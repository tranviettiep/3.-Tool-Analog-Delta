

### I. Các dòng PLC Delta tích hợp sẵn Analog (Built-in Analog)

Các dòng PLC này tự động cập nhật dữ liệu analog vào các thanh ghi đặc biệt trong CPU mà không cần dùng lệnh đọc/ghi phức tạp:

| Dòng PLC / Model | Loại Analog | Độ phân giải phần cứng | Dải Analog vật lý | Giá trị số trong PLC (Raw Value) | Thanh ghi đặc biệt tương ứng |
| --- | --- | --- | --- | --- | --- |
| **DVP10SX11R/T**<br>

<br>*(DVP-S Slim Legacy)* | Ngõ vào (AI)<br>

<br>Ngõ ra (AO) | 12-bit (V) / 11-bit (I)<br>

<br>12-bit | -10V ~ +10V<br>

<br>-20mA ~ +20mA<br>

<br>-10V ~ +10V<br>

<br>-20mA ~ +20mA | -1000 ~ +1000<br>

<br>**-2000 ~ +2000**<br>

<br>**-1000 ~ +1000**<br>

<br>**-2000 ~ +2000** | D1110 (CH0), D1111 (CH1)<br>

<br>D1116 (CH0), D1117 (CH1) |
| **DVP20SX211R/T/S**<br>

<br>*(DVP-SX2 Slim)* | Ngõ vào (AI)<br>

<br>Ngõ ra (AO) | 12-bit<br>

<br>12-bit | 0V ~ 10V<br>

<br>4mA ~ 20mA (I-)<br>

<br>0V ~ 10V<br>

<br>4mA ~ 20mA | 0 ~ 4000<br>

<br>**0 ~ 4000**<br>

<br>**0 ~ 4000**<br>

<br>**0 ~ 4000** | D1056 (CH0) ~ D1059 (CH3)<br>

<br>D1060 (CH0), D1061 (CH1) |
| **DVP20SX311T/R/S**<br>

<br>*(DVP-S3 Thế hệ mới)* | Ngõ vào (AI)<br>

<br>Ngõ ra (AO) | 16-bit (V/I)<br>

<br>12-bit | -10V ~ +10V / 4mA ~ 20mA<br>

<br>-10V ~ +10V / 4mA ~ 20mA | -32000 ~ +32000<br>

<br>**0 ~ 32000**<br>

<br>**-32000 ~ +32000**<br>

<br>**0 ~ 32000** | (Tự động ánh xạ trực tiếp vào vùng nhớ hệ thống) |
| **DVP20EX200R/T**<br>

<br>*(DVP-EX2)* | Ngõ vào (AI)<br>

<br>Ngõ ra (AO) | 12-bit<br>

<br>12-bit | 0V ~ 10V / 0 ~ 20mA<br>

<br>4mA ~ 20mA<br>

<br>0V ~ 10V / 0 ~ 20mA | 0 ~ 2000<br>

<br>**400 ~ 2000**<br>

<br>**0 ~ 2000** | D1110 (CH0) ~ D1113 (CH3)<br>

<br>D1116 (CH0), D1117 (CH1) |
| **DVP30EX200R/T**<br>

<br>*(DVP-EX2 Temp)* | Ngõ vào (AI)<br>

<br>Ngõ ra (AO) | 16-bit<br>

<br>12-bit | Cảm biến RTD Pt100 / Pt1000<br>

<br>0V ~ 10V / 0 ~ 20mA<br>

<br>0V ~ 10V / 0 ~ 20mA | -2000 ~ +8000 (-200°C ~ +800°C)<br>

<br>**0 ~ 32000**<br>

<br>**0 ~ 4000** | D1110 ~ D1112<br>

<br>D1116 |
| **AS218TX / PX / RX-A**<br>

<br>*(Dòng AS200)* | Ngõ vào (AI)<br>

<br>Ngõ ra (AO) | 16-bit (V/I)<br>

<br>12-bit | -10V ~ +10V<br>

<br>4mA ~ 20mA<br>

<br>-10V ~ +10V<br>

