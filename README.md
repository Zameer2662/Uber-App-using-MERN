# Uber Clone - Full Stack Ride Hailing Application

A complete ride-hailing application built with React.js frontend and Node.js/Express backend, featuring real-time location tracking, socket communication, and Google Maps integration.

## 🚀 Features

- **User Authentication** (Users and Captains)
- **Real-time Location Tracking** with Google Maps
- **Ride Booking and Management**
- **Live Socket Communication**
- **Distance and Fare Calculation**
- **OTP-based Ride Verification**
- **Responsive UI/UX**

## 📋 Table of Contents

- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Data Models](#data-models)
- [Socket Events](#socket-events)
- [Frontend Components](#frontend-components)
- [Backend Services](#backend-services)

## 🏗️ Project Structure

```
Uber Project/
├── Backend/
│   ├── controllers/         # API controllers
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── Services/           # Business logic
│   ├── middlewares/        # Authentication middleware
│   ├── db/                 # Database connection
│   ├── app.js              # Express app configuration
│   ├── server.js           # Server entry point
│   └── socket.js           # Socket.io configuration
└── Frontend/
    ├── src/
    │   ├── components/     # Reusable components
    │   ├── pages/          # Page components
    │   ├── context/        # React contexts
    │   └── assets/         # Static assets
    ├── public/             # Public assets
    └── package.json        # Frontend dependencies
```

## ⚙️ Installation & Setup

### Backend Setup

```bash
cd Backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

## 🔐 Environment Variables

### Backend (.env)
```env
MONGO_URI=mongodb://localhost:27017/uber-clone
JWT_SECRET=your-jwt-secret
GOOGLE_MAPS_API=your-google-maps-api-key
PORT=4000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:4000
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

## 📡 API Documentation

### Base URL
- Backend: `http://localhost:4000`
- All API requests require authentication (except register/login)

---

## 👤 User Authentication APIs

### 1. Register User
**POST** `/users/register`

**Request Body:**
```json
{
  "fullname": {
    "firstname": "John",
    "lastname": "Doe"
  },
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "jwt-token",
  "user": {
    "_id": "user-id",
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john@example.com"
  }
}
```

### 2. Login User
**POST** `/users/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### 3. Get User Profile
**GET** `/users/profile`

**Headers:**
```
Authorization: Bearer <jwt-token>
```

### 4. Logout User
**GET** `/users/logout`

---

## 🚗 Captain Authentication APIs

### 1. Register Captain
**POST** `/captains/register`

**Request Body:**
```json
{
  "fullname": {
    "firstname": "Jane",
    "lastname": "Smith"
  },
  "email": "jane@example.com",
  "password": "password123",
  "vehicle": {
    "color": "Red",
    "plate": "ABC123",
    "capacity": 4,
    "vehicleType": "car"
  }
}
```

### 2. Login Captain
**POST** `/captains/login`

### 3. Get Captain Profile
**GET** `/captains/profile`

### 4. Logout Captain
**GET** `/captains/logout`

---

## 🚕 Ride Management APIs

### 1. Create Ride
**POST** `/rides/create`

**Request Body:**
```json
{
  "pickup": "123 Main St, City",
  "destination": "456 Oak Ave, City",
  "vehicleType": "car"
}
```

**Response:**
```json
{
  "ride": {
    "_id": "ride-id",
    "user": "user-id",
    "pickup": "123 Main St, City",
    "destination": "456 Oak Ave, City",
    "fare": 150,
    "status": "pending",
    "otp": "123456"
  }
}
```

### 2. Get Fare Estimate
**GET** `/rides/get-fare?pickup=location1&destination=location2`

**Response:**
```json
{
  "auto": 80,
  "car": 120,
  "moto": 60
}
```

### 3. Confirm Ride (Captain)
**POST** `/rides/confirm`

**Request Body:**
```json
{
  "rideId": "ride-id"
}
```

### 4. Start Ride (Captain)
**GET** `/rides/start-ride?rideId=ride-id&otp=123456`

### 5. End Ride (Captain)
**POST** `/rides/end-ride`

**Request Body:**
```json
{
  "rideId": "ride-id"
}
```

---

## 🗺️ Maps APIs

### 1. Get Coordinates
**GET** `/maps/get-coordinates?address=123 Main St`

**Response:**
```json
{
  "ltd": 40.7128,
  "lng": -74.0060
}
```

### 2. Get Auto-complete Suggestions
**GET** `/maps/get-suggestions?input=Times Square`

**Response:**
```json
{
  "suggestions": [
    "Times Square, New York, NY",
    "Times Square Museum, New York, NY"
  ]
}
```

### 3. Get Distance and Time
**GET** `/maps/get-distance-time?origin=location1&destination=location2`

**Response:**
```json
{
  "distance": {
    "text": "5.2 km",
    "value": 5200
  },
  "duration": {
    "text": "15 mins",
    "value": 900
  }
}
```

---

## 🗃️ Data Models

### User Model
```javascript
{
  _id: ObjectId,
  fullname: {
    firstname: String (required, min: 3),
    lastname: String (required, min: 3)
  },
  email: String (required, unique),
  password: String (required, hashed),
  socketId: String,
  location: {
    ltd: Number,
    lng: Number
  }
}
```

### Captain Model
```javascript
{
  _id: ObjectId,
  fullname: {
    firstname: String (required, min: 3),
    lastname: String (min: 3)
  },
  email: String (required, unique),
  password: String (required, hashed),
  socketId: String,
  status: String (enum: ['active', 'inactive'], default: 'inactive'),
  vehicle: {
    color: String (required, min: 3),
    plate: String (required, min: 3),
    capacity: Number (required, min: 1),
    vehicleType: String (enum: ['car', 'motorcycle', 'auto'])
  },
  location: {
    ltd: Number,
    lng: Number
  }
}
```

### Ride Model
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User', required),
  captain: ObjectId (ref: 'Captain'),
  pickup: String (required),
  destination: String (required),
  fare: Number (required),
  status: String (enum: ['pending', 'accepted', 'ongoing', 'completed', 'cancelled']),
  duration: Number, // in seconds
  distance: Number, // in meters
  paymentID: String,
  orderId: String,
  signature: String,
  otp: String (required, select: false)
}
```

---

## 🔌 Socket Events

### Client to Server Events

#### User Events
```javascript
// Join user room
socket.emit('join', { userId: 'user-id', userType: 'user' });

// Update user location
socket.emit('update-location-user', {
  userId: 'user-id',
  location: { ltd: 40.7128, lng: -74.0060 }
});
```

#### Captain Events
```javascript
// Join captain room
socket.emit('join', { userId: 'captain-id', userType: 'captain' });

// Update captain location
socket.emit('update-location-captain', {
  userId: 'captain-id',
  location: { ltd: 40.7128, lng: -74.0060 }
});
```

### Server to Client Events

```javascript
// New ride available for captains
socket.on('new-ride', (ride) => {
  // Handle new ride notification
});

// Ride accepted by captain
socket.on('ride-confirmed', (ride) => {
  // Handle ride confirmation
});

// Ride started
socket.on('ride-started', (ride) => {
  // Handle ride start
});

// Ride ended
socket.on('ride-ended', (ride) => {
  // Handle ride completion
});
```

---

## 🎨 Frontend Components

### Key Components

#### Pages
- **Start.jsx** - Landing page
- **UserLogin.jsx** - User authentication
- **UserSignup.jsx** - User registration
- **CaptainLogin.jsx** - Captain authentication
- **CaptainSignup.jsx** - Captain registration
- **Home.jsx** - User dashboard
- **CaptainHome.jsx** - Captain dashboard
- **Riding.jsx** - Active ride view (user)
- **CaptainRiding.jsx** - Active ride view (captain)

#### Components
- **LiveTracking.jsx** - Google Maps integration
- **LocationSearchPanel.jsx** - Address search
- **VehiclePanel.jsx** - Vehicle selection
- **ConfirmRide.jsx** - Ride confirmation
- **RidePopup.jsx** - Ride details popup
- **FinishRide.jsx** - Ride completion

#### Context
- **UserContext.jsx** - User state management
- **CaptainContext.jsx** - Captain state management
- **SocketContext.jsx** - Socket connection management

---

## ⚙️ Backend Services

### User Service
```javascript
// Create user
createUser(userData)

// Compare password
comparePassword(password, hashedPassword)

// Generate auth token
generateAuthToken()
```

### Captain Service
```javascript
// Create captain
createCaptain(captainData)

// Get captains in radius
getCaptainsInTheRadius(ltd, lng, radius)
```

### Ride Service
```javascript
// Calculate fare
getFare(distance)

// Create ride
createRide(user, pickup, destination, vehicleType)

// Confirm ride
confirmRide(rideId, captain)

// Start ride
startRide(rideId, otp, captain)

// End ride
endRide(rideId, captain)
```

### Maps Service
```javascript
// Get address coordinates
getAddressCoordinates(address)

// Get distance and time
getDistanceTime(origin, destination)

// Get auto-complete suggestions
getAutoCompleteSuggestions(input)
```

---

## 🔒 Authentication Middleware

All protected routes require JWT token in the Authorization header:
```
Authorization: Bearer <jwt-token>
```

### User Authentication
- Middleware: `authUser`
- Validates user JWT token
- Attaches user data to `req.user`

### Captain Authentication
- Middleware: `authCaptain`
- Validates captain JWT token
- Attaches captain data to `req.captain`

---

## 🚦 Status Codes

- **200** - Success
- **201** - Created
- **400** - Bad Request
- **401** - Unauthorized
- **404** - Not Found
- **500** - Internal Server Error

---

## 📱 Frontend Usage Examples

### Making API Calls
```javascript
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Login user
const loginUser = async (email, password) => {
  const response = await axios.post(`${API_BASE_URL}/users/login`, {
    email,
    password
  });
  return response.data;
};

// Create ride
const createRide = async (pickup, destination, vehicleType) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(
    `${API_BASE_URL}/rides/create`,
    { pickup, destination, vehicleType },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};
```

### Socket Usage
```javascript
import { useSocket } from '../context/SocketContext';

const MyComponent = () => {
  const { socket } = useSocket();

  useEffect(() => {
    socket?.on('new-ride', (ride) => {
      console.log('New ride received:', ride);
    });

    return () => {
      socket?.off('new-ride');
    };
  }, [socket]);
};
```

---

## 🛠️ Development Guidelines

### For Frontend Developers
1. All API calls should include error handling
2. Use the provided contexts for state management
3. Implement loading states for better UX
4. Follow the established component structure
5. Use environment variables for API URLs

### For Backend Developers
1. Always validate input data using express-validator
2. Use proper HTTP status codes
3. Implement comprehensive error handling
4. Follow RESTful API conventions
5. Keep sensitive data in environment variables
6. Use proper authentication middleware

---

## 📦 Dependencies

### Backend
- **express** - Web framework
- **mongoose** - MongoDB ODM
- **socket.io** - Real-time communication
- **jsonwebtoken** - JWT authentication
- **bcrypt** - Password hashing
- **axios** - HTTP client for Google Maps API
- **express-validator** - Input validation

### Frontend
- **react** - UI library
- **react-router-dom** - Routing
- **axios** - HTTP client
- **socket.io-client** - Socket client
- **@react-google-maps/api** - Google Maps integration
- **@gsap/react** - Animations

---

## 🎯 Getting Started for New Developers

1. **Clone the repository**
2. **Set up environment variables** (see Environment Variables section)
3. **Install dependencies** for both frontend and backend
4. **Start the database** (MongoDB)
5. **Run the backend** server (`npm run dev`)
6. **Run the frontend** development server (`npm run dev`)
7. **Test the application** with the provided API endpoints

---

## 📞 Support

For any issues or questions, please refer to this documentation or check the code comments for additional context.
