const mongoose = require('mongoose');

// Schema for storing blacklisted JWT tokens (for logout functionality)
const blackListTokenSchema = new mongoose.Schema({
    // JWT token to be blacklisted
    token: { 
        type: String,
         required: true, 
         unique: true 
    },
    // Auto-expire tokens after 24 hours
    createdAt: {
         type: Date,
          default: Date.now,
           expires: 60 * 60 * 24 // 24 hours TTL
    }
});

module.exports = mongoose.model('BlackListToken', blackListTokenSchema);