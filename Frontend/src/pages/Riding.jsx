import React, { useState, useEffect, useContext} from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useSocket } from '../context/SocketContext'
import { useNavigate } from 'react-router-dom'
import LiveTracking from '../components/LiveTracking'
import axios from 'axios'

const Riding = () => {
  const location = useLocation()
  const [rideData, setRideData] = useState(null)
  const { socket, isConnected } = useSocket()
  const navigate = useNavigate()

  // Setup socket listeners in useEffect
  useEffect(() => {
    if (socket && isConnected) {
      console.log('🔗 Setting up ride-ended listener in Riding')
      
      const handleRideEnded = () => {
        console.log('🏁 Ride ended, navigating to home')
        navigate('/home')
      }

      socket.on('ride-ended', handleRideEnded)

      return () => {
        console.log('🧹 Cleaning up ride-ended listener')
        socket.off('ride-ended', handleRideEnded)
      }
    }
  }, [socket, isConnected, navigate])

  // Extract ride data from navigation state
  useEffect(() => {
    if (location.state && location.state.ride) {
      setRideData(location.state.ride)
      console.log('🚗 Ride data received in Riding:', location.state.ride)
    } else {
      console.warn('⚠️ No ride data found in navigation state')
    }
  }, [location.state])

  // Function to complete ride when user pays
  async function completeRide() {
    if (!rideData || !rideData._id) {
      alert('Ride information not available')
      return
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/rides/end-ride`,
        { rideId: rideData._id },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )
      if (response.status === 200) {
        console.log('Pay completed, navigating home')
        navigate('/home')
      }
    } catch (error) {
      console.error('Error completing ride:', error)
      alert('Error completing ride. Please try again.')
    }
  }

  // Show loading state if no ride data
  if (!rideData) {
    return (
      <div className='h-screen flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-semibold mb-4'>Loading Ride Details...</h2>
          <p className='text-gray-600'>Please wait while we fetch your ride information</p>
        </div>
      </div>
    )
  }

  return (
    <div className='h-screen flex flex-col'>
      {/* Home Button */}
      <Link
        to='/home'
        className='fixed right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full z-10'
      >
        <i className='text-lg ri-home-4-line'></i>
      </Link>

      {/* Map */}
      <div className='flex-grow h-1/2'>
        <LiveTracking ride={rideData} userType='user' />
      </div>

      {/* Details & Payment */}
      <div className='h-1/2 p-4 overflow-y-auto flex flex-col'>
        <div className='flex items-center justify-between mb-4'>
          <img className='h-12 w-16 object-contain' src='https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1682350473/assets/97/e2a99c-c349-484f-b6b0-3cea1a8331b5/original/UberBlack.png' alt='Logo' />
          <div className='text-right'>
            <h2 className='text-base font-medium'>{rideData.captain.fullname.firstname} {rideData.captain.fullname.lastname}</h2>
            <h4 className='text-sm font-semibold -mt-1'>{rideData.captain.vehicle.plate}</h4>
            <p className='text-xs text-gray-600'>{rideData.captain.vehicle.color} {rideData.captain.vehicle.vehicleType}</p>
          </div>
        </div>

        <div className='space-y-3 flex-grow'>
          <div className='flex items-center gap-3'><i className='ri-map-pin-line text-green-600'></i><p className='text-sm'>{rideData.pickup}</p></div>
          <div className='flex items-center gap-3'><i className='ri-map-pin-fill text-red-600'></i><p className='text-sm'>{rideData.destination}</p></div>
          <div className='flex items-center gap-3'><i className='ri-currency-fill text-yellow-600'></i><p className='text-sm'>Rs.{rideData.fare}</p></div>
        </div>

        <button onClick={completeRide} className='mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-semibold p-2 rounded-lg text-sm transition'>
          Pay Rs.{rideData.fare} – Complete Ride
        </button>
      </div>
    </div>
  )
}

export default Riding
