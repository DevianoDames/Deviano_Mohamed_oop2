// Constants
const gameCanvas = document.getElementById("gameCanvas");
const context = gameCanvas.getContext("2d");
const cellSize = 20;
const canvasWidth = gameCanvas.width;
const canvasHeight = gameCanvas.height;
const snakeColor = "green";
const foodColor = "red";

// Snake object
let snakeObj = {
    body: [{x: 10, y: 10}],
    direction: {x: 1, y: 0}
};

// Food object
let foodObj = {x: 15, y: 15};

let score = 0;

const retryButton = document.getElementById("retryButton");
const scoreDisplay = document.getElementById("scoreDisplay");

let gameLoop;

// Audio elements
const eatSound = new Audio("music/eatSound.wav");
const crashSound = new Audio("music/crash.wav");
const backgroundMusic = new Audio("music/background_music.mp3");

// Draw snake function
function drawSnake() {
    context.fillStyle = snakeColor;
    snakeObj.body.forEach(segment => {
        context.beginPath();
        context.arc((segment.x + 0.5) * cellSize, (segment.y + 0.5) * cellSize, cellSize / 2, 0, Math.PI * 2);
        context.fill();
    });
}

// Draw food function
function drawFood() {
    context.fillStyle = foodColor;
    context.beginPath();
    context.arc((foodObj.x + 0.5) * cellSize, (foodObj.y + 0.5) * cellSize, cellSize / 2, 0, Math.PI * 2);
    context.fill();
}

// Draw overlay function
function drawOverlay() {
    context.fillStyle = "rgba(0, 0, 0, 0.5)"; // Black with 50% opacity
    context.fillRect(0, 0, canvasWidth, canvasHeight); // Fill the entire canvas
}

// Move snake function
function moveSnake() {
    const head = {x: snakeObj.body[0].x + snakeObj.direction.x, y: snakeObj.body[0].y + snakeObj.direction.y};
    snakeObj.body.unshift(head);

    // Check if the snake hits the canvas walls or collides with itself
    if (
        head.x < 0 || head.x >= canvasWidth / cellSize ||
        head.y < 0 || head.y >= canvasHeight / cellSize ||
        checkCollision()
    ) {
        // Game over
        clearInterval(gameLoop);
        retryButton.style.display = "block"; // Show the retry button
        crashSound.currentTime = 0; // Rewind crash sound
        crashSound.play(); // Play crash sound
        backgroundMusic.pause(); // Pause background music
        return;
    }

    if (head.x === foodObj.x && head.y === foodObj.y) {
        foodObj.x = Math.floor(Math.random() * canvasWidth / cellSize);
        foodObj.y = Math.floor(Math.random() * canvasHeight / cellSize);
        score++;
        scoreDisplay.textContent = `Score: ${score}`; // Update score display
        eatSound.currentTime = 0; // Rewind eat sound
        eatSound.play(); // Play eat sound
    } else {
        snakeObj.body.pop();
    }
}

// Check collision function
function checkCollision() {
    const head = snakeObj.body[0];
    for (let i = 1; i < snakeObj.body.length; i++) {
        if (head.x === snakeObj.body[i].x && head.y === snakeObj.body[i].y) {
            return true; // Collision with itself
        }
    }
    return false;
}

// Main function
function main() {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    drawOverlay(); // Draw the overlay first
    drawSnake();
    drawFood();
    moveSnake();
}

// Event listener for arrow keys
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
        case " ": // Space bar
            if (gameLoop) {
                clearInterval(gameLoop); // Pause the game
                backgroundMusic.pause(); // Pause background music
                gameLoop = null;
            } else {
                gameLoop = setInterval(main, 100); // Resume the game
                backgroundMusic.play(); // Resume background music
            }
            break;
    }
});

// Event listener for retry button
retryButton.addEventListener("click", () => {
    snakeObj = {
        body: [{x: 10, y: 10}],
        direction: {x: 1, y: 0}
    };
    foodObj = {x: 15, y: 16};
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    retryButton.style.display = "none"; // Hide the retry button
    gameLoop = setInterval(main, 100); // Restart the game loop
    backgroundMusic.play(); // Play background music
});

// Start the game loop
gameLoop = setInterval(main, 100);
backgroundMusic.play(); // Play background music
