"use strict";

const startScrn = document.getElementById('start-screen');
const howScrn = document.getElementById('how-screen');
const gameScreen = document.getElementById('game-screen');
const gameBoard = document.getElementById('gameboard');
const player1Clip = document.getElementById('player1-clip');
const player2Clip = document.getElementById('player2-clip');
const startBtn = document.querySelector('.start-btn');
const howBtn = document.querySelector('.how-btn');
const gridArray = [];
let player1;
let player2;
let grid;
let clipReload;
const clipSize = 6;
const bulletSpeed = 40; // higher is sloweeeer
const cellSize = 40; // read as px


class Board {
    constructor(cols, rows) {
        this.cols = cols;
        this.rows = rows;
        this.width = cols * cellSize;
        this.height = rows * cellSize;
        this.gameOver = false;
    }
}

class Player {
    constructor(name, x, y, svg) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.clip = clipSize;
        this.svg = svg;
        this.elem = document.createElement('span');
    }

    moveLeft() {
        this.x = this.x - 1;
        drawPlayer(this);
    }

    moveRight() {
        this.x = this.x + 1;
        drawPlayer(this);
    }

    moveDown() {
        this.y = this.y + 1;
        drawPlayer(this);
    }

    moveUp() {
        this.y = this.y - 1;
        drawPlayer(this);
    }

    shootLeft() {
        if (this.clip > 0) {
            createBullet(this, "left");
        }
    }

    shootRight() {
        if (this.clip > 0) {
            createBullet(this, "right");
        }
    }

    shootDown() {
        if (this.clip > 0) {
            createBullet(this, "down");
        }
    }

    shootUp() {
        if (this.clip > 0) {
            createBullet(this, "up");
        }
    }

    die() {
        clearInterval(clipReload);
        grid.gameOver = true;
        endGame(this);
    }
}

class Cell {
    constructor() {
        this.flipped = false;
        this.elem;
    }

    flip() {
        if (!this.flipped) {
            this.elem.classList.add('flipped');
            this.flipped = true;

        } else if (this.flipped) {
            this.elem.classList.remove('flipped');
            this.flipped = false;
        }
    }

    drawBullet(player, axis) {
        if (axis === "x") {
            if (player === "blkPlayer") {
                const bulletElem = createCell('div', 'blkBulletX');
                this.elem.appendChild(bulletElem);
    
                setTimeout(() => {
                    const cellChild = this.elem.querySelector(".blkBulletX");
                    cellChild.remove();
                }, 500);
    
            } else if (player === "whtPlayer") {
                const bulletElem = createCell('div', 'whtBulletX');
                this.elem.appendChild(bulletElem);
    
                setTimeout(() => {
                    const cellChild = this.elem.querySelector(".whtBulletX");
                    cellChild.remove();
                }, 500);
            }
        }
        
        if (axis === "y") {
            if (player === "blkPlayer") {
                const bulletElem = createCell('div', 'blkBulletY');
                this.elem.appendChild(bulletElem);
    
                setTimeout(() => {
                    const cellChild = this.elem.querySelector(".blkBulletY");
                    cellChild.remove();
                }, 500);
    
            } else if (player === "whtPlayer") {
                const bulletElem = createCell('div', 'whtBulletY');
                this.elem.appendChild(bulletElem);
    
                setTimeout(() => {
                    const cellChild = this.elem.querySelector(".whtBulletY");
                    cellChild.remove();
                }, 500);
            }
        }
        
    }
}

function createCell(tag, classOf) {
    const elem = document.createElement(tag);
    elem.className = classOf;
    return elem;
}

