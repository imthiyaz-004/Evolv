document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('todo-form');
    const input = document.getElementById('todo-input');
    const prioritySelect = document.getElementById('priority');
    const todoList = document.getElementById('todo-list');

    // Add a task to the to-do list
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form submission

        const taskText = input.value.trim();
        const priority = prioritySelect.value; // Get selected priority

        if (taskText && priority) {
            const listItem = document.createElement('li');
            listItem.textContent = taskText;

            // Add priority class to the item
            listItem.classList.add(`priority-${priority}`);

            // Create a completed button
            const completeButton = document.createElement('button');
            completeButton.textContent = '✔';
            completeButton.className = 'complete-button';
            completeButton.addEventListener('click', function () {
                listItem.classList.toggle('completed');
            });

            // Create a delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = '✖';
            deleteButton.className = 'delete-button';
            deleteButton.addEventListener('click', function () {
                todoList.removeChild(listItem);
            });

            // Append buttons to the list item
            listItem.appendChild(completeButton);
            listItem.appendChild(deleteButton);

            // Add the list item to the to-do list and sort tasks
            todoList.appendChild(listItem);
            sortTasks();

            // Clear the input and reset priority
            input.value = '';
            prioritySelect.value = '';
        }
    });

    // Function to sort tasks based on priority
    function sortTasks() {
        const items = Array.from(todoList.children); // Convert NodeList to Array
        items.sort((a, b) => {
            const priorityOrder = { high: 1, medium: 2, low: 3 };
            const aPriority = priorityOrder[getPriorityClass(a)];
            const bPriority = priorityOrder[getPriorityClass(b)];
            return aPriority - bPriority;
        });
        items.forEach(item => todoList.appendChild(item)); // Reorder DOM elements
    }

    // Helper function to get the priority class of a task
    function getPriorityClass(item) {
        if (item.classList.contains('priority-high')) return 'high';
        if (item.classList.contains('priority-medium')) return 'medium';
        if (item.classList.contains('priority-low')) return 'low';
        return 'low'; // Default to 'low' if no class found
    }
});
