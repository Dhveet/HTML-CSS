document.getElementById("empForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const empId = document.getElementById("empId").value.trim();
    const email = document.getElementById("empEmail").value.trim();
    const mobile = document.getElementById("empMobile").value.trim();
    const salary = Number(document.getElementById("salary").value);
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Regular Expressions
    const empIdRegex = /^EMP-\d{4}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[6-9]\d{9}$/;
    const strongPassRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    let isValid = true;
    document.querySelectorAll(".error").forEach(el => el.textContent = "");
    const successMsg = document.getElementById("successMsg");
    successMsg.style.display = "none";

    if (!empIdRegex.test(empId)) {
        document.getElementById("empIdError").textContent = "ID must follow format EMP-XXXX (e.g., EMP-1024).";
        isValid = false;
    }

    if (!emailRegex.test(email)) {
        document.getElementById("empEmailError").textContent = "Enter a valid email address.";
        isValid = false;
    }

    if (!mobileRegex.test(mobile)) {
        document.getElementById("empMobileError").textContent = "Enter a valid 10-digit mobile number.";
        isValid = false;
    }

    if (isNaN(salary) || salary < 15000 || salary > 500000) {
        document.getElementById("salaryError").textContent = "Salary must be between ₹15,000 and ₹5,00,000.";
        isValid = false;
    }

    if (!strongPassRegex.test(password)) {
        document.getElementById("passError").textContent = "Password needs 8+ chars, uppercase, lowercase, number, and symbol.";
        isValid = false;
    }

    if (password !== confirmPassword || confirmPassword === "") {
        document.getElementById("confirmPassError").textContent = "Passwords do not match.";
        isValid = false;
    }

    if (isValid) {
        successMsg.style.display = "block";
        successMsg.textContent = `Employee ${empId} registered successfully!`;
        this.reset();
    }
});