// Load environment variables
const dotenv = require('dotenv');
dotenv.config();

const  express = require("express");
const cors = require('cors');
const cookieParser = require('cookie-parser');
const app = express();
const connectToDb = require('./db/db')
const userRoutes = require('./routes/user.routes');
const captainRoutes = require('./routes/captain.routes');
const mapsRoutes = require ('./routes/maps.routes');
const rideRoutes = require('./routes/ride.routes');

// Connect to MongoDB database
connectToDb();

// Middleware configuration
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(cookieParser()); // Parse cookies from request headers

// Default route
app.get('/' , (req,res) => {
    res.send("Hello World");
});

// Health check endpoint for monitoring server status
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'Backend server is running',
        timestamp: new Date().toISOString()
    });
});

// Route handlers
app.use('/users', userRoutes); // User authentication and management
app.use('/captains', captainRoutes); // Captain authentication and management
app.use('/maps', mapsRoutes); // Google Maps integration endpoints
app.use('/rides' , rideRoutes); // Ride booking and management

module.exports = app;