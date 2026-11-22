const FIXED_CHARGE = 50;

// Function to calculate slab-wise electricity charges
function calculateSlabCharge(units) {
    let charge = 0;

    if (units <= 100) {
        charge = units * 3;
    } else if (units <= 200) {
        charge = (100 * 3) + ((units - 100) * 5);
    } else if (units <= 300) {
        charge = (100 * 3) + (100 * 5) + ((units - 200) * 7);
    } else {
        charge = (100 * 3) + (100 * 5) + (100 * 7) + ((units - 300) * 10);
    }

    return charge;
}

function generateBill() {
    const consumer = document.getElementById("consumerName").value.trim();
    const units = Number(document.getElementById("units").value);

    if (!consumer || isNaN(units) || units < 0) {
        alert("Please enter a valid consumer name and non-negative units.");
        return;
    }

    const energyCharge = calculateSlabCharge(units);
    const totalBill = energyCharge + FIXED_CHARGE;

    const outputDiv = document.getElementById("output");
    outputDiv.style.display = "block";
    outputDiv.innerHTML = `
        <p><strong>Consumer Name:</strong> ${consumer}</p>
        <p><strong>Units Consumed:</strong> ${units} kWh</p>
        <p><strong>Energy Charge:</strong> ₹${energyCharge.toFixed(2)}</p>
        <p><strong>Fixed Meter Charge:</strong> ₹${FIXED_CHARGE.toFixed(2)}</p>
        <hr style="margin: 8px 0;">
        <p><strong>Total Payable Bill:</strong> ₹${totalBill.toFixed(2)}</p>
    `;
}