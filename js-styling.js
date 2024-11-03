function animateInput(wordleCell) { //adds class typing when inputting letters so it gives .typings pop animation from css
    wordleCell.classList.add('typing');

    setTimeout(() => {
        wordleCell.classList.remove('typing');
    }, 150); 
}

function updateCellStyles(scoreArray, currentCells) { //update the colors once enter has been pressed and cells with input = 5
    for (let i = 0; i < scoreArray.length; i++) {
        if (scoreArray[i] === CORRECT_CHAR) {
            currentCells[i].style.backgroundColor = "var(--correct-char";
        } else if (scoreArray[i] === EXISTS_CHAR) {
            currentCells[i].style.backgroundColor = "var(--exist-char)";
        } else {
            currentCells[i].style.backgroundColor = "var(--wrong-char)";
        }
    }
}

function flipCells(cells) {
    cells.forEach((cell, index) => {
        setTimeout(() => {
            cell.classList.add("flip-animation"); //flip cells animation from style.css

            setTimeout(() => {
                cell.classList.remove("flip-animation");
            }, 600); //MATCH DURATION TO THE CSS ANIMATION DURATION
        }, index * 200); //EACH CELL FLIP DURATION
    });
}

function updateKeyboardColors(userInput, scoreArray) { 
    if (!userInput || !scoreArray) {
        resetKeyboardColors();
        return;
    }
    
    userInput.split('').forEach((letter, index) => {
        const button = buttonElements[letter]; 
        if (button) {
            button.classList.remove('correct', 'wrong-position', 'incorrect');

            if (scoreArray[index] === CORRECT_CHAR) {
                button.classList.add('correct'); 
            } else if (scoreArray[index] === EXISTS_CHAR) {
                button.classList.add('wrong-position'); 
            } else {
                button.classList.add('incorrect'); 
            }
        }
    });
}
function resetKeyboardColors() {
    const buttonElements = document.querySelectorAll(".vs-keyboard-button");

    buttonElements.forEach(button => {
        button.classList.remove('correct', 'wrong-position', 'incorrect');
    });
}



let currentTheme = localStorage.getItem("theme") || null; //null is lightmode/default mode
const themeSwitch = document.getElementById("light-dark-mode");
const colorBlindButton = document.getElementById("color-blind-mode");

const applyTheme = (theme) => {
    document.body.classList.remove("darkmode", "colorblind")

    if (theme !== "light") {
        document.body.classList.add(theme)
    }
    localStorage.setItem("theme", theme)
}
applyTheme(currentTheme);

themeSwitch.addEventListener("click", () => {
    if (currentTheme === "darkmode") {
        currentTheme = null; 
    } else {
        currentTheme = "darkmode"; 
    }
    applyTheme(currentTheme);
});

colorBlindButton.addEventListener("click", () => {
    currentTheme = currentTheme === "colorblind" ? null : "colorblind"; 
    applyTheme(currentTheme);
});
