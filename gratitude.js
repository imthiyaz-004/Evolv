document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('gratitude-form');
    const gratitudeInput = document.getElementById('gratitude-input');
    const gratitudeList = document.getElementById('gratitude-list');
    const voiceNoteButton = document.getElementById('voice-note-button'); // Button to trigger voice recognition

    // Check if SpeechRecognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert("Sorry, your browser doesn't support voice recognition.");
        return; // Exit if SpeechRecognition is not supported
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;  // Set to false to only get the final result (no real-time transcription)

    let isRecognizing = false;  // Flag to track recognition state

    // Handle voice note button click
    voiceNoteButton.addEventListener('click', () => {
        if (!isRecognizing) {
            startVoiceRecognition();
        }
    });

    // Function to prevent form submission and add gratitude entry
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent form from submitting
        const gratitudeText = gratitudeInput.value.trim();
        
        if (gratitudeText) {
            addGratitudeEntry(gratitudeText); // Add typed gratitude entry
            gratitudeInput.value = ''; // Clear the input field
        }
    });

    function startVoiceRecognition() {
        recognition.start();
        isRecognizing = true;
        voiceNoteButton.textContent = "Listening..."; // Indicate listening

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            addGratitudeEntry(transcript); // Add the recognized text to the gratitude list
            voiceNoteButton.textContent = "Add Voice Note"; // Reset button text after result is received
        };

        recognition.onerror = (event) => {
            console.error('Voice recognition error:', event.error);
            alert('An error occurred during voice recognition.');
            voiceNoteButton.textContent = "Add Voice Note"; // Reset button text
            isRecognizing = false; // Reset the recognizing flag
        };

        recognition.onend = () => {
            voiceNoteButton.textContent = "Add Voice Note"; // Reset button text after recognition ends
            isRecognizing = false; // Reset the recognizing flag
        };
    }

    // Function to add gratitude entry to the list
    function addGratitudeEntry(text) {
        const listItem = document.createElement('li');
        listItem.textContent = text;
        gratitudeList.appendChild(listItem);
    }
});