function createPlayers() {
    player1 = new Player(
        "whtPlayer",
        3,
        3,
        '<svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m11.262 2.306c.196-.196.461-.306.738-.306s.542.11.738.306c1.917 1.917 7.039 7.039 8.956 8.956.196.196.306.461.306.738s-.11.542-.306.738c-1.917 1.917-7.039 7.039-8.956 8.956-.196.196-.461.306-.738.306s-.542-.11-.738-.306c-1.917-1.917-7.039-7.039-8.956-8.956-.196-.196-.306-.461-.306-.738s.11-.542.306-.738c1.917-1.917 7.039-7.039 8.956-8.956z" fill-rule="nonzero"/></svg>'
    );
    player2 = new Player(
        "blkPlayer",
        grid.cols - 2,
        grid.rows - 2,
        '<svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m11.262 2.306c.196-.196.461-.306.738-.306s.542.11.738.306c1.917 1.917 7.039 7.039 8.956 8.956.196.196.306.461.306.738s-.11.542-.306.738c-1.917 1.917-7.039 7.039-8.956 8.956-.196.196-.461.306-.738.306s-.542-.11-.738-.306c-1.917-1.917-7.039-7.039-8.956-8.956-.196-.196-.306-.461-.306-.738s.11-.542.306-.738c1.917-1.917 7.039-7.039 8.956-8.956z" fill-rule="nonzero"/></svg>'
    );

    clipReload = setInterval(() => {
        if (player1.clip < clipSize) {
            player1.clip++;
        }
        if (player2.clip < clipSize) {
            player2.clip++;
        }
    }, 1500);
}

function drawPlayer(player) {
    player.elem.remove();
    player.elem = createCell('div', player.name);
    gridArray[player.y - 1][player.x - 1].elem.appendChild(player.elem);
    player.elem.innerHTML = player.svg;
}

function createBullet(player, direction) {
    player.clip--;

    // update clip dom
    if (player.name === 'whtPlayer') {
        if (player.clip === clipSize) {

        }
    }


    let bulletX = player.x;
    let bulletY = player.y;

    // for left and right bullets
    if (direction === "left" || direction === "right") {
        
        if (player.name === "whtPlayer") {
            const bulletInterval = setInterval(() => {
                // bullet Logic
                if (direction === "left") {
                    bulletX--;
                } else if (direction === "right"){
                    bulletX++;
                }

                // top if statement to prevent flips on tiles outside grid
                if (bulletX > 0 && bulletX < grid.cols + 1) {

                    // use truthy value to check for opponent bullets, if found cancel bullet
                    if (gridArray[bulletY - 1][bulletX - 1].elem.querySelector(".blkBulletX")) {
                        gridArray[bulletY - 1][bulletX - 1].elem.querySelector(".blkBulletX").classList.add("bang");
                        clearInterval(bulletInterval);
                    } else if (gridArray[bulletY - 1][bulletX - 1].flipped === false) {
                        gridArray[bulletY - 1][bulletX - 1].flip();
                    }
                    // visible bullet
                    gridArray[bulletY - 1][bulletX - 1].drawBullet(player.name, "x");
                }

                // Bullet interactions
                // Bullet hits left/ right wall
                if (bulletX === 1) {
                    clearInterval(bulletInterval);
                } else if (bulletX === grid.cols) {
                    clearInterval(bulletInterval);
                } 
                // wht bullet hits blk player
                if (bulletX === player2.x && bulletY === player2.y) {
                    clearInterval(bulletInterval);
                    player.die();
                }
            }, bulletSpeed);
        }

        if (player.name === "blkPlayer") {
            const bulletInterval = setInterval(() => {
                // bullet Logic
                if (direction === "left") {
                    bulletX--;
                } else if (direction === "right"){
                    bulletX++;
                }
                
                // top if statement to prevent flips on tiles outside grid
                if (bulletX > 0 && bulletX < grid.cols + 1) {

                    // use truthy value to check for opponent bullets, if found cancel bullet
                    if (gridArray[bulletY - 1][bulletX - 1].elem.querySelector(".whtBulletX")) {
                        gridArray[bulletY - 1][bulletX - 1].elem.querySelector(".whtBulletX").classList.add("bang");
                        clearInterval(bulletInterval);
                    } else if (gridArray[bulletY - 1][bulletX - 1].flipped === true) {
                        gridArray[bulletY - 1][bulletX - 1].flip();
                    }
                    // visible bullet
                    gridArray[bulletY - 1][bulletX - 1].drawBullet(player.name, "x");
                }

                // Bullet interactions
                // Bullet hits left/ right wall
                if (bulletX === 1) {
                    clearInterval(bulletInterval);
                } else if (bulletX === grid.cols) {
                    clearInterval(bulletInterval);
                } 
                // blk bullet hits wht player
                if (bulletX === player1.x && bulletY === player1.y) {
                    clearInterval(bulletInterval);
                    player.die();
                }
            }, bulletSpeed);
        }
    }

    // for up and down bullets
    if (direction === "down" || direction === "up") {

        if (player.name === "whtPlayer") {
            const bulletInterval = setInterval(() => {
                // bullet Logic
                if (direction === "up") {
                    bulletY--;
                } else if (direction === "down"){
                    bulletY++;
                }

                // top if statement to prevent flips on tiles outside grid
                if (bulletY > 0 && bulletY < grid.rows + 1) {

                    // use truthy value to check for opponent bullets, if found cancel bullet
                    if (gridArray[bulletY - 1][bulletX - 1].elem.querySelector(".blkBulletY")) {
                        gridArray[bulletY - 1][bulletX - 1].elem.querySelector(".blkBulletY").classList.add("bang");
                        clearInterval(bulletInterval);
                    } else if (gridArray[bulletY - 1][bulletX - 1].flipped === false) {
                        gridArray[bulletY - 1][bulletX - 1].flip();
                    }

                    // visible bullet
                    gridArray[bulletY - 1][bulletX - 1].drawBullet(player.name, "y");
                }

                // Bullet interactions
                // Bullet hits top/ bottom wall
                if (bulletY === 1) {
                    clearInterval(bulletInterval);
                } else if (bulletY === grid.rows) {
                    clearInterval(bulletInterval);
                } 
                // wht bullet hits blk player
                if (bulletX === player2.x && bulletY === player2.y) {
                    clearInterval(bulletInterval);
                    player.die();
                }
            }, bulletSpeed);
        }

        if (player.name === "blkPlayer") {
            const bulletInterval = setInterval(() => {
                // bullet Logic
                if (direction === "up") {
                    bulletY--;
                } else if (direction === "down"){
                    bulletY++;
                }

                // top if statement to prevent flips on tiles outside grid
                if (bulletY > 0 && bulletY < grid.rows + 1) {
                    
                    // use truthy value to check for opponent bullets, if found cancel bullet
                    if (gridArray[bulletY - 1][bulletX - 1].elem.querySelector(".whtBulletY")) {
                        gridArray[bulletY - 1][bulletX - 1].elem.querySelector(".whtBulletY").classList.add("bang");
                        clearInterval(bulletInterval);
                    } else if (gridArray[bulletY - 1][bulletX - 1].flipped === true) {
                        gridArray[bulletY - 1][bulletX - 1].flip();
                    }
                    // visible bullet
                    gridArray[bulletY - 1][bulletX - 1].drawBullet(player.name, "y");
                }

                // Bullet interactions
                // Bullet hits top/ bottom wall
                if (bulletY === 1) {
                    clearInterval(bulletInterval);
                } else if (bulletY === grid.rows) {
                    clearInterval(bulletInterval);
                } 
                // blk bullet hits wht player
                if (bulletX === player1.x && bulletY === player1.y) {
                    clearInterval(bulletInterval);
                    player.die();
                }
            }, bulletSpeed);
        }
    }
}


