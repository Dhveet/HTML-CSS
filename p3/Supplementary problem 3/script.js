const GST_RATE = 0.18; // 18% GST

// Function using switch statement to return discount rate
function getDiscountRate(category) {
    switch (category) {
        case "member":
            return 0.15;
        case "student":
            return 0.10;
        case "regular":
        default:
            return 0.05;
    }
}

function generateShoppingBill() {
    const item = document.getElementById("itemName").value.trim();
    const price = Number(document.getElementById("price").value);
    const qty = Number(document.getElementById("qty").value);
    const category = document.getElementById("category").value;

    if (!item || price <= 0 || qty <= 0) {
        alert("Please enter valid item details.");
        return;
    }

    const subtotal = price * qty;
    const discountRate = getDiscountRate(category);
    const discountAmount = subtotal * discountRate;
    const taxableAmount = subtotal - discountAmount;
    const gstAmount = taxableAmount * GST_RATE;
    const finalAmount = taxableAmount + gstAmount;

    const outputDiv = document.getElementById("output");
    outputDiv.style.display = "block";
    outputDiv.innerHTML = `
        <p><strong>Item:</strong> ${item} (x${qty})</p>
        <p><strong>Subtotal:</strong> ₹${subtotal.toFixed(2)}</p>
        <p><strong>Discount (${discountRate * 100}%):</strong> -₹${discountAmount.toFixed(2)}</p>
        <p><strong>GST (18%):</strong> +₹${gstAmount.toFixed(2)}</p>
        <hr style="margin: 8px 0;">
        <p><strong>Final Payable Amount:</strong> ₹${finalAmount.toFixed(2)}</p>
    `;
}