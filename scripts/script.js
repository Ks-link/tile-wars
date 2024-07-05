"use strict";

// grab elems/ screens
const gameElems = {
    startScrn: document.getElementById('start-screen'),
    howScrn: document.getElementById('how-screen'),
    selectScrn: document.getElementById('select-screen'),
    gameScrn: document.getElementById('game-screen'),
    gameBoard: document.getElementById('gameboard'),
    player1Clip: document.getElementById('player1-clip'),
    player2Clip: document.getElementById('player2-clip'),
    startBtn: document.querySelector('.start-btn'),
    contentStartBtn: document.querySelector('.content-start-btn'),
    howBtn: document.querySelector('.how-btn'),
    playBtn: document.querySelector('.play-btn'),
    muteBtn: document.querySelector('.mute-btn'),
    homeBtn: document.querySelector('.back-to-title-btn'),
    waitingAudio: document.querySelector('#info-screens audio'),
    fightingAudio: document.querySelector('#game-screen audio'),
    gridOptionBtns: document.querySelectorAll('.grid-checkbox'),
    colourOptionBtns: document.querySelectorAll('.colour-checkbox'),
    colourVars: document.querySelector(':root'),
    player1NameInput: document.getElementById('player1Name'),
    player2NameInput: document.getElementById('player2Name')
}

// global vars
const gridArray = [];
const clipSize = 6;
const bulletSpeed = 40; // higher is sloweeeer
const cellSize = 40; // read as px
let isMuted = true;
let canPlayer1Shoot = true;
let canPlayer2Shoot = true;
let player1;
let player2;
let grid;
let clipReload;
let checkClip;
let colChoice = 24;
let rowChoice = 16;
let player1Username = "Player 1";
let player2Username = "Player 2";


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
    constructor(username, name, x, y, svg) {
        this.username = username;
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
        if (!grid.gameOver) {
            // reset music
            gameElems.fightingAudio.pause();
            gameElems.fightingAudio.currentTime = 0;
            // kill game timers
            clearInterval(clipReload);
            clearInterval(checkClip);

            grid.gameOver = true;
            endGame(this);
        }
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
        // handle left and right bullets
        if (axis === "x") {
            if (player === "blkPlayer") {
                const bulletElem = createElem('div', 'blkBulletX');
                this.elem.appendChild(bulletElem);
    
                setTimeout(() => {
                    const cellChild = this.elem.querySelector(".blkBulletX");
                    cellChild.remove();
                }, 500);
    
            } else if (player === "whtPlayer") {
                const bulletElem = createElem('div', 'whtBulletX');
                this.elem.appendChild(bulletElem);
    
                setTimeout(() => {
                    const cellChild = this.elem.querySelector(".whtBulletX");
                    cellChild.remove();
                }, 500);
            }
        }
        
        // handle up and down bullets
        if (axis === "y") {
            if (player === "blkPlayer") {
                const bulletElem = createElem('div', 'blkBulletY');
                this.elem.appendChild(bulletElem);
    
                setTimeout(() => {
                    const cellChild = this.elem.querySelector(".blkBulletY");
                    cellChild.remove();
                }, 500);
    
            } else if (player === "whtPlayer") {
                const bulletElem = createElem('div', 'whtBulletY');
                this.elem.appendChild(bulletElem);
    
                setTimeout(() => {
                    const cellChild = this.elem.querySelector(".whtBulletY");
                    cellChild.remove();
                }, 500);
            }
        }
    }
}

function createElem(tag, classOf) {
    const elem = document.createElement(tag);
    elem.className = classOf;
    return elem;
}

