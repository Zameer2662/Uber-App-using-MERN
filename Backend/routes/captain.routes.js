const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const captainController = require('../controllers/captain.controller');
const authMiddleware = require('../middlewares/auth.middleware');

// Debug route to check captain locations
router.get('/debug-locations', authMiddleware.authCaptain, async (req, res) => {
    try {
        const CaptainModel = require('../models/captain.model');
        
        const totalCaptains = await CaptainModel.countDocuments();
        const captainsWithLocation = await CaptainModel.countDocuments({
            'location.ltd': { $exists: true, $ne: null },
            'location.lng': { $exists: true, $ne: null }
        });
        
        const allCaptains = await CaptainModel.find({}, {
            'fullname.firstname': 1,
            'location': 1,
            'status': 1,
            'socketId': 1
        }).limit(10);
        
        res.json({
            debug: {
                totalCaptains,
                captainsWithLocation,
                sampleCaptains: allCaptains
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/register', [
    body('fullname.firstname').isLength({min: 3}).withMessage('First name must be at least 3 characters long'),
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long'),
    body('vehicle.color').isLength({min: 3}).withMessage('Color must be at least 3 characters long'),
    body('vehicle.plate').isLength({min: 3}).withMessage('Plate number must be at least 3 characters long'),
    body('vehicle.capacity').isInt({min: 1}).withMessage('Capacity must be at least 1'),
    body('vehicle.vehicleType').isIn(['car', 'motorcycle', 'auto']).withMessage('Vehicle type must be one of car, motorcycle, or auto')
],
  captainController.registerCaptain
);


router.post('/login', [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long')
], captainController.loginCaptain);

router.get('/profile', authMiddleware.authCaptain , captainController.getCaptainProfile);

router.get('/logout', authMiddleware.authCaptain, captainController.logoutCaptain);

module.exports = router;