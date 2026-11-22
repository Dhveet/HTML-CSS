document.getElementById("admissionForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const dob = document.getElementById("dob").value;
    const percentage = parseFloat(document.getElementById("percentage").value);
    const course = document.getElementById("course").value;

    // Regular Expressions
    const nameRegex = /^[A-Za-z\s]{3,50}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[6-9]\d{9}$/;

    let isValid = true;

    // Clear previous messages
    document.querySelectorAll(".error").forEach(el => el.textContent = "");
    const successMsg = document.getElementById("successMsg");
    successMsg.style.display = "none";

    if (!nameRegex.test(fullName)) {
        document.getElementById("nameError").textContent = "Enter a valid name (letters only, min 3 characters).";
        isValid = false;
    }

    if (!emailRegex.test(email)) {
        document.getElementById("emailError").textContent = "Enter a valid email address.";
        isValid = false;
    }

    if (!mobileRegex.test(mobile)) {
        document.getElementById("mobileError").textContent = "Enter a valid 10-digit Indian mobile number.";
        isValid = false;
    }

    if (!dob) {
        document.getElementById("dobError").textContent = "Please select your date of birth.";
        isValid = false;
    } else {
        const age = new Date().getFullYear() - new Date(dob).getFullYear();
        if (age < 16 || age > 35) {
            document.getElementById("dobError").textContent = "Applicant age must be between 16 and 35 years.";
            isValid = false;
        }
    }

    if (isNaN(percentage) || percentage < 45 || percentage > 100) {
        document.getElementById("percentError").textContent = "Percentage must be between 45% and 100%.";
        isValid = false;
    }

    if (course === "") {
        document.getElementById("courseError").textContent = "Please select an academic program.";
        isValid = false;
    }

    if (isValid) {
        successMsg.style.display = "block";
        successMsg.textContent = `Application submitted successfully for ${fullName} (${course})!`;
        this.reset();
    }
});