
const userModel = require('../models/user.model');
const userService = require('../Services/user.service');
const { validationResult } = require('express-validator');
const jwt = require ('jsonwebtoken');
const blackListTokenModel =  require ('../models/blackListToken.model')

/**
 * Register a new user account
 * Validates input, checks for existing user, hashes password, and generates JWT token
 */
module.exports.registerUser = async (req, res , next) => {
    // Validate request data using express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password } = req.body;
    
    // Check if user already exists with this email
    const isUserAlreadyExists = await userModel.findOne({ email });
    if (isUserAlreadyExists) {
        return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password before storing
    const hashedPassword = await userModel.hashPassword(password);

    // Create new user using service layer
    const user = await userService.CreateUser({
        firstname : fullname.firstname,
        lastname : fullname.lastname,
        email,
        password: hashedPassword
    });

    // Generate JWT token for authentication
    const token = user.generateAuthToken();
    res.status(201).json({token , user})
}

/**
 * Login user with email and password
 * Validates credentials and generates JWT token
 */
module.exports.loginUser = async (req , res , next)  => {
    // Validate request data
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {email , password} = req.body;
    
    // Find user by email and include password field
    const user = await userModel.findOne({email}).select('+password');

    if(!user) {
        return res.status(401).json({ message: 'Invalid Email or Password' });
    }

    // Verify password using bcrypt
    const isMatch = await user.comparePassword(password);
    if(!isMatch) {
        return res.status(401).json({ message: 'Invalid Email or Password' });
    }

    // Generate JWT token and set cookie
    const token = user.generateAuthToken();
    res.cookie('token' , token);

    res.status(200).json({ token, user });
}

/**
 * Get authenticated user's profile data
 * Returns user data attached by auth middleware
 */
module.exports.getUserProfile = async (req, res, next) => {
    res.status(200).json(req.user);
}

/**
 * Logout user by blacklisting JWT token
 * Clears cookie and adds token to blacklist
 */
module.exports.logoutUser = async (req, res, next) => {
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization.split(' ')[ 1 ]

    // Add token to blacklist to prevent reuse
    await  blackListTokenModel.create({token});
    res.status(200).json({message : "Logged Out"});
}

