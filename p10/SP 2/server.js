const express = require("express");
const bcrypt = require("bcryptjs");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

// In-memory store to demonstrate secure hashing without needing extra DB setup
const users = [];

// Strong password: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

app.post("/api/register", async (req, res) => {
    try {
        const name = (req.body.name || "").trim();
        const email = (req.body.email || "").trim().toLowerCase();
        const password = req.body.password || "";
        const confirmPassword = req.body.confirmPassword || "";

        // 1. Server-side validation
        if (!name || name.length < 3) {
            return res.status(400).json({ error: "Name must be at least 3 characters long." });
        }
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Please enter a valid email address." });
        }
        if (!strongPasswordRegex.test(password)) {
            return res.status(400).json({
                error: "Password must be 8+ characters with uppercase, lowercase, number, and special character."
            });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match." });
        }

        // Check duplicate email
        if (users.find(u => u.email === email)) {
            return res.status(409).json({ error: "An account with this email already exists." });
        }

        // 2. Hash password securely with salt rounds = 10
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        users.push({ id: users.length + 1, name, email, passwordHash });

        // Never return the password or hash in production; shown here only for lab demonstration
        res.status(201).json({
            message: "Registration successful! Password securely hashed.",
            demoHash: passwordHash
        });
    } catch (err) {
        // 3. Safe error handling (do not expose stack traces to client)
        console.error("Registration error:", err);
        res.status(500).json({ error: "Unable to process registration right now. Please try again later." });
    }
});

app.listen(PORT, () => console.log(`Secure Registration running at http://localhost:${PORT}`));