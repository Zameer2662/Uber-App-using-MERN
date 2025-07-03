# LiveTracking Component - Implementation Guide

## Overview
The LiveTracking component provides real-time GPS tracking and live location sharing for the ride-hailing app using Google Maps API and Socket.io.

## Features Implemented

### 🗺️ **Google Maps Integration**
- Interactive map with real-time location display
- Custom markers for pickup, destination, user, and captain
- Route directions from pickup to destination
- Responsive map controls and zoom functionality

### 📍 **Real-time Location Tracking**
- GPS-based location tracking using browser's Geolocation API
- Automatic location updates every few seconds
- High accuracy positioning for precise tracking

### 🔄 **Socket.io Integration**
- Live location sharing between user and captain
- Real-time updates without page refresh
- Bidirectional communication for location synchronization

### 🎨 **Custom Map Markers**
- **User Marker** (Blue): Shows passenger location
- **Captain Marker** (Yellow Car): Shows driver location
- **Pickup Marker** (Green Pin): Shows pickup location
- **Destination Marker** (Red Pin): Shows destination location

### 🛡️ **Error Handling**
- Fallback UI when Google Maps fails to load
- Graceful handling of location permission issues
- Loading states and error messages

## Setup Instructions

### 1. Environment Configuration
Add Google Maps API key to `.env` file:
```env
VITE_BASE_URL=http://localhost:4000
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### 2. Google Maps API Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the following APIs:
   - Maps JavaScript API
   - Geocoding API
   - Directions API
4. Create API credentials (API Key)
5. Add domain restrictions for security

### 3. Required Permissions
The app requests location permissions from users for GPS tracking.

## Usage

### In User Journey (Riding.jsx)
```jsx
import LiveTracking from '../components/LiveTracking'

<LiveTracking ride={rideData} userType="user" />
```

### In Captain Journey (CaptainRiding.jsx)
```jsx
import LiveTracking from '../components/LiveTracking'

<LiveTracking ride={rideData} userType="captain" />
```

## Socket Events

### Emitted Events
- `captain-location-update`: Captain sends location to user
- `user-location-update`: User sends location to captain

### Received Events
- `captain-location-update`: User receives captain's location
- `user-location-update`: Captain receives user's location

## Backend Socket Implementation

Added in `socket.js`:
```javascript
socket.on('captain-location-update', async (data) => {
    const { rideId, location } = data;
    socket.broadcast.emit('captain-location-update', { rideId, location });
});

socket.on('user-location-update', async (data) => {
    const { rideId, location } = data;
    socket.broadcast.emit('user-location-update', { rideId, location });
});
```

## Data Flow

1. **Location Acquisition**: Browser GPS → Component State
2. **Location Broadcasting**: Component → Socket.io → Other Users
3. **Map Rendering**: Google Maps API displays all locations
4. **Route Calculation**: Directions API shows pickup to destination route

## Security Considerations

- API key restrictions by domain
- Location data is not stored permanently
- Socket events are ride-specific (rideId validation)
- User permission required for location access

## Testing

To test the live tracking:
1. Start both frontend and backend servers
2. Create a ride and accept it
3. Navigate to riding pages (user and captain)
4. Allow location permissions
5. Move device/browser location to see real-time updates

## Troubleshooting

### Common Issues
1. **Maps not loading**: Check API key and internet connection
2. **Location not updating**: Verify location permissions
3. **Socket not connecting**: Ensure backend server is running
4. **Markers not showing**: Check console for geocoding errors

### Debug Logs
The component includes comprehensive console logs:
- `🗺️ Starting location tracking`
- `📍 Location updated`
- `📡 Emitting location update`
- `❌ Error messages for troubleshooting`

## Browser Compatibility

- Chrome 5+
- Firefox 3.5+
- Safari 5+
- Edge 12+

Requires HTTPS for location access in production.
