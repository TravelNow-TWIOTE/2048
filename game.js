let size = 4;
let board = [];
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let prevState = null;
let theme = "classic";

document.getElementById("highScore").innerText = highScore;

function init() {
  board = Array(size).fill().map(() => Array(size).fill(0));
  score = 0;
  addTile();
  addTile();
  draw();
}

function draw() {
  const game = document.getElementById("game");
  game.innerHTML = "";
  game.style.gridTemplateColumns = `repeat(${size}, 80px)`;
  game.className = theme;

  board.forEach(row => {
    row.forEach(cell => {
      const div = document.createElement("div");
      div.className = "tile";
      if (cell) {
        div.innerText = cell;
        div.dataset.value = cell;
      }
      game.appendChild(div);
    });
  });

  document.getElementById("score").innerText = score;
}

function addTile() {
  let empty = [];
  board.forEach((row, r) => {
    row.forEach((cell, c) => {
      if (!cell) empty.push([r, c]);
    });
  });

  if (empty.length === 0) return;

  let [r, c] = empty[Math.floor(Math.random() * empty.length)];
  board[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function saveState() {
  prevState = {
    board: JSON.parse(JSON.stringify(board)),
    score: score
  };
}

function undo() {
  if (!prevState) return;
  board = prevState.board;
  score = prevState.score;
  draw();
}

function move(dir) {
  saveState();

  let rotated = rotateBoard(board, dir);
  let moved = false;

  rotated = rotated.map(row => {
    let newRow = row.filter(x => x);
    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        score += newRow[i];
        newRow[i + 1] = 0;
      }
    }
    newRow = newRow.filter(x => x);
    while (newRow.length < size) newRow.push(0);

    if (JSON.stringify(row) !== JSON.stringify(newRow)) moved = true;
    return newRow;
  });

  board = rotateBoard(rotated, (4 - dir) % 4);

  if (moved) {
    addTile();
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
      document.getElementById("highScore").innerText = highScore;
    }
  }

  draw();
}

function rotateBoard(b, times) {
  let newBoard = JSON.parse(JSON.stringify(b));
  for (let t = 0; t < times; t++) {
    newBoard = newBoard[0].map((_, i) => newBoard.map(row => row[i]).reverse());
  }
  return newBoard;
}

document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp") move(0);
  if (e.key === "ArrowRight") move(1);
  if (e.key === "ArrowDown") move(2);
  if (e.key === "ArrowLeft") move(3);
});

function changeSize() {
  size = parseInt(document.getElementById("sizeSelect").value);
  init();
}

function toggleShop() {
  document.getElementById("shop").classList.toggle("hidden");
}

function setTheme(t) {
  theme = t;
  draw();
}

init();
