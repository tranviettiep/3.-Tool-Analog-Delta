import os
import re
import sys
sys.stdout.reconfigure(encoding='utf-8')

def clean_text(text):
    return re.sub(r'<[^>]+>', ' ', text).replace('**', '').replace('*', '').strip()

def parse_markdown_table(filepath):
    data = []
    if not os.path.exists(filepath):
        return data

    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Process lines, joining continuations
    lines = content.split('\n')
    joined_lines = []
    for line in lines:
        stripped = line.strip()
        if stripped.startswith('|'):
            joined_lines.append(stripped)
        elif joined_lines and stripped:
            # continuation of the previous line
            joined_lines[-1] += ' ' + stripped

    for line in joined_lines:
        if '---' not in line:
            cols = [c.strip() for c in line.split('|')[1:-1]]
            if len(cols) >= 5 and 'Dòng PLC' not in cols[0] and 'Model Module' not in cols[0] and 'Loại Cảm Biến' not in cols[1]:
                model_col = cols[0]
                analog_col = cols[3]
                digital_col = cols[4]

                # Extract all models
                models_raw = model_col.split('<br>')
                models = []
                for m in models_raw:
                    cln = clean_text(m)
                    if cln and not cln.startswith('('):
                        models.append(cln)

                # Extract analog ranges
                analogs_raw = analog_col.split('<br>')
                analogs = [clean_text(a) for a in analogs_raw if clean_text(a)]

                # Extract digital ranges
                digitals_raw = digital_col.split('<br>')
                digitals = [clean_text(d) for d in digitals_raw if clean_text(d)]

                # Map analog to digital
                ranges = []
                for i in range(len(analogs)):
                    a = analogs[i]
                    d = digitals[i] if i < len(digitals) else (digitals[-1] if digitals else "")
                    if a and d:
                        ranges.append({"analog": a, "digital": d})

                for m in models:
                    data.append({
                        "model": m,
                        "ranges": ranges
                    })
    return data

def parse_range(range_str):
    range_str = range_str.replace('±', '-').replace(' ', '').upper()
    parts = range_str.split('~')
    
    def extract_num(s):
        m = re.search(r'[-+]?\d*\.?\d+', s)
        return float(m.group()) if m else 0

    if len(parts) == 2:
        return extract_num(parts[0]), extract_num(parts[1])
    
    # Try splitting by '/' or '-' if not '~' but be careful with negative numbers
    # For simplicity, if it's not ~, let's try to extract two numbers
    nums = re.findall(r'[-+]?\d*\.?\d+', range_str)
    if len(nums) >= 2:
        return float(nums[0]), float(nums[1])
    return 0, 0

def check_analog_match(user_analog_min, user_analog_max, user_unit, hw_analog_str):
    hw_analog_str = hw_analog_str.upper()
    
    if 'V' in user_unit.upper() and 'V' not in hw_analog_str and 'MA' in hw_analog_str: return False
    if 'A' in user_unit.upper() and 'MA' not in hw_analog_str and 'V' in hw_analog_str: return False

    hw_min, hw_max = parse_range(hw_analog_str)
    
    # Check if user range is within HW range
    if user_analog_min >= hw_min and user_analog_max <= hw_max:
        return hw_min, hw_max
    return None

