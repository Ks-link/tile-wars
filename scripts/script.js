"use strict";

const gameBoard = document.getElementById('gameboard');
const boardWidth = gameBoard.offsetWidth;
const boardheight = gameBoard.offsetHeight;
const gridArray = [];
let player1;
let player2;

const mapSize = 20;
let player = [{ x: 10, y: 10 }];
let food = generateFood();

class Board {
    constructor(cols, rows) {
        this.cols = cols;
        this.rows = rows;
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
    }

    shoot(direction) {

    }

    die() {

    }
}

class Cell {
    constructor() {
        this.filled = false;
        // this.size = canvas.width / gameBoard.cols;
        // this.elem = document.getElementById('cell');
    }

    newOwner(plasdfgsyer) {

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

function setPos(elem, pos) {
    elem.style.gridColumn = pos.x;
    elem.style.gridRow = pos.y;
}

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
        2,
        2,
        '<svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m11.262 2.306c.196-.196.461-.306.738-.306s.542.11.738.306c1.917 1.917 7.039 7.039 8.956 8.956.196.196.306.461.306.738s-.11.542-.306.738c-1.917 1.917-7.039 7.039-8.956 8.956-.196.196-.461.306-.738.306s-.542-.11-.738-.306c-1.917-1.917-7.039-7.039-8.956-8.956-.196-.196-.306-.461-.306-.738s.11-.542.306-.738c1.917-1.917 7.039-7.039 8.956-8.956zm-7.573 9.694 8.311 8.311 8.311-8.311-8.311-8.311z" fill-rule="nonzero"/></svg>'
    );
    player2 = new Player(
        "blkPlayer",
        grid.cols - 3,
        grid.rows - 3,
        '<svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m11.262 2.306c.196-.196.461-.306.738-.306s.542.11.738.306c1.917 1.917 7.039 7.039 8.956 8.956.196.196.306.461.306.738s-.11.542-.306.738c-1.917 1.917-7.039 7.039-8.956 8.956-.196.196-.461.306-.738.306s-.542-.11-.738-.306c-1.917-1.917-7.039-7.039-8.956-8.956-.196-.196-.306-.461-.306-.738s.11-.542.306-.738c1.917-1.917 7.039-7.039 8.956-8.956z" fill-rule="nonzero"/></svg>'
    );
    // setPos(player1.svg, player1)
}





const grid = new Board(20, 20);

function startGame() {
    createPlayers();

    // add variability to grid size
    gameBoard.style.gridTemplateColumns = `repeat(${grid.cols}, 1fr`;
    gameBoard.style.gridTemplateRows = `repeat(${grid.rows}, 1fr`;

    // create an array of objects
    for (let c = 0; c < grid.cols; c++) {
        gridArray[c] = [];
        for (let r = 0; r < grid.rows; r++) {
            const cell = new Cell();
            gridArray[c][r] = cell;

            // create game grid
            const cellElem = createCell('div', 'cell');
            gameBoard.appendChild(cellElem);

            // place players
            if (c === player1.x && r === player1.y) {
                console.log(player1.svg);
                cellElem.innerHTML = player1.svg;
            } else if (c === player2.x && r === player2.y) {
                cellElem.innerHTML = player2.svg;
            }
        }
    }
}

startGame();