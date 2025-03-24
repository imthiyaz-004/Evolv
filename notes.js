const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';

const notesContainer = document.getElementById('notes-container');
const addNoteButton = document.getElementById('addNote');

addNoteButton.addEventListener('click', () => {
    startVoiceRecognition();
});

function startVoiceRecognition() {
    recognition.start();
    addNoteButton.textContent = "Listening...";

    recognition.onresult = (event) => {
        let transcript = event.results[0][0].transcript;

        const noteItem = document.createElement('div');
        noteItem.className = "note-item";
        noteItem.innerHTML = `
            <textarea readonly>${transcript}</textarea>
            <button class="delete-note">Delete</button>
        `;
        notesContainer.appendChild(noteItem);

        noteItem.querySelector('.delete-note').addEventListener('click', () => {
            notesContainer.removeChild(noteItem);
        });

        addNoteButton.textContent = "Add New Note";
        recognition.stop();
    };

    recognition.onerror = () => {
        alert('An error occurred during voice recognition.');
        addNoteButton.textContent = "Add New Note";
    };
}