function createPlayers() {
    // set usernames
    // handle usernames with spaces
    gameElems.player1NameInput.value = gameElems.player1NameInput.value.trim();
    if (gameElems.player1NameInput.value != '') {
        player1Username = gameElems.player1NameInput.value;
    } 
    gameElems.player2NameInput.value = gameElems.player2NameInput.value.trim();
    if (gameElems.player2NameInput.value != '') {
        player2Username = gameElems.player2NameInput.value;
    } 
    
    // create player objects
    player1 = new Player(
        player1Username,
        "whtPlayer",
        3,
        3,
        '<svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m11.262 2.306c.196-.196.461-.306.738-.306s.542.11.738.306c1.917 1.917 7.039 7.039 8.956 8.956.196.196.306.461.306.738s-.11.542-.306.738c-1.917 1.917-7.039 7.039-8.956 8.956-.196.196-.461.306-.738.306s-.542-.11-.738-.306c-1.917-1.917-7.039-7.039-8.956-8.956-.196-.196-.306-.461-.306-.738s.11-.542.306-.738c1.917-1.917 7.039-7.039 8.956-8.956z" fill-rule="nonzero"/></svg>'
    );
    player2 = new Player(
        player2Username,
        "blkPlayer",
        grid.cols - 2,
        grid.rows - 2,
        '<svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m11.262 2.306c.196-.196.461-.306.738-.306s.542.11.738.306c1.917 1.917 7.039 7.039 8.956 8.956.196.196.306.461.306.738s-.11.542-.306.738c-1.917 1.917-7.039 7.039-8.956 8.956-.196.196-.461.306-.738.306s-.542-.11-.738-.306c-1.917-1.917-7.039-7.039-8.956-8.956-.196-.196-.306-.461-.306-.738s.11-.542.306-.738c1.917-1.917 7.039-7.039 8.956-8.956z" fill-rule="nonzero"/></svg>'
    );

    // clip logic
    clipReload = setInterval(() => {
        if (player1.clip < clipSize) {
            player1.clip++;
        }
        if (player2.clip < clipSize) {
            player2.clip++;
        }
    }, 1500);

    checkClip = setInterval(() => {
        // update clip dom

        // player 1 clip 
        const player1ClipElems = gameElems.player1Clip.children;
        for (let i = 0; i < player1ClipElems.length; i++) {
            if (i < clipSize - player1.clip) {
                player1ClipElems[i].classList.add('player1-no-bullet-in-clip');
                player1ClipElems[i].classList.remove('player1-bullet-in-clip');
            } else {
                player1ClipElems[i].classList.remove('player1-no-bullet-in-clip');
                player1ClipElems[i].classList.add('player1-bullet-in-clip');
            }
        }
        
        // player2 clip
        const player2ClipElems = gameElems.player2Clip.children;
        for (let i = 0; i < player2ClipElems.length; i++) {
            if (i < clipSize - player2.clip) {
                player2ClipElems[i].classList.add('player2-no-bullet-in-clip');
                player2ClipElems[i].classList.remove('player2-bullet-in-clip');
            } else {
                player2ClipElems[i].classList.remove('player2-no-bullet-in-clip');
                player2ClipElems[i].classList.add('player2-bullet-in-clip');
            }
        }
    }, 100);
    
}

function drawPlayer(player) {
    player.elem.remove();
    player.elem = createElem('div', player.name);
    gridArray[player.y - 1][player.x - 1].elem.appendChild(player.elem);
    player.elem.innerHTML = player.svg;
}

