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

                showAllDepartments();
                console.log(`Added ${newDept} to the database.`)
            });
        });
}

// role



// employee