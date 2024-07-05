const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");


// const mapSize = 20;
// let player = [{ x: 10, y: 10 }];
// let food = generateFood();

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


// function drawBullet(player, direction, x, y) {
//     // grab parent div and create mini grid
//     bullet = new Bullet();
//     bullet.elem.remove();
//     bullet.elem = createCell('div', bullet.type);
//     gridArray[bullet.y - 1][bullet.x - 1].elem.appendChild(bullet.elem);
// }
// if (player === "whtPlayer") {
//     this.elem.classList.add('whtBulletLeft');
//     setTimeout(() => {
//         this.elem.classList.remove('whtBulletLeft');
//     }, 1000);
// }

//css
/* .player1 {
    position: absolute;
    background-color: #000;
    z-index: 10;
    grid-column: 2/3;
    grid-row: 2/3;
} */

/* .player2 {
    position: absolute;
    background-color: #777;
    z-index: 10;

    grid-column: 3/4;
    grid-row: 3/4;
} */

// class Bullet {
//     constructor(type, x, y) {
//         this.type = type;
//         this.x = x;
//         this.y = y;
//         this.elem = document.createElement('span');
//     }
// };

// function setPos(elem, pos) {
//     elem.style.gridColumn = pos.x;
//     elem.style.gridRow = pos.y;
// }

    // // add variability to grid size
    // // gameBoard.style.gridTemplateColumns = `repeat(${grid.cols}, ${grid.width / grid.cols}px`;
    // gameBoard.style.gridTemplateColumns = `repeat(${grid.cols}, ${cellSize}px`;
    // // gameBoard.style.gridTemplateRows = `repeat(${grid.rows}, ${grid.height / grid.rows}px`;
    // gameBoard.style.gridTemplateRows = `repeat(${grid.rows}, ${cellSize}px`;
    
    // boardWidth = gameBoard.offsetWidth;
    // boardHeight = gameBoard.offsetHeight;
    
// let boardWidth;
// let boardHeight;

	/* grid-template-columns: repeat(20, 1fr);
	grid-template-rows: repeat(20, 1fr); */

    // function clipCheck(player) {
    //     if (player.clip > 0) {
    //         return true;
    //     } else {
    //         return false
    //     }
    // }
    
        // for (let i = 0; i < clipElems.length; i++) {
        //     const elem = clipElems[i];
        //     if (player.clip === clipSize - 1) {
        //         if (i === clipSize - 2) {
        //             elem.classList.remove('player1-bullet-in-clip');
        //             elem.classList.add('player1-no-bullet-in-clip');
        //         }
        //     }
        //     if (player.clip === clipSize - 2) {
        //         if (i < clipSize - 2) {
        //             elem.classList.remove('player1-bullet-in-clip');
        //             elem.classList.add('player1-no-bullet-in-clip');
        //         }
        //     }
        //     if (player.clip === clipSize - 3) {
        //         if (i < clipSize - 3) {
        //             elem.classList.remove('player1-bullet-in-clip');
        //             elem.classList.add('player1-no-bullet-in-clip');
        //         }
        //     }
        //     if (player.clip === clipSize - 4) {
        //         if (i < clipSize - 4) {
        //             elem.classList.remove('player1-bullet-in-clip');
        //             elem.classList.add('player1-no-bullet-in-clip');
        //         }
        //     }
        //     if (player.clip === clipSize - 5) {
        //         if (i < clipSize - 5) {
        //             elem.classList.remove('player1-bullet-in-clip');
        //             elem.classList.add('player1-no-bullet-in-clip');
        //         }
        //     }
        // }
// bullet-${i + 1}
// function getGameOptions() {
//     let gridChoice;
//     let colourChoice;
//     let gridSelected = false;

//     const gridOptionBtns = document.querySelectorAll('.grid-checkbox');

