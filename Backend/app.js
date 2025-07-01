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
connectToDb();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/' , (req,res) => {
    res.send("Hello World");

});

// Health check endpoint for frontend
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'Backend server is running',
        timestamp: new Date().toISOString()
    });
});

app.use('/users', userRoutes);
app.use('/captains', captainRoutes);
app.use('/maps', mapsRoutes);
app.use('/rides' , rideRoutes);

module.exports = app;