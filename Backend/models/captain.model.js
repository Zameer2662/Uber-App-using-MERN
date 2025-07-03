const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Captain schema for storing captain/driver information
const captainSchema = new mongoose.Schema({
    // Captain's full name
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, 'First name must be at least 2 characters long'],
        },
        lastname: {
            type: String,
            minlength: [3, 'Last name must be at least 2 characters long'],
        }
    },

    // Captain's email address (unique identifier)
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase:true,
    },

    // Hashed password for authentication
    password: {
        type: String,
        required: true,
        select:false, // Don't include in queries for security
    },

    // Socket ID for real-time communication
    socketId : {
        type:String,
    },

    // Captain's availability status
    status : {
        type:String,
        enum:['acive' , 'inactive'],
        default: 'inactive',
    },

    // Vehicle information for ride matching
    vehicle: {
        color:{
            type: String,
            required: true,
            minlength: [3, 'Color must be at least 3 characters long'],
        },
        plate: {
            type: String,
            required: true,
            minlength: [3, 'Plate number must be at least 3 characters long'],
        },
        capacity: {
            type: Number,
            required: true,
            min: [1, 'Capacity must be at least 1']
        },
        vehicleType: {
            type: String,
            required: true,
            enum: ['car', 'motorcycle', 'auto'],
        }
    },

    // Location data for ride matching and tracking
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude] for GeoJSON
        },
        // Keep old fields for backward compatibility
        ltd: {
            type: Number,
        },
        lng: {
            type: Number,
        }
    }
})

// Create 2dsphere index for geospatial queries on coordinates
captainSchema.index({ 'location.coordinates': '2dsphere' });
// Also keep index on old format for backward compatibility  
captainSchema.index({ 'location.ltd': 1, 'location.lng': 1 });

// Generate JWT token for captain authentication
captainSchema.methods.generateAuthToken =  function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    return token;
}

// Compare provided password with stored hashed password
captainSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

// Hash password before storing in database
captainSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password,10);
}

const CaptainModel = mongoose.model('Captain', captainSchema);

module.exports = CaptainModel;