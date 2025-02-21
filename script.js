document.addEventListener("DOMContentLoaded", function () {
    const startBtn = document.getElementById("start-btn");
    const startSection = document.getElementById("start-section");
    const gameModeSection = document.getElementById("game-mode");
    const time = document.getElementById("time");
    const level = document.getElementById("level");
    const task = document.getElementById("task");
    const gameField = document.querySelector("#game-field");
    const difficultyButtons = document.querySelectorAll("#game-mode .btn");
    const submit = document.getElementById("submit-btn");
    const blankField = document.querySelector(".field");
    const userInput = document.getElementById("result"); 
    
    let lvl = 0;
    let round = 0;
    let taskResult = 0;
    let difficulty = null;
    let timeout;

    startBtn.addEventListener("click", function () {
        startSection.style.display = "none";
        gameModeSection.style.display = "block";
    });

    difficultyButtons.forEach(button => {
        button.addEventListener("click", function () {
            difficulty = this.id;
            loadGame();
        });
    });

    function loadGame() {
        if (round >= 10) {
            showVictoryMessage();
            return;
        }
        
        gameModeSection.style.display = "none";
        gameField.style.display = "block";
        submit.style.display = "block";
        userInput.value = "";
        lvl++;
        round++;
        timer(60);
        updateLevel();
        generateMathTask(difficulty);
    }

    function timer(x) {
        time.innerHTML = `Time: <b>${x}</b>`;
        if (x > 0) {
            timeout = setTimeout(() => {
                x--;
                timer(x);
            }, 1000);
        } else {
            submit.style.display = "none";  
            blankField.innerHTML = `<button class='btn' onClick="location.reload()"> TIME IS UP! </button>`;
        }
    }

    function updateLevel() {
        level.innerHTML = `Level: ${lvl}`;
    }

    function generateRandomNumbers() {
        return [
            Math.floor(Math.random() * 10) + 1,
            Math.floor(Math.random() * 100),
            Math.floor(Math.random() * 200) + 20,
        ];
    }

    function generateMathTask(difficulty) {
        const numbers = generateRandomNumbers();
        
        if (difficulty == 1) {
            taskResult = numbers[0] + numbers[1] + numbers[2];
            task.innerHTML = `${numbers[0]} + ${numbers[1]} + ${numbers[2]}`;
        } else if (difficulty == 2) {
            taskResult = numbers[0] * numbers[1] + numbers[2];
            task.innerHTML = `${numbers[0]} * ${numbers[1]} + ${numbers[2]}`;
        } else if (difficulty == 3) {
            taskResult = numbers[2] * numbers[0] + numbers[1] - numbers[0];
            task.innerHTML = `${numbers[2]} * ${numbers[0]} + ${numbers[1]} - ${numbers[0]}`;
        }
    }

    function checkAnswer() {
        const userAnswer = parseInt(userInput.value);
        clearTimeout(timeout);
        gameField.style.display = "none";
        
        const messageContainer = document.createElement("div");
        messageContainer.classList.add("message-container");
        messageContainer.innerHTML = `<p class='answer'>${userAnswer === taskResult ? `Correct! (${round}/10)` : `Wrong! The correct answer is ${taskResult}.`}</p>`;
        
        const nextButton = document.createElement("button");
        nextButton.classList.add("btn", "btn-next");
        nextButton.textContent = userAnswer === taskResult ? "NEXT!" : "PLAY AGAIN!";
        
        if (userAnswer === taskResult) {
            if (round === 10) {
                showVictoryMessage();
                return;
            }
            nextButton.addEventListener("click", function () {
                messageContainer.remove();
                gameField.style.display = "block";
                loadGame();
            });
        } else {
            nextButton.addEventListener("click", function () {
                location.reload();
            });
        }
        
        messageContainer.appendChild(nextButton);
        blankField.appendChild(messageContainer);
        submit.style.display = "none";
        userInput.value = "";
    }

    function showVictoryMessage() {
        blankField.innerHTML = `<p class='answer'> Congratulations! You won 10/10! 🎉</p>`;
        const restartButton = document.createElement("button");
        restartButton.classList.add("btn", "btn-next");
        restartButton.textContent = "PLAY AGAIN!";
        restartButton.addEventListener("click", function () {
            location.reload();
        });
        blankField.appendChild(restartButton);
    }
    
    if (submit) {
        submit.addEventListener("click", checkAnswer);
    }
});