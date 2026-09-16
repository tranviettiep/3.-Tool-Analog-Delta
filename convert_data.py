import os
import re
import json

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

def main():
    print("Reading data.md...")
    db = parse_markdown_table('data.md')
    if not db:
        print("Failed to read or parse data.md")
        return

    js_content = "window.PLC_DATABASE = " + json.dumps(db, indent=2, ensure_ascii=False) + ";"
    
    with open('data.js', 'w', encoding='utf-8') as f:
        f.write(js_content)
        
    print("Successfully created data.js with {} models.".format(len(db)))

if __name__ == "__main__":
    main()
