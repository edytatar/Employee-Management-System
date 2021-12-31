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

// Select:
// department
let departmentNameList = [];
selectDepartments = () => {
    db.query("SELECT name FROM department", function (err, results) {
        if (err) console.error(err);

        results.forEach(function (name) {
            departmentNameList.push(name)
        })

        departmentNameList.push(new inquirer.Separator());
    })
    return departmentNameList;
}

// role



// employee





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
                choices: selectDepartments()
            },


        ])

        .then(data => {
            // Select id from chosen department
            db.query("SELECT id FROM department WHERE name = ?", data.role_department, (err, results) => {
                if (err) console.error(err);

                const [{ id }] = results;

                const roleInfo = [data.role_title, data.role_salary, id];

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
                name: "employee_first_name"
            },
            {
                type: "input",
                message: "What is the employee's last name??",
                name: "employee_last_name"
            },
            {
                type: "list",
                name: "employee_role",
                message: "What is the employee's role?",
                choices: selectRoles()
            },
            {
                type: "list",
                name: "employee_manager",
                message: "Who is the employee's manager?",
                choices: selectEmployee()
            },


        ])

        .then(data => {
            // Select id from chosen department
            db.query("SELECT id FROM role WHERE title = ?", data.employee_role, (err, results) => {
                if (err) console.error(err);

                const [{ roleId }] = results;

                db.query("SELECT manager_id FROM employee WHERE id = ?", data.employee_manager, (err, resultsTwo) => {
                    if (err) console.error(err);

                    const [{ managerId }] = resultsTwo;


                    const employeeInfo = [data.employee_first_name, data.employee_last_name, roleId, managerId];

                    db.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?)", employeeInfo, (err, results) => {
                        if (err) console.error(err);

                        viewAllEmployees();
                        console.log(`Added ${data.employee_first_name} ${data.employee_last_name} to the database.`)
                    });
                });

            });

        });
}