<br>4mA ~ 20mA | -32000 ~ +32000<br>

<br>**0 ~ 32000**<br>

<br>**-32000 ~ +32000**<br>

<br>**0 ~ 32000** | (Cấu hình trực tiếp trong phần mềm bằng HWCONFIG) |

---

### II. Các Module mở rộng Analog dòng DVP Series (Slim & Block)

Để truy xuất dữ liệu từ các module mở rộng này, bạn cần sử dụng các lệnh gửi/nhận dữ liệu chuyên dụng là `FROM` / `TO` (đối với dòng Slim gắn bên phải CPU) hoặc cấu hình thông qua HWCONFIG:

| Model Module | Loại Analog | Độ phân giải | Dải Analog vật lý | Giá trị số (Raw Value) | Ghi chú kỹ thuật |
| --- | --- | --- | --- | --- | --- |
| **DVP04AD-S**<br>

<br>**DVP04AD-S2**<br>

<br>**DVP06AD-S** | Ngõ vào (AI) | 14-bit | -10V ~ +10V<br>

<br>-20mA ~ +20mA | -8000 ~ +8000<br>

<br>**-8000 ~ +8000** | Gắn bên phải CPU. Thế hệ S2 có thiết kế chống nhiễu vòng lặp tốt hơn. |
| **DVP04DA-S**<br>

<br>**DVP04DA-S2**<br>

<br>**DVP02DA-S** | Ngõ ra (AO) | 12-bit | 0V ~ 10V<br>

<br>0mA ~ 20mA<br>

<br>4mA ~ 20mA | 0 ~ 4000<br>

<br>**0 ~ 4000**<br>

<br>**0 ~ 4000** | 0 counts tương ứng với mức tín hiệu vật lý tối thiểu (0V/0mA hoặc 4mA). |
| **DVP06XA-S**<br>

<br>**DVP06XA-S2** | Ngõ vào (AI)<br>

<br>Ngõ ra (AO) | 12-bit | -10V ~ +10V / ±20mA<br>

<br>0V ~ 10V / 0 ~ 20mA | -2000 ~ +2000<br>

<br>**0 ~ 4000** | Tích hợp đồng thời 4 ngõ vào và 2 ngõ ra tương tự trên 1 module. |
| **DVP04AD-SL**<br>

<br>*(High-speed)* | Ngõ vào (AI) | 16-bit | -10V ~ +10V / ±5V<br>

<br>4mA ~ 20mA / 0 ~ 20mA | -32000 ~ +32000<br>

<br>**0 ~ 32000** | Gắn bên trái CPU (Left-side Bus). Tốc độ chuyển đổi siêu tốc 250 μs/kênh. |
| **DVP04DA-SL**<br>

<br>*(High-speed)* | Ngõ ra (AO) | 16-bit | -10V ~ +10V<br>

<br>4mA ~ 20mA / 0 ~ 20mA | -32000 ~ +32000<br>

<br>**0 ~ 32000** | Gắn bên trái CPU. Độ phân giải cao cho các ứng dụng điều khiển van tuyến tính. |
| **DVP04AD-E2** | Ngõ vào (AI) | 14-bit (V)<br>

<br>13-bit (I) | ±10V / ±5V<br>

<br>4mA ~ 20mA / 0 ~ 20mA | -32000 ~ +32000<br>

<br>**0 ~ 32000** | Chuẩn module mở rộng dạng khối (dành cho dòng ES2/EX2). |
| **DVP04DA-E2**<br>

<br>**DVP02DA-E2** | Ngõ ra (AO) | 14-bit | -10V ~ +10V<br>

<br>0mA ~ 20mA / 4 ~ 20mA | -32000 ~ +32000<br>

<br>**0 ~ 32000** | Khả năng xuất cả dải điện áp âm ổn định dải rộng. |
| **DVP06XA-E2** | Ngõ vào (AI)<br>

<br>Ngõ ra (AO) | 14-bit | 10V, 5V, 20mA<br>

<br>-10V ~ +10V / 4 ~ 20mA | -32000 ~ +32000<br>

