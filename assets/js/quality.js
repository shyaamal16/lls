document.addEventListener('DOMContentLoaded', () => {
    const subTableBody = document.querySelector('#subTable tbody');
    const addRowBtn = document.getElementById('addRowBtn');
    const submitBtn = document.getElementById('submitBtn');
    let rowCount = 1;

    // Populate current date and time
    function populateDateTime() {
        const now = new Date();
        const date = now.toLocaleDateString();
        const time = now.toLocaleTimeString();
        document.getElementById('currentDate').value = date;
        document.getElementById('currentTime').value = time;
    }
    populateDateTime();

    // Add a new row
    function createNewRow() {
        rowCount++;
        const tr = document.createElement('tr');

        const fields = ['nominalValue', 'tolPlus', 'tolMinus', 'usl', 'lsl', 'instrumentUsed', 'ctcCtq', 'remarks'];
        fields.forEach(field => {
            const td = document.createElement('td');
            const input = document.createElement('input');
            input.type = 'text';
            input.name = `${field}${rowCount}`;
            input.placeholder = `Enter ${field}`;
            td.appendChild(input);
            tr.appendChild(td);
        });

        const tdAction = document.createElement('td');
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'deleteBtn';
        deleteBtn.textContent = 'Delete';
        tdAction.appendChild(deleteBtn);
        tr.appendChild(tdAction);

        subTableBody.appendChild(tr);
    }

    // Submit the form
    async function handleSubmit() {
        const formData = collectFormData();
        console.log("Form Data:", formData);

        try {
            const response = await fetch('/api/save-quality-data', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                console.log("Data saved successfully!");
                alert('Data saved successfully!');
            } else {
                const error = await response.json();
                console.error("Backend Error:", error);
                alert('Error saving data!');
            }
        } catch (error) {
            console.error("Fetch Error:", error);
            alert('Error saving data!');
        }
    }

    // Collect form data
    function collectFormData() {
        const formData = {};
        formData.partNumber = document.querySelector('input[name="partNumber"]').value;
        formData.measurements = [];
        subTableBody.querySelectorAll('tr').forEach(row => {
            const measurement = {};
            row.querySelectorAll('input').forEach(input => {
                measurement[input.name] = input.value;
            });
            formData.measurements.push(measurement);
        });
        return formData;
    }

    submitBtn.addEventListener('click', handleSubmit);
});
