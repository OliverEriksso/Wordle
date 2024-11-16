// (PERSONAL NOTE, IGNORE) CTRL + K + C = comment all marked - CTRL + K + U = remove comment
// (PERSONAL NOTE, IGNORE) ctrl g (write 60) = go to line 60
// FOR MYSELF TOMORROW - MAKE BACK & ENTER BIGGER (IF BIGGER THAN 1 LETTER)
const wordleBoard = document.getElementById("wordle-board");
const allWords = "wordle.json"
let targetWord = "";

let gameWon = false;
let gameLost = false; //LEGIT ONLY HERE SO YOU CAN'T TYPE AFTER U LOST

let currentRow = 0;
let cells;
let activeCell = null;

const ROWS_AMOUNT = 6;
const CELLS_AMOUNT = 5;
//ALL THESE 5 VARIABLES ARE TO COMBAT MAGIC NUMBERS!
const CORRECT_CHAR = 2;
const EXISTS_CHAR = 1;
const INVALID_CHAR = 0;

let words = []; //GLOBAL VARIABLE SO WHEN GETNEWWORD RUNS WE CAN SEE IF THE INPUT WORD IS AN ACTUAL WORD IN THE JSON FILE

async function getNewWord() {   
    try {
        const response = await fetch(allWords);

        if (!response.ok) {
            throw new Error("response ain't working");
        }

        words = await response.json();
        const randomIndex = Math.floor(Math.random() * words.length);
        const newWord = words[randomIndex];

        console.log(newWord);
        return newWord.toUpperCase();
    } catch (error) {
        console.error("Error fetching new word:", error)
        throw error;
    };
} 

function handleInput(wordleCell) {
    wordleCell.value = wordleCell.value.toUpperCase();
    const nextCell = wordleCell.nextElementSibling;
    if (nextCell) {
        activeCell = nextCell;
        nextCell.focus(); 
    }
    animateInput(wordleCell); //FROM JS-STYLING.JS
}

function disableCurrentRow() {
    let rowCells = wordleBoard.children[currentRow].querySelectorAll(".wordle-cell");
    rowCells.forEach(cell => {
        cell.disabled = true;
    })
}
function enableCurrentRow() {
    let rowCells = wordleBoard.children[currentRow].querySelectorAll(".wordle-cell");
    rowCells.forEach(cell => {
        cell.disabled = false;
    })
}

function moveToNextRow(currentCell) {
    flipCells(currentCell); //FLIP CELLS ANIMATION FROM JS-STYLING.JS & STYLE.CSS
    
    setTimeout(() => { //WAIT FOR FLIP CELLS TO FINISH, THEN EXECUTE
        if (gameWon) return; //NEED THIS ELSE YOU'LL BE ABLE TO CONTINUE WRITING AFTER WINNING
        disableCurrentRow();

        currentRow++;

        if (currentRow < ROWS_AMOUNT) {
            const nextCellIndex = currentRow * CELLS_AMOUNT; 
            const nextCell = cells[nextCellIndex];
            if (nextCell) {
                enableCurrentRow();
                nextCell.focus(); 
            }
        }
        
        if (currentRow === ROWS_AMOUNT) {
            if (!gameWon) {
                gameLost = true;
                hasLost();
            }
        }
    }, CELLS_AMOUNT * 200); // DELAY TO FLIP EACH CELL
}

