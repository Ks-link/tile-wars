const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const os = require('os');

const app = express();
const server = http.createServer(app);

// Configure Socket.io with CORS and better network support
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
    },
    transports: ['websocket', 'polling'],
    allowEIO3: true
});

const PORT = process.env.PORT || 3000;

// Get network IP address
function getNetworkIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Skip internal (loopback) and non-IPv4 addresses
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

// Serve static files
app.use(express.static(path.join(__dirname)));

// Add a simple test endpoint to verify server is reachable
app.get('/test', (req, res) => {
    res.json({ status: 'ok', message: 'Server is reachable', ip: req.ip });
    console.log('Test endpoint hit from:', req.ip);
});

// Track connected players
let connectedPlayers = [];
const MAX_PLAYERS = 2;

// Log connection attempts
io.engine.on('connection_error', (err) => {
    console.error('Socket.io connection error:', err);
});

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    console.log('Client IP:', socket.handshake.address);

    // Check if server is full
    if (connectedPlayers.length >= MAX_PLAYERS) {
        socket.emit('serverFull');
        socket.disconnect();
        return;
    }

    // Assign player role
    let playerRole;
    if (connectedPlayers.length === 0) {
        playerRole = 'player1';
    } else {
        playerRole = 'player2';
    }

    connectedPlayers.push({ id: socket.id, role: playerRole });
    socket.emit('assignedRole', playerRole);

    // Notify other players that a new player joined
    if (connectedPlayers.length > 1) {
        socket.broadcast.emit('playerJoined', playerRole);
        socket.emit('playerJoined', connectedPlayers.find(p => p.id !== socket.id).role);
    }

    console.log(`Player ${playerRole} connected. Total players: ${connectedPlayers.length}`);

    // Relay player movement
    socket.on('playerMove', (data) => {
        socket.broadcast.emit('playerMoved', {
            role: playerRole,
            x: data.x,
            y: data.y
        });
    });

    // Relay bullet creation
    socket.on('playerShoot', (data) => {
        socket.broadcast.emit('bulletFired', {
            role: playerRole,
            direction: data.direction,
            x: data.x,
            y: data.y
        });
    });

    // Relay tile flip
    socket.on('tileFlip', (data) => {
        socket.broadcast.emit('tileFlipped', {
            row: data.row,
            col: data.col,
            flipped: data.flipped
        });
    });

    // Relay game start (only from player1/host)
    socket.on('gameStart', (config) => {
        if (playerRole === 'player1') {
            io.emit('gameStarted', config);
        }
    });

    // Relay game over
    socket.on('gameOver', (data) => {
        socket.broadcast.emit('gameOver', {
            winner: data.winner,
            winnerRole: data.winnerRole
        });
    });

    // Relay clip update
    socket.on('clipUpdate', (data) => {
        socket.broadcast.emit('clipUpdated', {
            role: playerRole,
            clip: data.clip
        });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`Player ${playerRole} disconnected`);
        connectedPlayers = connectedPlayers.filter(p => p.id !== socket.id);
        socket.broadcast.emit('playerDisconnected', playerRole);
    });
});

// Listen on all network interfaces (0.0.0.0) to allow connections from other machines
server.listen(PORT, '0.0.0.0', () => {
    const networkIP = getNetworkIP();
    console.log(`\n========================================`);
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Network IP: http://${networkIP}:${PORT}`);
    console.log(`\nTo connect from another device on the same network, use: http://${networkIP}:${PORT}`);
    console.log(`\nTest connectivity: http://${networkIP}:${PORT}/test`);
    console.log(`\nMake sure your firewall allows connections on port ${PORT}`);
    console.log(`========================================\n`);
    
    // Log all network interfaces for debugging
    console.log('Available network interfaces:');
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4') {
                console.log(`  ${name}: ${iface.address} (${iface.internal ? 'internal' : 'external'})`);
            }
        }
    }
    console.log('');
});

