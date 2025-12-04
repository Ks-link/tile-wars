"use strict";

// grab elems/ screens
const gameElems = {
    startScrn: document.getElementById('start-screen'),
    howScrn: document.getElementById('how-screen'),
    selectScrn: document.getElementById('select-screen'),
    modeScrn: document.getElementById('mode-screen'),
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
    player2NameInput: document.getElementById('player2Name'),
    localModeBtn: document.getElementById('local-mode-btn'),
    networkModeBtn: document.getElementById('network-mode-btn'),
    networkConnection: document.getElementById('network-connection'),
    connectionStatus: document.getElementById('connection-status'),
    serverIpInput: document.getElementById('server-ip'),
    connectBtn: document.getElementById('connect-btn'),
    continueBtn: document.getElementById('continue-btn'),
    backModeBtn: document.getElementById('back-mode-btn')
}

// global vars
const gridArray = [];
const clipSize = 6;
const bulletSpeed = 40; // higher is sloweeeer
const moveSpeed = 120; // lower is faaaaster
const cellSize = 40; // read as px
let isMuted = true;
let canPlayer1Shoot = true;
let canPlayer2Shoot = true;
let player1;
let player2;
let grid;
let player1MovingIntervalId;
let player2MovingIntervalId;
let player1Moving = { direction: null };
let player2Moving = { direction: null };
let clipReload;
let checkClip;
let colChoice = 24;
let rowChoice = 16;
let player1Username = "Player 1";
let player2Username = "Player 2";

