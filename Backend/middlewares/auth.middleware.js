const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');
const CaptainModel = require('../models/captain.model');
const blackListTokenModel = require('../models/blackListToken.model');

/**
 * Middleware to authenticate user requests
 * Validates JWT token and attaches user data to request object
 */
module.exports.authUser = async (req, res, next) => {
    // Extract token from cookies or Authorization header
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];
   if (!token) {
       return res.status(401).json({ message: 'Unauthorized' });
   }

   // Check if token is blacklisted (for logout functionality)
   const isBlackListed = await blackListTokenModel.findOne({ token: token });
   if(isBlackListed) {
       return res.status(401).json({ message: 'Unauthorized' });
   }

   try {
       // Verify JWT token and get user data
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
       const user = await UserModel.findById(decoded._id);
       req.user = user; // Attach user to request object

       return next();
   } catch (error) {
       return res.status(401).json({ message: 'Unauthorized' });
   }
}

/**
 * Middleware to authenticate captain requests
 * Validates JWT token and attaches captain data to request object
 */
module.exports.authCaptain = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        
        console.log('Captain auth - Token received:', token ? 'Yes' : 'No');
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Captain auth - Decoded token:', decoded);
        
        const captain = await CaptainModel.findById(decoded._id);
        
        if (!captain) {
            return res.status(401).json({ message: 'Captain not found' });
        }
        
        req.captain = captain;
        console.log('Captain auth - Success for captain:', captain._id);
        next();
        
    } catch (error) {
        console.error('Captain auth error:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
};

/**
 * Middleware to authenticate both user and captain requests
 * Validates JWT token and attaches user or captain data to request object
 */
module.exports.authUserOrCaptain = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Try to find user first
        const user = await UserModel.findById(decoded._id);
        if (user) {
            req.user = user;
            return next();
        }
        
        // If not user, try captain
        const captain = await CaptainModel.findById(decoded._id);
        if (captain) {
            req.captain = captain;
            return next();
        }
        
        return res.status(401).json({ message: 'User/Captain not found' });
        
    } catch (error) {
        console.error('Auth error:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
};

