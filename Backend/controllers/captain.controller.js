const captainModel = require('../models/captain.model');
const captainService = require('../Services/captain.service');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
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