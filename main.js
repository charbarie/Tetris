import './style.css';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const BLOCK_SIZE = 20;
const BOARD_WIDTH = 14;
const BOARD_HEIGHT = 20;

canvas.width = BLOCK_SIZE * BOARD_WIDTH;
canvas.height = BLOCK_SIZE * BOARD_HEIGHT;
context.scale(BLOCK_SIZE, BLOCK_SIZE);

let score = 0

const board = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const piece = {
  position: { x: 5, y: 1 },
  shape: [
    [1, 1],
    [1, 1],
  ],
};

const PIECES = [

  [
    [1, 1],
    [1, 1],
  ],


  [
    [1],
    [1],
    [1],
  ],


  [
    [0, 1],
    [0, 1],
    [1, 1],
  ],


  [
    [1, 1, 1, 1],
  ],

  [
    [1, 1, 1],
    [0, 1, 0],
  ],


  [
    [1, 1, 0],
    [0, 1, 1],
  ],


  [
    [0, 1, 1],
    [1, 1, 0],
  ],


  [
    [1, 0],
    [1, 0],
    [1, 1],
  ],


  [
    [1, 0, 1],
    [1, 1, 1],
  ],


  [
    [1, 1, 0],
    [0, 1, 1],
  ],


  [
    [0, 1, 1],
    [1, 1, 0],
  ],
];
let pause = false;

function stop() {
  pause = !pause;
}

let dropCounter = 0;
let lastTime = 0;

function update(time = 0) {
  const deltaTime = time - lastTime;
  lastTime = time;

  if (!pause) {
    dropCounter += deltaTime * 4;

    if (dropCounter > 1000) {
      piece.position.y++;
      dropCounter = 0;

      if (checkCollision()) {
        piece.position.y--;
        solidifyPiece();
        RemoveRows();
      }
    }
  }

  draw();
  window.requestAnimationFrame(update);
}


document.addEventListener('keydown', (event) => {
  if ((event.key === 'p' || event.key === 'P') || event.key === 'P') {
    stop();
  }
});

const pauseButton = document.getElementById('pauseButton');
pauseButton.addEventListener('click', stop);

window.requestAnimationFrame(update);

function draw() {
  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);
  board.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        context.fillStyle = 'red';
        context.fillRect(x, y, 1, 1,);
      }
    });
  });
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        context.fillStyle = 'blue';
        context.fillRect(x + piece.position.x, y + piece.position.y, 1, 1);
      }
    });
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'a') {
    piece.position.x--;
    if (checkCollision()) {
      piece.position.x++;
    }
  }
  if (e.key === 'ArrowRight' || e.key === 'd') {
    piece.position.x++;
    if (checkCollision()) {
      piece.position.x--;
    }
  }

  if (e.key === 'ArrowDown' || e.key === 's') {
    piece.position.y++;
    if (checkCollision()) {
      piece.position.y--;
      solidifyPiece();
      RemoveRows();
    }
  }

  if (e.key === 'ArrowUp' || e.key === 'w') {
    const rotated = [];
    for (let i = 0; i < piece.shape[0].length; i++) {
      const row = [];
      for (let j = piece.shape.length - 1; j >= 0; j--) {
        row.push(piece.shape[j][i]);
      }
      rotated.push(row);
    }
    piece.shape = rotated;
  }
});

function checkCollision() {
  return piece.shape.find((row, y) => {
    return row.find((value, x) => {
      return value !== 0 && board[y + piece.position.y]?.[x + piece.position.x] !== 0;
    });
  });
}

function solidifyPiece() {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value === 1) {
        board[y + piece.position.y][x + piece.position.x] = 1;
      }
    });
  });
  piece.shape = PIECES[Math.floor(Math.random() * PIECES.length)]
  piece.position.x = 5
  piece.position.y = 0
  if (checkCollision()) {
    window.alert("perdiste perro")
    board.forEach((row) => row.fill(0))
    score = 0;
    updateScoreDisplay();

  }
}

let updateScore = (score) => {
  return score + 10;
}

function RemoveRows() {
  const RowsToRemove = [];
  board.forEach((row, y) => {
    if (row.every(value => value === 1)) {
      score = updateScore(score);
      RowsToRemove.push(y);
      updateScoreDisplay();
    }
  });

  RowsToRemove.forEach(y => {
    board.splice(y, 1);
    const newRow = Array(BOARD_WIDTH).fill(0);
    board.unshift(newRow);
  });
}
function updateScoreDisplay() {
  const scoreElement = document.getElementById('score');
  scoreElement.textContent = score;
}
update();