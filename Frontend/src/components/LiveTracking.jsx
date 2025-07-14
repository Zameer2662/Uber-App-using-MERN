import React, { useState, useEffect, useRef } from 'react'
import { useJsApiLoader, GoogleMap, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api'
import { useSocket } from '../context/SocketContext'

const LiveTracking = ({ ride, userType }) => {
    const { socket, isConnected } = useSocket()
    const [currentLocation, setCurrentLocation] = useState(null)
    const [map, setMap] = useState(null)
    const [directions, setDirections] = useState(null)
    const [pickupCoords, setPickupCoords] = useState(null)
    const [destinationCoords, setDestinationCoords] = useState(null)
    const [captainLocation, setCaptainLocation] = useState(null)
    const [routeCoordinates, setRouteCoordinates] = useState([])
    const [showRoute, setShowRoute] = useState(false)
    const watchId = useRef(null)

    // Map marker icons
    const markerIcons = {
        user: 'data:image/svg+xml;base64,' + btoa(`
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="15" fill="#4285F4" stroke="white" stroke-width="3"/>
                <circle cx="20" cy="16" r="5" fill="white"/>
                <path d="M12 26c0-4 3.5-7 8-7s8 3 8 7" fill="white"/>
            </svg>
        `),
        captain: 'data:image/svg+xml;base64,' + btoa(`
            <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="15" width="24" height="12" rx="6" fill="#FFC107" stroke="white" stroke-width="2"/>
                <rect x="12" y="18" width="16" height="6" rx="1" fill="white"/>
                <circle cx="14" cy="29" r="3" fill="#333"/>
                <circle cx="26" cy="29" r="3" fill="#333"/>
            </svg>
        `),
        pickup: 'data:image/svg+xml;base64,' + btoa(`
            <svg width="35" height="35" viewBox="0 0 35 35" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.5 35c0 0-12-8-12-20a12 12 0 0 1 24 0c0 12-12 20-12 20z" fill="#34D399" stroke="white" stroke-width="2"/>
                <circle cx="17.5" cy="15" r="5" fill="white"/>
            </svg>
        `),
        destination: 'data:image/svg+xml;base64,' + btoa(`
            <svg width="35" height="35" viewBox="0 0 35 35" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.5 35c0 0-12-8-12-20a12 12 0 0 1 24 0c0 12-12 20-12 20z" fill="#EF4444" stroke="white" stroke-width="2"/>
                <circle cx="17.5" cy="15" r="5" fill="white"/>
            </svg>
        `)
    }

    // Get coordinates from address using Geocoding
    const getCoordinatesFromAddress = async (address) => {
        try {
            const geocoder = new window.google.maps.Geocoder()
            return new Promise((resolve, reject) => {
                geocoder.geocode({ address }, (results, status) => {
                    if (status === 'OK') {
                        const location = results[0].geometry.location
                        resolve({
                            lat: location.lat(),
                            lng: location.lng()
                        })
                    } else {
                        reject(status)
                    }
                })
            })
        } catch (error) {
            console.error('Geocoding error:', error)
            return null
        }
    }

    // Start watching user's location
    const startLocationTracking = () => {
        console.log('🗺️ Starting location tracking for', userType)
        console.log('🔌 Socket connected:', isConnected)
        
        if (navigator.geolocation) {
            watchId.current = navigator.geolocation.watchPosition(
                (position) => {
                    const newLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    }
                    console.log('📍 Location updated:', newLocation)
                    setCurrentLocation(newLocation)
                    
                    // Emit location to other users via socket
                    if (socket && isConnected && ride) {
                        if (userType === 'captain') {
                            console.log('📡 Emitting captain location update')
                            socket.emit('captain-location-update', {
                                rideId: ride._id,
                                location: newLocation
                            })
                        } else {
                            console.log('📡 Emitting user location update')
                            socket.emit('user-location-update', {
                                rideId: ride._id,
                                location: newLocation
                            })
                        }
                    } else {
                        console.warn('⚠️ Socket not ready for location broadcast')
                    }
                },
                (error) => {
                    console.error('❌ Geolocation error:', error)
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            console.error("User denied the request for Geolocation.")
                            break
                        case error.POSITION_UNAVAILABLE:
                            console.error("Location information is unavailable.")
                            break
                        case error.TIMEOUT:
                            console.error("The request to get user location timed out.")
                            break
                        default:
                            console.error("An unknown error occurred.")
                            break
                    }
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000
                }
            )
        } else {
            console.error('❌ Geolocation not supported by this browser')
        }
    }

    // Setup socket listeners for location updates
    useEffect(() => {
        if (socket && isConnected && ride) {
            console.log('🔗 Setting up socket listeners for', userType)
            
            // Listen for captain location updates (if user)
            if (userType === 'user') {
                const handleCaptainLocation = (data) => {
                    console.log('📍 Received captain location:', data)
                    if (data.rideId === ride._id) {
                        setCaptainLocation(data.location)
                    }
                }
                socket.on('captain-location-update', handleCaptainLocation)
            }
            
            // Listen for user location updates (if captain)
            if (userType === 'captain') {
                const handleUserLocation = (data) => {
                    console.log('📍 Received user location:', data)
                    if (data.rideId === ride._id) {
                        // Update user location if needed
                        console.log('User location update:', data.location)
                    }
                }
                socket.on('user-location-update', handleUserLocation)
            }

            return () => {
                console.log('🧹 Cleaning up socket listeners')
                socket.off('captain-location-update')
                socket.off('user-location-update')
            }
        } else {
            console.warn('⚠️ Socket or ride not ready for listeners')
        }
    }, [socket, isConnected, ride, userType])

    // Get coordinates for pickup and destination
    useEffect(() => {
        const loadCoordinates = async () => {
            if (ride && window.google && window.google.maps) {
                try {
                    console.log('🗺️ Loading coordinates for pickup and destination')
                    const pickup = await getCoordinatesFromAddress(ride.pickup)
                    const destination = await getCoordinatesFromAddress(ride.destination)
                    
                    if (pickup) {
                        console.log('📍 Pickup coordinates:', pickup)
                        setPickupCoords(pickup)
                    }
                    if (destination) {
                        console.log('📍 Destination coordinates:', destination)
                        setDestinationCoords(destination)
                    }
                } catch (error) {
                    console.error('❌ Error loading coordinates:', error)
                }
            } else {
                console.warn('⚠️ Google Maps API or ride data not ready')
            }
        }
        
        // Delay coordinate loading to ensure Google Maps is ready
        const timeoutId = setTimeout(loadCoordinates, 1000)
        return () => clearTimeout(timeoutId)
    }, [ride])

    // Start location tracking on component mount
    useEffect(() => {
        startLocationTracking()
        
        return () => {
            if (watchId.current) {
                navigator.geolocation.clearWatch(watchId.current)
            }
        }
    }, [])

    // Calculate directions when we have pickup and destination
    const onDirectionsCallback = (response, status) => {
        if (status === 'OK') {
            setDirections(response)
        } else {
            console.error('Directions request failed:', status)
        }
    }

    // Center map on current location when available
    useEffect(() => {
        if (map && currentLocation) {
            map.panTo(currentLocation)
        }
    }, [map, currentLocation])

    // Display route from Mapbox API
    const displayRoute = async (pickup, destination) => {
        try {
            const response = await fetch(
                `https://api.mapbox.com/directions/v5/mapbox/driving/${pickup.lng},${pickup.lat};${destination.lng},${destination.lat}?geometries=geojson&access_token=${import.meta.env.VITE_MAPBOX_TOKEN}`
            );
            const data = await response.json();
            
            if (data.routes && data.routes[0]) {
                const route = data.routes[0].geometry.coordinates;
                setRouteCoordinates(route);
                setShowRoute(true);
            }
        } catch (error) {
            console.error('Error fetching route:', error);
        }
    };

    // Handle ride confirmation
    const handleConfirmRide = (rideData) => {
        // Display route on map
        displayRoute(rideData.pickup, rideData.destination);
        
        // Other confirmation logic
        setRideConfirmed(true);
    };

    // Google Maps API key
    const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    // load Google Maps script once
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'live-tracking-script',
        googleMapsApiKey,
        libraries: ['geometry', 'places']
    })

    // API key missing
    if (!googleMapsApiKey) {
        console.error('Google Maps API key not found')
        return <div className='w-full h-full flex items-center justify-center'>Configuration Error</div>
    }
    if (loadError) {
        console.error('Google Maps script load error:', loadError)
        return <div className='w-full h-full flex items-center justify-center'>Map Unavailable</div>
    }
    if (!isLoaded) {
        return <div className='w-full h-full flex items-center justify-center'>Loading Map...</div>
    }

    return (
        <div className='w-full h-full relative'>
            <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={currentLocation || { lat: 28.6139, lng: 77.2090 }}
                zoom={15}
                onLoad={mapInstance => setMap(mapInstance)}
                options={{ zoomControl: true }}
            >
                {/* Current user location marker */}
                {currentLocation && (
                    <Marker
                        position={currentLocation}
                        icon={{
                            url: markerIcons[userType],
                            scaledSize: new window.google.maps.Size(40, 40),
                            anchor: new window.google.maps.Point(20, 20)
                        }}
                        title={userType === 'captain' ? 'Your Location (Captain)' : 'Your Location'}
                    />
                )}

                {/* Captain location marker (for users) */}
                {userType === 'user' && captainLocation && (
                    <Marker
                        position={captainLocation}
                        icon={{
                            url: markerIcons.captain,
                            scaledSize: new window.google.maps.Size(40, 40),
                            anchor: new window.google.maps.Point(20, 20)
                        }}
                        title="Captain Location"
                    />
                )}

                {/* Pickup location marker */}
                {pickupCoords && (
                    <Marker
                        position={pickupCoords}
                        icon={{
                            url: markerIcons.pickup,
                            scaledSize: new window.google.maps.Size(35, 35),
                            anchor: new window.google.maps.Point(17, 35)
                        }}
                        title="Pickup Location"
                    />
                )}

                {/* Destination marker */}
                {destinationCoords && (
                    <Marker
                        position={destinationCoords}
                        icon={{
                            url: markerIcons.destination,
                            scaledSize: new window.google.maps.Size(35, 35),
                            anchor: new window.google.maps.Point(17, 35)
                        }}
                        title="Destination"
                    />
                )}

                {/* Directions from pickup to destination */}
                {pickupCoords && destinationCoords && !directions && window.google && (
                    <DirectionsService
                        options={{
                            destination: destinationCoords,
                            origin: pickupCoords,
                            travelMode: window.google.maps.TravelMode.DRIVING
                        }}
                        callback={onDirectionsCallback}
                    />
                )}

                {/* Render directions */}
                {directions && (
                    <DirectionsRenderer
                        directions={directions}
                        options={{
                            suppressMarkers: true, // We'll use our custom markers
                            polylineOptions: {
                                strokeColor: '#4285F4',
                                strokeOpacity: 0.8,
                                strokeWeight: 4
                            }
                        }}
                    />
                )}
            </GoogleMap>
        </div>
    )
}

export default LiveTracking
