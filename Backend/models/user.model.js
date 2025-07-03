const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User schema for storing user account information
const userSchema = new mongoose.Schema({
     // User's full name
     fullname : {
        firstname: {
           type: String,
           required: true,
           minlength:[2, 'First name must be at least 3 characters long'],
        },
        lastname: {
           type: String,
           required: true,
           minlength:[2, 'Last name must be at least 3 characters long'],
        }
     },

     // User's email address (unique identifier)
     email: {
        type: String,
        required: true,
        unique: true,   
        minlength: [5, 'Email must be at least 5 characters long'],
     },

     // Hashed password for authentication
     password: {
        type: String,
        required: true,
        select: false, // Do not return password in queries for security
     },

     // Socket ID for real-time communication
     socketId: {
        type: String,
     },

     // User's current location for ride booking
     location: {
        ltd: {
            type: Number,
        },
        lng: {
            type: Number,
        }
     },
})

// Generate JWT token for user authentication
userSchema.methods.generateAuthToken =  function() {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
}

// Compare provided password with stored hashed password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

// Hash password before storing in database
userSchema.statics.hashPassword = async function(password) {
    return await bcrypt.hash( password, 10);
}

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;