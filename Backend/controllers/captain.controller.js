const captainModel = require('../models/captain.model');
const captainService = require('../Services/captain.service');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const blackListTokenModel = require('../models/blackListToken.model')

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
    res.status(200).json({ captain: req.captain });
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