<br>**0 ~ 32000** | Tích hợp đồng thời ngõ vào và ngõ ra cho dòng ES2/EX2. |
| **DVP04AD-H3**<br>

<br>**DVP04DA-H3**<br>

<br>**DVP06XA-H3** | Ngõ vào (AI)<br>

<br>Ngõ ra (AO) | 16-bit | -10V ~ +10V / ±20mA<br>

<br>-10V ~ +10V / 0 ~ 20mA | -32000 ~ +32000<br>

<br>**-32000 ~ +32000** | Module analog chuyên dụng cho dòng CPU hiệu suất cao EH3. |

---

### III. Các Module & Card mở rộng Analog dòng AS Series (Thế hệ mới)

Dòng AS Series sử dụng cấu trúc bus CAN Backplane song song cho tốc độ truyền dữ liệu nội bộ cực nhanh và độ phân giải 16-bit cho ngõ vào:

| Model Module / Card | Loại Analog | Độ phân giải | Dải Analog vật lý | Giá trị số (Raw Value) | Ghi chú cấu hình |
| --- | --- | --- | --- | --- | --- |
| **AS04AD-A**<br>

<br>**AS06XA-A (AI)** | Ngõ vào (AI) | 16-bit | -10V ~ +10V / ±5V<br>

<br>0 ~ 10V / 4 ~ 20mA | -32000 ~ +32000<br>

<br>**0 ~ 32000** | Cho phép bật/tắt từng kênh đo độc lập trực tiếp trong phần mềm để tối ưu vòng quét PLC. |
| **AS08AD-B** | Ngõ vào (AI)<br>

<br>*(Chỉ Voltage)* | 16-bit | -10V ~ +10V / ±5V<br>

<br>0 ~ 10V / 1 ~ 5V | -32000 ~ +32000<br>

<br>**0 ~ 32000** | Thiết kế 8 kênh chuyên dụng để nhận tín hiệu điện áp từ các cảm biến. |
| **AS08AD-C** | Ngõ vào (AI)<br>

<br>*(Chỉ Current)* | 16-bit | 0 ~ 20mA / 4 ~ 20mA<br>

<br>-20mA ~ +20mA | 0 ~ 32000<br>

<br>**-32000 ~ +32000** | Thiết kế 8 kênh chuyên dụng đo dòng điện. |
| **AS04DA-A**<br>

<br>**AS06XA-A (AO)** | Ngõ ra (AO) | 12-bit | -10V ~ +10V / 0 ~ 10V<br>

<br>0 ~ 20mA / 4 ~ 20mA | -32000 ~ +32000<br>

<br>**0 ~ 32000** | Giá trị thanh ghi cài đặt cho ngõ ra số nguyên vẫn ánh xạ dải 32000 giúp đồng bộ lập trình. |
| **AS-F2AD**<br>

<br>*(Card chức năng)* | Ngõ vào (AI) | 12-bit (V)<br>

<br>11-bit (I) | 0V ~ 10V<br>

<br>4mA ~ 20mA | 0 ~ 4000<br>

<br>**0 ~ 2000** | Card cắm trực tiếp vào mặt trước CPU AS giúp tiết kiệm không gian lắp đặt. |
| **AS-F2DA**<br>

<br>*(Card chức năng)* | Ngõ ra (AO) | 12-bit | 0V ~ 10V<br>

<br>4mA ~ 20mA | 0 ~ 4000<br>

<br>**0 ~ 4000** | Card xuất tín hiệu analog tuyến tính 12-bit. |

---

### IV. Các Module mở rộng Analog dòng AH Series (Hot-Swappable)

Dòng AH Series là phân khúc cao cấp cho nhà máy quy mô lớn với tốc độ chuyển đổi cực nhanh (150 μs/kênh) và hỗ trợ tháo lắp nóng (Hot-swapping):

| Model Module | Loại Analog | Độ phân giải | Dải Analog vật lý | Giá trị số (Raw Value) | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| **AH04AD-5A**<br>

<br>**AH08AD-5A** | Ngõ vào (AI) | 16-bit | -10V ~ +10V / 0 ~ 10V<br>

