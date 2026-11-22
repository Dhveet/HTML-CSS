const SEAT_PRICE = 250;
const ROWS = ["A", "B", "C", "D"];
const COLS = 6;
const PRE_BOOKED = ["A2", "A3", "B5", "C1"];

const seatGrid = document.getElementById("seatGrid");
const selectedSeatsEl = document.getElementById("selectedSeats");
const totalPriceEl = document.getElementById("totalPrice");
const confirmBtn = document.getElementById("confirmBtn");

function updateSummary() {
    const selected = Array.from(document.querySelectorAll(".seat.selected")).map(s => s.dataset.seat);
    selectedSeatsEl.textContent = selected.length > 0 ? selected.join(", ") : "None";
    totalPriceEl.textContent = selected.length * SEAT_PRICE;
}

// Generate seats dynamically
ROWS.forEach(row => {
    for (let col = 1; col <= COLS; col++) {
        const seatId = `${row}${col}`;
        const seatDiv = document.createElement("div");
        seatDiv.className = "seat";
        seatDiv.textContent = seatId;
        seatDiv.dataset.seat = seatId;

        if (PRE_BOOKED.includes(seatId)) {
            seatDiv.classList.add("booked");
        } else {
            seatDiv.addEventListener("click", () => {
                seatDiv.classList.toggle("selected");
                updateSummary();
            });
        }

        seatGrid.appendChild(seatDiv);
    }
});

// Confirm booking
confirmBtn.addEventListener("click", () => {
    const selectedSeats = document.querySelectorAll(".seat.selected");
    if (selectedSeats.length === 0) {
        alert("Please select at least one seat.");
        return;
    }

    selectedSeats.forEach(seat => {
        seat.classList.remove("selected");
        seat.classList.add("booked");
    });

    alert(`Booking confirmed for ${selectedSeats.length} seat(s)! Total paid: ₹${selectedSeats.length * SEAT_PRICE}`);
    updateSummary();
});