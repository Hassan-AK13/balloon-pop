document.addEventListener('DOMContentLoaded', () => {
    const gameArea = document.getElementById('gameArea');
    const gameOverScreen = document.getElementById('gameOver');
    const nameEntryScreen = document.getElementById('nameEntry');
    const scoreBoardScreen = document.getElementById('scoreBoard');
    const scoreDisplay = document.getElementById('score');
    const finalScoreDisplay = document.getElementById('finalScore');
    const playerNameInput = document.getElementById('playerName');
    const submitNameButton = document.getElementById('submitName');
    const scoreList = document.getElementById('scoreList');
    const restartGameButton = document.getElementById('restartGame');
    const title = document.querySelector('h1');
    const progressBar = document.getElementById('progressBar');
    const progress = document.getElementById('progress');
    const timeRemaining = document.createElement('div');
    timeRemaining.id = 'timeRemaining';
    progressBar.appendChild(timeRemaining);
    const customCursor = document.createElement('div');
    customCursor.id = 'customCursor';
    customCursor.style.width = '20px';
    customCursor.style.height = '20px';
    customCursor.style.backgroundColor = 'brown';
    customCursor.style.borderRadius = '50%';
    customCursor.style.backgroundImage = 'url("dartboard.png")';
    customCursor.style.backgroundSize = 'cover';
    document.body.appendChild(customCursor);
    let score = 0;
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
    let balloonInterval;
    let balloonMultiplier = 1;
    let mouseX = 0;
    let mouseY = 0;
    let gameDuration = 30000; // 30 seconds
    let remainingTime = gameDuration;
    let spacePressed = false;
    let targetBalloon = null;

    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
        customCursor.style.left = `${mouseX}px`;
        customCursor.style.top = `${mouseY}px`;
    });

    document.addEventListener('keydown', (event) => {
        if (event.code === 'Space' && !spacePressed) {
            spacePressed = true;
            targetBalloon = getBalloonAtMouse();
        }
    });

    document.addEventListener('keyup', (event) => {
        if (event.code === 'Space' && spacePressed) {
            spacePressed = false;
            if (targetBalloon && isMouseOverBalloon(targetBalloon)) {
                popBalloon(targetBalloon);
            }
            targetBalloon = null;
        }
    });

    function getBalloonAtMouse() {
        const balloons = document.querySelectorAll('.balloon');
        for (const balloon of balloons) {
            const rect = balloon.getBoundingClientRect();
            if (mouseX >= rect.left && mouseX <= rect.right && mouseY >= rect.top && mouseY <= rect.bottom) {
                return balloon;
            }
        }
        return null;
    }

    function isMouseOverBalloon(balloon) {
        const rect = balloon.getBoundingClientRect();
        return mouseX >= rect.left && mouseX <= rect.right && mouseY >= rect.top && mouseY <= rect.bottom;
    }

    function createBalloon() {
        for (let i = 0; i < balloonMultiplier; i++) {
            const balloon = document.createElement('div');
            balloon.className = 'balloon';
            balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            balloon.style.left = Math.random() * (gameArea.clientWidth - 60) + 'px'; // Adjusted for increased size
            balloon.style.bottom = '0px'; // Ensure balloons start from the bottom
            balloon.addEventListener('mouseover', () => customCursor.style.display = 'none');
            balloon.addEventListener('mouseout', () => customCursor.style.display = 'block');
            balloon.addEventListener('click', popBalloon);
            gameArea.appendChild(balloon);

            setTimeout(() => {
                if (balloon.parentElement) balloon.remove();
            }, 4000);
        }
    }

    function createPowerUp() {
        const powerUp = document.createElement('div');
        powerUp.className = 'powerUp';
        powerUp.style.left = Math.random() * (gameArea.clientWidth - 50) + 'px';
        powerUp.style.top = Math.random() * (gameArea.clientHeight - 50) + 'px';

        const type = Math.random();
        if (type < 0.15) {
            powerUp.textContent = '+';
            powerUp.style.backgroundColor = 'blue';
            powerUp.addEventListener('click', () => {
                score += 5;
                scoreDisplay.textContent = score;
                powerUp.remove();
            });
        } else if (type < 0.3) {
            powerUp.textContent = '▲';
            powerUp.style.backgroundColor = 'gold';
            powerUp.addEventListener('click', () => {
                balloonMultiplier++;
                powerUp.remove();
            });
        } else if (type < 0.45 && score > 5) {
            powerUp.textContent = '!';
            powerUp.style.backgroundColor = 'red';
            powerUp.addEventListener('click', () => {
                score -= 5;
                scoreDisplay.textContent = score;
                powerUp.remove();
            });
        } else if (type < 0.6) {
            powerUp.textContent = '☠';
            powerUp.style.backgroundColor = 'black';
            powerUp.classList.add('black');
            powerUp.addEventListener('click', () => {
                score = 0;
                scoreDisplay.textContent = score;
                endGame();
            });
        } else if (type < 0.75) {
            powerUp.textContent = '⬆';
            powerUp.style.backgroundColor = 'purple';
            powerUp.addEventListener('click', () => {
                increaseBalloonSpeedTemporarily();
                powerUp.remove();
            });
        } else if (type < 0.85) {
            powerUp.textContent = '⬟';
            powerUp.style.backgroundColor = 'gold';
            powerUp.addEventListener('click', () => {
                const addedScore = score * score;
                score += addedScore;
                scoreDisplay.textContent = score;
                powerUp.remove();
            });
        } else if (type < 0.95 && remainingTime < 25000) {
            powerUp.textContent = '😊';
            powerUp.style.backgroundColor = 'orange';
            powerUp.addEventListener('click', () => {
                remainingTime += 5000;
                gameDuration += 5000; // Adjust game duration
                powerUp.remove();
            });
        } else if (remainingTime > 5000) {
            powerUp.textContent = '☹';
            powerUp.style.backgroundColor = 'navy';
            powerUp.addEventListener('click', () => {
                remainingTime -= 5000;
                gameDuration -= 5000; // Adjust game duration
                powerUp.remove();
            });
        }

        gameArea.appendChild(powerUp);

        setTimeout(() => {
            if (powerUp.parentElement) powerUp.remove();
        }, 5000);
    }

    function increaseBalloonSpeedTemporarily() {
        const balloons = document.querySelectorAll('.balloon');
        balloons.forEach(balloon => {
            balloon.style.animationDuration = '2s'; // Increase speed
        });
        setTimeout(() => {
            balloons.forEach(balloon => {
                balloon.style.animationDuration = '4s'; // Reset speed
            });
        }, 3000); // Duration of increased speed
    }

    function increaseSpeedTemporarily() {
        clearInterval(balloonInterval);
        balloonInterval = setInterval(createBalloon, 500); // Increase speed
        setTimeout(() => {
            clearInterval(balloonInterval);
            balloonInterval = setInterval(createBalloon, 1000); // Reset speed
        }, 3000); // Duration of increased speed
    }

    function popBalloon(balloon) {
        balloon.classList.add('popped');
        balloon.innerHTML = '&#9733;'; // HTML5 star character
        setTimeout(() => {
            balloon.remove();
        }, 500); // Adjust duration to match the animation
        const popSound = new Audio('pop.wav'); // Ensure this path is correct
        popSound.play();
        score++;
        scoreDisplay.textContent = score;
    }

    function popBalloonAtMouse() {
        const balloons = document.querySelectorAll('.balloon');
        balloons.forEach(balloon => {
            const rect = balloon.getBoundingClientRect();
            if (mouseX >= rect.left && mouseX <= rect.right && mouseY >= rect.top && mouseY <= rect.bottom) {
                balloon.classList.add('popped');
                balloon.innerHTML = '&#9733;'; // HTML5 star character
                setTimeout(() => {
                    balloon.remove();
                }, 500); // Adjust duration to match the animation
                const popSound = new Audio('pop.wav'); // Ensure this path is correct
                popSound.play();
                score++;
                scoreDisplay.textContent = score;
            }
        });
    }

    function popPowerUpAtMouse() {
        const powerUps = document.querySelectorAll('.powerUp');
        powerUps.forEach(powerUp => {
            const rect = powerUp.getBoundingClientRect();
            if (mouseX >= rect.left && mouseX <= rect.right && mouseY >= rect.top && mouseY <= rect.bottom) {
                powerUp.click();
            }
        });
    }

    function updateProgressBar() {
        const startTime = Date.now();
        const interval = setInterval(() => {
            const elapsedTime = Date.now() - startTime;
            remainingTime = Math.max(0, gameDuration - elapsedTime);
            const progressPercentage = ((gameDuration - remainingTime) / gameDuration) * 100;
            progress.style.width = `${progressPercentage}%`;
            timeRemaining.textContent = `${(remainingTime / 1000).toFixed(1)}s`;
            if (remainingTime <= 0) {
                clearInterval(interval);
                endGame();
            }
        }, 100);
    }

    function endGame() {
        clearInterval(balloonInterval);
        gameArea.style.display = 'none';
        title.style.display = 'none';
        gameOverScreen.style.display = 'block';
        finalScoreDisplay.textContent = score;
        customCursor.style.display = 'none'; // Hide custom cursor
        progressBar.style.display = 'none';
        setTimeout(() => {
            gameOverScreen.style.display = 'none';
            nameEntryScreen.style.display = 'block';
            customCursor.style.display = 'none'; // Ensure custom cursor is hidden
        }, 3000); // Change delay to 3 seconds
    }

    function submitName() {
        const playerName = playerNameInput.value;
        if (playerName) {
            const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
            leaderboard.push({ name: playerName, score: score });
            leaderboard.sort((a, b) => b.score - a.score);
            if (leaderboard.length > 10) {
                const lowestScore = leaderboard[leaderboard.length - 1].score;
                if (score <= lowestScore) {
                    leaderboard.pop();
                    displayMessage("Sorry, you didn't make it on the leaderboard - better luck next time!");
                } else {
                    leaderboard.pop();
                }
            }
            localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
            displayLeaderboard();
            nameEntryScreen.style.display = 'none';
            scoreBoardScreen.style.display = 'block';
            customCursor.style.display = 'none'; // Ensure custom cursor is hidden
        }
    }

    function displayInstructions() {
        const instructions = `
            Welcome to the Balloon Game!
            - Click on balloons to pop them and earn points.
            - Click on power-ups for special effects.
            - Use the spacebar to pop balloons and power-ups at the cursor.
            - Try to get the highest score possible!
            Press the spacebar to start the game.
        `;
        displayMessage(instructions);
        createStartBalloon();
    }

    function displayMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        messageElement.innerHTML = message.replace(/\n/g, '<br>'); // Preserve line breaks
        messageElement.style.position = 'absolute';
        messageElement.style.top = '0';
        messageElement.style.left = '0';
        messageElement.style.width = '100%';
        messageElement.style.height = '100%';
        messageElement.style.backgroundColor = 'white';
        messageElement.style.color = 'black';
        messageElement.style.fontWeight = 'bold';
        messageElement.style.display = 'flex';
        messageElement.style.alignItems = 'center';
        messageElement.style.justifyContent = 'center';
        messageElement.style.pointerEvents = 'auto'; // Allow cursor interaction
        messageElement.style.cursor = 'default'; // Show default cursor
        gameArea.appendChild(messageElement);
    }

    function createStartBalloon() {
        const startBalloon = document.createElement('div');
        startBalloon.className = 'balloon';
        startBalloon.style.backgroundColor = 'red';
        startBalloon.style.width = '60px';
        startBalloon.style.height = '80px';
        startBalloon.style.position = 'absolute';
        startBalloon.style.left = '50%';
        startBalloon.style.top = '80%'; // Adjust position to be below the instructions
        startBalloon.style.transform = 'translate(-50%, -50%)';
        startBalloon.addEventListener('click', () => {
            startBalloon.remove();
            document.querySelector('.message').remove();
            startGame();
        });
        document.querySelector('.message').appendChild(startBalloon);

        document.addEventListener('keydown', (event) => {
            if (event.code === 'Space') {
                const rect = startBalloon.getBoundingClientRect();
                if (mouseX >= rect.left && mouseX <= rect.right && mouseY >= rect.top && mouseY <= rect.bottom) {
                    startBalloon.remove();
                    document.querySelector('.message').remove();
                    startGame();
                }
            }
        });
    }

    function displayLeaderboard() {
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        scoreList.innerHTML = '';
        leaderboard.forEach(entry => {
            const listItem = document.createElement('li');
            listItem.textContent = `${entry.name}: ${entry.score}`;
            scoreList.appendChild(listItem);
        });
        customCursor.style.display = 'none'; // Ensure custom cursor is hidden
    }

    function restartGame() {
        score = 0;
        scoreDisplay.textContent = score;
        scoreBoardScreen.style.display = 'none';
        gameArea.innerHTML = '';
        gameOverScreen.style.display = 'none';
        nameEntryScreen.style.display = 'none';
        gameArea.style.display = 'block';
        title.style.display = 'block';
        customCursor.style.display = 'block';
        progressBar.style.display = 'flex';
        balloonMultiplier = 1;
        startGame();
    }

    function startGame() {
        balloonInterval = setInterval(createBalloon, 1000);
        setInterval(createPowerUp, 10000); // Power-ups appear every 10 seconds
        updateProgressBar();
        setTimeout(endGame, gameDuration);
        progressBar.style.position = 'relative'; // Ensure progress bar is positioned relative to game area
        progressBar.style.top = '10px'; // Adjust as needed to position below game area
    }

    submitNameButton.addEventListener('click', submitName);
    restartGameButton.addEventListener('click', restartGame);

    // Display instructions and start balloon every time the page is loaded or refreshed
    displayInstructions();
});