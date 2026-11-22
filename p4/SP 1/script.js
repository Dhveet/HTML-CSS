const studentList = document.getElementById("studentList");
const studentNameInput = document.getElementById("studentNameInput");
const addStudentBtn = document.getElementById("addStudentBtn");

const totalCountEl = document.getElementById("totalCount");
const presentCountEl = document.getElementById("presentCount");
const absentCountEl = document.getElementById("absentCount");

// Initial sample students
const initialStudents = ["Aarav Mehta", "Priya Sharma", "Rohan Patel", "Sneha Joshi"];

function updateCounts() {
    const allItems = document.querySelectorAll(".student-item");
    const presentItems = document.querySelectorAll(".status-btn.present");
    const absentItems = document.querySelectorAll(".status-btn.absent");

    totalCountEl.textContent = allItems.length;
    presentCountEl.textContent = presentItems.length;
    absentCountEl.textContent = absentItems.length;
}

function createStudentRow(name) {
    const li = document.createElement("li");
    li.className = "student-item";

    const nameSpan = document.createElement("span");
    nameSpan.textContent = name;

    const statusBtn = document.createElement("button");
    statusBtn.textContent = "Absent";
    statusBtn.className = "status-btn absent";

    // Toggle Present / Absent on click
    statusBtn.addEventListener("click", () => {
        if (statusBtn.classList.contains("absent")) {
            statusBtn.classList.remove("absent");
            statusBtn.classList.add("present");
            statusBtn.textContent = "Present";
        } else {
            statusBtn.classList.remove("present");
            statusBtn.classList.add("absent");
            statusBtn.textContent = "Absent";
        }
        updateCounts();
    });

    li.appendChild(nameSpan);
    li.appendChild(statusBtn);
    studentList.appendChild(li);
    updateCounts();
}

// Load initial students
initialStudents.forEach(createStudentRow);

// Add new student dynamically
addStudentBtn.addEventListener("click", () => {
    const name = studentNameInput.value.trim();
    if (name === "") {
        alert("Please enter a student name.");
        return;
    }
    createStudentRow(name);
    studentNameInput.value = "";
});