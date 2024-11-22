// Define variables based on CSS classes
const selectBox = document.querySelector(".select-box"),
    selectBtnX = selectBox.querySelector(".options .playerX"),
    selectBtnO = selectBox.querySelector(".options .playerO"),
    winCounter = document.querySelector(".win-counter")
    playBoard = document.querySelector(".play-board"),
    players = document.querySelector(".players"),
    allBox = document.querySelectorAll("section span"),
    resultBox = document.querySelector(".result-box"),
    wonText = resultBox.querySelector(".won-text"),
    replayBtn = resultBox.querySelector("button");

// Paths to custom images for X and O
let playerXIcon = "x-image.png"; // Path to X image
let playerOIcon = "o-image.png"; // Path to O image
let playerSign = "X", runBot = true;

const Xturn = document.querySelector(".Xturn");
const Oturn = document.querySelector(".Oturn");

// Variables to track wins with updated names
let playerXWins = localStorage.getItem('playerXWins') ? parseInt(localStorage.getItem('playerXWins')) : 0;
let playerOWins = localStorage.getItem('playerOWins') ? parseInt(localStorage.getItem('playerOWins')) : 0;
let gameEnded = false;

// Get the "Player vs Player" button
const selectBtnPvP = selectBox.querySelector(".options .playerVsPlayer");
const resetCounterBtn = document.getElementById("resetCounterBtn");
const homeBtn = document.getElementById("homeBtn");
// Track if the game is in Player vs Player mode
let isPvPMode = false;
Xturn.innerHTML = "Your turn";
Oturn.innerHTML = "AI turn";

// Reset counter button
resetCounterBtn.addEventListener('click', resetWinCounter);

// Set PvP mode on button click
selectBtnPvP.onclick = () => {
    selectBtnPvP.onclick = () => {
        selectBox.classList.add("hide");
        playBoard.classList.add("show");
        isPvPMode = true;
        winCounter.style.display = "inline";
         Xturn.innerHTML = "X's turn";
        Oturn.innerHTML="O's turn"
    
        // Update the text content for the win counters
        document.querySelector('p[style="color: green;"] strong').textContent = "X Wins:";
        document.querySelector('p[style="color: red;"] strong').textContent = "O Wins:";
    };
};

// Display initial values
document.getElementById('xWins').textContent = playerXWins;
document.getElementById('oWins').textContent = playerOWins;

// Function to increment and store wins
function updateWinCounter(winner) {
    if (winner === 'X') {
        playerXWins++;
        localStorage.setItem('playerXWins', playerXWins);
    } else if (winner === 'O') {
        playerOWins++;
        localStorage.setItem('playerOWins', playerOWins);
    }
    displayWinCounter();
}

// Function to display updated win count
function displayWinCounter() {
    document.getElementById('xWins').textContent = playerXWins;
    document.getElementById('oWins').textContent = playerOWins;
}

// Reset win counters
function resetWinCounter() {
    playerXWins = 0;
    playerOWins = 0;
    localStorage.setItem('playerXWins', playerXWins);
    localStorage.setItem('playerOWins', playerOWins);
    displayWinCounter();
}

// Function to display the win message based on game mode and winner
function displayWinMessage(winner) {
    if (isPvPMode) {
        wonText.innerHTML = `Player ${winner} won the game!`;
    } else {
        wonText.innerHTML = winner === 'X' ? "You won!" : "You lost.";
    }
}

// Function to handle replay button without resetting win counter
replayBtn.addEventListener('click', () => {
    allBox.forEach(box => {
        box.innerHTML = '';              // Clear box contents
        box.removeAttribute('id');       // Remove 'X' or 'O' identifier
        box.style.pointerEvents = 'auto'; // Make box clickable again
        box.style.backgroundColor = '';  // Clear background color
    });
    resultBox.classList.remove('show');
    playBoard.classList.add('show');
    gameEnded = false;
    runBot = true;
    playerSign = "X";
    players.classList.remove("active");
    playBoard.style.pointerEvents = "auto";
    startTimer();
});

// Initialize game on page load
window.onload = () => {
    allBox.forEach(box => box.setAttribute("onclick", "clickedBox(this)"));
    displayWinCounter();
};

// Set player choice to "X" and start game
selectBtnX.onclick = () => {
    selectBox.classList.add("hide");
    winCounter.style.display = "inline-block";
    xWins.innerHTML="X Wins"
    playBoard.classList.add("show");
    
};

// Set player choice to "O" and start game
selectBtnO.onclick = () => {
    selectBox.classList.add("hide");
    winCounter.style.display = "inline-block";
    playBoard.classList.add("show");
    players.classList.add("active");
};

// Reference to sounds
const moveSound = document.getElementById("moveSound");
const winSound = document.getElementById("winSound");
const drawSound = document.getElementById("drawSound");

// Handle user interaction with the board
let timer; // Timer variable
const timeLimit = 20; // 10 seconds for each player
let timeRemaining = timeLimit; // Time remaining for the current player's turn
const timerDisplay = document.querySelector('.timer'); // Reference to timer display

