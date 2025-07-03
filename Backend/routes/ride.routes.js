const express = require('express')
const router = express.Router();
const { body, query } = require('express-validator')
const authMiddleware = require('../middlewares/auth.middleware')
const rideController = require('../controllers/ride.controller')

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

module.exports = router
