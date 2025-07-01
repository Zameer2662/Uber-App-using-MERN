
const socketIo = require('socket.io');
const userModel = require('./models/user.model'); // Assuming you have a user model
const captainModel = require('./models/captain.model'); // Assuming you have a capture model
const connectedSockets = new Map();
let io;


function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);
        connectedSockets.set(socket.id, socket);

        socket.on('join', async (data) => {
            const { userId, userType } = data;
            console.log(`User joined: ${userId}, Type: ${userType}`);

            if (userType === 'user') {
                await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
            } else if (userType === 'captain') {
                await captainModel.findByIdAndUpdate(userId, { socketId: socket.id });
            }
        });

        socket.on('update-location-captain ', async (data) => {
            const { userId, location } = data;
            if (
                !location ||
                typeof location.ltd !== 'number' ||
                typeof location.lang !== 'number' ||
                isNaN(location.ltd) ||
                isNaN(location.lang)
            ) {
                socket.emit('error', { message: 'Invalid location data' });
                return;
            }

            await captainModel.findByIdAndUpdate(userId,
                {
                    location: {
                        ltd: location.ltd,
                        lang: location.lang
                    }
                });
        })

        socket.on('disconnect', () => {
            console.log(`Socket disconnected: ${socket.id}`);

        });

        // Add more event handlers here if needed
    });
}

function sendMessageToSocketId(socketId, message) {
    const socket = connectedSockets.get(socketId);
    if (io) {
        io.to(socketId).emit('message', message);
        console.log(`Message sent to ${socketId}:`, message);
    } else {
        console.log(`Socket is not initialized.`);
    }
}

module.exports = {
    initializeSocket,
    sendMessageToSocketId
};
