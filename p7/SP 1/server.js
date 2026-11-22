const express = require("express");
const session = require("express-session");
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(session({
    secret: "course-portal-secret",
    resave: false,
    saveUninitialized: false
}));

// Authentication middleware
function requireAuth(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.redirect("/login");
}

app.get("/", (req, res) => {
    res.send(`
        <link rel="stylesheet" href="/style.css">
        <div class="box">
            <h1>Online Course Portal</h1>
            <p>Welcome to the Student Learning Management System.</p>
            <a class="btn" href="/courses">Access Course Materials</a>
            <a class="btn secondary" href="/login">Student Login</a>
        </div>
    `);
});

app.get("/login", (req, res) => {
    res.send(`
        <link rel="stylesheet" href="/style.css">
        <div class="box">
            <h2>Student Login</h2>
            <form method="POST" action="/login">
                <input type="text" name="username" placeholder="Username (student)" required>
                <input type="password" name="password" placeholder="Password (pass123)" required>
                <button type="submit">Login</button>
            </form>
        </div>
    `);
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (username === "student" && password === "pass123") {
        req.session.user = username;
        res.redirect("/courses");
    } else {
        res.send(`<link rel="stylesheet" href="/style.css"><div class="box"><p class="error">Invalid credentials!</p><a href="/login">Try Again</a></div>`);
    }
});

// Protected route
app.get("/courses", requireAuth, (req, res) => {
    res.send(`
        <link rel="stylesheet" href="/style.css">
        <div class="box">
            <h1>Course Materials</h1>
            <p>Logged in as: <strong>${req.session.user}</strong></p>
            <ul>
                <li><strong>ITUS102:</strong> Web Technology Framework — Notes &amp; Labs</li>
                <li><strong>BEE101:</strong> Basic Electrical Engineering — Lecture Slides</li>
                <li><strong>CS103:</strong> Algorithms &amp; Problem Solving — Practice Sheets</li>
            </ul>
            <a class="btn danger" href="/logout">Logout</a>
        </div>
    `);
});

app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
});

app.listen(PORT, () => console.log(`Course Portal running at http://localhost:${PORT}`));