document.addEventListener('DOMContentLoaded', () => {
    const measurementTableBody = document.querySelector('#measurementTable tbody');
    const addMeasurementBtn = document.getElementById('addMeasurementBtn');
    const submitBtn = document.getElementById('submitBtn');
    const confirmationModal = document.getElementById('confirmationModal');
    const closeButton = document.querySelector('.close-button');

    let measurementCount = 1; // Initial Measurement Row

    function updateTime() {
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString('en-US'); // Adjust format as needed
        const formattedTime = currentDate.toLocaleTimeString('en-US'); // Adjust format as needed
        document.getElementById('currentDate').value = formattedDate;
        document.getElementById('currentTime').value = formattedTime;
    }
      
    // Call the function initially to set the current date and time
    updateTime();

    // Update time every second
    setInterval(updateTime, 1000);

    // Remove the following line as it refers to an undefined function
    // setInterval(populateDateTime, 60000);

    // Rest of your code...




    // Function to create a new Measurement Row
    function addMeasurementRow() {
        measurementCount++;
        const tr = document.createElement('tr');

        // Sl No
        const tdSlNo = document.createElement('td');
        const slNoInput = document.createElement('input');
        slNoInput.type = 'number';
        slNoInput.name = `slNo${measurementCount}`;
        slNoInput.value = measurementCount;
        slNoInput.readOnly = true;
        tdSlNo.appendChild(slNoInput);
        tr.appendChild(tdSlNo);

        // Nominal Value
        const tdNominalValue = document.createElement('td');
        const nominalValueInput = document.createElement('input');
        nominalValueInput.type = 'text';
        nominalValueInput.name = `nominalValue${measurementCount}`;
        nominalValueInput.placeholder = 'Enter nominal value';
        nominalValueInput.required = true;
        tdNominalValue.appendChild(nominalValueInput);
        tr.appendChild(tdNominalValue);

        // Tol +
        const tdTolPlus = document.createElement('td');
        const tolPlusInput = document.createElement('input');
        tolPlusInput.type = 'text';
        tolPlusInput.name = `tolPlus${measurementCount}`;
        tolPlusInput.placeholder = 'Enter Tol +';
        tdTolPlus.appendChild(tolPlusInput);
        tr.appendChild(tdTolPlus);

        // Tol -
        const tdTolMinus = document.createElement('td');
        const tolMinusInput = document.createElement('input');
        tolMinusInput.type = 'text';
        tolMinusInput.name = `tolMinus${measurementCount}`;
        tolMinusInput.placeholder = 'Enter Tol -';
        tdTolMinus.appendChild(tolMinusInput);
        tr.appendChild(tdTolMinus);

        // USL
        const tdUSL = document.createElement('td');
        const uslInput = document.createElement('input');
        uslInput.type = 'text';
        uslInput.name = `usl${measurementCount}`;
        uslInput.placeholder = 'Enter USL';
        tdUSL.appendChild(uslInput);
        tr.appendChild(tdUSL);

        // LSL
        const tdLSL = document.createElement('td');
        const lslInput = document.createElement('input');
        lslInput.type = 'text';
        lslInput.name = `lsl${measurementCount}`;
        lslInput.placeholder = 'Enter LSL';
        tdLSL.appendChild(lslInput);
        tr.appendChild(tdLSL);

        // Instrument Used
        const tdInstrument = document.createElement('td');
        const instrumentInput = document.createElement('input');
        instrumentInput.type = 'text';
        instrumentInput.name = `instrumentUsed${measurementCount}`;
        instrumentInput.placeholder = 'Enter instrument used';
        tdInstrument.appendChild(instrumentInput);
        tr.appendChild(tdInstrument);

        // SAMPLES
        const tdSamples = document.createElement('td');
        const samplesContainer = document.createElement('div');
        samplesContainer.classList.add('samples-container');

        // Initialize 5 Samples
        for (let i = 1; i <= 5; i++) {
            const sampleDiv = document.createElement('div');
            sampleDiv.classList.add('sample');
            sampleDiv.setAttribute('data-sample-index', i);

            const sampleLabel = document.createElement('label');
            sampleLabel.textContent = `${i}:`;
            sampleDiv.appendChild(sampleLabel);

            const sampleInput = document.createElement('input');
            sampleInput.type = 'text';
            sampleInput.name = `sample${measurementCount}_${i}`;
            sampleInput.placeholder = `Sample ${i}`;
            sampleInput.required = true;
            sampleDiv.appendChild(sampleInput);

            const deleteSampleBtn = document.createElement('button');
            deleteSampleBtn.type = 'button';
            deleteSampleBtn.classList.add('deleteSampleBtn');
            deleteSampleBtn.textContent = 'Delete';
            if (i <= 5) {
                deleteSampleBtn.disabled = true; // Disable delete for initial 5 samples
            }
            sampleDiv.appendChild(deleteSampleBtn);

            samplesContainer.appendChild(sampleDiv);
        }

        tdSamples.appendChild(samplesContainer);

        // Add Sample Button
        const addSampleBtn = document.createElement('button');
        addSampleBtn.type = 'button';
        addSampleBtn.classList.add('addSampleBtn');
        addSampleBtn.textContent = 'Add Sample';
        tdSamples.appendChild(addSampleBtn);

        tr.appendChild(tdSamples);

        // Pass/Fail
        const tdPassFail = document.createElement('td');
        const passFailSelect = document.createElement('select');
        passFailSelect.name = `passFail${measurementCount}`;
        passFailSelect.required = true;

        const optionDefault = document.createElement('option');
        optionDefault.value = "";
        optionDefault.disabled = true;
        optionDefault.selected = true;
        optionDefault.textContent = 'Select';
        passFailSelect.appendChild(optionDefault);

        const optionPass = document.createElement('option');
        optionPass.value = 'Pass';
        optionPass.textContent = 'Pass';
        passFailSelect.appendChild(optionPass);

        const optionFail = document.createElement('option');
        optionFail.value = 'Fail';
        optionFail.textContent = 'Fail';
        passFailSelect.appendChild(optionFail);

        tdPassFail.appendChild(passFailSelect);
        tr.appendChild(tdPassFail);

        // Deviation Approval Reference
        const tdDeviationRef = document.createElement('td');
        const deviationRefInput = document.createElement('input');
        deviationRefInput.type = 'text';
        deviationRefInput.name = `deviationRef${measurementCount}`;
        deviationRefInput.placeholder = 'Enter deviation approval reference';
        tdDeviationRef.appendChild(deviationRefInput);
        tr.appendChild(tdDeviationRef);

        // Remarks
        const tdRemarks = document.createElement('td');
        const remarksInput = document.createElement('input');
        remarksInput.type = 'text';
        remarksInput.name = `remarks${measurementCount}`;
        remarksInput.placeholder = 'Enter remarks';
        tdRemarks.appendChild(remarksInput);
        tr.appendChild(tdRemarks);

        // Action (Delete Button)
        const tdAction = document.createElement('td');
        const deleteMeasurementBtn = document.createElement('button');
        deleteMeasurementBtn.type = 'button';
        deleteMeasurementBtn.classList.add('deleteMeasurementBtn');
        deleteMeasurementBtn.textContent = 'Delete';
        tdAction.appendChild(deleteMeasurementBtn);
        tr.appendChild(tdAction);

        measurementTableBody.appendChild(tr);
    }

    // Function to update Sl No after deletion
    function updateSlNo() {
        const rows = measurementTableBody.querySelectorAll('tr');
        measurementCount = rows.length; // Update measurementCount based on current rows
        rows.forEach((row, index) => {
            const slNoInput = row.querySelector(`input[name^="slNo"]`);
            if (slNoInput) {
                slNoInput.value = index + 1;
                slNoInput.name = `slNo${index + 1}`;
            }

            // Update other input names accordingly
            const inputs = row.querySelectorAll('input, select');
            inputs.forEach(input => {
                const name = input.name;
                const nameParts = name.match(/^([a-zA-Z]+)(\d+)_(\d+)?$/);
                if (nameParts) {
                    const field = nameParts[1];
                    const measurementNum = index + 1;
                    const sampleNum = nameParts[3];
                    if (sampleNum) {
                        input.name = `${field}${measurementNum}_${sampleNum}`;
                    } else {
                        input.name = `${field}${measurementNum}`;
                    }
                }
            });

            // Update Pass/Fail select
            const passFailSelect = row.querySelector(`select[name^="passFail"]`);
            if (passFailSelect) {
                passFailSelect.name = `passFail${index + 1}`;
            }
        });
    }

    // Function to add a Sample to a Measurement Row
    function addSample(measurementRow) {
        const samplesContainer = measurementRow.querySelector('.samples-container');
        const currentSamples = samplesContainer.querySelectorAll('.sample');
        const newSampleIndex = currentSamples.length + 1;

        const sampleDiv = document.createElement('div');
        sampleDiv.classList.add('sample');
        sampleDiv.setAttribute('data-sample-index', newSampleIndex);

        const sampleLabel = document.createElement('label');
        sampleLabel.textContent = `${newSampleIndex}:`;
        sampleDiv.appendChild(sampleLabel);

        const sampleInput = document.createElement('input');
        sampleInput.type = 'text';
        // Extract measurement number from existing sample names
        const firstSample = currentSamples[0];
        const firstSampleName = firstSample.querySelector('input').name;
        const measurementNum = firstSampleName.split('_')[0].replace(/\D/g, '');
        sampleInput.name = `sample${measurementNum}_${newSampleIndex}`;
        sampleInput.placeholder = `Sample ${newSampleIndex}`;
        sampleInput.required = true;
        sampleDiv.appendChild(sampleInput);

        const deleteSampleBtn = document.createElement('button');
        deleteSampleBtn.type = 'button';
        deleteSampleBtn.classList.add('deleteSampleBtn');
        deleteSampleBtn.textContent = 'Delete';
        sampleDiv.appendChild(deleteSampleBtn);

        samplesContainer.appendChild(sampleDiv);
    }

    // Function to delete a Sample from a Measurement Row
    function deleteSample(sampleBtn) {
        const sampleDiv = sampleBtn.parentElement;
        const samplesContainer = sampleDiv.parentElement;
        const samples = samplesContainer.querySelectorAll('.sample');

        if (samples.length > 5) { // Enforce minimum of 5 samples
            sampleDiv.remove();
            // Update sample labels and names
            samples.forEach((sample, index) => {
                const label = sample.querySelector('label');
                label.textContent = `${index + 1}:`;
                const input = sample.querySelector('input');
                const measurementNum = input.name.split('_')[0].replace(/\D/g, '');
                input.name = `sample${measurementNum}_${index + 1}`;
                input.placeholder = `Sample ${index + 1}`;
                sample.setAttribute('data-sample-index', index + 1);
            });
        } else {
            alert('At least 5 samples are required.');
        }
    }

    // Event Listener for Adding Measurement Rows
    addMeasurementBtn.addEventListener('click', () => {
        addMeasurementRow();
    });

    // Event Listener for Deleting Measurement Rows
    measurementTableBody.addEventListener('click', (event) => {
        if (event.target && event.target.classList.contains('deleteMeasurementBtn')) {
            const rowToDelete = event.target.closest('tr');
            if (rowToDelete) {
                rowToDelete.remove();
                updateSlNo();
            }
        }
    });

    // Event Listener for Adding Samples
    measurementTableBody.addEventListener('click', (event) => {
        if (event.target && event.target.classList.contains('addSampleBtn')) {
            const measurementRow = event.target.closest('tr');
            addSample(measurementRow);
        }
    });

    // Event Listener for Deleting Samples
    measurementTableBody.addEventListener('click', (event) => {
        if (event.target && event.target.classList.contains('deleteSampleBtn')) {
            const sampleBtn = event.target;
            deleteSample(sampleBtn);
        }
    });

    // Function to Collect Form Data
    function collectFormData() {
        const formData = {};

        // Part Information
        formData.partNumber = document.querySelector('input[name="partNumber"]').value.trim();
        formData.partName = document.querySelector('input[name="partName"]').value.trim();
        formData.grn = document.querySelector('input[name="grn"]').value.trim();
        formData.supplierName = document.querySelector('input[name="supplierName"]').value.trim();
        formData.materialSpec = document.querySelector('input[name="materialSpec"]').value.trim();
        formData.materialUsed = document.querySelector('input[name="materialUsed"]').value.trim();
        formData.date = document.getElementById('currentDate').value;
        formData.time = document.getElementById('currentTime').value;

        // Additional Information
        formData.inspectedBy = document.querySelector('input[name="inspectedBy"]').value.trim();
        formData.verifiedBy = document.querySelector('input[name="verifiedBy"]').value.trim();
        formData.status = document.querySelector('select[name="status"]').value;

        // Measurement Details
        formData.measurements = [];
        const measurementRows = measurementTableBody.querySelectorAll('tr');
        measurementRows.forEach(row => {
            const measurement = {};
            measurement.slNo = row.querySelector(`input[name^="slNo"]`).value;
            measurement.nominalValue = row.querySelector(`input[name^="nominalValue"]`).value.trim();
            measurement.tolPlus = row.querySelector(`input[name^="tolPlus"]`).value.trim();
            measurement.tolMinus = row.querySelector(`input[name^="tolMinus"]`).value.trim();
            measurement.usl = row.querySelector(`input[name^="usl"]`).value.trim();
            measurement.lsl = row.querySelector(`input[name^="lsl"]`).value.trim();
            measurement.instrumentUsed = row.querySelector(`input[name^="instrumentUsed"]`).value.trim();

            // Samples
            measurement.samples = [];
            const samplesContainer = row.querySelector('.samples-container');
            const sampleDivs = samplesContainer.querySelectorAll('.sample');
            sampleDivs.forEach(sampleDiv => {
                const sampleInput = sampleDiv.querySelector('input');
                measurement.samples.push(sampleInput.value.trim());
            });

            measurement.passFail = row.querySelector(`select[name^="passFail"]`).value;
            measurement.deviationRef = row.querySelector(`input[name^="deviationRef"]`).value.trim();
            measurement.remarks = row.querySelector(`input[name^="remarks"]`).value.trim();

            formData.measurements.push(measurement);
        });

        return formData;
    }

    // Function to Save Data to LocalStorage
    function saveData(data) {
        let existingData = JSON.parse(localStorage.getItem('inspectionData')) || [];
        existingData.push(data);
        localStorage.setItem('inspectionData', JSON.stringify(existingData));
    }

    // Function to Show Confirmation Modal
    function showConfirmationModal() {
        confirmationModal.style.display = 'block';
    }

    // Function to Hide Confirmation Modal
    function hideConfirmationModal() {
        confirmationModal.style.display = 'none';
    }

    // Event Listener for Submit Button
    submitBtn.addEventListener('click', () => {
        // Validate Form
        const requiredFields = document.querySelectorAll('input[required], select[required]');
        let isValid = true;
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.style.border = '2px solid red';
            } else {
                field.style.border = '';
            }
        });

        if (!isValid) {
            alert('Please fill in all required fields.');
            return;
        }

        // Collect Data
        const data = collectFormData();

        // Save Data
        saveData(data);

        // Show Confirmation
        showConfirmationModal();

        // Reset Form (Optional)
        // resetForm();
    });

    // Event Listener for Closing Modal
    closeButton.addEventListener('click', () => {
        hideConfirmationModal();
    });

    // Event Listener for Clicking Outside Modal
    window.addEventListener('click', (event) => {
        if (event.target == confirmationModal) {
            hideConfirmationModal();
        }
    });

    // Optional: Function to Reset Form after Submission
    function resetForm() {
        document.querySelector('#part-info').reset();
        document.querySelector('#additional-info').reset();
        document.querySelector('#measurementTable tbody').innerHTML = '';
        measurementCount = 0;
        addMeasurementRow(); // Add initial row
    }

    // Initial Call to Add Measurement Row if Needed
    // Uncomment the following line if you want to reset the form after submission
    // resetForm();
});
