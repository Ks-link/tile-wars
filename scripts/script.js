"use strict";

const gameBoard = document.getElementById('gameboard');
const boardWidth = gameBoard.offsetWidth;
const boardHeight = gameBoard.offsetHeight;
const gridArray = [];
let player1;
let player2;

// const mapSize = 20;
// let player = [{ x: 10, y: 10 }];
// let food = generateFood();

class Board {
    constructor(cols, rows) {
        this.cols = cols;
        this.rows = rows;
        this.width = boardWidth;
        this.height = boardHeight;
        this.player1 = new Player(this);
        this.player2 = new Player(this);
    }
}

class Player {
    constructor(name, x, y, svg) {
        this.name = name;
        // this.coords = coords;
        this.x = x;
        this.y = y;
        this.svg = svg;
        this.elem;
    }

    moveLeft() {
        if (this.x > 0) {
            this.x = this.x - 1;
            console.log(this.x);
            setPos(this.elem, this);
        }
    }

    moveRight() {
        if (this.x < grid.cols) {
            this.x = this.x + 1;
            console.log(this.x);
            setPos(this.elem, this);
        }
    }

    moveDown() {
        if (this.y < grid.rows) {
            this.y = this.y + 1;
            setPos(this.elem, this);
        }
    }

    moveUp() {
        if (this.y > 0) {
            this.y = this.y - 1;
            setPos(this.elem, this);
        }
    }



    shoot(direction) {

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





function drawMap() {
    gameBoard.innerHTML = '';
    // drawPlayer();
    // drawFood();
}

function drawPlayer() {
    player.forEach((segment) => {
        const playerElem = createGameElem('div', 'player1');
        setPos(playerElem, segment);
        gameBoard.appendChild(playerElem);
    })
}

function createGameElem(tag, className) {
    const elem = document.createElement(tag);
    elem.className = className;
    return elem;
}

// function setPos(elem, pos) {
//     elem.style.gridColumn = pos.x;
//     elem.style.gridRow = pos.y;
// }

function drawFood() {
    const foodElem = createGameElem('div', 'player2');
    setPos(foodElem, food);
    gameBoard.appendChild(foodElem);
}

function generateFood() {
    const x = Math.floor(Math.random() * mapSize) + 1;
    const y = Math.floor(Math.random() * mapSize) + 1;
    return { x, y };
}

drawMap();




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





const grid = new Board(20, 20);

function startGame() {
    createPlayers();

    // add variability to grid size
    gameBoard.style.gridTemplateColumns = `repeat(${grid.cols}, ${grid.width / grid.cols}px`;
    gameBoard.style.gridTemplateRows = `repeat(${grid.rows}, ${grid.height / grid.rows}px`;

    // create an array of objects
    for (let c = 0; c < grid.cols; c++) {
        gridArray[c] = [];
        for (let r = 0; r < grid.rows; r++) {
            gridArray[c][r] = new Cell();;

            // create game grid
            gridArray[c][r].elem = createCell('div', 'cell');
            gameBoard.appendChild(gridArray[c][r].elem);

            // place players
            // need to add - 1 to match up to grid area values
            if (c === (player1.x - 1) && r === (player1.y - 1)) {
                gridArray[c][r].elem.innerHTML = player1.svg;
                player1.elem = gridArray[c][r].elem;
            } else if (c === (player2.x - 1) && r === (player2.y - 1)) {
                gridArray[c][r].elem.innerHTML = player2.svg;
                player2.elem = gridArray[c][r].elem;
            }

            // set up flipped tiles 
            if (c < grid.cols / 2) {
                gridArray[c][r].flip();
            }
        }
    }
}

startGame();

document.addEventListener('keydown', (event) => {
    console.log(event);
    event.preventDefault();

    // OK BEGIN CONDITIONAL LOGIC *cries*

    // player1 movement
    if (event.key === "a") {
        player1.moveLeft();
    } else if (event.key === "d") {
        player1.moveRight();
    } else if (event.key === "s") {
        player1.moveDown();
    } else if (event.key === "w") {
        player1.moveUp();
    }

    // player2 movement
    if (event.key === "ArrowLeft") {
        console.log("I werk");

        player2.moveLeft();
    } else if (event.key === "ArrowRight") {
        player2.moveRight();
    } else if (event.key === "ArrowDown") {
        player2.moveDown();
    } else if (event.key === "ArrowUp") {
        player2.moveUp();
    }
});