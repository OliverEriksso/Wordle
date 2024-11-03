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
        const buttonContent = newButton.textContent; 

        const x = currentCellIndex; 
        const y = currentRow; 
        const oneDimensionalIndex = y * rowLength + x; //MAKE THE CURRENT ROW AND CURRENT CELL INTO A 1D ARRAY TO EASILY SWAP TO NEXT ROW

        if (buttonContent === "BACK") {
            if (currentCellIndex > 0 || cells[oneDimensionalIndex].value) {
                if (cells[oneDimensionalIndex].value === "") {
                    currentCellIndex--; 
                }
                cells[currentRow * CELLS_AMOUNT + currentCellIndex].value = ""; 
                cells[currentRow * CELLS_AMOUNT + currentCellIndex].focus(); 
            }
        } else if (buttonContent === "ENTER") {
            if (currentCellIndex === CELLS_AMOUNT) {
                let currentCell = wordleBoard.children[currentRow].querySelectorAll(".wordle-cell");

                const userInput = Array.from(currentCell)
                    .map(cell => cell.value)
                    .join("");

                const scoreArray = checkUserInput(userInput); //MAIN.JS
                updateCellStyles(scoreArray, currentCell); //JS-STYLING.JS
                updateKeyboardColors(userInput, scoreArray);  //JS-STYLING.JS

                checkForWin(scoreArray); //MAIN2.JS

                moveToNextRow(currentCell); //MAIN2.JS
                currentCellIndex = 0; 
            }
        } else {
            if (currentCellIndex < CELLS_AMOUNT) {
                cells[oneDimensionalIndex].value = buttonContent; 
                handleInput(cells[oneDimensionalIndex]); //MAIN2.JS
                currentCellIndex++;
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

