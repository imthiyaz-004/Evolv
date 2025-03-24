const eventForm = document.getElementById("eventForm");
const eventList = document.getElementById("eventList");

let events = JSON.parse(localStorage.getItem("events")) || [];  // Load events from localStorage

// Function to update the UI with events
function updateUI() {
    eventList.innerHTML = '';  // Clear the current event list
    events.forEach(event => {
        const today = new Date();
        const eventDate = new Date(event.date);
        const diffTime = eventDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        const listItem = document.createElement("li");
        listItem.textContent = `${event.name} - ${diffDays} days left`;
        eventList.appendChild(listItem);
    });
}

// Handle form submission
eventForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const eventName = document.getElementById("eventName").value;
    const eventDate = document.getElementById("eventDate").value;

    if (eventName && eventDate) {
        const newEvent = { name: eventName, date: eventDate };
        events.push(newEvent);

        // Save to localStorage
        localStorage.setItem("events", JSON.stringify(events));

        // Update UI
        updateUI();

        // Clear inputs
        eventForm.reset();
    }
});

// Initial UI update
updateUI();
