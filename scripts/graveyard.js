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

// for (let i = 0; i < (grid.cols * grid.rows); i++) {

// }

// function drawMap() {
//     gameBoard.innerHTML = '';
//     drawPlayer();
//     drawFood();
// }

// function drawPlayer() {
//     player.forEach((segment) => {
//         const playerElem = createGameElem('div', 'player1');
//         setPos(playerElem, segment);
//         gameBoard.appendChild(playerElem);
//     })
// }

// function createGameElem(tag, className) {
//     const elem = document.createElement(tag);
//     elem.className = className;
//     return elem;
// }

// function drawFood() {
//     const foodElem = createGameElem('div', 'player2');
//     setPos(foodElem, food);
//     gameBoard.appendChild(foodElem);
// }

// function generateFood() {
//     const x = Math.floor(Math.random() * mapSize) + 1;
//     const y = Math.floor(Math.random() * mapSize) + 1;
//     return { x, y };
// }

// drawMap();

// moveRight() {
//     if (this.x < grid.cols) {
//         this.x = this.x + 1;
//         console.log(this.x);
//         setPos(this.elem, this);
//     }
// }

// moveUp() {
//     console.log(this.y);
//     if (this.y > 1) {
//         this.y = this.y - 1;
//         drawPlayer(this);
//         // setPos(this.elem, this);
//     }
// }

// if (event.key === "ArrowLeft") {
//     console.log("I werk");

//     player2.moveLeft();
// } else if (event.key === "ArrowRight") {
//     player2.moveRight();
// } else if (event.key === "ArrowDown") {
//     player2.moveDown();
// } else if (event.key === "ArrowUp") {
//     player2.moveUp();
// }

// } else if (r === (player2.y) && c === (player2.x)) {
//     gridArray[r][c].elem.innerHTML = player2.svg;
//     player2.elem = gridArray[r][c].elem;
//     player2.elem.classList.add('player2');
// }
