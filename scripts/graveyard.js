const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");

// <canvas id="canvas" width="600" height="600"></canvas>

// emptyCell(colIndex, rowIndex) {
// ctx.beginPath();
// ctx.rect(this.size * rowIndex, this.size * colIndex, this.size, this.size);
// ctx.fillStyle = "#fff";
// ctx.fill();
// ctx.strokeStyle = "#000";
// ctx.stroke();
// ctx.closePath();
// }

// fillCell(colIndex, rowIndex) {
// ctx.beginPath();
// ctx.rect(this.size * rowIndex, this.size * colIndex, this.size, this.size);
// ctx.fillStyle = "#000";
// ctx.fill();
// ctx.strokeStyle = "#fff";
// ctx.stroke();
// ctx.closePath();
// }

// function createGrid(cols, rows) {
//     const grid = [];
//     for (let c = 0; c < cols; c++) {
//         grid[c] = [];
//         for (let r = 0; r < rows; r++) {
//             const cell = new Cell();
//             grid[c][r] = cell;

// example of targetting cell
// if (c === 1 && r === 1) {
//     cell.filled = true;
// }

// if (c >= gameBoard.rows / 2) {
//     cell.filled = true;
// }

// if (c === gameBoard.cols - 2 && r === gameBoard.cols - 2) {
//     cell.filled = false;
// }


//draw grid
// fill all selected cells
// if (cell.filled) {
//     cell.fillCell(c, r);
// } else {
//     cell.emptyCell(c, r);
// }

//         }
//     }
//     return grid;
// }

// setInterval(createGrid, 10);
// const gameGrid = createGrid(gameBoard.cols, gameBoard.rows);

// function drawGrid() {
// ctx.beginPath();
// ctx.rect();
// }