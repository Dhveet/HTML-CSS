const express = require("express");
const mysql = require("mysql2");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "4118@Dhveet", // <-- put your MySQL Workbench password here
    database: "college_db"
});

db.connect((err) => {
    if (err) {
        console.error("MySQL connection failed:", err.message);
        return;
    }
    console.log("Connected to MySQL (college_db)");
});

// READ all students
app.get("/api/students", (req, res) => {
    db.query("SELECT * FROM students ORDER BY id DESC", (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// CREATE student
app.post("/api/students", (req, res) => {
    const name = (req.body.name || "").trim();
    const email = (req.body.email || "").trim();
    const course = (req.body.course || "").trim();
    const semester = parseInt(req.body.semester, 10);

    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !course || isNaN(semester) || semester < 1 || semester > 8) {
        return res.status(400).json({ error: "Invalid student details provided." });
    }

    const sql = "INSERT INTO students (name, email, course, semester) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, email, course, semester], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Student added successfully!", id: result.insertId });
    });
});

// UPDATE student
app.put("/api/students/:id", (req, res) => {
    const name = (req.body.name || "").trim();
    const email = (req.body.email || "").trim();
    const course = (req.body.course || "").trim();
    const semester = parseInt(req.body.semester, 10);

    if (!name || !email || !course || isNaN(semester) || semester < 1 || semester > 8) {
        return res.status(400).json({ error: "Invalid update data." });
    }

    const sql = "UPDATE students SET name = ?, email = ?, course = ?, semester = ? WHERE id = ?";
    db.query(sql, [name, email, course, semester, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Student updated successfully!" });
    });
});

// DELETE student
app.delete("/api/students/:id", (req, res) => {
    db.query("DELETE FROM students WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Student deleted successfully!" });
    });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));