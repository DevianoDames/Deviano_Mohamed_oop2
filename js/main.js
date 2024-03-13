const playButton = document.getElementById("playButton");

playButton.addEventListener("click", startGame);

function startGame() {
    playButton.style.display = "none";
    initializeGame();
}

function initializeGame() {
    const gameCanvas = document.getElementById("gameCanvas");
    const context = gameCanvas.getContext("2d");
    const cellSize = 20;
    const canvasWidth = gameCanvas.width;
    const canvasHeight = gameCanvas.height;
    const snakeColor = "green";
    const foodColor = "red";

    let snakeObj = {
        body: [{x: 10, y: 10}],
        direction: {x: 1, y: 0}
    };

    let foodObj = {x: 15, y: 15};

    let score = 0;

    const retryButton = document.getElementById("retryButton");
    const scoreDisplay = document.getElementById("scoreDisplay");

    let gameLoop;

    const eatSound = new Audio("music/eatSound.wav");
    const crashSound = new Audio("music/crash.wav");
    const backgroundMusic = new Audio("music/background_music.mp3");

    function drawSnake() {
        context.fillStyle = snakeColor;
        snakeObj.body.forEach(segment => {
            context.beginPath();
            context.arc((segment.x + 0.5) * cellSize, (segment.y + 0.5) * cellSize, cellSize / 2, 0, Math.PI * 2);
            context.fill();
        });
    }

    function drawFood() {
        context.fillStyle = foodColor;
        context.beginPath();
        context.arc((foodObj.x + 0.5) * cellSize, (foodObj.y + 0.5) * cellSize, cellSize / 2, 0, Math.PI * 2);
        context.fill();
    }

    function drawOverlay() {
        context.fillStyle = "rgba(0, 0, 0, 0.5)";
        context.fillRect(0, 0, canvasWidth, canvasHeight);
    }

    function moveSnake() {
        const head = {x: snakeObj.body[0].x + snakeObj.direction.x, y: snakeObj.body[0].y + snakeObj.direction.y};
        snakeObj.body.unshift(head);

        if (
            head.x < 0 || head.x >= canvasWidth / cellSize ||
            head.y < 0 || head.y >= canvasHeight / cellSize ||
            checkCollision()
        ) {
            clearInterval(gameLoop);
            retryButton.style.display = "block";
            crashSound.currentTime = 0;
            crashSound.play();
            backgroundMusic.pause();
            return;
        }

        if (head.x === foodObj.x && head.y === foodObj.y) {
            foodObj.x = Math.floor(Math.random() * canvasWidth / cellSize);
            foodObj.y = Math.floor(Math.random() * canvasHeight / cellSize);
            score++;
            scoreDisplay.textContent = `Score: ${score}`;
            eatSound.currentTime = 0;
            eatSound.play();
        } else {
            snakeObj.body.pop();
        }
    }

    function checkCollision() {
        const head = snakeObj.body[0];
        for (let i = 1; i < snakeObj.body.length; i++) {
            if (head.x === snakeObj.body[i].x && head.y === snakeObj.body[i].y) {
                return true;
            }
        }
        return false;
    }

    function main() {
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        drawOverlay();
        drawSnake();
        drawFood();
        moveSnake();
    }

    document.addEventListener("keydown", event => {
        switch (event.key) {
            case "ArrowUp":
                if (snakeObj.direction.y !== 1) snakeObj.direction = {x: 0, y: -1};
                break;
            case "ArrowDown":
                if (snakeObj.direction.y !== -1) snakeObj.direction = {x: 0, y: 1};
                break;
            case "ArrowLeft":
                if (snakeObj.direction.x !== 1) snakeObj.direction = {x: -1, y: 0};
                break;
            case "ArrowRight":
                if (snakeObj.direction.x !== -1) snakeObj.direction = {x: 1, y: 0};
                break;
            case " ":
                if (gameLoop) {
                    clearInterval(gameLoop);
                    backgroundMusic.pause();
                    gameLoop = null;
                } else {
                    gameLoop = setInterval(main, 100);
                    backgroundMusic.play();
                }
                break;
        }
    });

    retryButton.addEventListener("click", () => {
        snakeObj = {
            body: [{x: 10, y: 10}],
            direction: {x: 1, y: 0}
        };
        foodObj = {x: 15, y: 16};
        score = 0;
        scoreDisplay.textContent = `Score: ${score}`;
        retryButton.style.display = "none";
        gameLoop = setInterval(main, 100);
        backgroundMusic.play();
    });

    gameLoop = setInterval(main, 100);
    backgroundMusic.play();
};
