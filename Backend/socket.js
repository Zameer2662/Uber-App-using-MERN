const socketIo = require('socket.io');
const userModel = require('./models/user.model');
const captainModel = require('./models/captain.model');
const connectedSockets = new Map(); // Track connected sockets
let io;

/**
 * Initialize Socket.IO server with CORS configuration
 * @param {Object} server - HTTP server instance
 */
function initializeSocket(server) {
    io = socketIo(server, {
        cors: {
            origin: "*", // Allow all origins for development
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log(`🔌 Socket connected: ${socket.id}`);
        connectedSockets.set(socket.id, socket);

        // Handle user/captain joining their respective rooms
        socket.on('join', async (data) => {
            const { userId, userType } = data;
            console.log(`👤 ${userType} joined:`, { userId, socketId: socket.id });

            try {
                // Update user's socket ID for real-time communication
                if (userType === 'user') {
                    await userModel.findByIdAndUpdate(userId, { socketId: socket.id }, { new: true });
                    console.log(`✅ User socket updated: ${userId} -> ${socket.id}`);
                } else if (userType === 'captain') {
                    // Update captain's socket ID for ride notifications
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

        // Handle captain location updates for ride matching
        socket.on('update-location-captain', async (data) => {
            const { userId, location } = data;
            
            // Validate location data
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
                // Update captain's location in database
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

        // Handle user location updates for ride tracking
        socket.on('update-location-user', async (data) => {
            const { userId, location } = data;
            
            // Validate location data
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
                // Update user's location in database
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
        });

        // Live tracking location updates during rides
        socket.on('captain-location-update', async (data) => {
            const { rideId, location } = data;
            console.log('📍 Captain location update during ride:', { rideId, location });
            
            try {
                // Broadcast captain location to all users in the ride
                socket.broadcast.emit('captain-location-update', {
                    rideId,
                    location
                });
            } catch (error) {
                console.error('❌ Error broadcasting captain location:', error);
            }
        });

        socket.on('user-location-update', async (data) => {
            const { rideId, location } = data;
            console.log('📍 User location update during ride:', { rideId, location });
            
            try {
                // Broadcast user location to captain
                socket.broadcast.emit('user-location-update', {
                    rideId,
                    location
                });
            } catch (error) {
                console.error('❌ Error broadcasting user location:', error);
            }
        });

        // Ride end event: broadcast to user
        socket.on('ride-ended', (data) => {
            const { rideId } = data;
            console.log(`🏁 Ride ended for ride ${rideId}, broadcasting to user`);
            // broadcast to all except sender
            socket.broadcast.emit('ride-ended', { rideId });
        });

        socket.on('disconnect', () => {
            console.log(`🔌 Socket disconnected: ${socket.id}`);
            connectedSockets.delete(socket.id);
        });

        // Add more event handlers here if needed
    });
}

/**
 * Send message to specific socket ID
 * @param {string} socketId - Target socket ID
 * @param {Object} messageObject - Message object containing event and data
 */
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
