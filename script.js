const startMenu = document.getElementById('startMenu');
const controlsPage = document.getElementById('controlsPage');
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');
const keysPressed = {};
var player1, player2, ball, drawInterval, eventInterval, probability, oldSpeedX, oldSpeedY;
let lastRandomEventTime = 0;
const cooldownDuration = 8000;

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

function drawPaddle(x, y, color, height) {
    const paddleWidth = 25;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, paddleWidth, height);
}

function handleRandomEvent() {
    const currentTime = new Date().getTime();
    if (currentTime - lastRandomEventTime < cooldownDuration) {
        return;
    }

    const randomEvent = Math.floor(Math.random() * 5) + 1;
    let eventText = '';
    switch (randomEvent) {
        case 1:
            ball.speedX = Math.floor(ball.speedX / 2);
            ball.speedY = Math.floor(ball.speedY / 2);
            eventText = 'Calming Speed';
            break;
        case 2:
            ball.speedX *= 2;
            ball.speedY *= 2;
            ball.speedX = Math.min(ball.speedX, ball.maxSpeed);
            ball.speedY = Math.min(ball.speedY, ball.maxSpeed);
            eventText = 'Raging Speed';
            break;
        case 3:
            player1.height += 80;
            player2.height += 80;
            setTimeout(() => {
                player1.height -= 80;
                player2.height -= 80;
            }, 5000);
            eventText = 'Longer Paddles';
            break;
        case 4:
            ball.color = '#00FFFF';
            oldSpeedX = ball.speedX;
            oldSpeedY = ball.speedY;
            ball.speedX = 0;
            ball.speedY = 0;
            setTimeout(() => {
                ball.color = 'white';
                ball.speedX = oldSpeedX;
                ball.speedY = oldSpeedY;
            }, 5000);
            eventText = 'Frozen Ball';
            break;
        default:
            break;
        case 5:
            ball.speedX = -ball.speedX
            ball.speedY = -ball.speedY
            eventText = 'Telekinesis';
            break;
    }

    lastRandomEventTime = currentTime;

    const event = document.createElement('h1');
    event.textContent = eventText;
    event.className = 'randomEvent';
    document.body.appendChild(event);

    setTimeout(() => {
        document.body.removeChild(event);
    }, 3000);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();

    drawPaddle(player1.x, player1.y, player1.color, player1.height);
    drawPaddle(player2.x, player2.y, player2.color, player2.height);

    if (ball.speedX != 0 || ball.speedY != 0) {
        ball.x += ball.speedX;
        ball.y += ball.speedY;
    }

    if (ball.y + ball.radius >= canvas.height || ball.y - ball.radius <= 0) {
        ball.speedY = -ball.speedY;
    }

    if (
        ball.x - ball.radius < player1.x + 25 &&
        ball.y > player1.y &&
        ball.y < player1.y + player1.height
    ) {
        ball.speedX = -ball.speedX;
        increaseBallSpeed();
        probability = Math.random();
    }

    if (
        ball.x + ball.radius > player2.x &&
        ball.y > player2.y &&
        ball.y < player2.y + player2.height
    ) {
        ball.speedX = -ball.speedX;
        increaseBallSpeed();
        probability = Math.random();
    }

    if (ball.x - ball.radius < 0) {
        player2.score++;
        const player2ScoreElement = document.getElementById('player2Score');
        if (player2ScoreElement) {
            player2ScoreElement.textContent = player2.score;
        }
        if (player2.score >= 5) {
            endGame(2);
        } else {
            resetBall();
        }
    } else if (ball.x + ball.radius > canvas.width) {
        player1.score++;
        const player1ScoreElement = document.getElementById('player1Score');
        if (player1ScoreElement) {
            player1ScoreElement.textContent = player1.score;
        }
        if (player1.score >= 5) {
            endGame(1);
        } else {
            resetBall();
        }
    }

    if (keysPressed['w']) {
        player1.y -= player1.speed;
        player1.y = Math.max(0, player1.y);
    }
    if (keysPressed['s']) {
        player1.y += player1.speed;
        player1.y = Math.min(canvas.height - player1.height, player1.y);
    }
    if (keysPressed['ArrowUp']) {
        player2.y -= player2.speed;
        player2.y = Math.max(0, player2.y);
    }
    if (keysPressed['ArrowDown']) {
        player2.y += player2.speed;
        player2.y = Math.min(canvas.height - player2.height, player2.y);
    }
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
        height: 185,
        color: '#45aee6',
        score: 0
    };

    player2 = {
        x: canvas.width - 120,
        y: canvas.height / 2 - 185 / 2,
        dy: 0,
        speed: 8,
        height: 185,
        color: '#e65045',
        score: 0
    };

    ball = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 15,
        speedX: 5,
        speedY: 5,
        maxSpeed: 12,
        speedIncrement: 0.5,
        color: 'white'
    };

    document.addEventListener('keydown', keyDownHandler, false);
    document.addEventListener('keyup', keyUpHandler, false);

    draw();

    drawInterval = setInterval(draw, 1000 / 60);
    eventInterval = setInterval(handleRandomEvent, 10000);
}

function endGame(winner) {
    clearInterval(drawInterval);
    clearInterval(eventInterval);

    const winnerText = document.createElement('p');
    winnerText.textContent = `Player ${winner} won!`;
    
    const playAgainButton = document.createElement('button');
    playAgainButton.textContent = 'Play Again';
    playAgainButton.addEventListener('click', () => {
        location.reload();
    });

    const gameResultContainer = document.getElementById('gameResult');
    gameResultContainer.appendChild(winnerText);
    gameResultContainer.appendChild(playAgainButton);
    gameResultContainer.style.display = 'block';

    canvas.style.display = 'none';
}
