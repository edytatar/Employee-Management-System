INSERT INTO department (name)
VALUES ("Accounting"),
       ("Customer Support"),
       ("Data"),
       ("Design"),
       ("Engineering"),
       ("Human Resources"),
       ("IT"),
       ("Marketing"),
       ("People"),
       ("Product"),
       ("Research and Development"),
       ("Sales");

INSERT INTO role (title, salary, department_id)
VALUES ("Mid-level Accountant", 100000, 1),
       ("Customer Support Specialist", 50000, 2),
       ("Data Analyst", 85000, 3),
       ("Junior Graphic Designer", 40000, 4),
       ("Creative Director", 120000, 4),
       ("Software Engineer I", 90000, 5),
       ("Lead Software Engineer", 250000, 5),
       ("Senior Recruiter", 95000, 6),
       ("IT Specialist", 75000, 7),
       ("Associate SEO manager", 38000, 8),
       ("Group Marketing Manager", 150000, 8),
       ("Chief of Staff", 650000, 9),
       ("Developer Advocate", 150000, 10),
       ("Associate Researcher", 45000, 11),
       ("Senior Researcher", 75000, 11),
       ("Principal Researcher", 500000, 11),
       ("Account Manager", 35000, 12);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES ("Edyta", "Tarczynski", 6, null),
           ("Madison", "Kip", 7, NULL),
           ("Elijah", "Thomas", 4, null),
           ("Noemi", "Krisowsky", 5, null),
           ("Nathaniel", "Bleimstein", 10, null),
           ("Maria", "Lopez", 14, null),
           ("Daniel", "Centenial", 15, null),
           ("Abdul", "Ayad", 16, null);


UPDATE employee 
SET 
    manager_id = 20
WHERE
    first_name = "Edyta";

UPDATE employee 
SET 
    manager_id = 22
WHERE
    first_name = "Elijah";

UPDATE employee 
SET 
    manager_id = 24
WHERE
    first_name = "Nathaniel";
    
UPDATE employee 
SET 
    manager_id = 25
WHERE
    first_name = "Maria";

    
UPDATE employee 
SET 
    manager_id = 26
WHERE
    first_name = "Daniel";


