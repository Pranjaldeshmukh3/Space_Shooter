


let score = 0;
let lives = 3;
let bestScore = localStorage.getItem("bestScore") || 0;

const pointsEl = document.getElementById("points");
const livesEl = document.getElementById("lives");
const bestScoreEl = document.getElementById("best-score");
const board = document.getElementById("board");
const restartBtn = document.getElementById("restart-btn");
const gameContainer = document.getElementById("game-container");

let rockGenerator, rockMover;

document.getElementById("play-btn").addEventListener("click", () => {
  document.getElementById("welcome-screen").style.display = "none";
  document.getElementById("bg-video").style.display = "none";
  gameContainer.style.display = "flex";
  startGame();
});

restartBtn.addEventListener("click", restartGame);

const controlsBtn = document.getElementById("controls-btn");
const controlsMenu = document.getElementById("controls-menu");
const closeControlsBtn = document.getElementById("close-controls");

const welcomeHeading = document.querySelector("#welcome-content h1");
const playBtn = document.getElementById("play-btn");

controlsBtn.addEventListener("click", () => {
  // ✅ Show controls menu
  controlsMenu.style.display = "block";

  // ✅ Hide heading and Play/Controls buttons
  welcomeHeading.style.display = "none";
  playBtn.style.display = "none";
  controlsBtn.style.display = "none";
});

closeControlsBtn.addEventListener("click", () => {
  // ✅ Hide controls menu
  controlsMenu.style.display = "none";

  // ✅ Show heading and buttons again
  welcomeHeading.style.display = "block";
  playBtn.style.display = "block";
  controlsBtn.style.display = "block";
});

function updateScore() {
  pointsEl.innerHTML = "Score: " + score;
}

function updateLives() {
  livesEl.innerHTML = "Lives: " + lives;
}

function updateBestScore() {
  bestScoreEl.innerHTML = "Best: " + bestScore;
}

function startGame() {
  clearBoard();
  score = 0;
  lives = 3;
  updateScore();
  updateLives();
  updateBestScore();

  const jet = document.getElementById("jet");
  jet.style.left = "230px"; // Center jet

  function handleControls(e) {
    let left = parseInt(window.getComputedStyle(jet).getPropertyValue("left"));
    if (e.key === "ArrowLeft" && left > 0) {
      jet.style.left = left - 20 + "px";
    } else if (e.key === "ArrowRight" && left < 460) {
      jet.style.left = left + 20 + "px";
    }

    if (e.key === "ArrowUp" || e.keyCode === 32) {
      shootBullet(left + 15);
    }
  }

  window.addEventListener("keydown", handleControls);
   // Touch move support
  board.addEventListener("touchmove", function (e) {
  e.preventDefault();
  let touch = e.touches[0];
  let boardRect = board.getBoundingClientRect();
  let x = touch.clientX - boardRect.left;

  // Move jet relative to touch position
  let newLeft = x - jet.offsetWidth / 2;
  if (newLeft < 0) newLeft = 0;
  if (newLeft > board.offsetWidth - jet.offsetWidth) {
    newLeft = board.offsetWidth - jet.offsetWidth;
  }
  jet.style.left = newLeft + "px";
}, { passive: false });

// Tap to shoot
board.addEventListener("touchstart", function (e) {
  let left = parseInt(window.getComputedStyle(jet).getPropertyValue("left"));
  shootBullet(left + jet.offsetWidth / 2);
});


  rockGenerator = setInterval(() => {
    const rock = document.createElement("div");
    rock.classList.add("rocks");
    rock.style.left = Math.floor(Math.random() * 450) + "px";
    board.appendChild(rock);
  }, 1000);

  rockMover = setInterval(() => {
    const rocks = document.querySelectorAll(".rocks");
    rocks.forEach((rock) => {
      let rockTop = parseInt(window.getComputedStyle(rock).getPropertyValue("top"));
      rock.style.top = rockTop + 5 + "px";

      if (rockTop >= 450) {
        rock.remove();
      }

      const jetRect = jet.getBoundingClientRect();
      const rockRect = rock.getBoundingClientRect();

      if (
        !(rockRect.right < jetRect.left ||
          rockRect.left > jetRect.right ||
          rockRect.bottom < jetRect.top ||
          rockRect.top > jetRect.bottom)
      ) {
        rock.remove();
        lives--;
        updateLives();
        flashScreen();
        if (lives <= 0) {
          clearInterval(rockMover);
          clearInterval(rockGenerator);
          window.removeEventListener("keydown", handleControls);
          endGame();
        }
      }
    });
  }, 50);
}

function shootBullet(left) {
  const bullet = document.createElement("div");
  bullet.classList.add("bullets");
  bullet.style.left = left + "px";
  board.appendChild(bullet);

  const bulletInterval = setInterval(() => {
    let bulletBottom = parseInt(window.getComputedStyle(bullet).getPropertyValue("bottom"));
    bullet.style.bottom = bulletBottom + 10 + "px";

    const rocks = document.querySelectorAll(".rocks");
    rocks.forEach((rock) => {
      const rockRect = rock.getBoundingClientRect();
      const bulletRect = bullet.getBoundingClientRect();

      if (
        bulletRect.top <= rockRect.bottom &&
        bulletRect.left >= rockRect.left &&
        bulletRect.right <= rockRect.right
      ) {
        rock.remove();
        bullet.remove();
        clearInterval(bulletInterval);
        score++;
        updateScore();
        if (score > bestScore) {
          bestScore = score;
          localStorage.setItem("bestScore", bestScore);
          updateBestScore();
        }
      }
    });

    if (bulletBottom >= 500) {
      bullet.remove();
      clearInterval(bulletInterval);
    }
  }, 20);
}

function flashScreen() {
  board.classList.add("flash");
  setTimeout(() => board.classList.remove("flash"), 300);
}

function endGame() {
  restartBtn.style.display = "block";
}

function restartGame() {
  restartBtn.style.display = "none";
  startGame();
}

function clearBoard() {
  board.innerHTML = '<div id="jet"></div>';
}
