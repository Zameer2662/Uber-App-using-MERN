const http = require('http');
const app = require('./app');
const {initializeSocket} = require('./socket');

// Get port from environment variable or use default
const port = process.env.PORT || 4000;

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO for real-time communication
initializeSocket(server);

// Start server and listen on specified port
server.listen(port , () =>{
    console.log(`Server is running on the port  ${port}`);
});