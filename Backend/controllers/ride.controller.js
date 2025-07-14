const rideService = require ('../Services/ride.service');
const {validationResult} = require ('express-validator');
const mapService = require ('../Services/maps.service');
const rideModel = require('../models/ride.model');
const {sendMessageToSocketId} = require('../socket');
const Ride = require('../models/ride.model');
const Captain = require('../models/captain.model');
const mongoose = require('mongoose');


module.exports.createRide = async(req , res) => {
 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {userId , pickup , destination , vehicleType} = req.body;

        try {
            const ride = await rideService.createRide({ user: req.user._id, pickup, destination, vehicleType });
            console.log('✅ Ride created successfully:', {
                rideId: ride._id,
                userId: req.user._id,
                pickup: pickup,
                destination: destination,
                vehicleType: vehicleType
            });

            // Send response first to avoid header issues
            res.status(201).json({ ride });

            // Process captain notifications asynchronously
            const processNotifications = async () => {
                try {
                    const pickupCoordinates = await mapService.getAddressCoordinate(pickup);
                    
                    if (!pickupCoordinates || !pickupCoordinates.ltd || !pickupCoordinates.lng) {
                        console.error('❌ Invalid pickup coordinates for address:', pickup);
                        return;
                    }

                    console.log('📍 Pickup coordinates:', {
                        address: pickup,
                        coordinates: pickupCoordinates
                    });

                    const captainsInRadius = await mapService.getCaptainsInTheRadius(pickupCoordinates.ltd, pickupCoordinates.lng, 2);
                    
                    // If no captains in radius, get all connected captains for testing
                    let availableCaptains = captainsInRadius;
                    if (captainsInRadius.length === 0) {
                        console.log('⚠️ No captains in 2km radius, checking all connected captains...');
                        const allConnectedCaptains = await mapService.getAllConnectedCaptains();
                        availableCaptains = allConnectedCaptains;
                        console.log('🔍 Found connected captains for fallback:', availableCaptains.length);
                    }
                    
                    if (availableCaptains.length > 0) {
                        // Send ride notification to all available captains
                        const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');
                        
                        console.log('📨 Sending ride notifications to captains...');
                        let notificationsSent = 0;
                        
                        availableCaptains.forEach((captain) => {
                            if (captain.socketId) {
                                console.log('🚗 Notifying captain:', {
                                    name: `${captain.fullname.firstname} ${captain.fullname.lastname}`,
                                    socketId: captain.socketId,
                                    location: captain.location
                                });
                                
                                sendMessageToSocketId(captain.socketId, {
                                    event: 'new-ride',
                                    data: rideWithUser
                                });
                                notificationsSent++;
                            } else {
                                console.log('⚠️ Captain has no active socket:', captain.fullname.firstname);
                            }
                        });
                        
                        console.log(`✅ Ride notifications sent to ${notificationsSent} captains`);
                    } else {
                        console.log('❌ No available captains found');
                    }
                } catch (notificationError) {
                    console.error('❌ Error processing captain notifications:', notificationError.message);
                }
            };

            // Process notifications without blocking the response
            processNotifications();
            
        } catch (error) {
            console.error('❌ Error in ride creation process:', error.message);
            if (!res.headersSent) {
                return res.status(500).json({ error: error.message || 'Internal Server Error' });
            }
        }

}


module.exports.getFare = async(req , res )=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()});

    }

    const {pickup , destination} = req.query;

    try {
        const fare = await rideService.getFare(pickup,destination);
        return res.status(200).json(fare);
        
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

module.exports.confirmRide = async(req , res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()});
    }

    const {rideId, captainId} = req.body;

    console.log('🚨 Captain confirming ride:', { rideId, captainId });

    try {
        const ride = await rideService.confirmRide({rideId, captainId});

        console.log('📱 Sending ride confirmation to user:', {
            userId: ride.user._id,
            userName: `${ride.user.fullname.firstname} ${ride.user.fullname.lastname}`,
            userSocket: ride.user.socketId,
            captainName: `${ride.captain.fullname.firstname} ${ride.captain.fullname.lastname}`,
            otp: ride.otp
        });

        // Send response first
        res.status(200).json(ride);

        // Then send socket notification
        if (ride.user.socketId) {
            console.log('🚀 Emitting ride-confirmed event to user socket:', ride.user.socketId);
            sendMessageToSocketId(ride.user.socketId, {
                event: 'ride-confirmed',
                data: ride
            });
            console.log('✅ Socket event sent successfully');
        } else {
            console.log('⚠️ User has no active socket connection');
        }
        
    } catch (error) {
        console.error('❌ Error confirming ride:', error.message);
        if (!res.headersSent) {
            return res.status(500).json({message: error.message});
        }
    }
}

