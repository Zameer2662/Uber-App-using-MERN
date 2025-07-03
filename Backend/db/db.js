const mongoose = require ('mongoose');

/**
 * Connect to MongoDB database using connection string from environment variables
 * Uses async connection with promise-based error handling
 */
function connectToDb () {
     mongoose.connect(process.env.DB_CONNECT
     ).then(() => {
        console.log("Connected to Database");
}).catch(err=>console.log(err));
}

module.exports = connectToDb;