// Function to start the timer
function startTimer() {
    if (!gameEnded){
     timeRemaining = timeLimit; // Reset time remaining
     clearInterval(timer); // Clear any existing timer
     timer = setInterval(() => {
         timeRemaining--;
         timerDisplay.textContent = `Time left: ${timeRemaining} seconds`; // Update timer display
         if (timeRemaining <= 0) {
             clearInterval(timer);
             
             declareWinner(playerSign === "X" ? "O" : "X"); // Declare the other player as the winner
         }
     }, 1000);
    }else{
    
    }
 }

// Function to declare the winner and update win counter
function declareWinner(winner) {
    runBot = false; // Stop bot from taking turns
    updateWinCounter(winner); // Update the win counter
    setTimeout(() => {
        resultBox.classList.add("show");
        playBoard.classList.remove("show");
    }, 700);
    winSound.play();
    gameEnded=true;
    displayWinMessage(winner);
}

function clickedBox(element) {
    element.style.backgroundColor = playerSign === "X" ? "#ffcccc" : "#cceeff";
    element.innerHTML = `<img src="${playerSign === "X" ? playerXIcon : playerOIcon}" alt="${playerSign}" style="width: 100%; height: 100%;">`;
    element.setAttribute("id", playerSign);
    element.style.pointerEvents = "none"; // Disable further clicks on the box
    moveSound.play();

    // Check if this move results in a win
    selectWinner();

    // Switch player if no winner yet
    if (!resultBox.classList.contains("show")) {
        playerSign = playerSign === "X" ? "O" : "X";
        players.classList.toggle("active");
        startTimer(); // Restart timer for the next player
    }

    // Enable next player or bot turn if in PvP or PvE mode
    if (isPvPMode) {
        playBoard.style.pointerEvents = "auto"; // Allows PvP continuation
    } else if (runBot && !resultBox.classList.contains("show")) {
        playBoard.style.pointerEvents = "none";
        setTimeout(bot, ((Math.random() * 1000) + 200).toFixed()); // Let bot take turn if no winner
    }
}

// Update the onload event to start the timer for the first player
window.onload = () => {
    allBox.forEach(box => box.setAttribute("onclick", "clickedBox(this)"));
    displayWinCounter();
    startTimer(); // Start timer for the first player
};

function bot() {
    let array = [];
    if (runBot) {
        playerSign = "O";
        for (let i = 0; i < allBox.length; i++) {
            if (allBox[i].childElementCount === 0) {
                array.push(i);
            }
        }
        let randomBox = array[Math.floor(Math.random() * array.length)];
        if (array.length > 0) {
            if (players.classList.contains("player")) {
                playerSign = "X";
                // Insert only the image for player X with size 100%
                allBox[randomBox].innerHTML = `<img src="${playerXIcon}" alt="Player X" style="width: 100%; height: 100%;">`;
                allBox[randomBox].setAttribute("id", playerSign);
                players.classList.add("active");
            }
            else {
                // Insert only the image for player O with size 100%
                allBox[randomBox].innerHTML = `<img src="${playerOIcon}" alt="Player O" style="width: 100%; height: 100%;">`;
                players.classList.remove("active");
                allBox[randomBox].setAttribute("id", playerSign);
            }
            selectWinner();
        }
        allBox[randomBox].style.pointerEvents = "none";
        playBoard.style.pointerEvents = "auto";
        playerSign = "X";
    }
}

function getIdVal(classname) {
    return document.querySelector(".box" + classname).id;
}

function checkIdSign(val1, val2, val3, val4, sign) {
    return getIdVal(val1) === sign && getIdVal(val2) === sign && getIdVal(val3) === sign && getIdVal(val4) === sign;
}
function selectWinner() {
    // Horizontal wins
    if (checkIdSign(1, 2, 3, 4, playerSign) ||
        checkIdSign(5, 6, 7, 8, playerSign) ||
        checkIdSign(9, 10, 11, 12, playerSign) ||
        checkIdSign(13, 14, 15, 16, playerSign)) {
        declareWinner(playerSign);
    }

    // Vertical wins
    if (checkIdSign(1, 5, 9, 13, playerSign) ||
        checkIdSign(2, 6, 10, 14, playerSign) ||
        checkIdSign(3, 7, 11, 15, playerSign) ||
        checkIdSign(4, 8, 12, 16, playerSign)) {
            clearInterval(timer);
            declareWinner(playerSign);
    }

    // Diagonal wins
    if (checkIdSign(1, 6, 11, 16, playerSign) || checkIdSign(4, 7, 10, 13, playerSign)) {
        clearInterval(timer);
        declareWinner(playerSign);
        return;
    }

    // Draw condition
    else if ([...allBox].every(box => box.id)) {
        drawSound.play();
        playBoard.style.pointerEvents = "none";
        gameEnded = true; // Stop the game
        clearInterval(timer); // Stop the timer
        setTimeout(() => {
            resultBox.classList.add("show");
            playBoard.classList.remove("show");
        }, 700);
        wonText.innerHTML = "Match has been drawn!";
    }
}
function updateWinCounter(){

}
