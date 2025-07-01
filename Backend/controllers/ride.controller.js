const rideService = require ('../Services/ride.service');
const {validationResult} = require ('express-validator');
const mapService = require ('../Services/maps.service');
const rideModel = require('../models/ride.model');
const {sendMessageToSocketId} = require('../socket');


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

    const {rideId} = req.body;

    try {
        const ride = await rideService.confirmRide(rideId);

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-confirmed',
            data: ride
        });
        
        return res.status(200).json(ride);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}