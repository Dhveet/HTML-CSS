const express = require("express");
const mysql = require("mysql2");
const crypto = require("crypto");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "4118@Dhveet",
    database: "finsecure_db"
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
        return;
    }
    console.log("Connected to MySQL (finsecure_db)");
});

// Salted password hashing using Node.js built-in crypto.scryptSync
function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString("hex");
    const derivedKey = crypto.scryptSync(password, salt, 64).toString("hex");
    return `${salt}:${derivedKey}`;
}

// Enhanced Registration Endpoint
app.post("/api/register", (req, res) => {
    const username = (req.body.username || "").trim();
    const email = (req.body.email || "").trim().toLowerCase();
    const password = req.body.password || "";
    const confirmPassword = req.body.confirmPassword || "";

    // 1. Input Validation
    if (!/^[a-zA-Z0-9_]{3,25}$/.test(username)) {
        return res.status(400).json({
            error: "Username must be 3-25 characters (letters, numbers, or underscores only)."
        });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({
            error: "Please provide a valid email address."
        });
    }

    // 2. Strong Password Policy Validation
    const passwordPolicy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=]).{8,}$/;
    if (!passwordPolicy.test(password)) {
        return res.status(400).json({
            error: "Password must be at least 8 characters and include uppercase, lowercase, number, and special symbol."
        });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({
            error: "Password and Confirm Password do not match."
        });
    }

    // 3. Salted Password Hashing
    const passwordHash = hashPassword(password);

    // 4. Parameterized Query + Safe Error Handling
    const sql = "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)";
    db.query(sql, [username, email, passwordHash], (err) => {
        if (err) {
            // Log full technical error internally, never send raw SQL messages to client
            console.error("Registration Error:", err.code, err.message);

            if (err.code === "ER_DUP_ENTRY") {
                return res.status(409).json({
                    error: "That username or email is already registered."
                });
            }
            return res.status(500).json({
                error: "Registration failed due to a server error. Please try again later."
            });
        }

        res.status(201).json({
            message: "Account created securely! Password validated and stored as a salted hash."
        });
    });
});

app.listen(PORT, () => console.log(`Registration Portal running at http://localhost:${PORT}`));