const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let snake = [{ x: 10, y: 10 }];
let direction = { x: 0, y: 0 };
let food = { x: 1, y: 1 };
let score = 0;

document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    if (event.key === 'ArrowUp' && direction.y === 0) {
        direction = { x: 0, y: -1 };
    } else if (event.key === 'ArrowDown' && direction.y === 0) {
        direction = { x: 0, y: 1 };
    } else if (event.key === 'ArrowLeft' && direction.x === 0) {
        direction = { x: -1, y: 0 };
    } else if (event.key === 'ArrowRight' && direction.x === 0) {
        direction = { x: 1, y: 0 };
    }
}

function gameLoop() {
    update();
    draw();
    if (checkCollision()) {
        alert('Game Over! Your score: ' + score);
        document.location.reload();
    }
    setTimeout(gameLoop, 100);
}

function update() {
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        placeFood();
    } else {
        snake.pop();
    }
}

function placeFood() {
    food.x = Math.floor(Math.random() * (canvas.width / 10));
    food.y = Math.floor(Math.random() * (canvas.height / 10));
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'blue';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * 10, segment.y * 10, 10, 10);
    });
    ctx.fillStyle = 'red';
    // ctx.fillRect(food.x * 10, food.y * 10, 10, 10);
    ctx.beginPath();
    ctx.arc(food.x * 10 +5, food.y * 10 +5, 5, 0, Math.PI * 2);
    ctx.fill();
}

function checkCollision() {
    const head = snake[0];
    return (
        head.x < 0 || head.x >= canvas.width / 10 ||
        head.y < 0 || head.y >= canvas.height / 10 ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
    );
}

gameLoop();