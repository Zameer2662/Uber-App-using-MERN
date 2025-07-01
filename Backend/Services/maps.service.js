const axios = require('axios');
const { response } = require('express');
const CaptainModel = require('../models/captain.model');


module.exports.getAddressCoordinate = async (address) => {
    if (!address) {
        throw new Error('Address is required');
    }

    const apiKey = process.env.GOOGLE_MAPS_API; // Make sure to set this in your .env file
    const encodedAddress = encodeURIComponent(address);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;
//                              ^^^^^^^^^^^^^^^^

    try {
        const response = await axios.get(url);
        const results = response.data.results;

        if (results && results.length > 0) {
            const location = results[0].geometry.location;
            return {
                ltd: location.lat,
                lng: location.lng
            };
        } else {
            throw new Error('No coordinates found for the given address');
        }
    } catch (error) {
        throw new Error('Failed to fetch coordinates: ' + error.message);
    }
}

module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and Destination are required');
    }

    const apiKey = process.env.GOOGLE_MAPS_API;

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            if (response.data.rows[0].elements[0].status === 'ZERO_RESULTS') {
                throw new Error('No Routes found');
            }
            return response.data.rows[0].elements[0];
        } else {
            throw new Error('Unable to Fetch Distance and Time');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}


module.exports.getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error('Query is required');
    }

    const apiKey = process.env.GOOGLE_MAPS_API;
    const encodedInput = encodeURIComponent(input);
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodedInput}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            return response.data.predictions;
        } else {
            throw new Error('Unable to fetch autocomplete suggestions');
        }
    } catch (error) {
        throw new Error('Failed to fetch autocomplete suggestions: ' + error.message);
    }
};

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {
    try {
        // Try GeoJSON format first (more efficient)
        let captains = await CaptainModel.find({
            'location.coordinates': {
                $geoWithin: {
                    $centerSphere: [[lng, ltd], radius / 6371] // [longitude, latitude]
                }
            }
        });

        // If no results with GeoJSON, try legacy format
        if (captains.length === 0) {
            captains = await CaptainModel.find({
                'location.ltd': { $exists: true, $ne: null },
                'location.lng': { $exists: true, $ne: null }
            });
            
            // Filter manually for legacy format
            captains = captains.filter(captain => {
                if (!captain.location || !captain.location.ltd || !captain.location.lng) return false;
                
                const distance = calculateDistance(ltd, lng, captain.location.ltd, captain.location.lng);
                return distance <= radius;
            });
        }

        return captains;
    } catch (error) {
        console.error('Error finding captains in radius:', error);
        throw error;
    }
}

// Helper function to get all connected captains for testing
module.exports.getAllConnectedCaptains = async () => {
    try {
        const connectedCaptains = await CaptainModel.find({
            socketId: { $exists: true, $ne: null }
        });
        
        return connectedCaptains;
    } catch (error) {
        console.error('Error getting connected captains:', error);
        throw error;
    }
};
