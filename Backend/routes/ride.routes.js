const express = require('express')
const router = express.Router();
const { body, query } = require('express-validator')
const authMiddleware = require('../middlewares/auth.middleware')
const rideController = require('../controllers/ride.controller')

router.post('/create',
    authMiddleware.authUser,
    body('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
    body('destination').isString().isLength({ min: 3 }).withMessage('Invalid Destination Address'),
    body('vehicleType').isString().isIn(['auto', 'car', 'moto']).withMessage('Invalid vehicle type. Must be one of: auto, car, motorcycle'),
    rideController.createRide

)


router.get('/get-fare',
    authMiddleware.authUser,
    query('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
    query('destination').isString().isLength({ min: 3 }).withMessage('Invalid Destination Address'),
    rideController.getFare
)

router.post('/confirm',
    authMiddleware.authCaptain,
    body('rideId').isString().withMessage('Invalid ride ID'),
    rideController.confirmRide
)
module.exports = router
