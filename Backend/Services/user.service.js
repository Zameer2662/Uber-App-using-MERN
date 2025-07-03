const userModel = require('../models/user.model');

/**
 * Create a new user in the database
 * @param {Object} userData - User registration data
 * @param {string} userData.firstname - User's first name
 * @param {string} userData.lastname - User's last name  
 * @param {string} userData.email - User's email address
 * @param {string} userData.password - Hashed password
 * @returns {Object} Created user object
 */
module.exports.CreateUser = async ({
    firstname , lastname , email, password
})=> {
    // Validate required fields
    if (!firstname ||  !email || !password) {
        throw new Error('All fields are required');
    }
    
    // Create user document in database
    const user =  userModel.create({
        fullname: {
            firstname,
            lastname
        },
        email,
        password
    })

    return user;
}