const express = require("express");
const session = require("express-session");
const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(session({
    secret: "hotel-reservation-secret",
    resave: false,
    saveUninitialized: false
}));

function requireLogin(req, res, next) {
    if (req.session.guest) return next();
    res.redirect("/login");
}

app.get("/", (req, res) => {
    res.send(`
        <link rel="stylesheet" href="/style.css">
        <div class="box">
            <h1>GrandView Hotel</h1>
            <p>Book luxury rooms online. Please log in to access reservations.</p>
            <a class="btn" href="/booking">Go to Booking Page</a>
            <a class="btn secondary" href="/login">Guest Login</a>
        </div>
    `);
});

app.get("/login", (req, res) => {
    res.send(`
        <link rel="stylesheet" href="/style.css">
        <div class="box">
            <h2>Guest Login</h2>
            <form method="POST" action="/login">
                <input type="text" name="username" placeholder="Username (guest)" required>
                <input type="password" name="password" placeholder="Password (hotel123)" required>
                <button type="submit">Login</button>
            </form>
        </div>
    `);
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (username === "guest" && password === "hotel123") {
        req.session.guest = username;
        res.redirect("/booking");
    } else {
        res.send(`<link rel="stylesheet" href="/style.css"><div class="box"><p class="error">Invalid login details.</p><a href="/login">Try Again</a></div>`);
    }
});

// Protected Booking Page
app.get("/booking", requireLogin, (req, res) => {
    res.send(`
        <link rel="stylesheet" href="/style.css">
        <div class="box">
            <h1>Room Reservation</h1>
            <p>Logged in as: <strong>${req.session.guest}</strong></p>
            <form method="POST" action="/booking">
                <label>Room Type:</label>
                <select name="room" required>
                    <option value="Standard Room (₹2,500/night)">Standard Room — ₹2,500/night</option>
                    <option value="Deluxe Suite (₹4,500/night)">Deluxe Suite — ₹4,500/night</option>
                </select>
                <label>Check-in Date:</label>
                <input type="date" name="checkin" required>
                <label>Nights:</label>
                <input type="number" name="nights" min="1" value="1" required>
                <button type="submit">Confirm Reservation</button>
            </form>
            <a class="btn danger" href="/logout">Logout</a>
        </div>
    `);
});

app.post("/booking", requireLogin, (req, res) => {
    const { room, checkin, nights } = req.body;
    res.send(`
        <link rel="stylesheet" href="/style.css">
        <div class="box">
            <h2>Reservation Confirmed!</h2>
            <p><strong>Guest:</strong> ${req.session.guest}</p>
            <p><strong>Room:</strong> ${room}</p>
            <p><strong>Check-in:</strong> ${checkin} (${nights} night(s))</p>
            <a class="btn" href="/booking">Book Another Room</a>
            <a class="btn danger" href="/logout">Logout</a>
        </div>
    `);
});

app.get("/logout", (req, res) => {
    req.session.destroy(() => res.redirect("/login"));
});

app.listen(PORT, () => console.log(`Hotel Portal running at http://localhost:${PORT}`));