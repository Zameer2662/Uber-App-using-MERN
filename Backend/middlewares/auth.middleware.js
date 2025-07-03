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
    // Extract token from cookies or Authorization header
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];  
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check if token is blacklisted (for logout functionality)
    const isBlackListed = await blackListTokenModel.findOne({token : token});
    
    if (isBlackListed){
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // Verify JWT token and get captain data
        const decoded = jwt.verify(token , process.env.JWT_SECRET);
        const captain = await CaptainModel.findById(decoded._id);
        req.captain = captain; // Attach captain to request object
        return next();
    }catch (err) {
        res.status(401).json({ message: 'Unauthorized' });
    }
}
 