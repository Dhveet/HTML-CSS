document.getElementById("eventForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("pName").value.trim();
    const email = document.getElementById("pEmail").value.trim();
    const ticket = document.getElementById("ticketType").value;
    const cardNum = document.getElementById("cardNum").value.trim();
    const expiry = document.getElementById("expiry").value.trim();
    const cvv = document.getElementById("cvv").value.trim();

    // Regular Expressions
    const nameRegex = /^[A-Za-z\s]{3,50}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cardRegex = /^\d{16}$/;
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    const cvvRegex = /^\d{3}$/;

    let isValid = true;
    document.querySelectorAll(".error").forEach(el => el.textContent = "");
    const confirmationBox = document.getElementById("confirmationBox");
    confirmationBox.style.display = "none";

    if (!nameRegex.test(name)) {
        document.getElementById("pNameError").textContent = "Enter a valid full name.";
        isValid = false;
    }

    if (!emailRegex.test(email)) {
        document.getElementById("pEmailError").textContent = "Enter a valid email address.";
        isValid = false;
    }

    if (ticket === "") {
        document.getElementById("ticketError").textContent = "Please select a ticket type.";
        isValid = false;
    }

    if (!cardRegex.test(cardNum)) {
        document.getElementById("cardError").textContent = "Card number must be exactly 16 digits.";
        isValid = false;
    }

    if (!expiryRegex.test(expiry)) {
        document.getElementById("expiryError").textContent = "Use MM/YY format (e.g., 08/28).";
        isValid = false;
    }

    if (!cvvRegex.test(cvv)) {
        document.getElementById("cvvError").textContent = "CVV must be 3 digits.";
        isValid = false;
    }

    if (isValid) {
        const regId = "EVT-" + Math.floor(100000 + Math.random() * 900000);
        confirmationBox.style.display = "block";
        confirmationBox.innerHTML = `
            <strong>Registration Confirmed!</strong><br>
            Booking ID: <strong>${regId}</strong><br>
            Participant: ${name}<br>
            Ticket: ${ticket}
        `;
        this.reset();
    }
});