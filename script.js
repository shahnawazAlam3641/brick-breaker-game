const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");


const life = document.getElementById("lifeValue")
const score = document.getElementById("scoreValue")


const paddle = {
  width: 100,
  height: 10,
  x: canvas.width / 2 - 50,
  y: canvas.height - 20,
  speed: 8
};

const brickRowCount = 6;
const brickColumnCount = 12;
const brickWidth = 53;


const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let lives = 3;

let gameScore = 0;

function lifeUi() {
    life.innerHTML = lives
}

function scoreUi() {
    gameScore = gameScore + 10
    score.innerHTML = gameScore
}

const ball = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    dx: 5, // Ball's speed in the x-axis
    dy: -5, // Ball's speed in the y-axis
    radius: 10
  };

const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        if (bricks[c][r].status === 1) {
          const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
          const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
          ctx.beginPath();
          ctx.rect(brickX, brickY, brickWidth, brickHeight);
          ctx.fillStyle = "#d9534f";
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }

  function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  }
  
  function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
  

    // Collision with the bottom wall
  if (ball.y + ball.dy > canvas.height - ball.radius) {
    ball.dy = -ball.dy; // Reverse vertical direction
    lives--; // Decrement a life
    lifeUi() 
    if (lives === 0) {
      // Game over condition
      alert("Game Over!");
      document.location.reload(); // Reload the page to restart the game
    } else {
      // Reset the ball position when a life is lost
      ball.x = canvas.width / 2;
      ball.y = canvas.height - 30;
      ball.dx = 5; // Reset ball's horizontal speed
      ball.dy = -5; // Reset ball's vertical speed
      paddle.x = canvas.width / 2 - paddle.width / 2; // Reset paddle position
    }
  }

    // Collision with side walls (left and right)
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
      ball.dx = -ball.dx; // Reverse the horizontal direction
    }
  
    // Collision with top wall
    if (ball.y - ball.radius < 0) {
      ball.dy = -ball.dy; // Reverse the vertical direction
    }
  
    // Collision with the paddle
    if (
        ball.x + ball.radius > paddle.x &&
        ball.x - ball.radius < paddle.x + paddle.width &&
        ball.y + ball.radius > canvas.height - paddle.height
      ) {
        const paddleCenter = paddle.x + paddle.width / 2;
        const collidePoint = ball.x - paddleCenter;
    
        if (Math.abs(collidePoint) < paddle.width / 2) {
          if (collidePoint < 0) {
            ball.dx = -Math.abs(ball.dx); // Bounce to the left
          } else {
            ball.dx = Math.abs(ball.dx); // Bounce to the right
          }
          ball.dy = -Math.abs(ball.dy); // Bounce straight up
        }
      }
  
    // Collision with bricks
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        const brick = bricks[c][r];
        if (brick.status === 1) {
          if (
            ball.x > brick.x &&
            ball.x < brick.x + brickWidth &&
            ball.y > brick.y &&
            ball.y < brick.y + brickHeight
          ) {
            ball.dy = -ball.dy;
            brick.status = 0;
            scoreUi()
            // Mark the brick as broken (change its status)
            // Additional logic for scoring or other actions on hitting a brick
          }
        }
      }
    }
  
    // Game over logic
    if (ball.y + ball.dy > canvas.height) {
      // Game over or reset the ball
      // For instance, reset the ball's position:
      ball.x = canvas.width / 2;
      ball.y = canvas.height - 30;

      alert("you won!");
      document.location.reload();
    }
  }
  
  
  

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
canvas.addEventListener("touchstart", touchStartHandler, false);
canvas.addEventListener("touchmove", touchMoveHandler, false);

let rightPressed = false;
let leftPressed = false;
let touchX = null;

function keyDownHandler(event) {
  if (event.key === "Right" || event.key === "ArrowRight") {
    rightPressed = true;
  } else if (event.key === "Left" || event.key === "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(event) {
  if (event.key === "Right" || event.key === "ArrowRight") {
    rightPressed = false;
  } else if (event.key === "Left" || event.key === "ArrowLeft") {
    leftPressed = false;
  }
}

function touchStartHandler(event) {
  if (event.targetTouches.length === 1) {
    touchX = event.targetTouches[0].pageX;
  }
}

function touchMoveHandler(event) {
  if (event.targetTouches.length === 1 && touchX !== null) {
    const newTouchX = event.targetTouches[0].pageX;
    const touchDifference = newTouchX - touchX;
    paddle.x += touchDifference;
    touchX = newTouchX;
  }
}

function movePaddle() {
  if (rightPressed && paddle.x < canvas.width - paddle.width) {
    paddle.x += paddle.speed;
  } else if (leftPressed && paddle.x > 0) {
    paddle.x -= paddle.speed;
  }
}

function updateGame() {
  movePaddle();
  moveBall();
}

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPaddle();
  drawBall();
  drawBricks();
}

function isGameOver() {
    let totalBricks = 0;
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        if (bricks[c][r].status === 1) {
          totalBricks++;
        }
      }
    }
    return totalBricks === 0; // Game over if all bricks are destroyed
  }
  

  function gameLoop() {
    updateGame();
    drawGame();
    if (isGameOver()) {
      console.log("Game Over"); 
      return; // Exit the game loop
    }
    requestAnimationFrame(gameLoop);
  }
  

gameLoop(); // Start the game loop


