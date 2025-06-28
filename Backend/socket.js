const { Server } = require('socket.io');

let io = null;
const connectedSockets = new Map();

function initializeSocket(server) {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);
        connectedSockets.set(socket.id, socket);

        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);
            connectedSockets.delete(socket.id);
        });

        // Add more event handlers here if needed
    });
}

function sendMessageToSocketId(socketId, event, message) {
    const socket = connectedSockets.get(socketId);
    if (socket) {
        socket.emit(event, message);
        console.log(`Message sent to ${socketId} on event '${event}':`, message);
    } else {
        console.log(`Socket with id ${socketId} not found.`);
    }
}

module.exports = {
    initializeSocket,
    sendMessageToSocketId
};
