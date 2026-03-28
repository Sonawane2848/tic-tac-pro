const board = document.getElementById("board");
const statusText = document.getElementById("status");

let cells = Array(9).fill("");
let currentPlayer = "X";
let gameActive = true;
let mode = "multi";

let xWins = 0;
let oWins = 0;

// Sounds
const clickSound = new Audio("https://www.soundjay.com/buttons/sounds/button-16.mp3");
const winSound = new Audio("https://www.zedge.net/notification-sounds/f218e179-a6b3-45eb-9975-20d84ff54a44");
const fireSound = new Audio("https://www.zedge.net/notification-sounds/5d862c4c-1115-3708-b17f-0c9ea3241d8e");

function setMode(selectedMode) {
  mode = selectedMode;
  restartGame();
}

function createBoard() {
  board.innerHTML = "";
  cells.forEach((_, index) => {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.addEventListener("click", () => handleMove(index));
    board.appendChild(cell);
  });
}

function handleMove(index) {
  if (!gameActive || cells[index] !== "") return;

  clickSound.play();
  makeMove(index);

  if (mode === "ai" && gameActive && currentPlayer === "O") {
    setTimeout(aiMove, 500);
  }
}

function makeMove(index) {
  cells[index] = currentPlayer;
  render();

  let winPattern = checkWinner();
  if (winPattern) {
    highlightWin(winPattern);
    statusText.textContent = `${currentPlayer} Wins!`;
    updateScore(currentPlayer);
    winSound.play();
    fireSound.play();
    celebrate();
    gameActive = false;
    return;
  }

  if (!cells.includes("")) {
    statusText.textContent = "Draw!";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.textContent = `Player ${currentPlayer}'s Turn`;
}

function render() {
  document.querySelectorAll(".cell").forEach((cell, i) => {
    cell.textContent = cells[i];
  });
}

function checkWinner() {
  const patterns = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for (let pattern of patterns) {
    const [a,b,c] = pattern;
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
      return pattern;
    }
  }
  return null;
}

function highlightWin(pattern) {
  const allCells = document.querySelectorAll(".cell");
  pattern.forEach(i => {
    allCells[i].classList.add("win");
  });
}

function aiMove() {
  let empty = cells
    .map((v, i) => v === "" ? i : null)
    .filter(v => v !== null);

  let move = empty[Math.floor(Math.random() * empty.length)];
  makeMove(move);
}

function updateScore(winner) {
  if (winner === "X") xWins++;
  else oWins++;

  document.getElementById("xWins").textContent = xWins;
  document.getElementById("oWins").textContent = oWins;
}

function celebrate() {
  confetti({
    particleCount: 200,
    spread: 120
  });
}

function restartGame() {
  cells = Array(9).fill("");
  currentPlayer = "X";
  gameActive = true;
  statusText.textContent = "Player X's Turn";
  createBoard();
}

function toggleTheme() {
  document.body.classList.toggle("dark");
}

// Init
createBoard();
statusText.textContent = "Player X's Turn";
