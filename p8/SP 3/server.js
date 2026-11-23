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
    database: "library_db"
});

db.connect((err) => {
    if (err) return console.error("MySQL connection failed:", err.message);
    console.log("Connected to MySQL (library_db)");
});

// READ & SEARCH books (by title, author, or ISBN)
app.get("/api/books", (req, res) => {
    const q = (req.query.q || "").trim();
    if (q) {
        const pattern = `%${q}%`;
        const sql = "SELECT * FROM books WHERE title LIKE ? OR author LIKE ? OR isbn LIKE ? ORDER BY id DESC";
        db.query(sql, [pattern, pattern, pattern], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
    } else {
        db.query("SELECT * FROM books ORDER BY id DESC", (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
    }
});

// CREATE book
app.post("/api/books", (req, res) => {
    const title = (req.body.title || "").trim();
    const author = (req.body.author || "").trim();
    const isbn = (req.body.isbn || "").trim();
    const copies = parseInt(req.body.copies, 10);

    if (!title || !author || !isbn || isNaN(copies) || copies < 0) {
        return res.status(400).json({ error: "Please enter valid book details and non-negative copies." });
    }

    const sql = "INSERT INTO books (title, author, isbn, copies) VALUES (?, ?, ?, ?)";
    db.query(sql, [title, author, isbn, copies], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Book added successfully!", id: result.insertId });
    });
});

// UPDATE book
app.put("/api/books/:id", (req, res) => {
    const title = (req.body.title || "").trim();
    const author = (req.body.author || "").trim();
    const isbn = (req.body.isbn || "").trim();
    const copies = parseInt(req.body.copies, 10);

    if (!title || !author || !isbn || isNaN(copies) || copies < 0) {
        return res.status(400).json({ error: "Invalid update data." });
    }

    const sql = "UPDATE books SET title = ?, author = ?, isbn = ?, copies = ? WHERE id = ?";
    db.query(sql, [title, author, isbn, copies, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Book updated successfully!" });
    });
});

// DELETE book
app.delete("/api/books/:id", (req, res) => {
    db.query("DELETE FROM books WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Book removed successfully!" });
    });
});

app.listen(PORT, () => console.log(`Library System running at http://localhost:${PORT}`));