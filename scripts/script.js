"use strict";

const gameBoard = document.getElementById('gameboard');
const boardWidth = gameBoard.offsetWidth;
const boardheight = gameBoard.offsetHeight;

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

    newOwner(player) {

    }

}

const grid = new Board(25, 25);

for (let i = 0; i < grid.cols * grid.rows; i++) {

    // create grid
    const cell = document.createElement('div');
    gameBoard.appendChild(cell).classList.add("cell");

    const player1 = document.createElement('div');
    gameBoard.appendChild(player1).classList.add("player1");

    const player2 = document.createElement('div');
    gameBoard.appendChild(player2).classList.add("player2");

    // add variability to grid size

    gameBoard.style.gridTemplateColumns = `repeat(${grid.cols}, 1fr`;
    gameBoard.style.gridTemplateRows = `repeat(${grid.rows}, 1fr`;
}