module.exports.startRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { rideId, otp } = req.query;

    console.log('🚀 Captain starting ride:', { rideId, otp });

    try {
        // Find the ride by ID
        const ride = await rideModel.findById(rideId).populate('user captain').select('+otp');
        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        console.log('📝 Ride details:', {
            rideId: ride._id,
            status: ride.status,
            otp: ride.otp,
            providedOtp: otp
        });

        // Check if ride is already started or completed
        if (ride.status === 'ongoing') {
            return res.status(400).json({ message: 'Ride already started' });
        }
        if (ride.status === 'completed') {
            return res.status(400).json({ message: 'Ride already completed' });
        }

        // Check if ride is accepted
        if (ride.status !== 'accepted') {
            return res.status(400).json({ message: 'Ride not accepted yet' });
        }

        // Check OTP
        if (ride.otp !== otp) {
            console.log('❌ OTP mismatch:', { expected: ride.otp, provided: otp });
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Update ride status
        ride.status = 'ongoing';
        ride.startTime = new Date();
        await ride.save();

        // Notify user and captain via socket if available
        if (ride.user && ride.user.socketId) {
            sendMessageToSocketId(ride.user.socketId, {
                event: 'ride-started',
                data: ride
            });
        }
        if (ride.captain && ride.captain.socketId) {
            sendMessageToSocketId(ride.captain.socketId, {
                event: 'ride-started',
                data: ride
            });
        }

        return res.status(200).json({ message: 'Ride started', ride });
    } catch (error) {
        console.error('❌ Error starting ride:', error.message);
        return res.status(500).json({ message: error.message });
    }
    
}

module.exports.endRide = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { rideId } = req.body;

    try {
        const ride =  await rideService.endRide({rideId, captain:req.captain});

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride
        });



        return res.status(200).json({ message: 'Ride ended successfully', ride });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

}

module.exports.completeRide = async (req, res) => {
    try {
        const { rideId } = req.params;
        const { fare, distance, completedBy } = req.body;
        
        console.log('Completing ride:', rideId, 'by:', completedBy);
        
        // Validate rideId
        if (!mongoose.Types.ObjectId.isValid(rideId)) {
            return res.status(400).json({ message: 'Invalid ride ID' });
        }
        
        const ride = await Ride.findById(rideId).populate('captain user');
        
        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }
        
        // Check authorization - allow both captain and user to complete
        let isAuthorized = false;
        if (req.captain && ride.captain._id.toString() === req.captain._id.toString()) {
            isAuthorized = true;
        } else if (req.user && ride.user._id.toString() === req.user._id.toString()) {
            isAuthorized = true;
        }
        
        if (!isAuthorized) {
            return res.status(403).json({ message: 'Unauthorized to complete this ride' });
        }
        
        if (ride.status === 'completed') {
            return res.status(200).json({ 
                message: 'Ride already completed',
                ride: ride,
                captain: await Captain.findById(ride.captain._id)
            });
        }
        
        // Update ride status
        ride.status = 'completed';
        ride.endTime = new Date();
        if (fare !== undefined) ride.fare = Number(fare);
        if (distance !== undefined) ride.distance = Number(distance);
        
        await ride.save();
        
        // Update captain earnings and stats
        const captain = await Captain.findById(ride.captain._id);
        
        if (captain) {
            const fareAmount = Number(fare) || Number(ride.fare) || 0;
            const rideDistance = Number(distance) || Number(ride.distance) || 0;
            
            captain.earnings = (captain.earnings || 0) + fareAmount;
            
            if (!captain.stats) {
                captain.stats = {
                    hoursOnline: 0,
                    totalRides: 0,
                    totalDistance: 0,
                    rating: 5.0,
                    totalRatings: 0
                };
            }
            
            captain.stats.totalRides = (captain.stats.totalRides || 0) + 1;
            captain.stats.totalDistance = (captain.stats.totalDistance || 0) + rideDistance;
            
            await captain.save();
            
            console.log('Captain earnings updated:', captain.earnings);
        }
        
        res.status(200).json({ 
            message: 'Ride completed successfully',
            ride: ride,
            captain: captain
        });
        
    } catch (error) {
        console.error('Error completing ride:', error);
        res.status(500).json({ 
            message: 'Internal server error',
            error: error.message
        });
    }
};