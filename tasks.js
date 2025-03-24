const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];  // Load tasks from localStorage

// Function to update the UI with tasks
function updateUI() {
    taskList.innerHTML = '';  // Clear the current task list
    tasks.forEach(task => {
        const listItem = document.createElement("li");
        listItem.textContent = `${task.name} (${task.priority})`;
        listItem.classList.add(task.priority);
        taskList.appendChild(listItem);
    });
}

// Handle form submission
taskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const taskName = document.getElementById("taskName").value;
    const priority = document.getElementById("priority").value;

    if (taskName) {
        // Add to task list
        const newTask = { name: taskName, priority: priority };
        tasks.push(newTask);

        // Save to localStorage
        localStorage.setItem("tasks", JSON.stringify(tasks));

        // Update UI
        updateUI();

        // Clear inputs
        taskForm.reset();
    }
});

// Initial UI update
updateUI();