//     gridOptionBtns.forEach((btn) => {
//         btn.addEventListener('click', () => {
//             gridSelected = true;
//         });
//     });
// }


        // if (player1.clip === clipSize) {
        //     player1ClipElems[0].classList.remove('player1-no-bullet-in-clip');
        //     player1ClipElems[0].classList.add('player1-bullet-in-clip');
        // } else if (player1.clip === clipSize - 1) {
        //     player1ClipElems[0].classList.remove('player1-bullet-in-clip');
        //     player1ClipElems[0].classList.add('player1-no-bullet-in-clip');            
        //     player1ClipElems[1].classList.remove('player1-no-bullet-in-clip');
        //     player1ClipElems[1].classList.add('player1-bullet-in-clip');
        // } else if (player1.clip === clipSize - 2) {
        //     player1ClipElems[1].classList.remove('player1-bullet-in-clip');
        //     player1ClipElems[1].classList.add('player1-no-bullet-in-clip');            
        //     player1ClipElems[2].classList.remove('player1-no-bullet-in-clip');
        //     player1ClipElems[2].classList.add('player1-bullet-in-clip');
        // } else if (player1.clip === clipSize - 3) {
        //     player1ClipElems[2].classList.remove('player1-bullet-in-clip');
        //     player1ClipElems[2].classList.add('player1-no-bullet-in-clip');            
        //     player1ClipElems[3].classList.remove('player1-no-bullet-in-clip');
        //     player1ClipElems[3].classList.add('player1-bullet-in-clip');
        // } else if (player1.clip === clipSize - 4) {
        //     player1ClipElems[3].classList.remove('player1-bullet-in-clip');
        //     player1ClipElems[3].classList.add('player1-no-bullet-in-clip');            
        //     player1ClipElems[4].classList.remove('player1-no-bullet-in-clip');
        //     player1ClipElems[4].classList.add('player1-bullet-in-clip');
        // } else if (player1.clip === clipSize - 5) {
        //     player1ClipElems[4].classList.remove('player1-bullet-in-clip');
        //     player1ClipElems[4].classList.add('player1-no-bullet-in-clip');            
        //     player1ClipElems[5].classList.remove('player1-no-bullet-in-clip');
        //     player1ClipElems[5].classList.add('player1-bullet-in-clip');
        // } else if (player1.clip === clipSize - 6) {
        //     player1ClipElems[5].classList.remove('player1-bullet-in-clip');
        //     player1ClipElems[5].classList.add('player1-no-bullet-in-clip');            
        // }
    //     if (player2.clip === clipSize) {
    //         player2ClipElems[0].classList.remove('player2-no-bullet-in-clip');
    //         player2ClipElems[0].classList.add('player2-bullet-in-clip');
    //     } else if (player2.clip === clipSize - 1) {
    //         player2ClipElems[0].classList.remove('player2-bullet-in-clip');
    //         player2ClipElems[0].classList.add('player2-no-bullet-in-clip');            
    //         player2ClipElems[1].classList.remove('player2-no-bullet-in-clip');
    //         player2ClipElems[1].classList.add('player2-bullet-in-clip');
    //     } else if (player2.clip === clipSize - 2) {
    //         player2ClipElems[1].classList.remove('player2-bullet-in-clip');
    //         player2ClipElems[1].classList.add('player2-no-bullet-in-clip');            
    //         player2ClipElems[2].classList.remove('player2-no-bullet-in-clip');
    //         player2ClipElems[2].classList.add('player2-bullet-in-clip');
    //     } else if (player2.clip === clipSize - 3) {
    //         player2ClipElems[2].classList.remove('player2-bullet-in-clip');
    //         player2ClipElems[2].classList.add('player2-no-bullet-in-clip');            
    //         player2ClipElems[3].classList.remove('player2-no-bullet-in-clip');
    //         player2ClipElems[3].classList.add('player2-bullet-in-clip');
    //     } else if (player2.clip === clipSize - 4) {
    //         player2ClipElems[3].classList.remove('player2-bullet-in-clip');
    //         player2ClipElems[3].classList.add('player2-no-bullet-in-clip');            
    //         player2ClipElems[4].classList.remove('player2-no-bullet-in-clip');
    //         player2ClipElems[4].classList.add('player2-bullet-in-clip');
    //     } else if (player2.clip === clipSize - 5) {
    //         player2ClipElems[4].classList.remove('player2-bullet-in-clip');
    //         player2ClipElems[4].classList.add('player2-no-bullet-in-clip');            
    //         player2ClipElems[5].classList.remove('player2-no-bullet-in-clip');
    //         player2ClipElems[5].classList.add('player2-bullet-in-clip');
    //     } else if (player2.clip === clipSize - 6) {
    //         player2ClipElems[5].classList.remove('player2-bullet-in-clip');
    //         player2ClipElems[5].classList.add('player2-no-bullet-in-clip');            
    //     }
    // }, 100);