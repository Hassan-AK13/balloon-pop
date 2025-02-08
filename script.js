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
    let score = 0;
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
    let balloonInterval;
    let balloonMultiplier = 1;

    function createBalloon() {
        for (let i = 0; i < balloonMultiplier; i++) {
            const balloon = document.createElement('div');
            balloon.className = 'balloon';
            balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            balloon.style.left = Math.random() * (gameArea.clientWidth - 50) + 'px';
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
        if (type < 0.25) {
            powerUp.textContent = '+';
            powerUp.style.backgroundColor = 'blue';
            powerUp.addEventListener('click', () => {
                score += 5;
                scoreDisplay.textContent = score;
                powerUp.remove();
            });
        } else if (type < 0.5) {
            powerUp.textContent = '▲';
            powerUp.style.backgroundColor = 'gold';
            powerUp.addEventListener('click', () => {
                balloonMultiplier++;
                powerUp.remove();
            });
        } else if (type < 0.75 && score > 5) {
            powerUp.textContent = '!';
            powerUp.style.backgroundColor = 'red';
            powerUp.addEventListener('click', () => {
                score -= 5;
                scoreDisplay.textContent = score;
                powerUp.remove();
            });
        } else {
            powerUp.textContent = '☠';
            powerUp.style.backgroundColor = 'black';
            powerUp.addEventListener('click', () => {
                score = 0;
                scoreDisplay.textContent = score;
                endGame();
            });
        }

        gameArea.appendChild(powerUp);

        setTimeout(() => {
            if (powerUp.parentElement) powerUp.remove();
        }, 5000);
    }

    function popBalloon(event) {
        const popSound = new Audio('pop.wav'); // Ensure this path is correct
        popSound.play();
        event.target.remove();
        score++;
        scoreDisplay.textContent = score;
    }

    function endGame() {
        clearInterval(balloonInterval);
        gameArea.style.display = 'none';
        title.style.display = 'none';
        gameOverScreen.style.display = 'block';
        finalScoreDisplay.textContent = score;
        setTimeout(() => {
            gameOverScreen.style.display = 'none';
            nameEntryScreen.style.display = 'block';
        }, 3000); // Change delay to 3 seconds
    }

    function submitName() {
        const playerName = playerNameInput.value;
        if (playerName) {
            const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
            leaderboard.push({ name: playerName, score: score });
            leaderboard.sort((a, b) => b.score - a.score);
            if (leaderboard.length > 10) {
                leaderboard.pop();
            }
            localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
            displayLeaderboard();
            nameEntryScreen.style.display = 'none';
            scoreBoardScreen.style.display = 'block';
        }
    }

    function displayLeaderboard() {
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        scoreList.innerHTML = '';
        leaderboard.forEach(entry => {
            const listItem = document.createElement('li');
            listItem.textContent = `${entry.name}: ${entry.score}`;
            scoreList.appendChild(listItem);
        });
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
        balloonMultiplier = 1;
        startGame();
    }

    function startGame() {
        balloonInterval = setInterval(createBalloon, 1000);
        setInterval(createPowerUp, 10000); // Power-ups appear every 10 seconds
        setTimeout(endGame, 30000);
    }

    submitNameButton.addEventListener('click', submitName);
    restartGameButton.addEventListener('click', restartGame);

    startGame();
});