# Practical 10 — Supplementary Problem 1
## Security Analysis of a Simple Login Module

### 1. Vulnerable Login Module (Sample Code)
```javascript
// INSECURE IMPLEMENTATION (FOR ANALYSIS ONLY)
app.post("/login", (req, res) => {
    const { email, password } = req.body;
    const query = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`;

    db.query(query, (err, result) => {
        if (err) return res.status(500).send(err.sqlMessage);
        if (result.length > 0) {
            res.send("Welcome " + result[0].email);
        } else {
            res.send("Invalid password for " + email);
        }
    });
});