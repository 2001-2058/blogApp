// Base URL of your backend server
const baseURL = 'http://localhost:8000';

let isUpdating = false;
let currentEmpId = null;

// Add or Update Employee
document.getElementById('employeeForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const designation = document.getElementById('designation').value;
    const empId = document.getElementById('empId').value;

    const data = { name, email, designation, empId };

    try {
        const response = await fetch(`${baseURL}/${isUpdating ? `updateEmp/${currentEmpId}` : 'addEmp'}`, {
            method: isUpdating ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        alert(result.message);
        
        resetForm();
        getAllEmployees();
    } catch (error) {
        console.error('Error:', error);
    }
});

// Get All Employees
document.getElementById('getAllEmpBtn').addEventListener('click', getAllEmployees);

async function getAllEmployees() {
    try {
        const response = await fetch(`${baseURL}/getAll`);
        const employees = await response.json();
        
        const employeeList = document.getElementById('employeeList');
        employeeList.innerHTML = ''; // Clear the list

        if (employees.error) {
            employeeList.innerHTML = `<li>${employees.error}</li>`;
        } else {
            employees.forEach(emp => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <strong>${emp.name}</strong> (${emp.empId}) - ${emp.designation}
                    <button onclick="editEmp('${emp.empId}')">Edit</button>
                    <button onclick="deleteEmp('${emp.empId}')">Delete</button>
                `;
                employeeList.appendChild(listItem);
            });
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Edit Employee
async function editEmp(empId) {
    try {
        const response = await fetch(`${baseURL}/emp/${empId}`);
        const employee = await response.json();

        document.getElementById('name').value = employee.name;
        document.getElementById('email').value = employee.email;
        document.getElementById('designation').value = employee.designation;
        document.getElementById('empId').value = employee.empId;

        currentEmpId = empId;
        isUpdating = true;

        // Toggle button visibility
        document.getElementById('addEmpBtn').style.display = 'none';
        document.getElementById('updateEmpBtn').style.display = 'inline-block';
    } catch (error) {
        console.error('Error:', error);
    }
}

// Delete Employee
async function deleteEmp(empId) {
    try {
        const response = await fetch(`${baseURL}/emp/${empId}`, {
            method: 'DELETE'
        });

        const result = await response.json();
        alert(result.message);
        getAllEmployees();
    } catch (error) {
        console.error('Error:', error);
    }
}

// Reset form and button states
function resetForm() {
    document.getElementById('employeeForm').reset();
    isUpdating = false;
    currentEmpId = null;

    // Toggle button visibility
    document.getElementById('addEmpBtn').style.display = 'inline-block';
    document.getElementById('updateEmpBtn').style.display = 'none';
}

// Upload Profile Picture
document.getElementById('profilePicForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const empId = document.getElementById('uploadEmpId').value;
    const profilePic = document.getElementById('profilePic').files[0];

    const formData = new FormData();
    formData.append('profilePic', profilePic);

    // Client-side validation for file size
    const maxSize = 5 * 1024 * 1024; // 5 MB
    if (profilePic.size > maxSize) {
        alert('File size must be less than 5 MB.');
        return;
    }

    try {
        const response = await fetch(`${baseURL}/emp/uploadProfilePic/${empId}`, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        alert(result.message); // Show the response message
    } catch (error) {
        console.error('Error:', error);
    }
});
