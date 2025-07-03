const captainModel = require('../models/captain.model');

/**
 * Create a new captain in the database
 * @param {Object} captainData - Captain registration data
 * @param {string} captainData.firstName - Captain's first name
 * @param {string} captainData.lastName - Captain's last name  
 * @param {string} captainData.email - Captain's email address
 * @param {string} captainData.password - Hashed password
 * @param {string} captainData.color - Vehicle color
 * @param {string} captainData.plate - Vehicle plate number
 * @param {number} captainData.capacity - Vehicle passenger capacity
 * @param {string} captainData.vehicleType - Type of vehicle (car/auto/motorcycle)
 * @returns {Object} Created captain object
 */
module.exports.createCaptain = async ({
    firstName,lastName,email,password,
    color,plate,capacity,vehicleType
}) => {
    // Validate all required fields
    if (!firstName  || !email || !password || !color || !plate || !capacity || !vehicleType) {
        throw new Error('All fields are required');
    }

    // Create captain document with personal and vehicle information
    const captain = captainModel.create({
        fullname: {
            firstname: firstName,
            lastname: lastName
        },
        email,
        password,
        vehicle: {
            color,
            plate,
            capacity,
            vehicleType
        }
    })

    return captain;
}