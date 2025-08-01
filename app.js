const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const speedSelect = document.getElementById("speed");
const pauseBtn = document.getElementById("pauseBtn");
const scoreDisplay = document.getElementById("scoreDisplay");
const warningBox = document.getElementById("warningBox");
const beepSound = document.getElementById("beepSound");

const box = 20;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

let snake, direction, food, score;
let gameInterval;
let isPaused = false;

function initGame() {
  snake = [{ x: 200, y: 200 }];
  direction = null;
  food = spawnFood();
  score = 0;
  updateScore();
  hideWarning();
}

function spawnFood() {
  return {
    x: Math.floor(Math.random() * (canvasWidth / box)) * box,
    y: Math.floor(Math.random() * (canvasHeight / box)) * box,
  };
}

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  else if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (e.key === " " || e.key === "p" || e.key === "P") togglePause();
});

function draw() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Ilonni chizish: bosh ko‘k, tana havorang
  snake.forEach((segment, i) => {
    ctx.fillStyle = i === 0 ? "blue" : "skyblue";
    ctx.beginPath();
    ctx.arc(segment.x + box / 2, segment.y + box / 2, box / 2.2, 0, Math.PI * 2);
    ctx.fill();
  });

  // Ovqatni chizish (katta dumaloq)
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(food.x + box / 2, food.y + box / 2, box * 0.8, 0, 2 * Math.PI);
  ctx.fill();

  // Harakat qilish
  const head = { ...snake[0] };
  if (direction === "UP") head.y -= box;
  else if (direction === "DOWN") head.y += box;
  else if (direction === "LEFT") head.x -= box;
  else if (direction === "RIGHT") head.x += box;

  // Devordan chiqib qarshi tomondan kirish
  if (head.x < 0) head.x = canvasWidth - box;
  else if (head.x >= canvasWidth) head.x = 0;
  if (head.y < 0) head.y = canvasHeight - box;
  else if (head.y >= canvasHeight) head.y = 0;

  // O‘ziga tegishni tekshirish, ammo o‘yin tugamaydi
  if (snake.some((seg, idx) => idx !== 0 && seg.x === head.x && seg.y === head.y)) {
    showWarning("⚠️ Ilon o‘zini bosib o‘tdi!");
    beepSound.play();
  } else {
    hideWarning();
  }

  // Ovqatni yesa, uzunligi oshadi va ball ortadi
  if (head.x === food.x && head.y === food.y) {
    snake.unshift(head);
    food = spawnFood();
    score++;
    updateScore();
  } else {
    snake.pop();
    snake.unshift(head);
  }
}

function startGame() {
  clearInterval(gameInterval);
  const speed = parseInt(speedSelect.value);
  gameInterval = setInterval(() => {
    if (!isPaused) draw();
  }, speed);
}

function restartGame() {
  initGame();
  isPaused = false;
  pauseBtn.textContent = "⏸ Pauza";
  startGame();
}

function togglePause() {
  isPaused = !isPaused;
  pauseBtn.textContent = isPaused ? "▶ Davom ettir" : "⏸ Pauza";
  if (isPaused) {
    showWarning(`⏸ O‘yin to‘xtatilgan. Ball: ${score}`);
  } else {
    hideWarning();
  }
}

function updateScore() {
  scoreDisplay.textContent = `Ball: ${score}`;
}

function showWarning(message) {
  warningBox.textContent = message;
  warningBox.style.opacity = "1";
  clearTimeout(warningBox.timeout);
  warningBox.timeout = setTimeout(() => {
    warningBox.style.opacity = "0";
  }, 2000);
}

function hideWarning() {
  warningBox.style.opacity = "0";
}

initGame();
startGame();
