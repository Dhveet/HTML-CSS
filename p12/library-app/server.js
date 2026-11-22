const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Connect to SQLite Database (creates library.db automatically)
const db = new sqlite3.Database("library.db", (err) => {
  if (err) console.log("Database error:", err);
  else console.log("Connected to SQLite database.");
});

// Create table if it doesn't exist
db.run(`
  CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    year INTEGER NOT NULL
  )
`);

// REST API 1: Get all books
app.get("/api/books", (req, res) => {
  db.all("SELECT * FROM books", [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(rows);
  });
});

// REST API 2: Add a new book (with validation & SQL injection protection)
app.post("/api/books", (req, res) => {
  const { title, author, year } = req.body;

  // Server-side validation
  if (!title || !author || !year) {
    return res.status(400).json({ error: "All fields are required." });
  }

  // Parameterized query (?) prevents SQL Injection
  const sql = "INSERT INTO books (title, author, year) VALUES (?, ?, ?)";
  db.run(sql, [title.trim(), author.trim(), year], function (err) {
    if (err) return res.status(500).json({ error: "Could not add book." });
    res.status(201).json({ id: this.lastID, title, author, year });
  });
});

// REST API 3: Delete a book by ID
app.delete("/api/books/:id", (req, res) => {
  const id = req.params.id;

  db.run("DELETE FROM books WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: "Could not delete book." });
    res.json({ message: "Book deleted" });
  });
});

// Start Server
app.listen(PORT, () => {
  console.log("Server running at http://localhost:" + PORT);
});