<br>0 ~ 20mA / 4 ~ 20mA<br>

<br>±20mA | -32000 ~ +32000<br>

<br>**0 ~ 32000**<br>

<br>**-32000 ~ +32000** | Có tính năng thông minh phát hiện đứt dây tín hiệu. |
| **AH08AD-5B** (Voltage)<br>

<br>**AH08AD-5C** (Current) | Ngõ vào (AI) | 16-bit | Tương tự dải điện áp dòng AH<br>

<br>Tương tự dải dòng điện dòng AH | -32000 ~ +32000<br>

<br>**0 ~ 32000** | Module đo lường dải cao chuyên biệt, chống nhiễu vượt trội. |
| **AH04DA-5A**<br>

<br>**AH08DA-5A** | Ngõ ra (AO) | 16-bit | -10V ~ +10V<br>

<br>0 ~ 20mA / 4 ~ 20mA | -32000 ~ +32000<br>

<br>**0 ~ 32000** | Hỗ trợ cho các ứng dụng điều khiển van tỷ lệ tốc độ cao. |
| **AH08DA-5B** (Voltage)<br>

<br>**AH08DA-5C** (Current) | Ngõ ra (AO) | 16-bit | Chỉ xuất tín hiệu điện áp dòng AH<br>

<br>Chỉ xuất tín hiệu dòng điện dòng AH | -32000 ~ +32000<br>

<br>**0 ~ 32000** | Module chuyên dùng xuất điện áp hoặc dòng điện cô lập 8 kênh. |
| **AH06XA-5A** | Ngõ vào (AI)<br>

<br>Ngõ ra (AO) | 16-bit | AI: -10V ~ +10V / ±20mA<br>

<br>AO: -10V ~ 10V / 4mA ~ 20mA | -32000 ~ +32000<br>

<br>**0 ~ 32000** | Tích hợp đồng thời 4 đầu vào và 2 đầu ra tuyến tính chất lượng cao. |

---

### V. Các Module đo nhiệt độ tương thích (RTD & Thermocouple)

Các module này tự động thực hiện tính toán tuyến tính hóa và bù nhiệt đầu lạnh (CJC) từ cảm biến để đưa về giá trị nhiệt độ độ C/F thực tế hiển thị trực tiếp trong PLC:

| Model Module | Loại Cảm Biến Hỗ Trợ | Độ phân giải | Dải đo vật lý thực tế | Giá trị số hiển thị trong PLC |
| --- | --- | --- | --- | --- |
| **AS04RTD-A**<br>

<br>**AS06RTD-A** | Pt100, Pt1000, Ni100, Ni1000, JPt100, LG-Ni1000 | 16-bit | Pt100: -180°C ~ +800°C<br>

<br>Ni100: -80°C ~ +170°C | -1800 ~ +8000<br>

<br>**-800 ~ +1700**<br>

<br>*(Tự động scale tỉ lệ x10: Giá trị thực = Raw / 10)* |
| **AS04TC-A**<br>

<br>**AS08TC-A** | Thermocouple: J, K, R, S, T, E, N, B | 24-bit | Type K: -100°C ~ +1350°C<br>

<br>Type R/S: 0°C ~ 1750°C | -1000 ~ +13500<br>

<br>**0 ~ +17500**<br>

<br>*(Tự động scale tỉ lệ x10: Giá trị thực = Raw / 10)* |
| **AH04PT-5A** | Pt100, Pt1000, Ni100, Ni1000 | 16-bit | Pt100 / Pt1000: -200°C ~ +800°C<br>

<br>Ni100 / Ni1000: -100°C ~ +180°C | -2000 ~ +8000<br>

<br>**-1000 ~ +1800**<br>

<br>*(Tự động scale tỉ lệ x10)* |
| **AH04TC-5A**<br>

<br>**AH08TC-5A** | Thermocouple: J, K, R, S, T, E, N | 24-bit | Theo dải đo tiêu chuẩn của từng loại Thermocouple (Can nhiệt). | (Tự động scale tỉ lệ x10 theo giá trị thực tế đo được). |

---
