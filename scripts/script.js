"use strict";

const gameBoard = document.getElementById('gameboard');
const boardWidth = gameBoard.offsetWidth;
const boardHeight = gameBoard.offsetHeight;
const gridArray = [];
let player1;
let player2;
const bulletSpeed = 50;


class Board {
    constructor(cols, rows) {
        this.cols = cols;
        this.rows = rows;
        this.width = boardWidth;
        this.height = boardHeight;
        // this.player1 = new Player(this);
        // this.player2 = new Player(this);
    }
}

class Player {
    constructor(name, x, y, svg) {
        this.name = name;
        this.x = x;
        this.y = y;
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
        let bulletX = this.x;
        let bulletY = this.y;

        if (this.name === "blkPlayer") {
            const bulletInterval = setInterval(() => {
                if (gridArray[bulletY - 1][bulletX - 1].flipped === true) {
                    gridArray[bulletY - 1][bulletX - 1].flip();
                }
                if (bulletX === 1) {
                    clearInterval(bulletInterval);
                }
                bulletX--;
            }, bulletSpeed);
        } else if (this.name === "whtPlayer") {
            const bulletInterval = setInterval(() => {
                if (gridArray[bulletY - 1][bulletX - 1].flipped === false) {
                    gridArray[bulletY - 1][bulletX - 1].flip();
                }
                if (bulletX === 1) {
                    clearInterval(bulletInterval);
                }
                bulletX--;
            }, bulletSpeed);
        }
    }

    shootRight() {
        let bulletX = this.x;
        let bulletY = this.y;

        if (this.name === "blkPlayer") {
            const bulletInterval = setInterval(() => {
                if (gridArray[bulletY - 1][bulletX - 1].flipped === true) {
                    gridArray[bulletY - 1][bulletX - 1].flip();
                }
                if (bulletX === grid.cols) {
                    clearInterval(bulletInterval);
                }
                bulletX++;
            }, bulletSpeed);
        } else if (this.name === "whtPlayer") {
            const bulletInterval = setInterval(() => {
                if (gridArray[bulletY - 1][bulletX - 1].flipped === false) {
                    gridArray[bulletY - 1][bulletX - 1].flip();
                }
                if (bulletX === grid.cols) {
                    clearInterval(bulletInterval);
                }
                bulletX++;
            }, bulletSpeed);
        }
    }

    shootDown() {
        let bulletX = this.x;
        let bulletY = this.y;

        if (this.name === "blkPlayer") {
            const bulletInterval = setInterval(() => {
                if (gridArray[bulletY - 1][bulletX - 1].flipped === true) {
                    gridArray[bulletY - 1][bulletX - 1].flip();
                }
                if (bulletY === grid.rows) {
                    clearInterval(bulletInterval);
                }
                bulletY++;
            }, bulletSpeed);
        } else if (this.name === "whtPlayer") {
            const bulletInterval = setInterval(() => {
                if (gridArray[bulletY - 1][bulletX - 1].flipped === false) {
                    gridArray[bulletY - 1][bulletX - 1].flip();
                }
                if (bulletY === grid.rows) {
                    clearInterval(bulletInterval);
                }
                bulletY++;
            }, bulletSpeed);
        }
    }

    shootUp() {
        let bulletX = this.x;
        let bulletY = this.y;

        if (this.name === "blkPlayer") {
            const bulletInterval = setInterval(() => {
                if (gridArray[bulletY - 1][bulletX - 1].flipped === true) {
                    gridArray[bulletY - 1][bulletX - 1].flip();
                }
                if (bulletY === 1) {
                    clearInterval(bulletInterval);
                }
                bulletY--;
            }, bulletSpeed);
        } else if (this.name === "whtPlayer") {
            const bulletInterval = setInterval(() => {
                if (gridArray[bulletY - 1][bulletX - 1].flipped === false) {
                    gridArray[bulletY - 1][bulletX - 1].flip();
                }
                if (bulletY === 1) {
                    clearInterval(bulletInterval);
                }
                bulletY--;
            }, bulletSpeed);
        }
    }


    die() {

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

}

const bullet = {
    // name: blk,
    // name: wht
};



// add remove classes to toggle cell
// will stil need grid array to make conditional logic easier

function createCell(tag, classOf) {
    const elem = document.createElement(tag);
    elem.className = classOf;
    return elem;
}

function setPos(elem, pos) {
    elem.style.gridColumn = pos.x;
    elem.style.gridRow = pos.y;
}

function createPlayers() {
    player1 = new Player(
        "whtPlayer",
        3,
        3,
        '<svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#fafafa" d="m11.262 2.306c.196-.196.461-.306.738-.306s.542.11.738.306c1.917 1.917 7.039 7.039 8.956 8.956.196.196.306.461.306.738s-.11.542-.306.738c-1.917 1.917-7.039 7.039-8.956 8.956-.196.196-.461.306-.738.306s-.542-.11-.738-.306c-1.917-1.917-7.039-7.039-8.956-8.956-.196-.196-.306-.461-.306-.738s.11-.542.306-.738c1.917-1.917 7.039-7.039 8.956-8.956z" fill-rule="nonzero"/></svg>'
    );
    player2 = new Player(
        "blkPlayer",
        grid.cols - 2,
        grid.rows - 2,
        '<svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m11.262 2.306c.196-.196.461-.306.738-.306s.542.11.738.306c1.917 1.917 7.039 7.039 8.956 8.956.196.196.306.461.306.738s-.11.542-.306.738c-1.917 1.917-7.039 7.039-8.956 8.956-.196.196-.461.306-.738.306s-.542-.11-.738-.306c-1.917-1.917-7.039-7.039-8.956-8.956-.196-.196-.306-.461-.306-.738s.11-.542.306-.738c1.917-1.917 7.039-7.039 8.956-8.956z" fill-rule="nonzero"/></svg>'
    );
    // setPos(player1.svg, player1)
}

function drawPlayer(player) {
    player.elem.remove();
    player.elem = createCell('div', player.name);
    gridArray[player.y - 1][player.x - 1].elem.appendChild(player.elem);
    player.elem.innerHTML = player.svg;
}

function drawBullet(type) {
    player.elem.remove();
    player.elem = createCell('div', player.name);
    gridArray[player.y - 1][player.x - 1].elem.appendChild(player.elem);
    player.elem.innerHTML = player.svg;
}



const grid = new Board(20, 20);

function startGame() {
    createPlayers();

    // add variability to grid size
    gameBoard.style.gridTemplateColumns = `repeat(${grid.cols}, ${grid.width / grid.cols}px`;
    gameBoard.style.gridTemplateRows = `repeat(${grid.rows}, ${grid.height / grid.rows}px`;

    // create an array of objects
    for (let r = 0; r < grid.rows; r++) {
        gridArray[r] = [];
        for (let c = 0; c < grid.cols; c++) {
            gridArray[r][c] = new Cell();;

            // create game grid
            gridArray[r][c].elem = createCell('div', 'cell');
            gameBoard.appendChild(gridArray[r][c].elem);

            // place players
            if (r === (player1.y) && c === (player1.x)) {
                drawPlayer(player1)
            } else if (r === (player2.y) && c === (player2.x)) {
                drawPlayer(player2);
            }

            // set up flipped tiles 
            if (c < grid.cols / 2) {
                gridArray[r][c].flip();
            }
        }
    }
}

startGame();

document.addEventListener('keydown', (event) => {
    event.preventDefault();
    console.log(event);

    // OK BEGIN CONDITIONAL LOGIC *cries*

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


});