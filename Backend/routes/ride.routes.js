const express = require('express')
const router = express.Router();
const { body, query } = require('express-validator')
const authMiddleware = require('../middlewares/auth.middleware')
const rideController = require('../controllers/ride.controller')
const { authCaptain, authUserOrCaptain } = require('../middlewares/auth.middleware');
const { completeRide } = require('../controllers/ride.controller');

// Create new ride request (user only)
router.post('/create',
    authMiddleware.authUser,
    body('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
    body('destination').isString().isLength({ min: 3 }).withMessage('Invalid Destination Address'),
    body('vehicleType').isString().isIn(['auto', 'car', 'moto']).withMessage('Invalid vehicle type. Must be one of: auto, car, motorcycle'),
    rideController.createRide
)

// Get fare estimation for a route (user only)
router.get('/get-fare',
    authMiddleware.authUser,
    query('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
    query('destination').isString().isLength({ min: 3 }).withMessage('Invalid Destination Address'),
    rideController.getFare
)

// Confirm ride acceptance (captain only)
router.post('/confirm',
    authMiddleware.authCaptain,
    body('rideId').isString().withMessage('Invalid ride ID'),
    rideController.confirmRide
)

// Start ride with OTP verification (captain only)
router.get('/start-ride',
    authMiddleware.authCaptain,
    query('rideId').isString().withMessage('Invalid ride ID'),
    query('otp').isString().isLength({ min: 6, max: 6 }).withMessage('Invalid OTP'),
    rideController.startRide
)

// End ride and complete transaction (captain only)
router.post('/end-ride',
    authMiddleware.authCaptain,
    body('rideId').isString().withMessage('Invalid ride ID'),
    rideController.endRide
)

// Complete ride route - accessible by both user and captain
router.post('/complete/:rideId', async (req, res, next) => {
    try {
        // Try captain auth first
        const captainToken = req.cookies.token || req.headers.authorization?.split(' ')[1];
        
        if (captainToken) {
            const jwt = require('jsonwebtoken');
            const Captain = require('../models/captain.model');
            
            try {
                const decoded = jwt.verify(captainToken, process.env.JWT_SECRET);
                const captain = await Captain.findById(decoded._id);
                
                if (captain) {
                    req.captain = captain;
                    return next();
                }
            } catch (err) {
                // If captain auth fails, try user auth
            }
        }
        
        // Try user auth
        const User = require('../models/user.model');
        
        try {
            const decoded = jwt.verify(captainToken, process.env.JWT_SECRET);
            const user = await User.findById(decoded._id);
            
            if (user) {
                req.user = user;
                return next();
            }
        } catch (err) {
            // If both fail, return unauthorized
        }
        
        return res.status(401).json({ message: 'Unauthorized' });
        
    } catch (error) {
        return res.status(401).json({ message: 'Authentication failed' });
    }
}, completeRide);

module.exports = router;