def main():
    print("=========================================================")
    print("CẤU HÌNH CORE ENGINE: DELTA PLC SCALE CALCULATOR")
    print("=========================================================")
    
    data_path = 'data.md'
    if not os.path.exists(data_path):
        print(f"Lỗi: Không tìm thấy file {data_path} trong thư mục hiện tại.")
        sys.exit(1)
        
    db = parse_markdown_table(data_path)
    
    module_code = input("Nhập mã thiết bị PLC/Module (VD: DVP04AD-S): ").strip()
    sensor_range = input("Nhập dải đo của cảm biến (VD: 0~10, hoặc -20~100): ").strip()
    analog_signal = input("Nhập loại tín hiệu Analog cảm biến xuất ra (VD: 4~20mA, 0~10V): ").strip()

    try:
        dest_min, dest_max = parse_range(sensor_range)
    except:
        print("Lỗi: Định dạng dải đo cảm biến không hợp lệ.")
        sys.exit(1)

    try:
        analog_min, analog_max = parse_range(analog_signal)
        unit = 'mA' if 'mA' in analog_signal.lower() or 'a' in analog_signal.lower() else 'V'
    except:
        print("Lỗi: Định dạng tín hiệu Analog không hợp lệ.")
        sys.exit(1)

    found_model = None
    for entry in db:
        if module_code.upper() in entry['model'].upper() or entry['model'].upper() in module_code.upper():
            found_model = entry
            break

    if not found_model:
        print(f"\n[LỖI] Không tìm thấy thông số của thiết bị '{module_code}' trong cơ sở dữ liệu.")
        print("Vui lòng kiểm tra lại mã thiết bị hoặc cập nhật file data.md.")
        sys.exit(1)

    matched_hw_range = None
    hw_min_val, hw_max_val = 0, 0
    for r in found_model['ranges']:
        res = check_analog_match(analog_min, analog_max, unit, r['analog'])
        if res:
            hw_min_val, hw_max_val = res
            matched_hw_range = r
            break

    if not matched_hw_range:
        print(f"\n[LỖI] Module {found_model['model']} không hỗ trợ hoặc cấu hình dải tín hiệu {analog_signal} không phù hợp.")
        print("Các dải hỗ trợ của Module:")
        for r in found_model['ranges']:
            print(f"  - {r['analog']} -> {r['digital']}")
        sys.exit(1)

    dig_min, dig_max = parse_range(matched_hw_range['digital'])
    
    print("\n--- [Bước 2: Tra cứu thông số] ---")
    print(f"Module: {found_model['model']}")
    print(f"Dải Analog cơ sở của Module: {matched_hw_range['analog']} (Min={hw_min_val}, Max={hw_max_val})")
    print(f"Dải Digital cơ sở (Raw): {matched_hw_range['digital']} (Min={dig_min}, Max={dig_max})")

    print("\n--- [Bước 3: Quy đổi dải Digital đầu vào (Offset)] ---")
    if hw_max_val - hw_min_val == 0:
        print("Lỗi dữ liệu Analog của phần cứng (Max bằng Min).")
        sys.exit(1)

    source_min = dig_min + (analog_min - hw_min_val) * (dig_max - dig_min) / (hw_max_val - hw_min_val)
    source_max = dig_min + (analog_max - hw_min_val) * (dig_max - dig_min) / (hw_max_val - hw_min_val)
    
    print(f"Tín hiệu cảm biến: {analog_min}{unit} ~ {analog_max}{unit}")
    print(f"Quy đổi dải Digital thực tế (Source):")
    print(f"  - Min. source value = {source_min}")
    print(f"  - Max. source value = {source_max}")

    print("\n--- [Bước 4 & 5: Thực thi tính toán & Kết quả] ---")
    print(f"Dải Destination (Vật lý): Min={dest_min}, Max={dest_max}")
    
    if source_max - source_min == 0:
        print("Lỗi: Max source bằng Min source, không thể chia cho 0.")
        sys.exit(1)

    s2_float = ((dest_max - dest_min) / (source_max - source_min)) * 1000
    s2 = round(s2_float)

    s3_float = dest_min - ((source_min * s2) / 1000)
    s3 = round(s3_float)

    print("\nChi tiết phép tính:")
    print(f"  S2 = [(Max.dest - Min.dest) / (Max.src - Min.src)] * 1000")
    print(f"     = [({dest_max} - {dest_min}) / ({source_max} - {source_min})] * 1000")
    print(f"     = {s2_float:.4f} -> Làm tròn thành: {s2}")
    
    print(f"\n  S3 = Min.dest - [(Min.src * S2) / 1000]")
    print(f"     = {dest_min} - [({source_min} * {s2}) / 1000]")
    print(f"     = {s3_float:.4f} -> Làm tròn thành: {s3}")

    print("\n================== KẾT QUẢ ==================")
    print(f"S2 = {s2}")
    print(f"S3 = {s3}")
    print("\nVí dụ lệnh Ladder:")
    print(f"SCLP D100 K{s2} K{s3} D200")
    print("=============================================")
    
    if abs(s2) < 100 or abs(s3_float - s3) > 0.1:
        print("\n* Mẹo tối ưu: Kết quả bị làm tròn có thể gây sai số. Bạn nên cân nhắc nhân dải Destination lên 10, 100 hoặc 1000 lần.")

if __name__ == "__main__":
    main()
