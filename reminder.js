// Request notification permission
if (Notification.permission !== "granted") {
    Notification.requestPermission();
}

const reminderVoiceButton = document.getElementById('reminderVoiceButton');
const reminderList = document.getElementById('reminderList');

const recognitionReminder = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognitionReminder.lang = 'en-US';
recognitionReminder.continuous = false;
recognitionReminder.interimResults = false;

reminderVoiceButton.addEventListener('click', function () {
    recognitionReminder.start();
    reminderVoiceButton.textContent = "Listening for Reminder...";

    recognitionReminder.onresult = function (event) {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }

        // Extract time and reminder details from voice input
        const taskDetails = transcript.match(/(\d+)\s+(second|minute|hour)s?/);
        if (taskDetails) {
            const time = parseInt(taskDetails[1], 10);
            const unit = taskDetails[2];

            // Convert to milliseconds
            const delay = unit === 'minute' ? time * 60 * 1000 : 
                          unit === 'second' ? time * 1000 : 
                          time * 60 * 60 * 1000;

            const reminderItem = document.createElement('li');
            reminderItem.textContent = `Reminder: "${transcript}" in ${time} ${unit}(s)`;

            // Create a delete button for each reminder
            const deleteButton = document.createElement('button');
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener('click', () => {
                reminderList.removeChild(reminderItem);
            });

            reminderItem.appendChild(deleteButton);
            reminderList.appendChild(reminderItem);
            setTimeout(() => {
                // Play the sound before showing the notification
                const sound = new Audio('audio.wav');
                sound.play();
            
                // Now trigger the notification
                new Notification("Reminder", { body: transcript });
                alert(`Reminder Triggered: ${transcript}`);
                reminderItem.style.color = "green";
            }, delay);
            
        } else {
            alert('Please say a valid reminder with time (e.g., "remind me in 5 minutes to buy groceries")');
        }
    };

    recognitionReminder.onerror = function (event) {
        alert('An error occurred during voice recognition.');
    };
});
