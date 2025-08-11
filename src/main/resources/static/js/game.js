const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");

// ゲーム変数
let x, y, dx, dy, paddleX;
const ballRadius = 10;
const paddleHeight = 10;
const paddleWidth = 75;
let rightPressed = false;
let leftPressed = false;
let isRunning = false;
let score = 0;

// ブロック設定
const brickRowCount = 3;
const brickColumnCount = 6;
const brickWidth = 80;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
let bricks = [];

// イベント登録
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
startButton.addEventListener("click", startGame);

// キー操作
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

// ゲーム初期化
function resetGame() {
	x = canvas.width / 2;
	y = canvas.height - 30;
	dx = 2;
	dy = -2;
	paddleX = (canvas.width - paddleWidth) / 2;
	score = 0;
	initBricks();
}

// ブロック初期化
function initBricks() {
	bricks = [];
	for (let c = 0; c < brickColumnCount; c++) {
		bricks[c] = [];
		for (let r = 0; r < brickRowCount; r++) {
			bricks[c][r] = { x : 0, y : 0, status : 1};
		}
	}
}

// 描画系
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

function drawBricks() {
	for (let c = 0; c < brickColumnCount; c++) {
		for (let r = 0; r < brickRowCount; r++) {
			if (bricks[c][r].status === 1) {
				let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
				let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
				bricks[c][r].x = brickX;
				bricks[c][r].y = brickY;
				ctx.beginPath();
				ctx.rect(brickX, brickY, brickWidth, brickHeight);
				ctx.fillStyle = "#ff9933";
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}

function drawScore() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "#fff";
	ctx.fillText("Score: " + score, 8, 20);
}

// 当たり判定
function collisionDetection() {
	for (let c = 0; c < brickColumnCount; c++) {
		for (let r = 0; r < brickRowCount; r++) {
			let b = bricks[c][r];
			if (b.status === 1) {
				if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
					dy = -dy;
					b.status = 0;
					score++;
					if (score === brickRowCount * brickColumnCount) {
						alert("クリア");
						isRunning = false;
						startButton.disabled = false;
						resetGame();
					}
				}
			}
		}
	}
}

// メインループ
function draw() {
	if (!isRunning) return;
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	drawBricks();
	drawBall();
	drawPaddle();
	drawScore();
	collisionDetection();
	
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

// スタートボタン処理
function startGame() {
	resetGame();
	isRunning = true;
	startButton.disabled = true;
	draw();
}