function startGame() {
    startScrn.style.display = 'none';
    gameScreen.style.display = 'flex';
    
    grid = new Board(24, 16);

    grid.gameOver = false;
    createPlayers();

    // add variability to grid size
    gameBoard.style.gridTemplateColumns = `repeat(${grid.cols}, ${cellSize}px`;
    gameBoard.style.gridTemplateRows = `repeat(${grid.rows}, ${cellSize}px`;

    // add clip depending on clipSize
    player1Clip.style.gridTemplateColumns = `15px`;
    player1Clip.style.gridTemplateRows = `repeat(${clipSize}, 25px`;
    player2Clip.style.gridTemplateColumns = `15px`;
    player2Clip.style.gridTemplateRows = `repeat(${clipSize}, 25px`;
    
    // create an array of objects
    for (let r = 0; r < grid.rows; r++) {
        gridArray[r] = [];
        for (let c = 0; c < grid.cols; c++) {
            gridArray[r][c] = new Cell();
            
            // create game grid
            gridArray[r][c].elem = createCell('div', 'cell');
            gameBoard.appendChild(gridArray[r][c].elem);
            
            // set up flipped tiles 
            if (r >= grid.rows / 2) {
                gridArray[r][c].flip();
            }
            
            // set up flipped tiles around player    }
            if ((r === (player1.y - 1) && c === (player1.x - 1)) ||
            (r === (player1.y) && c === (player1.x)) ||
                (r === (player1.y - 1) && c === (player1.x)) ||
                (r === (player1.y) && c === (player1.x - 1)) ||
                (r === (player1.y - 2) && c === (player1.x - 2)) ||
                (r === (player1.y - 1) && c === (player1.x - 2)) ||
                (r === (player1.y) && c === (player1.x - 2)) ||
                (r === (player1.y - 2) && c === (player1.x)) ||
                (r === (player1.y - 2) && c === (player1.x - 1))) {
                gridArray[r][c].flip();
            } else if ((r === (player2.y - 1) && c === (player2.x - 1)) ||
            (r === (player2.y) && c === (player2.x)) ||
                (r === (player2.y - 1) && c === (player2.x)) ||
                (r === (player2.y) && c === (player2.x - 1)) ||
                (r === (player2.y - 2) && c === (player2.x - 2)) ||
                (r === (player2.y - 1) && c === (player2.x - 2)) ||
                (r === (player2.y) && c === (player2.x - 2)) ||
                (r === (player2.y - 2) && c === (player2.x)) ||
                (r === (player2.y - 2) && c === (player2.x - 1))) {
                    gridArray[r][c].flip();
                }
                
                // place players
                if (r === (player1.y) && c === (player1.x)) {
                    drawPlayer(player1)
                } else if (r === (player2.y) && c === (player2.x)) {
                drawPlayer(player2);
            }
        }
    }

    // Create player clips
    for (let i = 0; i < clipSize; i++) {
        const player1BulletInClip = createCell('div', `player1-bullet-in-clip bullet-${i + 1}`)
        player1Clip.appendChild(player1BulletInClip);
        const player2BulletInClip = createCell('div', `player2-bullet-in-clip bullet-${i + 1}`)
        player2Clip.appendChild(player2BulletInClip);
    }

}

