// Base URL of your backend server
const baseURL = 'http://localhost:8000';

// Add Employee (unchanged)
document.getElementById('employeeForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const designation = document.getElementById('designation').value;
    const empId = document.getElementById('empId').value;

    const data = { name, email, designation, empId };

    try {
        const response = await fetch(`${baseURL}/addEmp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        alert(result.message);
    } catch (error) {
        console.error('Error:', error);
    }
});

// Get All Employees (unchanged)
document.getElementById('getAllEmpBtn').addEventListener('click', async () => {
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
                    <button onclick="deleteEmp('${emp.empId}')">Delete</button>
                `;
                employeeList.appendChild(listItem);
            });
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// Delete Employee (unchanged)
async function deleteEmp(empId) {
    try {
        const response = await fetch(`${baseURL}/emp/${empId}`, {
            method: 'DELETE'
        });

        const result = await response.json();
        alert(result.message);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Upload Profile Picture (modified)
document.getElementById('profilePicForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const empId = document.getElementById('uploadEmpId').value;
    const profilePic = document.getElementById('profilePic').files[0];

    const formData = new FormData();
    formData.append('profilePic', profilePic);

    try {
        const response = await fetch(`${baseURL}/uploadProfilePic/${empId}`, {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        alert(result.message);
    } catch (error) {
        console.error('Error:', error);
    }
});
