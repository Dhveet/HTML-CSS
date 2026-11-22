const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

function addTask() {
    const text = taskInput.value.trim();
    if (text === "") {
        alert("Please enter a task.");
        return;
    }

    const li = document.createElement("li");
    li.className = "task-item";

    const span = document.createElement("span");
    span.className = "task-text";
    span.textContent = text;

    const actions = document.createElement("div");
    actions.className = "actions";

    // Complete Button
    const completeBtn = document.createElement("button");
    completeBtn.textContent = "Done";
    completeBtn.className = "complete-btn";
    completeBtn.addEventListener("click", () => {
        span.classList.toggle("completed");
    });

    // Edit Button
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "edit-btn";
    editBtn.addEventListener("click", () => {
        const updatedText = prompt("Edit task:", span.textContent);
        if (updatedText !== null && updatedText.trim() !== "") {
            span.textContent = updatedText.trim();
        }
    });

    // Delete Button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-btn";
    deleteBtn.addEventListener("click", () => {
        li.remove();
    });

    actions.appendChild(completeBtn);
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(span);
    li.appendChild(actions);
    taskList.appendChild(li);

    taskInput.value = "";
}

addTaskBtn.addEventListener("click", addTask);

// Allow pressing Enter key to add task
taskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addTask();
    }
});