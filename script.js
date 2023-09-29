const dino = document.getElementById('dino');
const gameContainer = document.getElementById('game-container');
let isJumping = false;
let isGameOver = false;
let gameOverDisplayed = false;
let obstaclesPassed = false;
let obstaclesPassedScore = 0;

function jump() {
  if (!isJumping) {
    isJumping = true;
    jumpUp();
  }
}

function jumpUp() {
  let jumpHeight = 0;
  const jumpUpInterval = setInterval(() => {
    if (jumpHeight <= 100) {
      dino.style.bottom = jumpHeight + 'px';
      jumpHeight += 5;
    } else {
      clearInterval(jumpUpInterval);
      jumpDown();
    }
  }, 20);
}

function jumpDown() {
  let fallHeight = 100;
  const jumpDownInterval = setInterval(() => {
    if (fallHeight > 0) {
      dino.style.bottom = fallHeight + 'px';
      fallHeight -= 5;
    } else {
      dino.style.bottom = '0';
      isJumping = false;
      clearInterval(jumpDownInterval);
    }
  }, 20);
}

function startObstacleInterval() {
  setInterval(createObstacle, 2000);
}

function createObstacle() {
  if (gameOverDisplayed) {
    return;
  }

  const obstacle = document.createElement('div');
  obstacle.className = 'obstacle';
  obstacle.style.left = '500px';
  gameContainer.appendChild(obstacle);

  let obstaclePassed = false;

  function moveObstacle() {
    const obstacleLeft = parseInt(obstacle.style.left);
    if (obstacleLeft > -20) {
      obstacle.style.left = (obstacleLeft - 5) + 'px';
      if (checkCollision(dino, obstacle)) {
        clearInterval(moveObstacleInterval);
        document.removeEventListener('keydown', jump);
        showGameOver();
        return;
      }
      requestAnimationFrame(moveObstacle);
    } else {
      gameContainer.removeChild(obstacle);
      if (!obstaclePassed && obstacleLeft <= 0) {
        obstaclePassed = true;
        ++obstaclesPassedScore;
        if (obstaclesPassedScore > 0) {
          updateScore();
        }
      }
    }
  }

  const moveObstacleInterval = requestAnimationFrame(moveObstacle);
}

function updateScore() {
  const scoreElement = document.querySelector('.score');
  scoreElement.textContent = `Avoided Obstacles: ${obstaclesPassedScore}`;
}

function checkCollision(dino, obstacle) {
  const dinoRect = dino.getBoundingClientRect();
  const obstacleRect = obstacle.getBoundingClientRect();
  return (
    dinoRect.bottom >= obstacleRect.top &&
    dinoRect.right >= obstacleRect.left &&
    dinoRect.left <= obstacleRect.right
  );
}

function showGameOver() {
  if (!gameOverDisplayed) {
    gameOverDisplayed = true;
    const gameOverElement = document.createElement('div');
    gameOverElement.className = 'game-over';
    gameOverElement.textContent = `Game Over | Your score: ${obstaclesPassedScore}`;
    gameContainer.appendChild(gameOverElement);
  }
}

document.addEventListener('keydown', (event) => {
  if (event.key === " ") {
    jump();
  }
});

startObstacleInterval();