const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");

// ゲーム変数
let paddleSpeed = 7;
let ballSpeed = 3;
let ballRadius = 10
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = ballSpeed;
let dy = -ballSpeed;
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;
let isRunning = false;
let score = 0;

// ブロック設定
const brickColors = [
	"#FFB3BA", "#FFDEBA", "#FFFFBA", "#BAFFC9", "#BAE1FF", "#E6BAFF", "#FFD6E0", "#FFF0BA", "#D4F0F0", "#FFCCE5"
];
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
	dx = ballSpeed;
	dy = -ballSpeed;
	paddleX = (canvas.width - paddleWidth) / 2;
	score = 0;
	initBricks();
}

// ブロック初期化
function initBricks() {
	bricks = [];
	for (let r = 0; r < brickRowCount; r++) {
		bricks[r] = [];
		let rowColor = brickColors[Math.floor(Math.random() * brickColors.length)];
		for (let c = 0; c < brickColumnCount; c++) {
			bricks[r][c] = { x : 0, y : 0, status : 1, color: rowColor};
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
			let b = bricks[r][c];
			if (b.status === 1) {
				let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
				let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
				b.x = brickX;
				b.y = brickY;
				ctx.beginPath();
				ctx.rect(brickX, brickY, brickWidth, brickHeight);
				ctx.fillStyle = b.color;
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
			let b = bricks[r][c];
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
			let paddleCenter = paddleX + paddleWidth / 2;
			let hitPos = (x - paddleCenter) / (paddleWidth / 2);
			let maxSpeed = 4;
			dx = hitPos * maxSpeed;
			dy = -Math.abs(dy);
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
		paddleX += paddleSpeed;
	} else if (leftPressed && paddleX > 0) {
		paddleX -= paddleSpeed;
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