
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
        console.log(`🔌 Socket connected: ${socket.id}`);
        connectedSockets.set(socket.id, socket);

        socket.on('join', async (data) => {
            const { userId, userType } = data;
            console.log(`👤 ${userType} joined:`, { userId, socketId: socket.id });

            try {
                if (userType === 'user') {
                    await userModel.findByIdAndUpdate(userId, { socketId: socket.id }, { new: true });
                    console.log(`✅ User socket updated: ${userId} -> ${socket.id}`);
                } else if (userType === 'captain') {
                    const captain = await captainModel.findByIdAndUpdate(userId, { socketId: socket.id }, { new: true });
                    console.log(`✅ Captain socket updated:`, {
                        name: captain ? `${captain.fullname.firstname} ${captain.fullname.lastname}` : 'Unknown',
                        id: userId,
                        socketId: socket.id
                    });
                }
            } catch (error) {
                console.error('❌ Error updating socket ID:', error);
            }
        });

        socket.on('update-location-captain', async (data) => {
            const { userId, location } = data;
            
            if (
                !location ||
                typeof location.ltd !== 'number' ||
                typeof location.lng !== 'number' ||
                isNaN(location.ltd) ||
                isNaN(location.lng)
            ) {
                socket.emit('error', { message: 'Invalid location data' });
                return;
            }

            try {
                const captain = await captainModel.findByIdAndUpdate(userId,
                    {
                        location: {
                            type: 'Point',
                            coordinates: [location.lng, location.ltd], // [longitude, latitude] for GeoJSON
                            ltd: location.ltd,
                            lng: location.lng
                        }
                    }, { new: true });
                
                console.log('📍 Captain location updated:', {
                    name: captain ? `${captain.fullname.firstname} ${captain.fullname.lastname}` : 'Unknown',
                    location: { lat: location.ltd, lng: location.lng }
                });
                
            } catch (error) {
                console.error('❌ Error updating captain location:', error);
                socket.emit('error', { message: 'Failed to update location' });
            }
        });

        socket.on('update-location-user', async (data) => {
            const { userId, location } = data;
            
            if (
                !location ||
                typeof location.ltd !== 'number' ||
                typeof location.lng !== 'number' ||
                isNaN(location.ltd) ||
                isNaN(location.lng)
            ) {
                socket.emit('error', { message: 'Invalid location data' });
                return;
            }

            try {
                const user = await userModel.findByIdAndUpdate(userId,
                    {
                        location: {
                            ltd: location.ltd,
                            lng: location.lng
                        }
                    }, { new: true });
                
                console.log('📍 User location updated:', {
                    name: user ? `${user.fullname.firstname} ${user.fullname.lastname}` : 'Unknown',
                    location: { lat: location.ltd, lng: location.lng }
                });
                
            } catch (error) {
                console.error('❌ Error updating user location:', error);
                socket.emit('error', { message: 'Failed to update location' });
            }
        })

        socket.on('disconnect', () => {
            console.log(`🔌 Socket disconnected: ${socket.id}`);
            connectedSockets.delete(socket.id);
        });

        // Add more event handlers here if needed
    });
}

function sendMessageToSocketId(socketId, messageObject) {
    if (io) {
        io.to(socketId).emit(messageObject.event, messageObject.data);
        console.log(`📤 Message sent to ${socketId}:`, {
            event: messageObject.event,
            rideId: messageObject.data?._id
        });
    } else {
        console.log(`❌ Socket is not initialized.`);
    }
}

module.exports = {
    initializeSocket,
    sendMessageToSocketId
};
