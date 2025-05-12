const container = document.getElementById("gameContainer");
const paddleLeft = document.getElementById("paddleLeft");
const paddleRight = document.getElementById("paddleRight");
const ball = document.getElementById("ball");
const startButton = document.getElementById("start-button");

let ballX = container.clientWidth / 2;
let ballY = container.clientHeight / 2;
let ballSpeedX = 4;
let ballSpeedY = 3;
let intervalId;

startButton.addEventListener("click", startGame);

function startGame() {
  resetBall();
  intervalId = setInterval(updateGame, 20);
}

function resetBall() {
  ballX = container.clientWidth / 2;
  ballY = container.clientHeight / 2;
  ballSpeedX = Math.random() > 0.5 ? 4 : -4;
  ballSpeedY = (Math.random() * 4 - 2);
}

// Mouse controls left paddle
container.addEventListener("mousemove", (e) => {
  const rect = container.getBoundingClientRect();
  let y = e.clientY - rect.top - paddleLeft.offsetHeight / 2;
  y = Math.max(0, Math.min(y, container.clientHeight - paddleLeft.offsetHeight));
  paddleLeft.style.top = y + "px";
});

function updateGame() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Bounce on top/bottom walls
  if (ballY <= 0 || ballY + ball.offsetHeight >= container.clientHeight) {
    ballSpeedY *= -1;
  }

  // Left paddle collision (Player)
  if (ballX <= paddleLeft.offsetWidth) {
    const paddleTop = paddleLeft.offsetTop;
    const paddleBottom = paddleTop + paddleLeft.offsetHeight;

    if (ballY + ball.offsetHeight >= paddleTop && ballY <= paddleBottom) {
      ballSpeedX *= -1;
    } else {
      alert("AI Wins!");
      clearInterval(intervalId);
    }
  }

  // Right paddle (AI follows ball)
  let targetY = ballY - paddleRight.offsetHeight / 2;
  targetY = Math.max(0, Math.min(targetY, container.clientHeight - paddleRight.offsetHeight));
  paddleRight.style.top = targetY + "px";

  // Right paddle collision (AI)
  if (ballX + ball.offsetWidth >= container.clientWidth - paddleRight.offsetWidth) {
    const paddleTop = paddleRight.offsetTop;
    const paddleBottom = paddleTop + paddleRight.offsetHeight;

    if (ballY + ball.offsetHeight >= paddleTop && ballY <= paddleBottom) {
      ballSpeedX *= -1;
    } else {
      alert("You Win!");
      clearInterval(intervalId);
    }
  }

  ball.style.left = ballX + "px";
  ball.style.top = ballY + "px";
}
