const BOARD_SIZE = 15;
let board = [];
let currentPlayer = '黑棋';
let gameOver = false;
let movesStack = [];
let gameMode = 'pvp'; // 'pvp' 為雙人對戰，'ai' 為 AI 對戰

const boardDiv = document.getElementById('board');
const undoBtn = document.getElementById('undoBtn');
const restartBtn = document.getElementById('restartBtn');
const modeRadios = document.getElementsByName('mode');

function initBoard() {
  board = Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(''));
  boardDiv.innerHTML = '';
  // 建立棋盤格子
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = i;
      cell.dataset.col = j;
      cell.addEventListener('click', onCellClick);
      boardDiv.appendChild(cell);
    }
  }
  currentPlayer = '黑棋';
  gameOver = false;
  movesStack = [];
}

function onCellClick(e) {
  if (gameOver) return;
  const row = Number(e.currentTarget.dataset.row);
  const col = Number(e.currentTarget.dataset.col);
  if (board[row][col] !== '') return;

  makeMove(row, col, currentPlayer);
  if (checkWin(row, col, currentPlayer)) {
    highlightWin(row, col, currentPlayer);
    alert(`玩家 ${currentPlayer} 獲勝！請重新開始棋局。`);
    gameOver = true;
    return;
  }
  switchPlayer();

  // 若為 AI 模式且輪到 AI 下棋
  if (gameMode === 'ai' && currentPlayer === '白棋' && !gameOver) {
    aiMove();
  }
}

function makeMove(row, col, player) {
  board[row][col] = player;
  movesStack.push({ row, col, player });
  updateCell(row, col, player);
}

function updateCell(row, col, player) {
  const index = row * BOARD_SIZE + col;
  const cell = boardDiv.children[index];
  if (player === '黑棋') {
    cell.innerHTML = `<svg width="100%" height="100%" viewBox="0 0 100 100" class="chess-piece"><circle cx="50" cy="50" r="40" fill="black" /></svg>`;
  } else {
    cell.innerHTML = `<svg width="100%" height="100%" viewBox="0 0 100 100" class="chess-piece"><circle cx="50" cy="50" r="40" fill="white" stroke="black" stroke-width="5" /></svg>`;
  }
}

function switchPlayer() {
  currentPlayer = currentPlayer === '黑棋' ? '白棋' : '黑棋';
}

function checkWin(row, col, player) {
  // 檢查水平方向、垂直方向及兩個對角線
  return (
    countConsecutive(row, col, player, 0, 1) + countConsecutive(row, col, player, 0, -1) - 1 >= 5 ||
    countConsecutive(row, col, player, 1, 0) + countConsecutive(row, col, player, -1, 0) - 1 >= 5 ||
    countConsecutive(row, col, player, 1, 1) + countConsecutive(row, col, player, -1, -1) - 1 >= 5 ||
    countConsecutive(row, col, player, 1, -1) + countConsecutive(row, col, player, -1, 1) - 1 >= 5
  );
}

function countConsecutive(row, col, player, deltaRow, deltaCol) {
  let count = 0;
  let r = row, c = col;
  while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
    count++;
    r += deltaRow;
    c += deltaCol;
  }
  return count;
}

function highlightWin(row, col, player) {
  // 將獲勝者的連線高亮顯示 (此處僅作簡單提示，可擴充實作以高亮所有五子)
  const index = row * BOARD_SIZE + col;
  const cell = boardDiv.children[index];
  cell.style.backgroundColor = "#ff0";
}

function undo() {
  if (movesStack.length === 0 || gameOver) return;
  // 撤銷上一步
  const lastMove = movesStack.pop();
  board[lastMove.row][lastMove.col] = '';
  const index = lastMove.row * BOARD_SIZE + lastMove.col;
  const cell = boardDiv.children[index];
  cell.innerHTML = '';
  gameOver = false;
  currentPlayer = lastMove.player;
}

function restart() {
  if (confirm("確定要重新開始棋局嗎？")) {
    initBoard();
  }
}

function aiMove() {
  let emptyCells = [];
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      if (board[i][j] === '') {
        emptyCells.push({ i, j });
      }
    }
  }
  if (emptyCells.length === 0) return;

  // 先檢查是否有直接能贏棋的著法
  for (const move of emptyCells) {
    board[move.i][move.j] = currentPlayer;
    if (checkWin(move.i, move.j, currentPlayer)) {
      board[move.i][move.j] = '';
      makeMove(move.i, move.j, currentPlayer);
      if (checkWin(move.i, move.j, currentPlayer)) {
        highlightWin(move.i, move.j, currentPlayer);
        alert(`玩家 ${currentPlayer} 獲勝！請重新開始棋局。`);
        gameOver = true;
        return;
      }
      switchPlayer();
      return;
    }
    board[move.i][move.j] = '';
  }

  let opponent = currentPlayer === '黑棋' ? '白棋' : '黑棋';
  // 檢查是否需要阻擋對手的必勝著法
  for (const move of emptyCells) {
    board[move.i][move.j] = opponent;
    if (checkWin(move.i, move.j, opponent)) {
      board[move.i][move.j] = '';
      makeMove(move.i, move.j, currentPlayer);
      switchPlayer();
      return;
    }
    board[move.i][move.j] = '';
  }

  // 評估所有候選著法，並考慮鄰近棋子的加成
  let bestScore = -Infinity;
  let bestMoves = [];
  for (const move of emptyCells) {
    let scoreForMe = evaluateMove(move.i, move.j, currentPlayer);
    let scoreForOpponent = evaluateMove(move.i, move.j, opponent);
    let neighborBonus = hasNeighbor(move.i, move.j) ? 1 : 0;
    let score = scoreForMe - scoreForOpponent * 0.8 + neighborBonus;
    if (score > bestScore) {
      bestScore = score;
      bestMoves = [move];
    } else if (score === bestScore) {
      bestMoves.push(move);
    }
  }
  const chosenMove = bestMoves[Math.floor(Math.random() * bestMoves.length)];
  makeMove(chosenMove.i, chosenMove.j, currentPlayer);
  if (checkWin(chosenMove.i, chosenMove.j, currentPlayer)) {
    highlightWin(chosenMove.i, chosenMove.j, currentPlayer);
    alert(`玩家 ${currentPlayer} 獲勝！請重新開始棋局。`);
    gameOver = true;
    return;
  }
  switchPlayer();
}

function evaluateMove(row, col, player) {
  // 暫時下子後評估此處的連線數量，再恢復原狀
  board[row][col] = player;
  let maxLine = Math.max(
    countConsecutive(row, col, player, 0, 1) + countConsecutive(row, col, player, 0, -1) - 1,
    countConsecutive(row, col, player, 1, 0) + countConsecutive(row, col, player, -1, 0) - 1,
    countConsecutive(row, col, player, 1, 1) + countConsecutive(row, col, player, -1, -1) - 1,
    countConsecutive(row, col, player, 1, -1) + countConsecutive(row, col, player, -1, 1) - 1
  );
  board[row][col] = '';
  return maxLine;
}

function hasNeighbor(row, col) {
  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      if (i < 0 || i >= BOARD_SIZE || j < 0 || j >= BOARD_SIZE) continue;
      if (board[i][j] !== '') return true;
    }
  }
  return false;
}

undoBtn.addEventListener('click', undo);
restartBtn.addEventListener('click', restart);
modeRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    gameMode = document.querySelector('input[name="mode"]:checked').value;
    restart();
  });
});

// 初始化遊戲
initBoard();
