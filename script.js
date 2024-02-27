const startMenu = document.getElementById('startMenu');
const controlsPage = document.getElementById('controlsPage');
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');
const keysPressed = {};
var player1, player2;

showStartMenu();

document.getElementById('startButton').addEventListener('click', () => {
    hideStartMenu();
    showGameCanvas();
    startGame();
});

document.getElementById('controlsButton').addEventListener('click', () => {
    hideStartMenu();
    showControlsPage();
});

function showStartMenu() {
    startMenu.style.display = 'flex';
    controlsPage.style.display = 'none';
    canvas.style.display = 'none';
}

function hideStartMenu() {
    startMenu.style.display = 'none';
}

function showControlsPage() {
    controlsPage.style.display = 'block';
}

function showGameCanvas() {
    canvas.style.display = 'block';
}

function resizeCanvas() {
    canvas.width = window.innerWidth - 28;
    canvas.height = window.innerHeight - 28;
}

function increaseBallSpeed(ball) {
    if (Math.abs(ball.speedX) < ball.maxSpeed) {
        ball.speedX += ball.speedIncrement * Math.sign(ball.speedX);
    }
    if (Math.abs(ball.speedY) < ball.maxSpeed) {
        ball.speedY += ball.speedIncrement * Math.sign(ball.speedY);
    }
}

function resetBall(ball) {
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

function drawPaddle(x, y, color) {
    const paddleWidth = 25;
    const paddleHeight = 185;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, paddleWidth, paddleHeight);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPaddle(player1.x, player1.y, player1.color);
    drawPaddle(player2.x, player2.y, player2.color);

    ball.x += ball.speedX;
    ball.y += ball.speedY;

    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.speedY = -ball.speedY;
    }

    if (
        ball.x - ball.radius < player1.x + 25 &&
        ball.y > player1.y &&
        ball.y < player1.y + 185
    ) {
        ball.speedX = -ball.speedX;
        increaseBallSpeed(ball);
    }

    if (
        ball.x + ball.radius > player2.x &&
        ball.y > player2.y &&
        ball.y < player2.y + 185
    ) {
        ball.speedX = -ball.speedX;
        increaseBallSpeed(ball);
    }

    if (ball.x - ball.radius < 0) {
        player2.score++;
        document.getElementById('player2Score').textContent = player2.score;
        resetBall(ball);
    } else if (ball.x + ball.radius > canvas.width) {
        player1.score++;
        document.getElementById('player1Score').textContent = player1.score;
        resetBall(ball);
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

    player1.y = Math.max(0, Math.min(player1.y, canvas.height - 185));
    player2.y = Math.max(0, Math.min(player2.y, canvas.height - 185));
}

window.addEventListener('resize', () => {
    resizeCanvas();
    draw();
});

resizeCanvas();

function startGame() {
    hideStartMenu();
    showGameCanvas();

    player1 = {
        x: 120,
        y: canvas.height / 2 - 185 / 2,
        dy: 0,
        speed: 8,
        color: '#45aee6',
        score: 0
    };

    player2 = {
        x: canvas.width - 120,
        y: canvas.height / 2 - 185 / 2,
        dy: 0,
        speed: 8,
        color: '#e65045',
        score: 0
    };

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

    draw();

    document.addEventListener('keydown', keyDownHandler, false);
    document.addEventListener('keyup', keyUpHandler, false);

    setInterval(draw, 1000 / 60);
}
