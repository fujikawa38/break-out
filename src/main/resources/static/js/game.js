const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");

let x, y, dx, dy, paddleX;
const ballRadius = 10;

const paddleHeight = 10;
const paddleWidth = 75;

let rightPressed = false;
let leftPressed = false;

let isRunning = false;

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
startButton.addEventListener("click", startGame);

function keyDownHandler(e) {
	if (e.key === "Right" || e.key === "ArrowRight") {
		rightPressed = true;
	} else if (e.key === "left" || e.key === "ArrowLeft") {
		leftPressed = true;
	}
}

function keyUpHandler(e) {
	if (e.key === "Right" || e.key === "ArrowRight") {
		rightPressed = false;
	} else if (e.key === "left" || e.key === "ArrowLeft") {
		leftPressed = false;
	}
}

function resetGame() {
	x = canvas.width / 2;
	y = canvas.height - 30;
	dx = 2;
	dy = -2;
	paddleX = (canvas.width - paddleWidth) / 2;
}

function drawBall() {
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
	ctx.fillStyle = "#00ffcc";
	ctx.fill();
	ctx.closePath();
}

function drawPaddle() {
	ctx.beginPath();
	ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
	ctx.fillStyle = "#fff";
	ctx.fill();
	ctx.closePath();
}

function draw() {
	if (!isRunning) return;
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	drawBall();
	drawPaddle();
	
	if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
		dx = -dx;
	}
	if (y + dy < ballRadius) {
		dy = -dy;
	} else if (y + dy > canvas.height - ballRadius) {
		if (x > paddleX && x < paddleX + paddleWidth) {
			dy = -dy;
		} else {
			alert("ゲームオーバー！");
			isRunning = false;
			startButton.disabled = false;
			resetGame();
			return;
		}
	}
	
	x += dx;
	y += dy;
	
	if (rightPressed && paddleX < canvas.width - paddleWidth) {
		paddleX += 5;
	} else if (leftPressed && paddleX > 0) {
		paddleX -= 5;
	}
	
	requestAnimationFrame(draw);
}

function startGame() {
	resetGame();
	isRunning = true;
	startButton.disabled = true;
	draw();
}