// Multiplayer variables
let multiplayerMode = 'local'; // 'local' or 'network'
let socket = null;
let myPlayerRole = null; // 'player1' or 'player2'
let isConnected = false;
let waitingForPlayer = false;
let lastPositionUpdate = { player1: { x: 0, y: 0, time: 0 }, player2: { x: 0, y: 0, time: 0 } };
const POSITION_UPDATE_THROTTLE = 100; // Only send position updates every 100ms



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
            clearInterval(player1MovingIntervalId);
            clearInterval(player2MovingIntervalId);

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
        const wasFlipped = this.flipped;
        if (!this.flipped) {
            this.elem.classList.add('flipped');
            this.flipped = true;
        } else if (this.flipped) {
            this.elem.classList.remove('flipped');
            this.flipped = false;
        }
        
        // In network mode, send tile flip to server
        if (multiplayerMode === 'network' && grid && gridArray) {
            // Find the row and col of this cell
            for (let r = 0; r < gridArray.length; r++) {
                for (let c = 0; c < gridArray[r].length; c++) {
                    if (gridArray[r][c] === this) {
                        sendTileFlip(r, c, this.flipped);
                        break;
                    }
                }
            }
        }
    }

    drawBullet(player, axis) {
        // handle left and right bullets
        if (axis === "x") {
            if (player === "blkPlayer") {
                const bulletElem = createElem('div', 'blkBulletX');
                this.elem.appendChild(bulletElem);
    
                // remove bullet after half a second
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

// Multiplayer functions
function initMultiplayer(serverUrl = 'http://localhost:3000') {
    // Check if socket.io is loaded
    if (typeof io === 'undefined') {
        console.error('Socket.io library not loaded!');
        updateConnectionStatus('Error: Socket.io library not loaded. Check your internet connection.');
        return;
    }
    
    if (socket) {
        socket.disconnect();
        socket.removeAllListeners();
    }
    
    updateConnectionStatus('Connecting...');
    console.log('Attempting to connect to:', serverUrl);
    
    try {
        // Try polling first for better network compatibility, then upgrade to websocket
        socket = io(serverUrl, {
            timeout: 20000, // Increased timeout for network connections
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            transports: ['polling', 'websocket'], // Try polling first (more reliable on some networks)
            upgrade: true,
            rememberUpgrade: false, // Don't remember upgrade to allow fallback
            forceNew: true // Force new connection
        });
        isConnected = false;
        waitingForPlayer = false;
        
        setupSocketListeners();
        
        socket.on('connect', () => {
            console.log('Connected to server');
            isConnected = true;
            updateConnectionStatus('Connected to server! Waiting for role assignment...');
            // Don't show continue button yet - wait for role assignment
            if (gameElems.continueBtn) {
                gameElems.continueBtn.style.display = 'none';
            }
        });
        
        socket.on('disconnect', () => {
            console.log('Disconnected from server');
            isConnected = false;
            updateConnectionStatus('Disconnected from server');
            if (gameElems.continueBtn) {
                gameElems.continueBtn.style.display = 'none';
            }
        });
        
        socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
            console.error('Error details:', {
                message: error.message,
                type: error.type,
                description: error.description
            });
            
            let errorMsg = 'Connection failed. ';
            if (error.message && error.message.includes('xhr poll error')) {
                errorMsg += 'Cannot reach server. Check:\n';
                errorMsg += '1. Server IP address is correct\n';
                errorMsg += '2. Server is running (check server console)\n';
                errorMsg += '3. Firewall allows connections on port 3000\n';
                errorMsg += '4. Both machines are on the same network';
            } else {
                errorMsg += error.message || 'Check server IP and make sure server is running.';
            }
            
            updateConnectionStatus(errorMsg);
            isConnected = false;
            if (gameElems.continueBtn) {
                gameElems.continueBtn.style.display = 'none';
            }
        });
        
        // Add timeout check (longer than socket.io timeout to allow it to handle errors)
        setTimeout(() => {
            if (!isConnected && socket && !socket.connected) {
                console.error('Connection timeout');
                updateConnectionStatus('Connection timeout. Check server IP, firewall, and make sure server is running.');
                if (socket) {
                    socket.disconnect();
                }
            }
        }, 25000);
        
    } catch (error) {
        console.error('Error initializing socket:', error);
        updateConnectionStatus('Error connecting. Check console for details.');
    }
}

function setupSocketListeners() {
    if (!socket) return;
    
    socket.on('assignedRole', (role) => {
        myPlayerRole = role;
        console.log('Assigned role:', role);
        waitingForPlayer = (role === 'player1');
        
        // If player 1 (host), show continue button to access game options
        if (role === 'player1') {
            updateConnectionStatus('Connected as Player 1 (Host). Click "Continue to Game Options" to configure.');
            if (gameElems.continueBtn) {
                gameElems.continueBtn.style.display = 'block';
            }
        } else {
            // Player 2 - hide continue button and show waiting message
            updateConnectionStatus('Connected as Player 2. Waiting for host to configure and start game...');
            if (gameElems.continueBtn) {
                gameElems.continueBtn.style.display = 'none';
            }
        }
    });
    
    socket.on('playerJoined', (role) => {
        console.log('Other player joined:', role);
        if (myPlayerRole && myPlayerRole !== role) {
            waitingForPlayer = false;
            updateConnectionStatus(`Both players connected! (You are ${myPlayerRole === 'player1' ? 'Player 1' : 'Player 2'})`);
        }
    });
    
    socket.on('playerMoved', (data) => {
        if (multiplayerMode === 'network' && data.role !== myPlayerRole && grid && !grid.gameOver) {
            const remotePlayer = data.role === 'player1' ? player1 : player2;
            if (remotePlayer && gridArray && gridArray[data.y - 1] && gridArray[data.y - 1][data.x - 1]) {
                remotePlayer.x = data.x;
                remotePlayer.y = data.y;
                drawPlayer(remotePlayer);
            }
        }
    });
    
    socket.on('bulletFired', (data) => {
        if (multiplayerMode === 'network' && data.role !== myPlayerRole && grid && !grid.gameOver) {
            const remotePlayer = data.role === 'player1' ? player1 : player2;
            if (remotePlayer && gridArray && gridArray[data.y - 1] && gridArray[data.y - 1][data.x - 1]) {
                createBullet(remotePlayer, data.direction, true);
            }
        }
    });
    
    socket.on('tileFlipped', (data) => {
        if (multiplayerMode === 'network' && gridArray[data.row] && gridArray[data.row][data.col]) {
            const cell = gridArray[data.row][data.col];
            if (cell.flipped !== data.flipped) {
                cell.flip();
            }
        }
    });
    
    socket.on('gameStarted', (config) => {
        if (multiplayerMode === 'network') {
            console.log('Game started event received, config:', config);
            colChoice = config.cols;
            rowChoice = config.rows;
            player1Username = config.player1Name;
            player2Username = config.player2Name;
            
            // Apply color scheme if provided
            if (config.colourScheme) {
                gameElems.colourVars.style.setProperty('--player-1-colour', config.colourScheme.player1);
                gameElems.colourVars.style.setProperty('--player-2-colour', config.colourScheme.player2);
            }
            
            // Close all screens and show game screen (for both players)
            gameElems.startScrn.style.display = 'none';
            gameElems.howScrn.style.display = 'none';
            gameElems.selectScrn.style.display = 'none';
            gameElems.modeScrn.style.display = 'none';
            gameElems.gameScrn.style.display = 'flex';
            gameElems.homeBtn.style.display = 'none';
            
            // Hide network connection UI
            if (gameElems.networkConnection) {
                gameElems.networkConnection.style.display = 'none';
            }
            
            console.log('Starting game for player:', myPlayerRole);
            // Force start for both players when gameStarted event is received
            startGame(true);
        }
    });
    
    socket.on('gameOver', (data) => {
        if (multiplayerMode === 'network') {
            const winner = data.winnerRole === 'player1' ? player1 : player2;
            if (winner) {
                endGame(winner);
            }
        }
    });
    
    socket.on('clipUpdated', (data) => {
        if (multiplayerMode === 'network' && data.role !== myPlayerRole) {
            const remotePlayer = data.role === 'player1' ? player1 : player2;
            if (remotePlayer) {
                remotePlayer.clip = data.clip;
            }
        }
    });
    
    socket.on('playerDisconnected', (role) => {
        console.log('Player disconnected:', role);
        updateConnectionStatus('Other player disconnected');
        if (grid && !grid.gameOver) {
            alert('Other player disconnected. Returning to menu.');
            backToTitle();
        }
    });
    
    socket.on('serverFull', () => {
        alert('Server is full. Maximum 2 players allowed.');
        updateConnectionStatus('Server full');
    });
}

function sendPlayerMove(x, y) {
    if (socket && isConnected && multiplayerMode === 'network') {
        socket.emit('playerMove', { x, y });
    }
}

function sendPlayerShoot(direction, x, y) {
    if (socket && isConnected && multiplayerMode === 'network') {
        socket.emit('playerShoot', { direction, x, y });
    }
}

function sendTileFlip(row, col, flipped) {
    if (socket && isConnected && multiplayerMode === 'network') {
        socket.emit('tileFlip', { row, col, flipped });
    }
}

function sendGameStart(config) {
    if (socket && isConnected && multiplayerMode === 'network' && myPlayerRole === 'player1') {
        socket.emit('gameStart', config);
    }
}

function sendGameOver(winner, winnerRole) {
    if (socket && isConnected && multiplayerMode === 'network') {
        socket.emit('gameOver', { winner, winnerRole });
    }
}

function sendClipUpdate(clip) {
    if (socket && isConnected && multiplayerMode === 'network') {
        socket.emit('clipUpdate', { clip });
    }
}

function selectMultiplayerMode(mode) {
    console.log('selectMultiplayerMode called with:', mode);
    multiplayerMode = mode;
    if (mode === 'local') {
        console.log('Setting up local mode');
        if (socket) {
            socket.disconnect();
            socket = null;
        }
        isConnected = false;
        myPlayerRole = null;
        waitingForPlayer = false;
        showSelect();
    } else if (mode === 'network') {
        console.log('Setting up network mode');
        console.log('Mode screen element:', gameElems.modeScrn);
        console.log('Network connection element:', gameElems.networkConnection);
        
        if (!gameElems.modeScrn) {
            console.error('Mode screen element not found!');
            alert('Error: Mode screen element not found. Check console for details.');
            return;
        }
        
        gameElems.startScrn.style.display = 'none';
        gameElems.howScrn.style.display = 'none';
        gameElems.selectScrn.style.display = 'none';
        gameElems.modeScrn.style.display = 'block';
        
        if (gameElems.networkConnection) {
            gameElems.networkConnection.style.display = 'block';
        } else {
            console.error('Network connection element not found!');
        }
        
        if (gameElems.homeBtn) {
            gameElems.homeBtn.style.display = 'block';
        }
        
        // Reset connection status - show instructions
        updateConnectionStatus('Enter server IP and click Connect');
        if (gameElems.continueBtn) {
            gameElems.continueBtn.style.display = 'none';
        }
        // Reset connection state
        isConnected = false;
        myPlayerRole = null;
        waitingForPlayer = false;
        
        console.log('Network mode setup complete');
    }
}

function updateConnectionStatus(status) {
    console.log('Connection status:', status);
    if (gameElems.connectionStatus) {
        gameElems.connectionStatus.textContent = status;
    } else {
        console.error('Connection status element not found!');
    }
}

function createPlayers() {
    // set usernames
    // handle usernames with spaces
    // if name is blank default will take over
    gameElems.player1NameInput.value = gameElems.player1NameInput.value.trim();
    if (gameElems.player1NameInput.value != '') {
        player1Username = gameElems.player1NameInput.value;
    } 
    gameElems.player2NameInput.value = gameElems.player2NameInput.value.trim();
    if (gameElems.player2NameInput.value != '') {
        player2Username = gameElems.player2NameInput.value;
    } 
    
    // In network mode, only create the local player
    if (multiplayerMode === 'network') {
        if (myPlayerRole === 'player1') {
            player1 = new Player(
                player1Username,
                "whtPlayer",
                3,
                3,
                '<svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m11.262 2.306c.196-.196.461-.306.738-.306s.542.11.738.306c1.917 1.917 7.039 7.039 8.956 8.956.196.196.306.461.306.738s-.11.542-.306.738c-1.917 1.917-7.039 7.039-8.956 8.956-.196.196-.461.306-.738.306s-.542-.11-.738-.306c-1.917-1.917-7.039-7.039-8.956-8.956-.196-.196-.306-.461-.306-.738s.11-.542.306-.738c1.917-1.917 7.039-7.039 8.956-8.956z" fill-rule="nonzero"/></svg>'
            );
            // Create placeholder for player2 (will be updated when they connect)
            player2 = new Player(
                player2Username,
                "blkPlayer",
                grid.cols - 2,
                grid.rows - 2,
                '<svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m11.262 2.306c.196-.196.461-.306.738-.306s.542.11.738.306c1.917 1.917 7.039 7.039 8.956 8.956.196.196.306.461.306.738s-.11.542-.306.738c-1.917 1.917-7.039 7.039-8.956 8.956-.196.196-.461.306-.738.306s-.542-.11-.738-.306c-1.917-1.917-7.039-7.039-8.956-8.956-.196-.196-.306-.461-.306-.738s.11-.542.306-.738c1.917-1.917 7.039-7.039 8.956-8.956z" fill-rule="nonzero"/></svg>'
            );
        } else if (myPlayerRole === 'player2') {
            // Create placeholder for player1
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
        }
    } else {
        // Local mode - create both players
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
    }

    // clip logic
    clipReload = setInterval(() => {
        if (player1 && player1.clip < clipSize) {
            player1.clip++;
            if (multiplayerMode === 'network' && myPlayerRole === 'player1') {
                sendClipUpdate(player1.clip);
            }
        }
        if (player2 && player2.clip < clipSize) {
            player2.clip++;
            if (multiplayerMode === 'network' && myPlayerRole === 'player2') {
                sendClipUpdate(player2.clip);
            }
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
    // Safety check - ensure grid and player position are valid
    if (!player || !gridArray || !gridArray[player.y - 1] || !gridArray[player.y - 1][player.x - 1]) {
        return;
    }
    
    player.elem.remove();
    player.elem = createElem('div', player.name);
    gridArray[player.y - 1][player.x - 1].elem.appendChild(player.elem);
    player.elem.innerHTML = player.svg;
    
    // In network mode, send position update to server for local player (throttled)
    if (multiplayerMode === 'network' && myPlayerRole) {
        const isLocalPlayer = (myPlayerRole === 'player1' && player.name === 'whtPlayer') ||
                             (myPlayerRole === 'player2' && player.name === 'blkPlayer');
        if (isLocalPlayer) {
            const playerKey = myPlayerRole;
            const now = Date.now();
            const lastUpdate = lastPositionUpdate[playerKey];
            
            // Only send update if position changed AND enough time has passed
            if ((player.x !== lastUpdate.x || player.y !== lastUpdate.y) && 
                (now - lastUpdate.time >= POSITION_UPDATE_THROTTLE)) {
                sendPlayerMove(player.x, player.y);
                lastPositionUpdate[playerKey] = { x: player.x, y: player.y, time: now };
            }
        }
    }
}

function createBullet(player, direction, isRemote = false) {
    if (!isRemote) {
        player.clip--;
        sendClipUpdate(player.clip);
        if (!isMuted) {
            const shootSound = new Audio("./media/shoot.mp3");
            shootSound.play();
        }
        
        // In network mode, send bullet creation to server
        if (multiplayerMode === 'network') {
            sendPlayerShoot(direction, player.x, player.y);
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

function startGame(forceStart = false) {
    // Check if network mode and both players connected
    if (multiplayerMode === 'network') {
        if (!isConnected) {
            alert('Not connected to server. Please connect first.');
            return;
        }
        // Allow player2 to start if forceStart is true (called from gameStarted event)
        if (myPlayerRole === 'player2' && !forceStart) {
            // Player 2 waits for game start from server (handled in socket listener)
            updateConnectionStatus('Waiting for host to start game...');
            return;
        }
        if (myPlayerRole === 'player1' && waitingForPlayer && !forceStart) {
            alert('Waiting for another player to connect...');
            return;
        }
    }
    
    // DOM
    gameElems.startScrn.style.display = 'none';
    gameElems.howScrn.style.display = 'none';
    gameElems.selectScrn.style.display = 'none';
    gameElems.modeScrn.style.display = 'none';
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
    
    // Reset position update tracking
    if (multiplayerMode === 'network') {
        if (player1) {
            lastPositionUpdate.player1 = { x: player1.x, y: player1.y, time: Date.now() };
        }
        if (player2) {
            lastPositionUpdate.player2 = { x: player2.x, y: player2.y, time: Date.now() };
        }
    }
    
    // In network mode, if player1, send game config to server
    if (multiplayerMode === 'network' && myPlayerRole === 'player1') {
        const config = {
            cols: colChoice,
            rows: rowChoice,
            player1Name: player1Username,
            player2Name: player2Username,
            colourScheme: {
                player1: getComputedStyle(gameElems.colourVars).getPropertyValue('--player-1-colour').trim(),
                player2: getComputedStyle(gameElems.colourVars).getPropertyValue('--player-2-colour').trim()
            }
        };
        sendGameStart(config);
    }

    // Clear existing grid to prevent duplicates
    gameElems.gameBoard.innerHTML = '';
    gridArray.length = 0; // Clear the grid array
    
    // add variability to grid size
    gameElems.gameBoard.style.gridTemplateColumns = `repeat(${grid.cols}, ${cellSize}px`;
    gameElems.gameBoard.style.gridTemplateRows = `repeat(${grid.rows}, ${cellSize}px`;

    // add clip depending on clipSize
    gameElems.player1Clip.style.gridTemplateColumns = `15px`;
    gameElems.player1Clip.style.gridTemplateRows = `repeat(${clipSize}, 25px`;
    gameElems.player2Clip.style.gridTemplateColumns = `15px`;
    gameElems.player2Clip.style.gridTemplateRows = `repeat(${clipSize}, 25px`;
    
    // Clear existing clip elements
    gameElems.player1Clip.innerHTML = '';
    gameElems.player2Clip.innerHTML = '';
    
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
    // In network mode, send game over to server
    if (multiplayerMode === 'network') {
        const winnerRole = player.name === 'whtPlayer' ? 'player1' : 'player2';
        sendGameOver(player.username, winnerRole);
    }
    
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
    gameElems.modeScrn.style.display = 'none';
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
    if (socket && multiplayerMode === 'network') {
        socket.disconnect();
        socket = null;
        isConnected = false;
        myPlayerRole = null;
        multiplayerMode = 'local';
    }
    gameElems.startScrn.style.display = 'block';
    gameElems.howScrn.style.display = 'none';
    gameElems.selectScrn.style.display = 'none';
    gameElems.modeScrn.style.display = 'none';
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
        // feed choice to var
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

function keepMovingPlayer1(direction) {
    player1MovingIntervalId = setInterval(() => {
        if (!player1 || !grid || grid.gameOver) {
            clearInterval(player1MovingIntervalId);
            return;
        }
        switch (direction) {
            case player1.x > 1 && gridArray[player1.y - 1] && gridArray[player1.y - 1][player1.x - 2] && gridArray[player1.y - 1][player1.x - 2].flipped === true && 'left':
                player1.moveLeft();
            break;

            case player1.x < grid.cols && gridArray[player1.y - 1] && gridArray[player1.y - 1][player1.x] && gridArray[player1.y - 1][player1.x].flipped === true && 'right':
                player1.moveRight();
            break;

            case player1.y < grid.rows && gridArray[player1.y] && gridArray[player1.y][player1.x - 1] && gridArray[player1.y][player1.x - 1].flipped === true && 'down':
                player1.moveDown();
            break;

            case player1.y > 1 && gridArray[player1.y - 2] && gridArray[player1.y - 2][player1.x - 1] && gridArray[player1.y - 2][player1.x - 1].flipped === true && 'up':
                player1.moveUp();
            break;
            
        default:
            break;
        }
        
    }, moveSpeed);
    return {direction: direction};
}

function keepMovingPlayer2(direction) {
    player2MovingIntervalId = setInterval(() => {
        if (!player2 || !grid || grid.gameOver) {
            clearInterval(player2MovingIntervalId);
            return;
        }
        switch (direction) {
            case player2.x > 1 && gridArray[player2.y - 1] && gridArray[player2.y - 1][player2.x - 2] && gridArray[player2.y - 1][player2.x - 2].flipped === false && 'left':
                player2.moveLeft();
            break;

            case player2.x < grid.cols && gridArray[player2.y - 1] && gridArray[player2.y - 1][player2.x] && gridArray[player2.y - 1][player2.x].flipped === false && 'right':
                player2.moveRight();
            break;

            case player2.y < grid.rows && gridArray[player2.y] && gridArray[player2.y][player2.x - 1] && gridArray[player2.y][player2.x - 1].flipped === false && 'down':
                player2.moveDown();
            break;

            case player2.y > 1 && gridArray[player2.y - 2] && gridArray[player2.y - 2][player2.x - 1] && gridArray[player2.y - 2][player2.x - 1].flipped === false && 'up':
                player2.moveUp();
            break;
            
        default:
            break;
        }
    }, moveSpeed);
    return {direction: direction};
}


// ^ End of functions and classes...

// here are all the listeners
gameElems.startBtn.addEventListener('click', showModeSelection);
gameElems.contentStartBtn.addEventListener('click', showModeSelection);
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

// Function to setup mode selection listeners
function setupModeSelectionListeners() {
    console.log('Setting up mode selection listeners...');
    
    if (gameElems.localModeBtn) {
        console.log('Local mode button found, adding listener');
        gameElems.localModeBtn.addEventListener('click', () => {
            console.log('Local mode button clicked');
            selectMultiplayerMode('local');
        });
    } else {
        console.error('Local mode button NOT found!');
    }

    if (gameElems.networkModeBtn) {
        console.log('Network mode button found, adding listener');
        gameElems.networkModeBtn.addEventListener('click', (e) => {
            console.log('Network mode button clicked', e);
            e.preventDefault();
            e.stopPropagation();
            selectMultiplayerMode('network');
        });
    } else {
        console.error('Network mode button NOT found!');
        console.error('Looking for element with id: network-mode-btn');
        const testBtn = document.getElementById('network-mode-btn');
        console.error('Direct query result:', testBtn);
        
        // Try again after a short delay
        setTimeout(() => {
            const retryBtn = document.getElementById('network-mode-btn');
            if (retryBtn) {
                console.log('Found button on retry, adding listener');
                retryBtn.addEventListener('click', (e) => {
                    console.log('Network mode button clicked (retry)');
                    e.preventDefault();
                    selectMultiplayerMode('network');
                });
            } else {
                console.error('Button still not found after retry');
            }
        }, 1000);
    }
}

// Setup listeners when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupModeSelectionListeners);
} else {
    // DOM is already ready
    setupModeSelectionListeners();
}

if (gameElems.connectBtn) {
    gameElems.connectBtn.addEventListener('click', async () => {
        console.log('Connect button clicked');
        let serverIp = gameElems.serverIpInput.value.trim() || 'localhost';
        
        // Remove port if already included
        if (serverIp.includes(':')) {
            serverIp = serverIp.split(':')[0];
        }
        
        // Remove http:// if included
        serverIp = serverIp.replace(/^https?:\/\//, '');
        
        const serverUrl = `http://${serverIp}:3000`;
        console.log('Connecting to:', serverUrl);
        updateConnectionStatus('Connecting...');
        if (gameElems.continueBtn) {
            gameElems.continueBtn.style.display = 'none';
        }
        
        // First test if server is reachable via HTTP
        try {
            console.log('Testing server connectivity to:', `${serverUrl}/test`);
            updateConnectionStatus('Testing server connectivity...');
            const testUrl = `${serverUrl}/test`;
            const response = await fetch(testUrl, { 
                method: 'GET',
                signal: AbortSignal.timeout(10000) // 10 second timeout
            });
            if (response.ok) {
                const data = await response.json();
                console.log('✓ Server is reachable:', data);
                updateConnectionStatus('Server reachable, connecting...');
            } else {
                console.warn('Server responded but with error:', response.status);
                updateConnectionStatus(`Server responded with error ${response.status}. Trying socket connection...`);
            }
        } catch (error) {
            console.error('✗ Server connectivity test failed:', error);
            console.error('This means the server is NOT reachable at:', serverUrl);
            updateConnectionStatus(`Cannot reach server at ${serverUrl}. Check:\n- Server is running\n- IP address is correct\n- Firewall allows port 3000\n- Both machines on same network`);
            
            // Don't try socket connection if HTTP test fails
            if (gameElems.continueBtn) {
                gameElems.continueBtn.style.display = 'none';
            }
            return; // Stop here, don't try socket connection
        }
        
        initMultiplayer(serverUrl);
    });
} else {
    console.error('Connect button not found!');
}

if (gameElems.continueBtn) {
    gameElems.continueBtn.addEventListener('click', () => {
        if (isConnected) {
            // Only player 1 (host) can access game options
            if (myPlayerRole === 'player1') {
                showSelect();
            } else {
                updateConnectionStatus('Waiting for host to configure and start game...');
            }
        } else {
            alert('Not connected to server. Please connect first.');
        }
    });
}

if (gameElems.backModeBtn) {
    gameElems.backModeBtn.addEventListener('click', () => {
        if (socket) {
            socket.disconnect();
            socket = null;
        }
        showModeSelection();
    });
}

function showModeSelection() {
    gameElems.startScrn.style.display = 'none';
    gameElems.howScrn.style.display = 'none';
    gameElems.selectScrn.style.display = 'none';
    gameElems.modeScrn.style.display = 'block';
    gameElems.networkConnection.style.display = 'none';
    gameElems.homeBtn.style.display = 'block';
}


// OK BEGIN CONDITIONAL LOGIC *cries*

document.addEventListener('keydown', (event) => {
    
    if (gameElems.gameScrn.style.display === "flex" && grid && !grid.gameOver) {
        event.preventDefault();
        
        // In network mode, only handle keys for assigned player
        const isPlayer1Key = ['a', 'd', 's', 'w', 'g', 'j', 'h', 'y'].includes(event.key.toLowerCase());
        const isPlayer2Key = ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp', '4', '6', '5', '8'].includes(event.key);
        
        if (multiplayerMode === 'network') {
            // Only process keys if we have a role assigned
            if (!myPlayerRole) return;
            if (myPlayerRole === 'player1' && !isPlayer1Key) return;
            if (myPlayerRole === 'player2' && !isPlayer2Key) return;
        }
        
        // player1 movement
        // need to check grid bounds here to avoid checking cell that doesn't exsit after key press
        if (player1 && player1.x > 1 && gridArray[player1.y - 1] && gridArray[player1.y - 1][player1.x - 2] && gridArray[player1.y - 1][player1.x - 2].flipped === true && event.key === "a" && !event.repeat) {
            // clear movement interval (I only needed one afterall!)
            clearInterval(player1MovingIntervalId);
            player1.moveLeft();
            // call movement function and store results for cancel
            player1Moving = keepMovingPlayer1('left');
        } else if (player1 && player1.x < grid.cols && gridArray[player1.y - 1] && gridArray[player1.y - 1][player1.x] && gridArray[player1.y - 1][player1.x].flipped === true && event.key === "d" && !event.repeat) {
            clearInterval(player1MovingIntervalId);
            player1.moveRight();
            player1Moving = keepMovingPlayer1('right');
        } else if (player1 && player1.y < grid.rows && gridArray[player1.y] && gridArray[player1.y][player1.x - 1] && gridArray[player1.y][player1.x - 1].flipped === true && event.key === "s" && !event.repeat) {
            clearInterval(player1MovingIntervalId);
            player1.moveDown();
            player1Moving = keepMovingPlayer1('down');
        } else if (player1 && player1.y > 1 && gridArray[player1.y - 2] && gridArray[player1.y - 2][player1.x - 1] && gridArray[player1.y - 2][player1.x - 1].flipped === true && event.key === "w" && !event.repeat) {
            clearInterval(player1MovingIntervalId);
            player1.moveUp();
            player1Moving = keepMovingPlayer1('up');
        }

        // player2 movement
        if (player2 && player2.x > 1 && gridArray[player2.y - 1] && gridArray[player2.y - 1][player2.x - 2] && gridArray[player2.y - 1][player2.x - 2].flipped === false && event.key === "ArrowLeft" && !event.repeat) {
            clearInterval(player2MovingIntervalId);
            player2.moveLeft();
            player2Moving = keepMovingPlayer2('left');
        } else if (player2 && player2.x < grid.cols && gridArray[player2.y - 1] && gridArray[player2.y - 1][player2.x] && gridArray[player2.y - 1][player2.x].flipped === false && event.key === "ArrowRight" && !event.repeat) {
            clearInterval(player2MovingIntervalId);
            player2.moveRight();
            player2Moving = keepMovingPlayer2('right');
        } else if (player2 && player2.y < grid.rows && gridArray[player2.y] && gridArray[player2.y][player2.x - 1] && gridArray[player2.y][player2.x - 1].flipped === false && event.key === "ArrowDown" && !event.repeat) {
            clearInterval(player2MovingIntervalId);
            player2.moveDown();
            player2Moving = keepMovingPlayer2('down');
        } else if (player2 && player2.y > 1 && gridArray[player2.y - 2] && gridArray[player2.y - 2][player2.x - 1] && gridArray[player2.y - 2][player2.x - 1].flipped === false && event.key === "ArrowUp" && !event.repeat) {
            clearInterval(player2MovingIntervalId);
            player2.moveUp();
            player2Moving = keepMovingPlayer2('up');
        }
        
        // player1 bullets
        // timeout is to prevent bullet spam
        if (player1 && event.key === "g" && canPlayer1Shoot) {
            canPlayer1Shoot = false;
            player1.shootLeft();
            setTimeout(() => {
                canPlayer1Shoot = true;
            }, 50);
        } else if (player1 && event.key === "j" && canPlayer1Shoot) {
            canPlayer1Shoot = false;
            player1.shootRight();
            setTimeout(() => {
                canPlayer1Shoot = true;
            }, 50);
        } else if (player1 && event.key === "h" && canPlayer1Shoot) {
            canPlayer1Shoot = false;
            player1.shootDown();
            setTimeout(() => {
                canPlayer1Shoot = true;
            }, 50);
        } else if (player1 && event.key === "y" && canPlayer1Shoot) {
            canPlayer1Shoot = false;
            player1.shootUp();
            setTimeout(() => {
                canPlayer1Shoot = true;
            }, 50);
        }

        // player2 bullets
        if (player2 && event.key === "4" && canPlayer2Shoot) {
            player2.shootLeft();
            canPlayer2Shoot = false;
            setTimeout(() => {
                canPlayer2Shoot = true;
            }, 50);
        } else if (player2 && event.key === "6" && canPlayer2Shoot) {
            player2.shootRight();
            canPlayer2Shoot = false;
            setTimeout(() => {
                canPlayer2Shoot = true;
            }, 50);
        } else if (player2 && event.key === "5" && canPlayer2Shoot) {
            player2.shootDown();
            canPlayer2Shoot = false;
            setTimeout(() => {
                canPlayer2Shoot = true;
            }, 50);
        } else if (player2 && event.key === "8" && canPlayer2Shoot) {
            player2.shootUp();
            canPlayer2Shoot = false;
            setTimeout(() => {
                canPlayer2Shoot = true;
            }, 50);
        }
    }
});

// clear movement interval on keyup, but only if the player is currently moving in that direction!
document.addEventListener('keyup', (event) => {

    if (gameElems.gameScrn.style.display === "flex" && grid && !grid.gameOver) {
        event.preventDefault();
        
        // In network mode, only handle keys for assigned player
        const isPlayer1Key = ['a', 'd', 's', 'w'].includes(event.key.toLowerCase());
        const isPlayer2Key = ['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp'].includes(event.key);
        
        if (multiplayerMode === 'network') {
            // Only process keys if we have a role assigned
            if (!myPlayerRole) return;
            if (myPlayerRole === 'player1' && !isPlayer1Key) return;
            if (myPlayerRole === 'player2' && !isPlayer2Key) return;
        }

        // player 1
        if (player1Moving && event.key === "a" && player1Moving.direction === 'left') {
            clearInterval(player1MovingIntervalId);
        }
        if (event.key === "d" && player1Moving.direction === 'right') {
            clearInterval(player1MovingIntervalId);
        }
        if (event.key === "s" && player1Moving.direction === 'down') {
            clearInterval(player1MovingIntervalId);
        }
        if (event.key === "w" && player1Moving.direction === 'up') {
            clearInterval(player1MovingIntervalId);
        }

        // player 2
        if (player2Moving && event.key === "ArrowLeft" && player2Moving.direction === 'left') {
            clearInterval(player2MovingIntervalId);
        }
        if (event.key === "ArrowRight" && player2Moving.direction === 'right') {
            clearInterval(player2MovingIntervalId);
        }
        if (event.key === "ArrowDown" && player2Moving.direction === 'down') {
            clearInterval(player2MovingIntervalId);
        }
        if (event.key === "ArrowUp" && player2Moving.direction === 'up') {
            clearInterval(player2MovingIntervalId);
        }
    }
});

// Done!