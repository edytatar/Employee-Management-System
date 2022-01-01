// Import
require('dotenv').config();
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');


const PORT = process.env.PORT || 3001;


// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: process.env.DB_USER,
        // MySQL password
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    },
    console.log(`Connected to the employee_db database.`)
);



// Prompt when connection is created
db.connect(err => {
    if (err) console.error(err);
    mainPrompt();
});

const mainPrompt = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'options',
            message: "What would you like to do?",
            choices: ["View all departments", "View all roles", "View all employees", "Add a department", "Add a role", "Add an employee", "Update an employee", "Quit"],
            loop: false,
        },

    ])
        .then(data => {
            switch (data.options) {
                case "View all departments":
                    viewAllDepartments();
                    break;
                case "View all roles":
                    viewAllRoles();
                    break;
                case "View all employees":
                    viewAllEmployees();
                    break;
                case "Add a department":
                    addDepartment();
                    break;
                case "Add a role":
                    addRole();
                    break;
                case "Add an employee":
                    addEmployee();
                    break;
                case "Update an employee":
                    updateEmployee();
                    break;
                case "Quit":
                    db.end()
                    break;
            }
        })
}

module.exports = { mainPrompt };

// Select:
// department
let departmentNameList = [];
selectDepartment = () => {
    db.query("SELECT name FROM department", function (err, results) {
        if (err) console.error(err);

        results.forEach(name => departmentNameList.push(name));

        departmentNameList.push(new inquirer.Separator());
    })
    return departmentNameList;
}

// role
let roleNameList = [];
function selectRole() {
    db.query("SELECT title FROM role", function (err, results) {
        if (err) console.error(err);

        for (var i = 0; i < results.length; i++) {
            roleNameList.push(results[i].title);
        }

        roleNameList.push(new inquirer.Separator());
    })
    return roleNameList;

}

// employee
let employeeNameList = [];
selectEmployee = () => {
    db.query("SELECT first_name, last_name FROM employee", function (err, results) {
        if (err) console.error(err);

        for (var i = 0; i < results.length; i++) {
            employeeNameList.push(results[i].first_name + " " + results[i].last_name);
        }

        employeeNameList.push(new inquirer.Separator());
    })
    return employeeNameList;
}


// Manager
let managerNameList = [];
selectManager = () => {
    db.query("SELECT first_name, last_name FROM employee", function (err, results) {
        if (err) console.error(err);

        managerNameList.push("None");

        for (var i = 0; i < results.length; i++) {
            managerNameList.push(results[i].first_name + " " + results[i].last_name);
        }

        managerNameList.push(new inquirer.Separator());
    })
    return managerNameList;
}




// View: 
// department
viewAllDepartments = () => {
    db.query("SELECT * FROM department", (err, results) => {
        if (err) console.error(err);

        console.table(results);
        mainPrompt();
    });
}


// role
viewAllRoles = () => {
    db.query("SELECT * FROM role", (err, results) => {
        if (err) console.error(err);

        console.table(results);
        mainPrompt();
    });
}

// employee
viewAllEmployees = () => {
    db.query("SELECT * FROM employee", (err, results) => {
        if (err) console.error(err);

        console.table(results);
        mainPrompt();
    });
}



// Add:
// department
addDepartment = () => {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the name of the department?",
                name: "department_name"
            },
        ])
        .then(data => {
            const newDept = data.department_name;

            db.query("INSERT INTO department (name) VALUES (?)", newDept, (err, results) => {
                if (err) console.error(err);

                viewAllDepartments();
                console.log(`Added ${newDept} to the database.`)
            });
        });
}


// role
addRole = () => {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the name of the role?",
                name: "role_title"
            },
            {
                type: "input",
                message: "What is the salary for the role?",
                name: "role_salary"
            },
            {
                type: "list",
                name: "role_department",
                message: "What department does the role belong to?",
                choices: selectDepartment()
            },


        ])

        .then(data => {
            // Select id from chosen department
            db.query("SELECT id FROM department WHERE name = ?", data.role_department, (err, results) => {
                if (err) console.error(err);

                const [{ departmentid }] = results;

                const roleInfo = [data.role_title, data.role_salary, departmentid];

                db.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", roleInfo, (err, results) => {
                    if (err) console.error(err);

                    viewAllRoles();
                    console.log(`Added ${data.role_title} to the database.`)
                });

            });

        });
}


// employee
addEmployee = () => {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the employee's first name?",
                name: "first_name"
            },
            {
                type: "input",
                message: "What is the employee's last name?",
                name: "last_name"
            },
            {
                type: "list",
                message: "What is the employee's role?",
                name: "employee_role",
                choices: selectRole()
            },
            {
                type: "list",
                message: "Who is the employee's manager?",
                name: "employee_manager",
                choices: selectManager()
            },

        ])
        .then(data => {
            db.query("SELECT id FROM role WHERE title = ?", data.employee_role, (err, results) => {
                if (err) console.error(err);

                const [{ id }] = results;

                const newEmployeeInfo = [data.first_name, data.last_name];
                newEmployeeInfo.push(id)

                if (data.employee_manager === "None") {
                    let noManager = null

                    newEmployeeInfo.push(noManager)

                    db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", newEmployeeInfo, (err, results) => {
                        if (err) console.error(err);

                        ViewAllEmployees();
                        console.log(`Added ${data.first_name} ${data.last_name} to the database.`)
                    });
                } else {
                    const manager = data.employee_manager.split(' ')

                    db.query("SELECT id FROM employee WHERE first_name = ? and last_name = ?", manager, (err, results) => {
                        if (err) console.error(err);

                        const [{ id }] = results;

                        newEmployeeInfo.push(id)

                        db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", newEmployeeInfo, (err, results) => {
                            if (err) console.error(err);

                            viewAllEmployees();
                            console.log(`Added ${data.first_name} ${data.last_name} to the database.`)
                        });
                    });
                }
            });

        });
}

// Update:
// employee
updateEmployee = () => {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to update?",
                name: "update",
                choices: ["Employee's role"]
            },
            {
                type: "list",
                message: "Whose role would you like to update?",
                name: "employee_name",
                choices: selectEmployee()
            },
            {
                type: "list",
                message: "Which role do you want to assign the selected employee?",
                name: "employee_new_role",
                choices: selectRole()
            },
        ])
        .then(data => {
            db.query("SELECT id FROM role WHERE title = ?", data.employee_new_role, (err, results) => {
                if (err) console.error(err);

                const [{ id }] = results;

                const updateEmployee = [];
                updateEmployee.push(id)

                const employee = data.employee_name.split(' ');

                db.query("SELECT id FROM employee WHERE first_name = ? and last_name = ?", employee, (err, results) => {
                    if (err) console.error(err);

                    const [{ id }] = results;

                    updateEmployee.push(id)

                    db.query("UPDATE employee SET role_id = ? WHERE id = ?", updateEmployee, (err, results) => {
                        if (err) console.error(err);

                        viewAllEmployees();
                        console.log(`Updated ${data.employee_name} to ${data.employee_new_role} in the database.`)
                    });
                });
            });
        });
}
