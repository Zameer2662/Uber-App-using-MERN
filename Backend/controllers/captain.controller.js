const captainModel = require('../models/captain.model');
const captainService = require('../Services/captain.service');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const blackListTokenModel = require('../models/blackListToken.model')
const mongoose = require('mongoose');

module.exports.registerCaptain = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        fullname,
        email,
        password,
        vehicle,
    } = req.body;

    //check kren ge k captain already exists ya nahi

    const isCaptainAlreadyExists = await captainModel.findOne({ email });
    if (isCaptainAlreadyExists) {
        return res.status(400).json({ message: 'Captain already exists' });
    }

    //password hashed kren ge 

    const hashedPassword = await captainModel.hashPassword(password);

    const captain = await captainService.createCaptain({
            firstName: fullname.firstname,
            lastName: fullname.lastname,
            email,
            password : hashedPassword,
            color : vehicle.color,
            plate: vehicle.plate,
            capacity: vehicle.capacity,
            vehicleType: vehicle.vehicleType
        });
        const token = captain.generateAuthToken();
        res.status(201).json({token, captain});
 

}


module.exports.loginCaptain = async (req, res , next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    //check kren ge k captain exists ya nahi
    const captain = await captainModel.findOne({ email }).select('+password');
    if (!captain) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }
    //password match kren ge
    const isPasswordMatch = await captain.comparePassword(password);
    if (!isPasswordMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = captain.generateAuthToken();

    res.cookie('token', token);
    res.status(200).json({ token, captain });

}

module.exports.getCaptainProfile = async (req, res) => {
    try {
        console.log('Fetching captain profile for ID:', req.captain._id);
        
        const captain = await Captain.findById(req.captain._id).select('-password');
        
        if (!captain) {
            return res.status(404).json({ message: 'Captain not found' });
        }

        // Ensure earnings is a number
        if (typeof captain.earnings !== 'number') {
            captain.earnings = 0;
        }
        
        // Ensure stats object exists with default values
        if (!captain.stats) {
            captain.stats = {
                hoursOnline: 0,
                totalRides: 0,
                totalDistance: 0,
                rating: 5.0,
                totalRatings: 0
            };
        }

        // Save captain if we updated default values
        await captain.save();

        console.log('Captain profile fetched successfully:', {
            id: captain._id,
            earnings: captain.earnings,
            stats: captain.stats
        });

        res.status(200).json({
            success: true,
            captain: {
                ...captain.toObject(),
                earnings: captain.earnings,
                stats: captain.stats
            }
        });

    } catch (error) {
        console.error('Error fetching captain profile:', error);
        res.status(500).json({ 
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        });
    }
}

module.exports.logoutCaptain = async (req, res) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    // Blacklist the token
    await blackListTokenModel.create({token});

    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
}

module.exports.updateEarnings = async (req, res, next) => {
    try {
        const { amount } = req.body;
        
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        const captain = await Captain.findById(req.captain._id);
        
        if (!captain) {
            return res.status(404).json({ message: 'Captain not found' });
        }
        
        captain.earnings = (captain.earnings || 0) + amount;
        await captain.save();
        
        res.status(200).json({
            captain,
            message: 'Earnings updated successfully'
        });
    } catch (error) {
        console.error('Error updating earnings:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports.updateStats = async (req, res, next) => {
    try {
        const { hoursOnline, totalRides, totalDistance, rating } = req.body;
        const captain = await Captain.findById(req.captain._id);
        
        if (!captain) {
            return res.status(404).json({ message: 'Captain not found' });
        }
        
        // Initialize stats if not exists
        if (!captain.stats) {
            captain.stats = {
                hoursOnline: 0,
                totalRides: 0,
                totalDistance: 0,
                rating: 5.0,
                totalRatings: 0
            };
        }
        
        // Update stats
        if (hoursOnline !== undefined) captain.stats.hoursOnline = hoursOnline;
        if (totalRides !== undefined) captain.stats.totalRides = totalRides;
        if (totalDistance !== undefined) captain.stats.totalDistance = totalDistance;
        
        // Update rating
        if (rating !== undefined) {
            const currentRating = captain.stats.rating || 5.0;
            const totalRatings = captain.stats.totalRatings || 0;
            
            captain.stats.rating = ((currentRating * totalRatings) + rating) / (totalRatings + 1);
            captain.stats.totalRatings = totalRatings + 1;
        }
        
        await captain.save();
        
        res.status(200).json({
            captain,
            message: 'Stats updated successfully'
        });
    } catch (error) {
        console.error('Error updating stats:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports.getEarnings = async (req, res, next) => {
    try {
        const captain = await Captain.findById(req.captain._id).select('earnings stats');
        
        if (!captain) {
            return res.status(404).json({ message: 'Captain not found' });
        }
        
        res.status(200).json({
            earnings: captain.earnings || 0,
            stats: captain.stats || {
                hoursOnline: 0,
                totalRides: 0,
                totalDistance: 0,
                rating: 5.0,
                totalRatings: 0
            }
        });
    } catch (error) {
        console.error('Error fetching earnings:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports.resetEarnings = async (req, res, next) => {
    try {
        const captain = await Captain.findById(req.captain._id);
        
        if (!captain) {
            return res.status(404).json({ message: 'Captain not found' });
        }
        
        captain.earnings = 0;
        await captain.save();
        
        res.status(200).json({
            captain,
            message: 'Earnings reset successfully'
        });
    } catch (error) {
        console.error('Error resetting earnings:', error);
        res.status(500).json({ message: error.message });
    }
};