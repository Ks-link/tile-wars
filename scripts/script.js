"use strict";
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");


const gameBoard = {
    cols: 10,
    rows: 10,
    cellSize: canvas.width / 10,
};

class Player {
    constructor() {

    }
}

function createGrid(cols, rows) {
    const grid = [];
    for (let c = 0; c < cols; c++) {
        grid[c] = [];
        for (let r = 0; r < rows; r++) {
            grid[c][r] = 0;
            // grid[c][r] = document.querySelector("div");
        }
    }
    return grid;
}

const grid = createGrid(gameBoard.cols, gameBoard.rows);

function drawGrid() {
    // ctx.beginPath();
    // ctx.rect();
}