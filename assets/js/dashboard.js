document.addEventListener('DOMContentLoaded', function () {
    // Check user role and show/hide signup option
    const userRole = localStorage.getItem('userRole');
    const signupOption = document.getElementById('signupOption');

    if (userRole === 'manager') {
        signupOption.style.display = 'block';
    } else {
        signupOption.style.display = 'none';
    }

    // Create button event listener
    document.getElementById('createButton').addEventListener('click', openPopup);

    // Logout button event listener
    document.getElementById('logoutButton').addEventListener('click', logout);
});

// Navigation function
function navigateTo(page) {
    if (page === 'create-quality-plan') {
        // Navigate to Create Quality Plan page
        window.location.href = 'quality.html';
    } else if (page === 'create-inspection-report') {
        // Navigate to Create Inspection Report page
        window.location.href = 'inspection.html';
    } else if (page === 'signup') {
        // Navigate to Sign Up page (only for managers)
        window.location.href = 'index.html';
    } else {
        document.getElementById('page-title').textContent = page === 'quality-plan' ? 'Quality Plan' : 'Inspection Report';
        document.getElementById('page-description').textContent = `You are viewing the ${page} section.`;
    }
    closePopup();
}

// Open create options popup
function openPopup() {
    document.getElementById('createPopup').style.display = 'block';
}

// Close create options popup
function closePopup() {
    document.getElementById('createPopup').style.display = 'none';
}

// Logout function
function logout() {
    // Clear local storage
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');

    // Redirect to login page
    window.location.href = 'login.html';
}

// Data Filtering Function (With Date Range)
function filterData() {
    const partNumber = document.getElementById("part_number").value;
    const fromDate = document.getElementById("from_date").value;
    const toDate = document.getElementById("to_date").value;

    // Validate date range
    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
        alert("From Date cannot be later than To Date.");
        return;
    }

    // Fetch filtered data from the server
    fetch(`/api/inspection-data?from_date=${fromDate}&to_date=${toDate}&part_number=${partNumber}`)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById("table_body");
            tableBody.innerHTML = ""; // Clear existing rows

            if (data.length === 0) {
                tableBody.innerHTML = "<tr><td colspan='4'>No data found for the selected criteria.</td></tr>";
                return;
            }

            // Display the data in the table
            data.forEach(entry => {
                const rowHTML = `
                    <tr>
                        <td>${entry.date || 'N/A'}</td>
                        <td>${entry.part_number || 'N/A'}</td>
                        <td>${entry.inspection_details || 'N/A'}</td>
                        <td>${entry.result || 'N/A'}</td>
                    </tr>`;
                tableBody.innerHTML += rowHTML;
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            alert("An error occurred while fetching data.");
        });
}

// Download Data Function (in XLS format)
function downloadData() {
    const partNumber = document.getElementById("part_number").value;
    const fromDate = document.getElementById("from_date").value;
    const toDate = document.getElementById("to_date").value;

    // Validate date range
    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
        alert("From Date cannot be later than To Date.");
        return;
    }

    // Trigger file download (XLS format)
    window.location.href = `/api/download-data?from_date=${fromDate}&to_date=${toDate}&part_number=${partNumber}`;
}
