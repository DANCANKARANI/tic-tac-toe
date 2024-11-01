// specify variable based on CSS classes
const selectBox = document.querySelector(".select-box"),
selectBtnX = selectBox.querySelector(".options .playerX"),
selectBtnO = selectBox.querySelector(".options .playerO"),
playBoard = document.querySelector(".play-board"),
players = document.querySelector(".players"),
allBox = document.querySelectorAll("section span"),

resultBox = document.querySelector(".result-box"),
wonText = resultBox.querySelector(".won-text"),
replayBtn = resultBox.querySelector("button");


// Variables to track wins
let xWins = localStorage.getItem('xWins') ? parseInt(localStorage.getItem('xWins')) : 0;
let oWins = localStorage.getItem('oWins') ? parseInt(localStorage.getItem('oWins')) : 0;

// Display initial values
document.getElementById('xWins').textContent = xWins;
document.getElementById('oWins').textContent = oWins;

// Function to increment and store wins
function updateWinCounter(winner) {
    if (winner === 'X') {
        xWins++;
        localStorage.setItem('xWins', xWins);
    } else if (winner === 'O') {
        oWins++;
        localStorage.setItem('oWins', oWins);
    }
    displayWinCounter();
}

// Function to display updated win count
function displayWinCounter() {
    document.getElementById('xWins').textContent = xWins;
    document.getElementById('oWins').textContent = oWins;
}

// Function to handle the replay button without resetting the win counter
replayBtn.addEventListener('click', () => {
    // Reset game board and any necessary game logic here
    allBox.forEach(box => {
        box.innerHTML = '';      // Clear box contents
        box.removeAttribute('id'); // Remove 'X' or 'O' identifier
        box.style.pointerEvents = 'auto'; // Make box clickable again
    });

    // Hide the result box and show the play board again
    resultBox.classList.remove('show');
    playBoard.classList.add('show');
    
    // Reset game-specific variables
    runBot = true;
    playerSign = "X";
    players.classList.remove("active"); // Reset players' turn indicator
    playBoard.style.pointerEvents = "auto"; // Enable playBoard interactions
});


window.onload = ()=>{
    // make sure all the boxes in the board are clickable
    for (let i = 0; i < allBox.length; i++) {
       allBox[i].setAttribute("onclick", "clickedBox(this)");
    }
}

selectBtnX.onclick = ()=>{
    selectBox.classList.add("hide");
    playBoard.classList.add("show");
}

selectBtnO.onclick = ()=>{ 
    selectBox.classList.add("hide");
    playBoard.classList.add("show");
    players.setAttribute("class", "players active player");
}

let playerXIcon = "fas fa-times", playerOIcon = "far fa-circle", playerSign = "X", runBot = true;

// user interaction with the board
// Reference to the move sound
const moveSound = document.getElementById("moveSound");
const winSound = document.getElementById("winSound");

function clickedBox(element) {
    if(players.classList.contains("player")){
        playerSign = "O";
        element.innerHTML = `<i class="${playerOIcon}"></i>`;
        players.classList.remove("active");
        element.setAttribute("id", playerSign);
    } else {
        playerSign = "X";
        element.innerHTML = `<i class="${playerXIcon}"></i>`;
        players.classList.add("active");
        element.setAttribute("id", playerSign);
    }

    // Play the move sound
    moveSound.play();

    selectWinner();
    element.style.pointerEvents = "none";
    playBoard.style.pointerEvents = "none";

    // Delay for AI's move
    let randomTimeDelay = ((Math.random() * 1000) + 200).toFixed();
    setTimeout(() => {
        bot(runBot);
    }, randomTimeDelay);
}
  
// computer interaction with the board
function bot(){
    let array = [];
    if(runBot){
        playerSign = "O";
        // find the remaining boxes that has not been marked
        for (let i = 0; i < allBox.length; i++) {
            if(allBox[i].childElementCount == 0){
                array.push(i);
            }
        }
        // get random box from remaining tiles
        let randomBox = array[Math.floor(Math.random() * array.length)];
        if(array.length > 0){
            if(players.classList.contains("player")){ 
                playerSign = "X";
                allBox[randomBox].innerHTML = `<i class="${playerXIcon}"></i>`;
                allBox[randomBox].setAttribute("id", playerSign);
                players.classList.add("active"); 
            }
            else{
                allBox[randomBox].innerHTML = `<i class="${playerOIcon}"></i>`;
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
// get the sign of a certain box
function getIdVal(classname){
    return document.querySelector(".box" + classname).id;
}
// check 3 tiles to see if they are the same
function checkIdSign(val1, val2, val3, sign){ 
    if(getIdVal(val1) == sign && getIdVal(val2) == sign && getIdVal(val3) == sign){
        return true;
    }
    return false;
}
// check winner
function selectWinner() {
    if (checkIdSign(1, 2, 3, playerSign) || checkIdSign(4, 5, 6, playerSign) || checkIdSign(7, 8, 9, playerSign) || 
        checkIdSign(1, 4, 7, playerSign) || checkIdSign(2, 5, 8, playerSign) || checkIdSign(3, 6, 9, playerSign) || 
        checkIdSign(1, 5, 9, playerSign) || checkIdSign(3, 5, 7, playerSign)) {
        
        runBot = false;
        bot(runBot);

        // Play the winning sound
        winSound.play();

        // Increment win counter based on winner
        if (playerSign === "X") {
            xWins++;
        } else {
            oWins++;
        }
        updateWinCounter(); // Update the display with new win counts


        // Buffer time to show the result
        setTimeout(() => {
            resultBox.classList.add("show");
            playBoard.classList.remove("show");
        }, 700);
        
        wonText.innerHTML = `Player ${playerSign}<br> won the game!`;
    } else {
        // Check for a draw
        if (getIdVal(1) !== "" && getIdVal(2) !== "" && getIdVal(3) !== "" && getIdVal(4) !== "" &&
            getIdVal(5) !== "" && getIdVal(6) !== "" && getIdVal(7) !== "" && getIdVal(8) !== "" && 
            getIdVal(9) !== "") {
            
            runBot = false;
            bot(runBot);

            // Buffer time to show draw result
            setTimeout(() => {
                resultBox.classList.add("show");
                playBoard.classList.remove("show");
            }, 700);
             // Play the winning sound
            winSound.play();
            wonText.textContent = "Match has been drawn!";

        }
    }
}
