// script.js

// Check if the browser supports Speech API
const startButton = document.getElementById('startButton');
const responseDiv = document.getElementById('response');
const notesDiv = document.getElementById('notes');

// Initialize Speech Synthesis (Text-to-Speech)
const synth = window.speechSynthesis;

// Speech Recognition setup
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.interimResults = false;

// Listen for the button click to start recognition
startButton.addEventListener('click', () => {
    recognition.start();  // Start listening to user's speech
    responseDiv.innerText = "Listening...";  // Update UI
});

// When speech is recognized, respond
recognition.onresult = (event) => {
    const userSpeech = event.results[0][0].transcript;  // Get the text the user said
    responseDiv.innerText = `You said: "${userSpeech}"`;  // Display user's speech

    // Add this input as a new note in the "Your Notes" section
    addNoteToUI(userSpeech);

    // AI Response Logic (you can expand it based on tasks)
    const response = getAIResponse(userSpeech);
    speakResponse(response);
};

// Handle errors during recognition
recognition.onerror = (event) => {
    responseDiv.innerText = "Sorry, I didn't catch that.";
};

// Function to get AI's response based on user input
function getAIResponse(input) {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes("task") || lowerInput.includes("add")) {
        return "Sure, I can help you add a new task. What task would you like to add?";
    } else if (lowerInput.includes("hello")) {
        return "Hello! How can I assist you today?";
    } else if (lowerInput.includes("goodbye")) {
        return "Goodbye! Have a great day!";
    } else {
        return "Sorry, I didn't understand that. Could you say it again?";
    }
}

// Function to speak the AI's response
function speakResponse(response) {
    const utterance = new SpeechSynthesisUtterance(response);
    synth.speak(utterance);
}

// Function to add the speech input as a note to the UI
function addNoteToUI(noteContent) {
    const note = document.createElement('div');
    note.classList.add('note');
    note.textContent = noteContent;
    notesDiv.appendChild(note);
}
// Save the notes to localStorage
function saveNotes() {
    const notes = [];
    document.querySelectorAll('.note').forEach(note => {
        notes.push(note.textContent);
    });
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Load the notes from localStorage
function loadNotes() {
    const notes = JSON.parse(localStorage.getItem('notes'));
    if (notes) {
        notes.forEach(note => {
            addNoteToUI(note);
        });
    }
}

// Call loadNotes when the page loads to retrieve previous notes
window.onload = loadNotes;

// Save notes every time a new note is added
window.onbeforeunload = saveNotes;
