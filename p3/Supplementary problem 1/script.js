// Reusable function to determine grade and classification
function getGradeDetails(percentage, isPass) {
    if (!isPass) {
        return { grade: "F", classification: "Fail" };
    } else if (percentage >= 90) {
        return { grade: "A+", classification: "Distinction" };
    } else if (percentage >= 75) {
        return { grade: "A", classification: "First Class with Distinction" };
    } else if (percentage >= 60) {
        return { grade: "B", classification: "First Class" };
    } else if (percentage >= 50) {
        return { grade: "C", classification: "Second Class" };
    } else {
        return { grade: "D", classification: "Pass Class" };
    }
}

function calculateResult() {
    const name = document.getElementById("studentName").value.trim();
    const marks = [
        Number(document.getElementById("m1").value),
        Number(document.getElementById("m2").value),
        Number(document.getElementById("m3").value),
        Number(document.getElementById("m4").value)
    ];

    if (!name) {
        alert("Please enter the student's name.");
        return;
    }

    let total = 0;
    let isPass = true;

    // Loop to validate marks and compute total
    for (let i = 0; i < marks.length; i++) {
        if (marks[i] < 0 || marks[i] > 100 || isNaN(marks[i])) {
            alert("All marks must be between 0 and 100.");
            return;
        }
        if (marks[i] < 35) {
            isPass = false;
        }
        total += marks[i];
    }

    const percentage = (total / (marks.length * 100)) * 100;
    const result = getGradeDetails(percentage, isPass);

    const outputDiv = document.getElementById("output");
    outputDiv.style.display = "block";
    outputDiv.innerHTML = `
        <p><strong>Student:</strong> ${name}</p>
        <p><strong>Total Marks:</strong> ${total} / 400</p>
        <p><strong>Percentage:</strong> ${percentage.toFixed(2)}%</p>
        <p><strong>Grade:</strong> ${result.grade}</p>
        <p><strong>Classification:</strong> ${result.classification}</p>
    `;
}