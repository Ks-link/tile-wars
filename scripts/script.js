"use strict";

const gameBoard = document.getElementById('gameboard');
const boardWidth = gameBoard.offsetWidth;
const boardheight = gameBoard.offsetHeight;

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
    constructor() {

    }
}

class Cell {
    constructor() {
        this.filled = false;
        this.size = canvas.width / gameBoard.cols;
        this.elem = document.getElementById('cell');
    }

    newOwner(plasdfgsyer) {

    }

}





function drawMap() {
    gameBoard.innerHTML = '';
    drawPlayer();
    drawFood();
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


const grid = new Board(25, 25);

for (let i = 0; i < grid.cols * grid.rows; i++) {

    // create grid
    const cell = document.createElement('div');
    gameBoard.appendChild(cell).classList.add("cell");

    // if (i === 15) {
    //     const player1 = document.createElement('div');
    //     gameBoard.appendChild(player1).classList.add("player1");
    //     i++;
    // }

    // if (i === 35) {
    //     const player2 = document.createElement('div');
    //     gameBoard.appendChild(player2).classList.add("player2");
    //     i++;
    // }

    // add variability to grid size
    gameBoard.style.gridTemplateColumns = `repeat(${grid.cols}, 1fr`;
    gameBoard.style.gridTemplateRows = `repeat(${grid.rows}, 1fr`;
}