function addCellEventListeners(wordleCell, wordleRow) {
    const updateUserInput = () => {
        const userInput = Array.from(wordleRow.querySelectorAll(".wordle-cell"))
            .map(cell => cell.value)
            .join("");
        return userInput;
    }

    wordleCell.addEventListener("focus", () => { //KEEP TRACK OF WHAT CELL IS ACTIVE
        activeCell = wordleCell;
    })
    wordleCell.addEventListener("input", (event) => {
        if (event.inputType !== "deleteContentBackward") {
            handleInput(wordleCell);
        }
        updateUserInput();
    });
    
    document.addEventListener("click", () => { //NOW WHEN YOU PRESS ANYWHERE FOCUS IS KEPT ON THE ACTIVE CELL
        this.blur();
        activeCell.focus();
    })

    wordleCell.addEventListener("keydown", (event) => {
        if (event.key === "Backspace") {
            const pastCell = wordleCell.previousElementSibling;
            if (wordleCell.value === "" && pastCell) {
                pastCell.focus();
            }
            updateUserInput();
        }
        if (event.key === "Enter") {
            const userInput = updateUserInput();
            if (userInput.length === CELLS_AMOUNT) {

                if (!words.includes(userInput.toLowerCase())) {
                    alert("Word not found in the list!");
                    return;
                }

                let currentCell = wordleBoard.children[currentRow].querySelectorAll(".wordle-cell");
                let scoreArray = checkUserInput(userInput);

                updateCellStyles(scoreArray, currentCell); //THIS IS ALSO FROM JS-STYLING.JS, KEEPING THE STYLING AND GAME SEPARATE
                updateKeyboardColors(userInput, scoreArray); //THIS IS FROM VISUAL-KEYBOARD.JS TO DO WHAT IT SAYS TRUST

                checkForWin(scoreArray); //CHECK FOR WIN FIRST BEFORE MOVING ON TO NEXT ROW WITH THE UPDATED USERINPUT

                moveToNextRow(currentCell); //IF NO WIN, MOVE TO NEXT ROW & ALSO THIS DICTATES IF YOU LOSE
            }
        }
    })
}

function createBoard() { 
    for (let i = 0; i < ROWS_AMOUNT; i++) {
        const wordleRow = document.createElement("div");
        wordleRow.classList.add("wordle-row");

        for (let j = 0; j < CELLS_AMOUNT; j++) {

            const wordleCell = document.createElement("input");
            wordleCell.type = "text";
            wordleCell.classList.add("wordle-cell");
            wordleCell.maxLength = "1";

            addCellEventListeners(wordleCell, wordleRow);
            
            wordleRow.appendChild(wordleCell);
        }
        wordleBoard.appendChild(wordleRow);
    }
}

async function initializeGame() {
    targetWord = await getNewWord();
    createBoard();
    disableBoard();

    cells = Array.from(document.querySelectorAll(".wordle-cell"));

    enableCurrentRow();
    const firstCell = wordleBoard.querySelector(".wordle-row input");
    firstCell.focus();
}

function checkUserInput(userInput) {
    if (!userInput || userInput.length === 0) {
        return []; //RETURN EMPTY ARRAY TO AVOID ERROR
    }

    let scoreLookup = Array.from({length: userInput.length}, () => INVALID_CHAR);
    for (let i = 0; i < userInput.length; i++) {
        //scoreLookup[i] = INVALID_CHAR;
        if (userInput[i] === targetWord[i]) {
            scoreLookup[i] = CORRECT_CHAR;
            continue;
        }
        for (let j = 0; j < targetWord.length; j++) {
            if (userInput[i] === targetWord[j]) {
                scoreLookup[i] = EXISTS_CHAR;
                break;
            } 
        }
    }
    console.log(scoreLookup);
    return scoreLookup;
}

function checkForWin(scoreArray) {
    let didWin = scoreArray.every(score => score === CORRECT_CHAR);
    if (didWin) {
        didWin = true;
        gameWon = true; 
        setTimeout(() => hasWon(), 500); //DELAY SO TEXT CAN CHANGE TO GREEN BEFORE ALERT FROM HASWON
    }
}

function showPopup(message) {
    const playAgainPopup = document.getElementById("play-again-popup");
    const playAgainBtn = document.getElementById("play-again-btn");
    const playAgainPara = document.getElementById("play-again-paragraph");

    playAgainPara.textContent = message;
    playAgainPopup.style.display = "block";

    playAgainBtn.addEventListener("click", function handler() {
        resetGame();
        playAgainPopup.style.display = "none";
        playAgainBtn.removeEventListener("click", handler);
    });
}

function hasWon() {
    disableBoard();
    showPopup("Congratulations, you WIN!");
}

function hasLost() {
    disableBoard();
    showPopup(`Congratulations, for a LOSER! Word: ${targetWord} `);
}


function disableBoard() {
    const cells = document.querySelectorAll(".wordle-cell");
    cells.forEach(cell => {
        cell.disabled = true;
        cell.blur();
    });
}


function resetGame() {
    gameWon = false;
    currentRow = 0;
    currentCellIndex = 0;
    cells = [];
    
    while (wordleBoard.firstChild) {
        wordleBoard.removeChild(wordleBoard.firstChild);
    }

    updateKeyboardColors(); //UPDATE KEYBOARD COLORS HAS RESET COLORS IN IT'S FUNC (STYLING.JS)

    initializeGame();
}

initializeGame();
