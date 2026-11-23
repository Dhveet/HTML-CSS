const express = require("express");
const session = require("express-session");
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(session({
    secret: "employee-attendance-secret",
    resave: false,
    saveUninitialized: false
}));

function isAuthenticated(req, res, next) {
    if (req.session.employee) return next();
    res.redirect("/login");
}

app.get("/", (req, res) => res.redirect("/login"));

app.get("/login", (req, res) => {
    res.send(`
        <link rel="stylesheet" href="/style.css">
        <div class="box">
            <h2>Employee Portal Login</h2>
            <form method="POST" action="/login">
                <input type="text" name="empId" placeholder="Employee ID (emp101)" required>
                <input type="password" name="password" placeholder="Password (emp123)" required>
                <button type="submit">Login</button>
            </form>
        </div>
    `);
});

app.post("/login", (req, res) => {
    const { empId, password } = req.body;
    if (empId === "emp101" && password === "emp123") {
        req.session.employee = { id: "EMP-101", name: "Dhveet Patel", role: "Software Engineer", status: "Not Marked" };
        res.redirect("/dashboard");
    } else {
        res.send(`<link rel="stylesheet" href="/style.css"><div class="box"><p class="error">Invalid Employee ID or Password.</p><a href="/login">Back to Login</a></div>`);
    }
});

app.get("/dashboard", isAuthenticated, (req, res) => {
    const emp = req.session.employee;
    res.send(`
        <link rel="stylesheet" href="/style.css">
        <div class="box">
            <h1>Attendance Dashboard</h1>
            <p>Welcome, <strong>${emp.name}</strong> (${emp.id})</p>
            <p>Today's Status: <strong>${emp.status}</strong></p>
            <form method="POST" action="/mark-attendance">
                <button type="submit">Mark Present for Today</button>
            </form>
            <div class="links">
                <a class="btn secondary" href="/profile">View Profile</a>
                <a class="btn danger" href="/logout">Logout</a>
            </div>
        </div>
    `);
});

app.post("/mark-attendance", isAuthenticated, (req, res) => {
    req.session.employee.status = `Present (Marked at ${new Date().toLocaleTimeString()})`;
    res.redirect("/dashboard");
});

app.get("/profile", isAuthenticated, (req, res) => {
    const emp = req.session.employee;
    res.send(`
        <link rel="stylesheet" href="/style.css">
        <div class="box">
            <h2>Employee Profile</h2>
            <p><strong>ID:</strong> ${emp.id}</p>
            <p><strong>Name:</strong> ${emp.name}</p>
            <p><strong>Designation:</strong> ${emp.role}</p>
            <div class="links">
                <a class="btn" href="/dashboard">Back to Dashboard</a>
                <a class="btn danger" href="/logout">Logout</a>
            </div>
        </div>
    `);
});

app.get("/logout", (req, res) => {
    req.session.destroy(() => res.redirect("/login"));
});

app.listen(PORT, () => console.log(`Attendance Portal running at http://localhost:${PORT}`));