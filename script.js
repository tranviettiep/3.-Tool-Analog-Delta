document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const form = document.getElementById('calcForm');
    const moduleCodeSelect = document.getElementById('moduleCode');
    
    // New sensor min/max
    const sensorMinInput = document.getElementById('sensorMin');
    const sensorMaxInput = document.getElementById('sensorMax');
    
    // New analog select
    const analogSignalSelect = document.getElementById('analogSignal');
    
    const resultSection = document.getElementById('resultSection');
    const errorBox = document.getElementById('errorBox');
    const errorMessage = document.getElementById('errorMessage');
    const optimizationTip = document.getElementById('optimizationTip');
    
    // Result elements
    const resS2 = document.getElementById('resS2');
    const resS3 = document.getElementById('resS3');
    const resLadder = document.getElementById('resLadder');
    
    // Detail elements
    const detModule = document.getElementById('detModule');
    const detBaseAnalog = document.getElementById('detBaseAnalog');
    const detBaseDigital = document.getElementById('detBaseDigital');
    const detSensorSignal = document.getElementById('detSensorSignal');
    const detSourceRange = document.getElementById('detSourceRange');
    const detS2Calc = document.getElementById('detS2Calc');
    const detS3Calc = document.getElementById('detS3Calc');

    const toggleDetails = document.getElementById('toggleDetails');
    const detailsContent = document.getElementById('detailsContent');

    // Module Modal elements
    const btnSettings = document.getElementById('btnSettings');
    const settingsModal = document.getElementById('settingsModal');
    const btnCloseModal = document.getElementById('btnCloseModal');
    const moduleListView = document.getElementById('moduleListView');
    const moduleList = document.getElementById('moduleList');
    const btnAddNew = document.getElementById('btnAddNew');
    const btnResetDB = document.getElementById('btnResetDB');
    const moduleForm = document.getElementById('moduleForm');
    const btnCancelEdit = document.getElementById('btnCancelEdit');
    const editIndexInput = document.getElementById('editIndex');
    const fmModel = document.getElementById('fmModel');
    const fmAnalog = document.getElementById('fmAnalog');
    const fmDigital = document.getElementById('fmDigital');

    // Analog Modal elements
    const btnAnalogSettings = document.getElementById('btnAnalogSettings');
    const analogSettingsModal = document.getElementById('analogSettingsModal');
    const btnCloseAnalogModal = document.getElementById('btnCloseAnalogModal');
    const analogListView = document.getElementById('analogListView');
    const analogList = document.getElementById('analogList');
    const btnAddNewAnalog = document.getElementById('btnAddNewAnalog');
    const btnResetAnalogDB = document.getElementById('btnResetAnalogDB');
    const analogForm = document.getElementById('analogForm');
    const btnCancelAnalogEdit = document.getElementById('btnCancelAnalogEdit');
    const editAnalogIndex = document.getElementById('editAnalogIndex');
    const fmAnalogName = document.getElementById('fmAnalogName');

    // --- State ---
    let db = [];
    let analogDB = [];
    
    const defaultAnalogDB = [
        "4~20mA",
        "0~20mA",
        "-20~20mA",
        "0~10V",
        "-10~10V",
        "-5~5V",
        "1~5V"
    ];

    // --- Initialization ---
    function initDB() {
        const storedDB = localStorage.getItem('plc_database');
        if (storedDB) {
            try {
                db = JSON.parse(storedDB);
            } catch(e) {
                db = window.PLC_DATABASE || [];
            }
        } else {
            db = window.PLC_DATABASE ? JSON.parse(JSON.stringify(window.PLC_DATABASE)) : [];
        }
        renderSelect();
    }
    
    function initAnalogDB() {
        const stored = localStorage.getItem('analog_database');
        if (stored) {
            try {
                analogDB = JSON.parse(stored);
            } catch(e) {
                analogDB = [...defaultAnalogDB];
            }
        } else {
            analogDB = [...defaultAnalogDB];
        }
        renderAnalogSelect();
    }

    function saveDB() {
        localStorage.setItem('plc_database', JSON.stringify(db));
        renderSelect();
    }
    
    function saveAnalogDB() {
        localStorage.setItem('analog_database', JSON.stringify(analogDB));
        renderAnalogSelect();
    }

    function renderSelect() {
        db.sort((a, b) => a.model.localeCompare(b.model));
        moduleCodeSelect.innerHTML = '<option value="" disabled selected>-- Chọn Module/PLC --</option>';
        db.forEach((entry, index) => {
            const opt = document.createElement('option');
            opt.value = index;
            opt.textContent = entry.model;
            moduleCodeSelect.appendChild(opt);
        });
    }
    
    function renderAnalogSelect() {
        analogSignalSelect.innerHTML = '<option value="" disabled selected>-- Chọn Tín hiệu --</option>';
        analogDB.forEach((val, index) => {
            const opt = document.createElement('option');
            opt.value = index;
            opt.textContent = val;
            analogSignalSelect.appendChild(opt);
        });
    }

    initDB();
    initAnalogDB();

    // --- Utility Functions ---
    function parseRange(rangeStr) {
        rangeStr = rangeStr.replace(/±/g, '-').replace(/\s+/g, '').toUpperCase();
        let parts = rangeStr.split('~');
        
        const extractNum = (s) => {
            const m = s.match(/[-+]?\d*\.?\d+/);
            return m ? parseFloat(m[0]) : 0;
        };

        if (parts.length === 2) {
            return [extractNum(parts[0]), extractNum(parts[1])];
        }
        
        const nums = rangeStr.match(/[-+]?\d*\.?\d+/g);
        if (nums && nums.length >= 2) {
            return [parseFloat(nums[0]), parseFloat(nums[1])];
        }
        return [0, 0];
    }

    function checkAnalogMatch(userMin, userMax, userUnit, hwAnalogStr) {
        hwAnalogStr = hwAnalogStr.toUpperCase();
        userUnit = userUnit.toUpperCase();
        
        if (userUnit.includes('V') && !hwAnalogStr.includes('V') && hwAnalogStr.includes('MA')) return null;
        if ((userUnit.includes('A') || userUnit.includes('MA')) && !hwAnalogStr.includes('MA') && hwAnalogStr.includes('V')) return null;

        const [hwMin, hwMax] = parseRange(hwAnalogStr);
        
        if (userMin >= hwMin && userMax <= hwMax) {
            return [hwMin, hwMax];
        }
        return null;
    }

    function showError(msg) {
        errorMessage.innerHTML = msg;
        errorBox.classList.remove('hidden');
        resultSection.classList.add('hidden');
    }

    // --- Accordion Logic ---
    toggleDetails.addEventListener('click', () => {
        toggleDetails.classList.toggle('active');
        detailsContent.classList.toggle('active');
    });

    // --- Main Calculation Logic ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        errorBox.classList.add('hidden');
        resultSection.classList.add('hidden');
        optimizationTip.classList.add('hidden');
        detailsContent.classList.remove('active');
        toggleDetails.classList.remove('active');

        const selectedModuleIndex = moduleCodeSelect.value;
        const selectedAnalogIndex = analogSignalSelect.value;
        
        const destMin = parseFloat(sensorMinInput.value);
        const destMax = parseFloat(sensorMaxInput.value);

        if (selectedModuleIndex === "") {
            showError("Vui lòng chọn Mã thiết bị PLC/Module.");
            return;
        }
        if (selectedAnalogIndex === "") {
            showError("Vui lòng chọn Tín hiệu Analog.");
            return;
        }
        if (isNaN(destMin) || isNaN(destMax) || destMin >= destMax) {
            showError("Dải đo cảm biến không hợp lệ (Min phải nhỏ hơn Max).");
            return;
        }

        const foundModel = db[selectedModuleIndex];
        const analogSignalStr = analogDB[selectedAnalogIndex];

        // Parse analog signal
        let analogMin, analogMax, unit;
        try {
            [analogMin, analogMax] = parseRange(analogSignalStr);
            unit = (analogSignalStr.toLowerCase().includes('ma') || analogSignalStr.toLowerCase().includes('a')) ? 'mA' : 'V';
        } catch (err) {
            showError("Định dạng tín hiệu Analog không hợp lệ.");
            return;
        }

        // Find matching analog range in module config
        let matchedHwRange = null;
        let hwMinVal = 0, hwMaxVal = 0;

        for (let r of foundModel.ranges) {
            const res = checkAnalogMatch(analogMin, analogMax, unit, r.analog);
            if (res) {
                [hwMinVal, hwMaxVal] = res;
                matchedHwRange = r;
                break;
            }
        }

        if (!matchedHwRange) {
            let supportStr = foundModel.ranges.map(r => `<li>${r.analog} &rarr; ${r.digital}</li>`).join('');
            showError(`Module <strong>${foundModel.model}</strong> không hỗ trợ tín hiệu ${analogSignalStr}.<br><br>Các dải hỗ trợ:<ul style="margin-left: 20px; margin-top:5px;">${supportStr}</ul>`);
            return;
        }

        const [digMin, digMax] = parseRange(matchedHwRange.digital);

        if (hwMaxVal - hwMinVal === 0) {
            showError("Lỗi dữ liệu Analog của phần cứng (Max bằng Min).");
            return;
        }

        // Calculate Source Offset
        const sourceMin = digMin + (analogMin - hwMinVal) * (digMax - digMin) / (hwMaxVal - hwMinVal);
        const sourceMax = digMin + (analogMax - hwMinVal) * (digMax - digMin) / (hwMaxVal - hwMinVal);

        if (sourceMax - sourceMin === 0) {
            showError("Lỗi: Max source bằng Min source, không thể chia cho 0.");
            return;
        }

        // Calculate S2, S3
        const s2_float = ((destMax - destMin) / (sourceMax - sourceMin)) * 1000;
        const s2 = Math.round(s2_float);

        const s3_float = destMin - ((sourceMin * s2) / 1000);
        const s3 = Math.round(s3_float);

        // Update UI
        resS2.textContent = s2;
        resS3.textContent = s3;
        resLadder.textContent = `SCLP D100 K${s2} K${s3} D200`;

        // Update Details
        detModule.textContent = `Module: ${foundModel.model}`;
        detBaseAnalog.textContent = `Dải Analog cơ sở: ${matchedHwRange.analog} (Min=${hwMinVal}, Max=${hwMaxVal})`;
        detBaseDigital.textContent = `Dải Digital cơ sở: ${matchedHwRange.digital} (Min=${digMin}, Max=${digMax})`;

        detSensorSignal.textContent = `Tín hiệu cảm biến: ${analogMin}${unit} ~ ${analogMax}${unit}`;
        detSourceRange.textContent = `Quy đổi dải Digital thực tế (Source): Min = ${sourceMin}, Max = ${sourceMax}`;

        detS2Calc.innerHTML = `S2 = [(${destMax} - ${destMin}) / (${sourceMax} - ${sourceMin})] * 1000 <br>&nbsp;&nbsp;&nbsp;= ${s2_float.toFixed(4)} &rarr; Làm tròn thành: <strong>${s2}</strong>`;
        detS3Calc.innerHTML = `S3 = ${destMin} - [(${sourceMin} * ${s2}) / 1000] <br>&nbsp;&nbsp;&nbsp;= ${s3_float.toFixed(4)} &rarr; Làm tròn thành: <strong>${s3}</strong>`;

        if (Math.abs(s2) < 100 || Math.abs(s3_float - s3) > 0.1) {
            optimizationTip.classList.remove('hidden');
        }

        resultSection.classList.remove('hidden');
    });

    // ==========================================
    // --- Module Modal Logic ---
    // ==========================================
    function openModal() { settingsModal.classList.remove('hidden'); showModuleList(); }
    function closeModal() { settingsModal.classList.add('hidden'); }

    btnSettings.addEventListener('click', openModal);
    btnCloseModal.addEventListener('click', closeModal);
    settingsModal.addEventListener('click', (e) => { if (e.target === settingsModal) closeModal(); });

    function showModuleList() {
        moduleForm.classList.add('hidden');
        moduleListView.classList.remove('hidden');
        
        moduleList.innerHTML = '';
        db.forEach((entry, index) => {
            const item = document.createElement('div');
            item.className = 'module-item';
            
            const info = document.createElement('div');
            info.className = 'module-info';
            
            const name = document.createElement('div');
            name.className = 'module-name';
            name.textContent = entry.model;
            
            const ranges = document.createElement('div');
            ranges.className = 'module-ranges';
            ranges.textContent = entry.ranges.length + ' dải cấu hình';
            
            info.appendChild(name);
            info.appendChild(ranges);
            
            const actions = document.createElement('div');
            actions.className = 'module-actions';
            
            const btnEdit = document.createElement('button');
            btnEdit.className = 'btn-edit';
            btnEdit.innerHTML = '✏️';
            btnEdit.title = 'Sửa';
            btnEdit.onclick = () => editModule(index);
            
            const btnDel = document.createElement('button');
            btnDel.className = 'btn-del';
            btnDel.innerHTML = '🗑️';
            btnDel.title = 'Xóa';
            btnDel.onclick = () => deleteModule(index);
            
            actions.appendChild(btnEdit);
            actions.appendChild(btnDel);
            item.appendChild(info);
            item.appendChild(actions);
            moduleList.appendChild(item);
        });
    }

    btnAddNew.addEventListener('click', () => {
        editIndexInput.value = '-1';
        fmModel.value = '';
        fmAnalog.value = '';
        fmDigital.value = '';
        
        moduleListView.classList.add('hidden');
        moduleForm.classList.remove('hidden');
    });

    btnResetDB.addEventListener('click', () => {
        if(confirm('Bạn có chắc muốn khôi phục cơ sở dữ liệu về mặc định ban đầu không? Mọi thay đổi sẽ bị mất.')) {
            localStorage.removeItem('plc_database');
            initDB();
            showModuleList();
        }
    });

    btnCancelEdit.addEventListener('click', () => showModuleList());

    function editModule(index) {
        const entry = db[index];
        editIndexInput.value = index;
        fmModel.value = entry.model;
        
        const analogs = entry.ranges.map(r => r.analog).join(', ');
        const digitals = entry.ranges.map(r => r.digital).join(', ');
        
        fmAnalog.value = analogs;
        fmDigital.value = digitals;
        
        moduleListView.classList.add('hidden');
        moduleForm.classList.remove('hidden');
    }

    function deleteModule(index) {
        if(confirm(`Bạn có chắc muốn xóa Module ${db[index].model}?`)) {
            db.splice(index, 1);
            saveDB();
            showModuleList();
        }
    }

    moduleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const model = fmModel.value.trim();
        const analogs = fmAnalog.value.split(',').map(s => s.trim()).filter(s => s);
        const digitals = fmDigital.value.split(',').map(s => s.trim()).filter(s => s);
        
        if (analogs.length === 0 || digitals.length === 0) {
            alert('Vui lòng nhập ít nhất 1 dải Analog và 1 dải Digital');
            return;
        }

        const ranges = [];
        for(let i=0; i<analogs.length; i++) {
            ranges.push({
                analog: analogs[i],
                digital: i < digitals.length ? digitals[i] : digitals[digitals.length-1]
            });
        }
        
        const index = parseInt(editIndexInput.value);
        if (index >= 0) {
            db[index] = { model, ranges };
        } else {
            db.push({ model, ranges });
        }
        
        saveDB();
        showModuleList();
    });

    // ==========================================
    // --- Analog Signal Modal Logic ---
    // ==========================================
    function openAnalogModal() { analogSettingsModal.classList.remove('hidden'); showAnalogList(); }
    function closeAnalogModal() { analogSettingsModal.classList.add('hidden'); }

    btnAnalogSettings.addEventListener('click', openAnalogModal);
    btnCloseAnalogModal.addEventListener('click', closeAnalogModal);
    analogSettingsModal.addEventListener('click', (e) => { if (e.target === analogSettingsModal) closeAnalogModal(); });

    function showAnalogList() {
        analogForm.classList.add('hidden');
        analogListView.classList.remove('hidden');
        
        analogList.innerHTML = '';
        analogDB.forEach((val, index) => {
            const item = document.createElement('div');
            item.className = 'module-item';
            
            const name = document.createElement('div');
            name.className = 'module-name';
            name.textContent = val;
            
            const actions = document.createElement('div');
            actions.className = 'module-actions';
            
            const btnEdit = document.createElement('button');
            btnEdit.className = 'btn-edit';
            btnEdit.innerHTML = '✏️';
            btnEdit.title = 'Sửa';
            btnEdit.onclick = () => editAnalog(index);
            
            const btnDel = document.createElement('button');
            btnDel.className = 'btn-del';
            btnDel.innerHTML = '🗑️';
            btnDel.title = 'Xóa';
            btnDel.onclick = () => deleteAnalog(index);
            
            actions.appendChild(btnEdit);
            actions.appendChild(btnDel);
            item.appendChild(name);
            item.appendChild(actions);
            analogList.appendChild(item);
        });
    }

    btnAddNewAnalog.addEventListener('click', () => {
        editAnalogIndex.value = '-1';
        fmAnalogName.value = '';
        analogListView.classList.add('hidden');
        analogForm.classList.remove('hidden');
    });

    btnResetAnalogDB.addEventListener('click', () => {
        if(confirm('Khôi phục danh sách Tín hiệu Analog về mặc định?')) {
            localStorage.removeItem('analog_database');
            initAnalogDB();
            showAnalogList();
        }
    });

    btnCancelAnalogEdit.addEventListener('click', () => showAnalogList());

    function editAnalog(index) {
        editAnalogIndex.value = index;
        fmAnalogName.value = analogDB[index];
        analogListView.classList.add('hidden');
        analogForm.classList.remove('hidden');
    }

    function deleteAnalog(index) {
        if(confirm(`Xóa tín hiệu ${analogDB[index]}?`)) {
            analogDB.splice(index, 1);
            saveAnalogDB();
            showAnalogList();
        }
    }

    analogForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const val = fmAnalogName.value.trim();
        
        if(!val) return;
        
        const index = parseInt(editAnalogIndex.value);
        if (index >= 0) {
            analogDB[index] = val;
        } else {
            analogDB.push(val);
        }
        
        saveAnalogDB();
        showAnalogList();
    });

});
