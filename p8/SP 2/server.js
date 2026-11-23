const express = require("express");
const mysql = require("mysql2");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "4118@Dhveet", 
    database: "company_db"
});

db.connect((err) => {
    if (err) return console.error("MySQL connection failed:", err.message);
    console.log("Connected to MySQL (company_db)");
});

// READ all employees
app.get("/api/employees", (req, res) => {
    db.query("SELECT * FROM employees ORDER BY id DESC", (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// CREATE employee
app.post("/api/employees", (req, res) => {
    const name = (req.body.name || "").trim();
    const email = (req.body.email || "").trim();
    const department = (req.body.department || "").trim();
    const salary = parseFloat(req.body.salary);

    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !department || isNaN(salary) || salary <= 0) {
        return res.status(400).json({ error: "Invalid employee details provided." });
    }

    const sql = "INSERT INTO employees (name, email, department, salary) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, email, department, salary], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Employee added successfully!", id: result.insertId });
    });
});

// UPDATE employee
app.put("/api/employees/:id", (req, res) => {
    const name = (req.body.name || "").trim();
    const email = (req.body.email || "").trim();
    const department = (req.body.department || "").trim();
    const salary = parseFloat(req.body.salary);

    if (!name || !email || !department || isNaN(salary) || salary <= 0) {
        return res.status(400).json({ error: "Invalid update data." });
    }

    const sql = "UPDATE employees SET name = ?, email = ?, department = ?, salary = ? WHERE id = ?";
    db.query(sql, [name, email, department, salary, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Employee updated successfully!" });
    });
});

// DELETE employee
app.delete("/api/employees/:id", (req, res) => {
    db.query("DELETE FROM employees WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Employee deleted successfully!" });
    });
});

app.listen(PORT, () => console.log(`Employee Management running at http://localhost:${PORT}`));