function endGame(player) {
    const allCells = gameBoard.querySelectorAll(".cell");
    if (player.name === "whtPlayer") {
        allCells.forEach(cell => {
            cell.classList.add("flipped");
        });
    } else if (player.name === "blkPlayer") {
        allCells.forEach(cell => {
            cell.classList.remove("flipped");
        })
    }
}

function showInstructions() {
    startScrn.style.display = 'none';
    howScrn.style.display = 'block';

}


// ^ End of functions and classes...

startBtn.addEventListener('click', startGame);
howBtn.addEventListener('click', showInstructions);

document.addEventListener('keydown', (event) => {
    console.log(event);
    event.preventDefault();
    
    // OK BEGIN CONDITIONAL LOGIC *cries*
    
    if (!grid.gameOver) {

        // player1 movement
        // need to check grid bounds here to avoid checking cell that doesn't exsit after key press
        if (player1.x > 1 && gridArray[player1.y - 1][player1.x - 2].flipped === true && event.key === "a") {
            player1.moveLeft();
        } else if (player1.x < grid.cols && gridArray[player1.y - 1][player1.x].flipped === true && event.key === "d") {
            player1.moveRight();
        } else if (player1.y < grid.rows && gridArray[player1.y][player1.x - 1].flipped === true && event.key === "s") {
            player1.moveDown();
        } else if (player1.y > 1 && gridArray[player1.y - 2][player1.x - 1].flipped === true && event.key === "w") {
            player1.moveUp();
        }

        // player2 movement
        if (player2.x > 1 && gridArray[player2.y - 1][player2.x - 2].flipped === false && event.key === "ArrowLeft") {
            player2.moveLeft();
        } else if (player2.x < grid.cols && gridArray[player2.y - 1][player2.x].flipped === false && event.key === "ArrowRight") {
            player2.moveRight();
        } else if (player2.y < grid.rows && gridArray[player2.y][player2.x - 1].flipped === false && event.key === "ArrowDown") {
            player2.moveDown();
        } else if (player2.y > 1 && gridArray[player2.y - 2][player2.x - 1].flipped === false && event.key === "ArrowUp") {
            player2.moveUp();
        }


        // player1 bullets
        if (event.key === "g") {
            player1.shootLeft();
        } else if (event.key === "j") {
            player1.shootRight();
        } else if (event.key === "h") {
            player1.shootDown();
        } else if (event.key === "y") {
            player1.shootUp();
        }

        // player2 bullets
        if (event.key === "4") {
            player2.shootLeft();
        } else if (event.key === "6") {
            player2.shootRight();
        } else if (event.key === "5") {
            player2.shootDown();
        } else if (event.key === "8") {
            player2.shootUp();
        }

    }
});