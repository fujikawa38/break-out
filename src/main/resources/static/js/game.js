const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ゲーム変数
let paddleSpeed = 5;
let ballSpeed = 2;
let ballRadius = 5;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = ballSpeed * (Math.random() < 0.5 ? -1 : 1);
let dy = -ballSpeed;
let paddleHeight = 10;
let paddleWidth = 90;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;
let isRunning = false;
let score = 0;
let currentStage = 1;
const maxStage = 5;
let stageGate = null;
let gameOver = false;

// 最終スコアとタイムの保存
let finalScore = 0;
let finalTime = 0;
let allCleared = 0;

// アイテム関連設定
const ITEM_TYPES = [
	{ type: "speedUp", chance: 0.02 },
	{ type: "paddleSizeUp", chance: 0.02 },
	{ type: "pierce", chance: 0.02 }
];
let items = [];
let pierceMode = false;


// ブロック設定
const brickColors = [
	"#FFB3BA", "#FFDEBA", "#FFFFBA", "#BAFFC9", "#BAE1FF", "#E6BAFF", "#FFD6E0", "#FFF0BA", "#D4F0F0", "#FFCCE5"
];
//const totalWidth = 600;
let brickRowCount = 3;
let brickColumnCount = 6;
let brickWidth = 0;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
let brickOffsetLeft = 30;
let bricks = [];

// タイム表示用変数
let startTime;
let elapsedTime = 0;

// イベント登録
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

