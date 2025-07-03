const mongoose = require ('mongoose')

// Ride schema for storing ride booking information
const rideSchema = new mongoose.Schema({
    // User who booked the ride
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },

    // Captain assigned to the ride
    captain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Captain',
    },

    // Pickup location address
    pickup: {
        type:String,
        required: true
    },
    
    // Destination address
    destination: {
        type:String,
        required: true
    },
    
    // Calculated fare for the ride
    fare: {
        type: Number,
        required: true
    },
    
    // Current status of the ride
    status: {
        type: String,
        enum: ['pending', 'accepted', 'ongoing', 'completed', 'cancelled' ],
        default: 'pending'
    },

    // Estimated duration of the ride in seconds
    duration : {
        type:Number,
    },
    
    // Estimated distance of the ride in meters
    distance : {
        type : Number,
    },

    // Payment gateway transaction ID
    paymentID : {
        type:String,
    },

    // Payment order ID
    orderId: {
        type : String,
    },

    // Payment signature for verification
    signature:{
        type:String
    },

    // OTP for ride verification (hidden from queries)
    otp: {
        type: String,
        select: false,
        required : true,
    },
})

module.exports = mongoose.model('ride' , rideSchema);