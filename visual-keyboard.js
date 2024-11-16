const keyboardVisual = document.getElementById("visual-keyboard")

const keyboardButtons = [
    "Q", "W", "E",
    "R", "T", "Y",
    "U", "I", "O",
    "P", "A", "S",
    "D", "F", "G",
    "H", "J", "K",
    "L", "ENTER", "Z", "X",
    "C", "V", "B",
    "N", "M", "BACK"
]
const buttonElements = {};

let maxNumberOfBtnsPerRow = 10;
const rowLength = CELLS_AMOUNT; 

let currentCellIndex = 0;


function keyboardEventListener(newButton) {
    newButton.addEventListener('click', () => {
        if (gameWon) return;
        if (gameLost) return; 

        const buttonContent = newButton.textContent; 

        if (buttonContent === "BACK") {
            const pastCell = activeCell.previousElementSibling;
            if (activeCell.value === "" && pastCell) {
                activeCell = pastCell;
                activeCell.value = "";
                activeCell.focus();
            } else { 
                activeCell.value = ""; //NECCESARY OR SOMETIMES IT BUGS OUT
            }
        } else if (buttonContent === "ENTER") {
            const currentRowCells = Array.from(wordleBoard.children[currentRow].querySelectorAll(".wordle-cell"));
            const userInput = currentRowCells.map(cell => cell.value).join("");
            if (userInput.length === CELLS_AMOUNT) {
                const scoreArray = checkUserInput(userInput);

                updateCellStyles(scoreArray, currentRowCells);
                updateKeyboardColors(userInput, scoreArray);

                checkForWin(scoreArray);
                moveToNextRow(currentRowCells);
            }
        } else {
            if (currentCellIndex < CELLS_AMOUNT) {
                activeCell.value = buttonContent; 
                handleInput(activeCell); //MAIN2.JS
            }
        }
    });
}

function createKeyboard() {
    let rowContainer = document.createElement('div'); 
    rowContainer.classList.add('keyboard-row'); 

    let rowCount = 1; //TRACK ROW FOR KEYBOARD ROW APPEARANCE

    for (let i = 0; i < keyboardButtons.length; i++) {
        const newButton = document.createElement("button");
        newButton.classList.add("vs-keyboard-button");
        newButton.textContent = keyboardButtons[i]; 

        buttonElements[keyboardButtons[i]] = newButton; //STORE REFERENCE FROM BUTTON PRESSES

        // if (newButton.textContent.length > 1) {
        //     newButton.style.width = "100px";  //FOR MORE LETTERS => BIGGER BUTTON
        // } else {
        //     newButton.style.width = "50px";  //DEFAULT
        // }
        newButton.textContent.length > 1 ? newButton.style.width = "100px" : newButton.style.width = "50px";

        keyboardEventListener(newButton);
        rowContainer.appendChild(newButton); 

        let buttonsInCurrentRow = (rowCount === 2) ? maxNumberOfBtnsPerRow - 1 : maxNumberOfBtnsPerRow; //KEYBOARD ROW APPEARANCE, IF ROW = 2 THEN 1 LESS BUTTON

        if (rowContainer.children.length === buttonsInCurrentRow) { 
            keyboardVisual.appendChild(rowContainer); 
            rowContainer = document.createElement('div'); 
            rowContainer.classList.add('keyboard-row'); 
            rowCount++; 
        }
    }

    if (rowContainer.children.length > 0) {
        keyboardVisual.appendChild(rowContainer);
    }
}
createKeyboard();

