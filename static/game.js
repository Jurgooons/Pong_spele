// mainīgie no html
const container = document.getElementById("gameContainer");
const paddleLeft = document.getElementById("paddleLeft");
const paddleRight = document.getElementById("paddleRight");
const ball = document.getElementById("ball");
const startButton = document.getElementById("start-button");

// mainīgie spēles sākumam
let ballX = container.clientWidth / 2;
let ballY = container.clientHeight / 2;
let ballSpeedX = 4;
let ballSpeedY = 3;
let intervalId;
let playerHits = 0;

// punktu skaitītājam iestatijui
const hitCounter = document.createElement("div");
hitCounter.id = "hitCounter";
hitCounter.style.position = "absolute";
hitCounter.style.top = "10px";
hitCounter.style.left = "10px";
hitCounter.style.color = "white";
hitCounter.style.fontSize = "20px";
hitCounter.style.zIndex = "1000";
hitCounter.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
hitCounter.style.padding = "5px 10px";
hitCounter.style.borderRadius = "5px";
hitCounter.textContent = "Hits: 0";
document.body.appendChild(hitCounter);

// poga lai sāktu spēli
startButton.addEventListener("click", startGame);


//palaiž spēli
function startGame() {
  playerHits = 0;
  hitCounter.textContent = "Hits: 0";
  resetBall();
  intervalId = setInterval(updateGame, 20);
}

// pēc spēles novieto bumbu atpakaļ centrā
function resetBall() {
  ballX = container.clientWidth / 2;
  ballY = container.clientHeight / 2;
  ballSpeedX = Math.random() > 0.5 ? 4 : -4;
  ballSpeedY = (Math.random() * 4 - 2);
}

// kontrolē lāpstiņu ar peli
container.addEventListener("mousemove", (e) => {
  const rect = container.getBoundingClientRect();
  let y = e.clientY - rect.top - paddleLeft.offsetHeight / 2;
  y = Math.max(0, Math.min(y, container.clientHeight - paddleLeft.offsetHeight));
  paddleLeft.style.top = y + "px";
});


//spēles fizika
function updateGame() {

  // bumbas kustība
  ballX += ballSpeedX;
  ballY += ballSpeedY;


  // atsisties no augšējās un apakšejās malas
  if (ballY <= 0 || ballY + ball.offsetHeight >= container.clientHeight) {
    ballSpeedY *= -1;
  }

 // atsisties no lāpstiņas
  if (ballX <= paddleLeft.offsetWidth) {
    const paddleTop = paddleLeft.offsetTop;
    const paddleBottom = paddleTop + paddleLeft.offsetHeight;
//paliek ātrāka bumba kad atsitas pret lāpstiņu
    if (ballY + ball.offsetHeight >= paddleTop && ballY <= paddleBottom) {
      ballSpeedX *= -1.1;
      ballSpeedY *= 1.1;
      const maxSpeed = 15;
      ballSpeedX = Math.max(-maxSpeed, Math.min(maxSpeed, ballSpeedX));
      ballSpeedY = Math.max(-maxSpeed, Math.min(maxSpeed, ballSpeedY));
      playerHits++;
      hitCounter.textContent = "Hits: " + playerHits;
    } else {
      alert("AI Wins!");
      const username = document.getElementById("username").value.trim();
      submitScore(username || "Unknown", playerHits);
      clearInterval(intervalId);
    }
  }

// "AI" seko bumbai visu laiku ar lapstinas centru
  let targetY = ballY - paddleRight.offsetHeight / 2;
  targetY = Math.max(0, Math.min(targetY, container.clientHeight - paddleRight.offsetHeight));
  paddleRight.style.top = targetY + "px";

 // kad saduras ar "ai" lāpstiņu
  if (ballX + ball.offsetWidth >= container.clientWidth - paddleRight.offsetWidth) {
    const paddleTop = paddleRight.offsetTop;
    const paddleBottom = paddleTop + paddleRight.offsetHeight;

    if (ballY + ball.offsetHeight >= paddleTop && ballY <= paddleBottom) {
      ballSpeedX *= -1.1;
      ballSpeedY *= 1.1;
      const maxSpeed = 15;
      ballSpeedX = Math.max(-maxSpeed, Math.min(maxSpeed, ballSpeedX));
      ballSpeedY = Math.max(-maxSpeed, Math.min(maxSpeed, ballSpeedY));
    } else {
      alert("You Win!");
      const username = document.getElementById("username").value.trim();
      submitScore(username || "Unknown", playerHits);
      clearInterval(intervalId);
    }
  }
//bumbas kustība
  ball.style.left = ballX + "px";
  ball.style.top = ballY + "px";
}


function submitScore(username, hits) { // Nostua punktus un lietotajvardu
  fetch('/submit-score', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, hits })
  })
  .then(response => {
    if (!response.ok) {
      alert("Kļūda sūtot rezultātu uz serveri.");
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}