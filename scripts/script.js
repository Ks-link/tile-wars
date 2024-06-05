"use strict";
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");


const gameBoard = {
    cols: 10,
    rows: 10,
    // cellSize: canvas.width / 10,
};

class Player {
    constructor() {

    }
}

class Cell {
    constructor() {
        this.filled = false;
        this.size = canvas.width / gameBoard.cols;
    }
}

function createGrid(cols, rows) {
    const grid = [];
    for (let c = 0; c < cols; c++) {
        grid[c] = [];
        for (let r = 0; r < rows; r++) {
            const cell = new Cell();
            grid[c][r] = cell;

            //draw grid
            ctx.beginPath();
            ctx.rect(cell.size * r, cell.size * c, cell.size, cell.size);
            ctx.strokeStyle = "#000";
            ctx.stroke();
            // ctx.closePath();

            // example of targetting cell
            if (c === 1 && r === 1) {
                cell.filled = true;
            }

            if (c > 4) {
                cell.filled = true;
            }

            if (c === 8 && r === 8) {
                cell.filled = false;
            }

            if (cell.filled) {
                // ctx.beginPath();
                ctx.rect(cell.size * r, cell.size * c, cell.size, cell.size);
                ctx.fillStyle = "#000";
                ctx.fill();
                ctx.strokeStyle = "#fff";
                ctx.stroke();
                ctx.closePath();
            }

        }
    }
    return grid;
}

const gameGrid = createGrid(gameBoard.cols, gameBoard.rows);

function drawGrid() {
    // ctx.beginPath();
    // ctx.rect();
}