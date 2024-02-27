const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth - 28;
    canvas.height = window.innerHeight - 28;
}

window.addEventListener('resize', () => {
    resizeCanvas();
    draw();
});

resizeCanvas();

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 15,
    speedX: 5,
    speedY: 5,
    maxSpeed: 12,
    speedIncrement: 0.5,
    color: 'black'
};

const paddleWidth = 25;
const paddleHeight = 185;

const player1 = {
    x: 120,
    y: canvas.height / 2 - paddleHeight / 2,
    dy: 0,
    speed: 8,
    color: '#45aee6',
    score: 0
};

const player2 = {
    x: canvas.width - 120,
    y: canvas.height / 2 - paddleHeight / 2,
    dy: 0,
    speed: 8,
    color: '#e65045',
    score: 0
};

const keysPressed = {};

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

function drawPaddle(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, paddleWidth, paddleHeight);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBall();

    drawPaddle(player1.x, player1.y, player1.color);
    drawPaddle(player2.x, player2.y, player2.color);

    ball.x += ball.speedX;
    ball.y += ball.speedY;

    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.speedY = -ball.speedY;
    }

    if (
        ball.x - ball.radius < player1.x + paddleWidth &&
        ball.y > player1.y &&
        ball.y < player1.y + paddleHeight
    ) {
        ball.speedX = -ball.speedX;
        increaseBallSpeed();
    }

    if (
        ball.x + ball.radius > player2.x &&
        ball.y > player2.y &&
        ball.y < player2.y + paddleHeight
    ) {
        ball.speedX = -ball.speedX;
        increaseBallSpeed();
    }

    if (ball.x - ball.radius < 0) {
        player2.score++;
        document.getElementById('player2Score').textContent = player2.score;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        player1.score++;
        document.getElementById('player1Score').textContent = player1.score;
        resetBall();
    }

    if (keysPressed['w']) {
        player1.y -= player1.speed;
    }
    if (keysPressed['s']) {
        player1.y += player1.speed;
    }
    if (keysPressed['ArrowUp']) {
        player2.y -= player2.speed;
    }
    if (keysPressed['ArrowDown']) {
        player2.y += player2.speed;
    }

    player1.y = Math.max(0, Math.min(player1.y, canvas.height - paddleHeight));
    player2.y = Math.max(0, Math.min(player2.y, canvas.height - paddleHeight));
}

function increaseBallSpeed() {
    if (Math.abs(ball.speedX) < ball.maxSpeed) {
        ball.speedX += ball.speedIncrement * Math.sign(ball.speedX);
    }
    if (Math.abs(ball.speedY) < ball.maxSpeed) {
        ball.speedY += ball.speedIncrement * Math.sign(ball.speedY);
    }
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedX = 5;
    ball.speedY = 5;
}

function keyDownHandler(e) {
    keysPressed[e.key] = true;
}

function keyUpHandler(e) {
    keysPressed[e.key] = false;
}

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

setInterval(draw, 1000 / 60);
