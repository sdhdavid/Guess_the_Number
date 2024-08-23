// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getDatabase, ref, push, query, orderByChild, limitToFirst, get } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCXxJvEWkEnlcVJjl_3PLFXExRZq9BKfaA",
    authDomain: "guess-number-game-c4580.firebaseapp.com",
    databaseURL: "https://guess-number-game-c4580-default-rtdb.europe-west1.firebasedatabase.app/",
    projectId: "guess-number-game-c4580",
    storageBucket: "guess-number-game-c4580.appspot.com",
    messagingSenderId: "954549899579",
    appId: "1:954549899579:web:c70ddbe8318e88737d271e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

let randomNumber;
let attempts = 0;

function startNewGame() {
    randomNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 0;
    document.getElementById('attempts').textContent = `Attempts: 0`;
    document.getElementById('result').textContent = '';
    document.getElementById('guess-input').value = '';
    document.getElementById('name-input-container').style.display = 'none';
    console.log("New game started. Random number:", randomNumber);
}

function submitGuess() {
    const guessInput = document.getElementById('guess-input');
    const guess = parseInt(guessInput.value);
    
    if (isNaN(guess) || guess < 1 || guess > 100) {
        document.getElementById('result').textContent = 'Please enter a valid number between 1 and 100.';
        return;
    }

    attempts++;
    console.log(`Attempt ${attempts}: Guessed ${guess}, Actual ${randomNumber}`);

    if (guess === randomNumber) {
        document.getElementById('result').textContent = `Congratulations! You guessed the number in ${attempts} attempts.`;
        document.getElementById('name-input-container').style.display = 'block';
    } else if (guess < randomNumber) {
        document.getElementById('result').textContent = 'Too low! Try again.';
    } else {
        document.getElementById('result').textContent = 'Too high! Try again.';
    }

    document.getElementById('attempts').textContent = `Attempts: ${attempts}`;
    guessInput.value = '';
    guessInput.focus();
}

function saveRecord() {
    const nameInput = document.getElementById('name-input');
    const name = nameInput.value.trim();
    
    if (name === '') {
        alert('Please enter your name');
        return;
    }

    const recordsRef = ref(db, 'records');
    push(recordsRef, {
        name: name,
        attempts: attempts,
        date: new Date().toISOString()
    }).then(() => {
        console.log('Record saved successfully');
        updateLeaderboard();
        document.getElementById('name-input-container').style.display = 'none';
        startNewGame();
    }).catch((error) => {
        console.error('Error saving record: ', error);
    });
}

function updateLeaderboard() {
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = '';

    const recordsRef = ref(db, 'records');
    const topRecordsQuery = query(recordsRef, orderByChild('attempts'), limitToFirst(5));

    get(topRecordsQuery).then((snapshot) => {
        if (snapshot.exists()) {
            const records = [];
            snapshot.forEach((childSnapshot) => {
                records.push(childSnapshot.val());
            });
            records.sort((a, b) => a.attempts - b.attempts);
            records.forEach((record) => {
                const li = document.createElement('li');
                li.textContent = `${record.name}: ${record.attempts} attempts - ${new Date(record.date).toLocaleDateString()}`;
                leaderboardList.appendChild(li);
            });
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.error('Error getting records: ', error);
    });
}

document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('submit-guess').addEventListener('click', submitGuess);
    document.getElementById('new-game').addEventListener('click', startNewGame);
    document.getElementById('submit-name').addEventListener('click', saveRecord);
    document.getElementById('guess-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            submitGuess();
        }
    });

    startNewGame();
    updateLeaderboard();
});