const express = require ('express')
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const mapController = require('../controllers/map.controller');
const {query} = require('express-validator')

// Get coordinates for a given address
router.get('/get-coordinates' ,
    query('address').isString().isLength({min:3}),
    authMiddleware.authUser , mapController.getCoordinates
);

// Get autocomplete suggestions for address input
router.get('/get-suggestions',
    query('input').isString().isLength({ min: 3 }),
    authMiddleware.authUser,
    mapController.getAutoCompleteSuggestions
);

// Get distance and estimated time between two locations
router.get('/get-distance-time',
    query('origin').isString().isLength({min:3}),
    query('destination').isString().isLength({min : 3}),
    authMiddleware.authUser,
    mapController.getDistanceTime
)

module.exports = router