// キー操作
function keyDownHandler(e) {
	if (e.key === "Right" || e.key === "ArrowRight") {
		rightPressed = true;
	} else if (e.key === "left" || e.key === "ArrowLeft") {
		leftPressed = true;
	}
	
	if (e.key === " " && !isRunning) {
		startGame();
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
	ballSpeed = 2;
	dx = ballSpeed * (Math.random() < 0.5 ? -1 : 1);
	dy = -ballSpeed;
	paddleWidth = 90;
	paddleSpeed = 5;
	paddleX = (canvas.width - paddleWidth) / 2;
	score = 0;
	items = [];
	pierceMode = false;
	rightPressed = false;
	leftPressed = false;
	currentStage = 1;
	elapsedTime = 0;
	setStage(currentStage);
	initBricks();
	gameOver = false;
	allCleared = false;
}

// ステージ設定
function setStage(stage) {
	currentStage = stage;
	
	brickColumnCount = 6 + (stage - 1) * 1;
	brickRowCount = 3 + (stage - 1) * 1;
	
	brickWidth = (canvas.width - (brickPadding * (brickColumnCount - 1)) - brickOffsetLeft * 2) / brickColumnCount;
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

// パドルとボールの位置初期化
function resetPosition() {
	x = canvas.width / 2;
	y = canvas.height - 30;
	paddleX = (canvas.width - paddleWidth) / 2;
}

// アイテム生成
function createItem(x, y) {
	let r = Math.random();
	let sum = 0;
	for (let itemDef of ITEM_TYPES) {
		sum += itemDef.chance;
		if (r < sum) {
			items.push({x: x, y: y, width: 20, height: 20, type: itemDef.type, speed: 1});
			break;
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

function drawInfo() {
	ctx.font = "16px Arial";
	ctx.fillStyle = "#fff";
	
	ctx.fillText("Score: " + score, 8, 20);
	ctx.fillText("Stage: " + currentStage, canvas.width - 80, 20);
	
	let minutes = Math.floor(elapsedTime / 60000);
	let seconds = Math.floor((elapsedTime % 60000) / 1000);
	let displayTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
	ctx.fillText("Time: " + displayTime, 8, 40);
}

function drawItems() {
	items.forEach(item => {
		ctx.fillStyle = (item.type === "speedUp") ? "#FF6347" : (item.type === "paddleSizeUp") ? "#4169E1" : "#FFD700";
		ctx.fillRect(item.x, item.y, item.width, item.height);
	});
}

function updateItems() {
	items.forEach((item, index) => {
		item.y += item.speed;
		
		if (item.y + item.height >= canvas.height - paddleHeight && item.x < paddleX + paddleWidth && item.x + item.width > paddleX) {
			activateItem(item.type);
			items.splice(index, 1);
		}
		
		if (item.y > canvas.height) {
			items.splice(index, 1);
		}
	});
}

function drawStageGate() {
	if (stageGate && stageGate.active) {
		ctx.fillStyle = "#00FF99";
		ctx.fillRect(stageGate.x, 0, stageGate.width, stageGate.height);
	}
}

// アイテム効果
function activateItem(type) {
	if (type === "speedUp") {
		ballSpeed *= 1.3;
		dx *= 1.3;
		dy *= 1.3;
		paddleSpeed *= 1.3;
	} else if (type === "paddleSizeUp") {
		paddleWidth *= 1.2;
	} else if (type === "pierce") {
		pierceMode = true;
	}
}

// 当たり判定
function collisionDetection() {
	for (let c = 0; c < brickColumnCount; c++) {
		for (let r = 0; r < brickRowCount; r++) {
			let b = bricks[r][c];
			if (b.status === 1) {
				if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
					
					createItem(b.x + brickWidth/2 - 10, b.y);
					
					if (!pierceMode) {
						dy = -dy;
					}

					b.status = 0;
					score++;
				}
			}
		}
	}
}

function checkGateCollision() {
	if (stageGate && stageGate.active) {
		if (x > stageGate.x && x < stageGate.x + stageGate.width && y + ballRadius > 0 && y - ballRadius < 0 + stageGate.height) {
			stageGate.active = false;
			if (currentStage < maxStage) {
				currentStage++;
				resetPosition();
				setStage(currentStage);
				initBricks();
			} else {
				isRunning = false;
				gameOver = true;
				allCleared = true;
				finalTime = elapsedTime;
			}
		}
	}
}

// ステージクリア判定
function checkStageClear() {
	if (stageGate && stageGate.active) return;
	
	let allCleared = true;
	for (let row of bricks) {
		for (let b of row) {
			if (b.status === 1) {
				allCleared = false;
				break;
			}
		}
	}

	if (allCleared) {
		stageGate = { x: canvas.width / 2 - 100, y: canvas.height - 100, width: 200, height: 10, active: true};
	}
}

// メインループ
function draw() {
	if (!isRunning) { 
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "#fff";
		ctx.font = "bold 24px Arial";
		
		if (gameOver) {
			if (allCleared) {
				drawCenteredText("オールクリア！", canvas.height / 2 - 40);
				let minutes = Math.floor(finalTime / 60000);
				let seconds = Math.floor((finalTime % 60000) / 1000);
				let displayTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
				drawCenteredText("クリアタイム: " + displayTime, canvas.height / 2);
				drawCenteredText("スペースでリスタート", canvas.height / 2 + 40);
			} else {
				drawCenteredText("ゲームオーバー！", canvas.height / 2 - 40);
				drawCenteredText("最終スコア: " + finalScore, canvas.height / 2);
				drawCenteredText("スペースでリスタート", canvas.height / 2 + 40);
			}
		} else {
			drawCenteredText("スペースを押してスタート", canvas.height / 2);
		}
		
		requestAnimationFrame(draw);
		return;
	}
	
	elapsedTime = new Date().getTime() - startTime;
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	drawBricks();
	drawBall();
	drawPaddle();
	drawItems();
	updateItems();
	drawInfo();
	drawStageGate();
	collisionDetection();
	checkGateCollision();
	
	if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
		dx = -dx;
	}
	if (y + dy < ballRadius) {
		if (pierceMode) {
			pierceMode = false;
		} else {
			dy = -dy;
		}
	} else if (y + dy > canvas.height - ballRadius) {
		if (x > paddleX && x < paddleX + paddleWidth) {
			let paddleCenter = paddleX + paddleWidth / 2;
			let hitPos = (x - paddleCenter) / (paddleWidth / 2);
			let maxSpeed = 4;
			dx = hitPos * maxSpeed;
			dy = -Math.abs(dy);
		} else {
			isRunning = false;
			gameOver = true;
			finalScore = score;
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
	checkStageClear();
}

// 文字の中央寄せ
function drawCenteredText(text, y) {
	const textWidth = ctx.measureText(text).width;
	const x = (canvas.width - textWidth) / 2;
	ctx.fillText(text, x, y);
}

// スタート処理
function startGame() {
	resetGame();
	isRunning = true;
	startTime = new Date().getTime();
	draw();
}

draw();