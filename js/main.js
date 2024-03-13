class SnakeGame {
    constructor() {
        this.playButton = document.getElementById("playButton");
        this.retryButton = document.getElementById("retryButton");
        this.scoreDisplay = document.getElementById("scoreDisplay");

        this.gameCanvas = document.getElementById("gameCanvas");
        this.context = this.gameCanvas.getContext("2d");
        this.cellSize = 20;
        this.canvasWidth = this.gameCanvas.width;
        this.canvasHeight = this.gameCanvas.height;
        this.snakeColor = "green";
        this.foodColor = "red";

        this.snake = {
            body: [{x: 10, y: 10}],
            direction: {x: 1, y: 0}
        };
        this.food = {x: 15, y: 15};
        this.score = 0;

        this.gameLoop = null;

        this.eatSound = new Audio("music/eatSound.wav");
        this.crashSound = new Audio("music/crash.wav");
        this.backgroundMusic = new Audio("music/background_music.mp3");

        this.playButton.addEventListener("click", this.startGame.bind(this));
    }

    startGame() {
        this.playButton.style.display = "none";
        this.initializeGame();
    }

    initializeGame() {
        this.retryButton.addEventListener("click", this.resetGame.bind(this));
        this.backgroundMusic.play();
        this.gameLoop = setInterval(this.main.bind(this), 100);
        document.addEventListener("keydown", this.handleKeyPress.bind(this));
    }

    main() {
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.drawOverlay();
        this.drawSnake();
        this.drawFood();
        this.moveSnake();
    }

    drawSnake() {
        this.context.fillStyle = this.snakeColor;
        this.snake.body.forEach(segment => {
            this.context.beginPath();
            this.context.arc((segment.x + 0.5) * this.cellSize, (segment.y + 0.5) * this.cellSize, this.cellSize / 2, 0, Math.PI * 2);
            this.context.fill();
        });
    }

    drawFood() {
        this.context.fillStyle = this.foodColor;
        this.context.beginPath();
        this.context.arc((this.food.x + 0.5) * this.cellSize, (this.food.y + 0.5) * this.cellSize, this.cellSize / 2, 0, Math.PI * 2);
        this.context.fill();
    }

    drawOverlay() {
        this.context.fillStyle = "rgba(0, 0, 0, 0.5)";
        this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

    moveSnake() {
        const head = {x: this.snake.body[0].x + this.snake.direction.x, y: this.snake.body[0].y + this.snake.direction.y};
        this.snake.body.unshift(head);

        if (
            head.x < 0 || head.x >= this.canvasWidth / this.cellSize ||
            head.y < 0 || head.y >= this.canvasHeight / this.cellSize ||
            this.checkCollision()
        ) {
            clearInterval(this.gameLoop);
            this.retryButton.style.display = "block";
            this.crashSound.currentTime = 0;
            this.crashSound.play();
            this.backgroundMusic.pause();
            return;
        }

        if (head.x === this.food.x && head.y === this.food.y) {
            this.food.x = Math.floor(Math.random() * this.canvasWidth / this.cellSize);
            this.food.y = Math.floor(Math.random() * this.canvasHeight / this.cellSize);
            this.score++;
            this.scoreDisplay.textContent = `Score: ${this.score}`;
            this.eatSound.currentTime = 0;
            this.eatSound.play();
        } else {
            this.snake.body.pop();
        }
    }

    checkCollision() {
        const head = this.snake.body[0];
        for (let i = 1; i < this.snake.body.length; i++) {
            if (head.x === this.snake.body[i].x && head.y === this.snake.body[i].y) {
                return true;
            }
        }
        return false;
    }

    handleKeyPress(event) {
        switch (event.key) {
            case "ArrowUp":
                if (this.snake.direction.y !== 1) this.snake.direction = {x: 0, y: -1};
                break;
            case "ArrowDown":
                if (this.snake.direction.y !== -1) this.snake.direction = {x: 0, y: 1};
                break;
            case "ArrowLeft":
                if (this.snake.direction.x !== 1) this.snake.direction = {x: -1, y: 0};
                break;
            case "ArrowRight":
                if (this.snake.direction.x !== -1) this.snake.direction = {x: 1, y: 0};
                break;
            case " ":
                if (this.gameLoop) {
                    clearInterval(this.gameLoop);
                    this.backgroundMusic.pause();
                    this.gameLoop = null;
                } else {
                    this.gameLoop = setInterval(this.main.bind(this), 100);
                    this.backgroundMusic.play();
                }
                break;
        }
    }

    resetGame() {
        this.snake = {
            body: [{x: 10, y: 10}],
            direction: {x: 1, y: 0}
        };
        this.food = {x: 15, y: 16};
        this.score = 0;
        this.scoreDisplay.textContent = `Score: ${this.score}`;
        this.retryButton.style.display = "none";
        this.initializeGame();
    }
}

new SnakeGame();