function createBullet(player, direction) {
    player.clip--;
    if (!isMuted) {
        const shootSound = new Audio("./media/shoot.mp3");
        shootSound.play();
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
    // DOM
    gameElems.startScrn.style.display = 'none';
    gameElems.howScrn.style.display = 'none';
    gameElems.selectScrn.style.display = 'none';
    gameElems.gameScrn.style.display = 'flex';
    gameElems.homeBtn.style.display = 'none';

    
    // Audio
    if (!isMuted) {
        gameElems.waitingAudio.pause()
        gameElems.waitingAudio.currentTime = 0;
        gameElems.fightingAudio.play();
        gameElems.fightingAudio.muted = false;
        const startGameAudio = new Audio('../media/game-start.mp3');
        startGameAudio.play();
    }

    // Logic
    grid = new Board(colChoice, rowChoice);

    grid.gameOver = false;
    createPlayers();

    // add variability to grid size
    gameElems.gameBoard.style.gridTemplateColumns = `repeat(${grid.cols}, ${cellSize}px`;
    gameElems.gameBoard.style.gridTemplateRows = `repeat(${grid.rows}, ${cellSize}px`;

    // add clip depending on clipSize
    gameElems.player1Clip.style.gridTemplateColumns = `15px`;
    gameElems.player1Clip.style.gridTemplateRows = `repeat(${clipSize}, 25px`;
    gameElems.player2Clip.style.gridTemplateColumns = `15px`;
    gameElems.player2Clip.style.gridTemplateRows = `repeat(${clipSize}, 25px`;
    
    // create an array of objects
    for (let r = 0; r < grid.rows; r++) {
        gridArray[r] = [];
        for (let c = 0; c < grid.cols; c++) {
            gridArray[r][c] = new Cell();
            
            // create game grid
            gridArray[r][c].elem = createElem('div', 'cell');
            gameElems.gameBoard.appendChild(gridArray[r][c].elem);
            
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
        const player1BulletInClip = createElem('div', `player1-bullet-in-clip bullet`)
        gameElems.player1Clip.appendChild(player1BulletInClip);
        const player2BulletInClip = createElem('div', `player2-bullet-in-clip bullet`)
        gameElems.player2Clip.appendChild(player2BulletInClip);
    }

}

function endGame(player) {
    // DOM
    gameElems.homeBtn.style.display = 'block';

    // Audio
    if (!isMuted) {
        const gameOverAudio = new Audio('../media/victory.mp3');
        gameOverAudio.play();
    }

    // flip all tiles
    const allCells = gameElems.gameBoard.querySelectorAll(".cell");
    if (player.name === "whtPlayer") {
        allCells.forEach(cell => {
            cell.classList.add("flipped");
        });
    } else if (player.name === "blkPlayer") {
        allCells.forEach(cell => {
            cell.classList.remove("flipped");
        });
    }

    const whoWonMessage = createElem('h3', 'who-won-message');
    const playAgainBtn = createElem('button', 'play-again-btn');
    gameElems.gameScrn.appendChild(whoWonMessage);
    gameElems.gameScrn.appendChild(playAgainBtn);
    whoWonMessage.innerHTML = `${player.username} wins`;
    playAgainBtn.innerHTML = `Play Agan?`;

    playAgainBtn.addEventListener('click', resetGame);
    playAgainBtn.addEventListener('click', startGame);
}

function resetGame() {
    if (grid.gameOver) {
        const whoWonMessage = document.querySelector(".who-won-message");
        const playAgain = document.querySelector(".play-again-btn");
        whoWonMessage.remove();
        playAgain.remove();
    }
    const allCells = gameElems.gameBoard.querySelectorAll(".cell");
    for (let i = 0; i < allCells.length; i++) {
        allCells[i].remove();
    }
    const playerBullets = document.querySelectorAll(".bullet");
    for (let i = 0; i < playerBullets.length; i++) {
        playerBullets[i].remove();
    }
}

function showInstructions() {
    gameElems.startScrn.style.display = 'none';
    gameElems.howScrn.style.display = 'block';
    gameElems.homeBtn.style.display = 'block';
}

function showSelect() {
    gameElems.startScrn.style.display = 'none';
    gameElems.howScrn.style.display = 'none';
    gameElems.selectScrn.style.display = 'block';
    gameElems.homeBtn.style.display = 'block';
    
    gameElems.player1NameInput.value = '';
    gameElems.player2NameInput.value = '';
    player1Username = 'Player 1';
    player2Username = 'Player 2';
}

function muteUnmute() {
    isMuted ? isMuted = false : isMuted = true;
    if ((gameElems.gameScrn.style.display === '' || gameElems.gameScrn.style.display === 'none') && isMuted === false) {
        gameElems.waitingAudio.play();
        gameElems.waitingAudio.muted = false;
        gameElems.muteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24"><path d="M6 7l8-5v20l-8-5v-10zm-6 10h4v-10h-4v10zm20.264-13.264l-1.497 1.497c1.847 1.783 2.983 4.157 2.983 6.767 0 2.61-1.135 4.984-2.983 6.766l1.498 1.498c2.305-2.153 3.735-5.055 3.735-8.264s-1.43-6.11-3.736-8.264zm-.489 8.264c0-2.084-.915-3.967-2.384-5.391l-1.503 1.503c1.011 1.049 1.637 2.401 1.637 3.888 0 1.488-.623 2.841-1.634 3.891l1.503 1.503c1.468-1.424 2.381-3.309 2.381-5.394z"></svg>'
    } else if ((gameElems.gameScrn.style.display === '' || gameElems.gameScrn.style.display === 'none') && isMuted === true) {
        gameElems.waitingAudio.pause();
        gameElems.waitingAudio.muted = true;
        gameElems.muteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24"><path d="M19 7.358v15.642l-8-5v-.785l8-9.857zm3-6.094l-1.548-1.264-3.446 4.247-6.006 3.753v3.646l-2 2.464v-6.11h-4v10h.843l-3.843 4.736 1.548 1.264 18.452-22.736z"></svg>'
    } else if (gameElems.gameScrn.style.display === 'flex' && isMuted === false) {
        gameElems.fightingAudio.play();
        gameElems.fightingAudio.muted = false;
        gameElems.muteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24"><path d="M6 7l8-5v20l-8-5v-10zm-6 10h4v-10h-4v10zm20.264-13.264l-1.497 1.497c1.847 1.783 2.983 4.157 2.983 6.767 0 2.61-1.135 4.984-2.983 6.766l1.498 1.498c2.305-2.153 3.735-5.055 3.735-8.264s-1.43-6.11-3.736-8.264zm-.489 8.264c0-2.084-.915-3.967-2.384-5.391l-1.503 1.503c1.011 1.049 1.637 2.401 1.637 3.888 0 1.488-.623 2.841-1.634 3.891l1.503 1.503c1.468-1.424 2.381-3.309 2.381-5.394z"></svg>'
    } else if (gameElems.gameScrn.style.display === 'flex' && isMuted === true) {
        gameElems.fightingAudio.pause();
        gameElems.fightingAudio.muted = true;
        gameElems.muteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24"><path d="M19 7.358v15.642l-8-5v-.785l8-9.857zm3-6.094l-1.548-1.264-3.446 4.247-6.006 3.753v3.646l-2 2.464v-6.11h-4v10h.843l-3.843 4.736 1.548 1.264 18.452-22.736z"></svg>'
    }
}
    
function backToTitle() {
    if (!isMuted) {
        gameElems.waitingAudio.muted = false;
        gameElems.waitingAudio.play()
    }
    if (gameElems.gameScrn.style.display === 'flex') {
        resetGame();
    }
    gameElems.startScrn.style.display = 'block';
    gameElems.howScrn.style.display = 'none';
    gameElems.selectScrn.style.display = 'none';
    gameElems.gameScrn.style.display = 'none';
    gameElems.homeBtn.style.display = 'none';
    gameElems.fightingAudio.pause();
    gameElems.fightingAudio.currentTime = 0;
}

function selectOption(selected, type) {
    // So only one box can be checked at a time:
    if (type === "grid") {
        gameElems.gridOptionBtns.forEach(btn => {
            btn.checked = false;
        });
        selected.checked = true;
        // feed choice
        if (selected.name === "gridOption1") {
            colChoice = 24;
            rowChoice = 16;
        } else if (selected.name === "gridOption2") {
            colChoice = 14;
            rowChoice = 14;
        } else if (selected.name === "gridOption3") {
            colChoice = 5;
            rowChoice = 12;
        }
    } else if (type === "colour") {
        gameElems.colourOptionBtns.forEach(btn => {
            btn.checked = false;
        });
        selected.checked = true;
        // feed choice
        if (selected.name === "colourOption1") {
            gameElems.colourVars.style.setProperty('--player-1-colour', '#ffffff');
            gameElems.colourVars.style.setProperty('--player-2-colour', '#000000');
        } else if (selected.name === "colourOption2") {
            gameElems.colourVars.style.setProperty('--player-1-colour', '#F59501');
            gameElems.colourVars.style.setProperty('--player-2-colour', '#3572A0');
        } else if (selected.name === "colourOption3") {
            gameElems.colourVars.style.setProperty('--player-1-colour', '#EFF500');
            gameElems.colourVars.style.setProperty('--player-2-colour', '#7B00F5');
        }
    }
}


// ^ End of functions and classes...

// here are all the listeners
gameElems.startBtn.addEventListener('click', showSelect);
gameElems.contentStartBtn.addEventListener('click', showSelect);
gameElems.howBtn.addEventListener('click', showInstructions);
gameElems.playBtn.addEventListener('click', startGame);
gameElems.muteBtn.addEventListener('click', muteUnmute);
gameElems.homeBtn.addEventListener('click', backToTitle);
gameElems.gridOptionBtns.forEach((btn) => {
    btn.addEventListener('click', () => {selectOption(btn, "grid")});
});
gameElems.colourOptionBtns.forEach((btn) => {
    btn.addEventListener('click', () => {selectOption(btn, "colour")});
});




// OK BEGIN CONDITIONAL LOGIC *cries*
    
    document.addEventListener('keydown', (event) => {
        
        if (gameElems.gameScrn.style.display === "flex" && !grid.gameOver) {
            event.preventDefault();
            
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
            if (event.key === "g" && canPlayer1Shoot) {
                canPlayer1Shoot = false;
                player1.shootLeft();
                setTimeout(() => {
                    canPlayer1Shoot = true;
                }, 50);
            } else if (event.key === "j" && canPlayer1Shoot) {
                // debugger;
                canPlayer1Shoot = false;
                player1.shootRight();
                setTimeout(() => {
                    canPlayer1Shoot = true;
                }, 50);
            } else if (event.key === "h" && canPlayer1Shoot) {
                canPlayer1Shoot = false;
                player1.shootDown();
                setTimeout(() => {
                    canPlayer1Shoot = true;
                }, 50);
            } else if (event.key === "y" && canPlayer1Shoot) {
                canPlayer1Shoot = false;
                player1.shootUp();
                setTimeout(() => {
                    canPlayer1Shoot = true;
                }, 50);
            }

            // player2 bullets
            if (event.key === "4" && canPlayer2Shoot) {
                player2.shootLeft();
                canPlayer2Shoot = false;
                setTimeout(() => {
                    canPlayer2Shoot = true;
                }, 50);
            } else if (event.key === "6" && canPlayer2Shoot) {
                player2.shootRight();
                canPlayer2Shoot = false;
                setTimeout(() => {
                    canPlayer2Shoot = true;
                }, 50);
            } else if (event.key === "5" && canPlayer2Shoot) {
                player2.shootDown();
                canPlayer2Shoot = false;
                setTimeout(() => {
                    canPlayer2Shoot = true;
                }, 50);
            } else if (event.key === "8" && canPlayer2Shoot) {
                player2.shootUp();
                canPlayer2Shoot = false;
                setTimeout(() => {
                    canPlayer2Shoot = true;
                }, 50);
            }
        }
    });
