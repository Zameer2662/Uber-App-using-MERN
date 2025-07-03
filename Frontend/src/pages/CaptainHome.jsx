import React, { useRef, useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import RidePopup from '../components/RidePopup'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ConfirmRidePopup from '../components/ConfirmRidePopup'

import { CaptainDataContext } from '../context/CaptainContext'
import { useSocket } from '../context/SocketContext'
import axios from 'axios'




const CaptainHome = () => {

  const [ridePopupPanel, setRidePopupPanel] = useState(false);
  const [ride, setRide] = useState(null); // Assuming ride data will be set when a new ride request comes in
  const ridePopupPanelref = useRef(null)

  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
  const ConfirmRidePopupPanelref = useRef(null)

  const { socket, isConnected, connectionError } = useSocket();
  const { captain } = useContext(CaptainDataContext);

  // Show connection status
  useEffect(() => {
    if (isConnected && captain?._id) {
      console.log('✅ Captain connected successfully:', {
        name: `${captain.fullname.firstname} ${captain.fullname.lastname}`,
        id: captain._id,
        email: captain.email,
        vehicle: captain.vehicle?.vehicleType
      });
    } else {
      console.log('⚠️ Captain connection status:', {
        isConnected,
        hasCaptain: !!captain,
        captainId: captain?._id
      });
    }
  }, [isConnected, captain]);


  useEffect(() => {
  if (!captain || !captain._id || !socket || !isConnected) {
    return;
  }
  
  socket.emit('join', {
    userId: captain._id,
    userType: 'captain'
  });

  const updateLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const location = {
          ltd: position.coords.latitude, 
          lng: position.coords.longitude
        };
        
        console.log('📍 Updating captain location:', location);
        
        socket.emit('update-location-captain', {
          userId: captain._id,
          location: location
        });
      });
    }
  };

  const locationInterval = setInterval(updateLocation, 10000);
  updateLocation();

  return () => {
    clearInterval(locationInterval);
  };
}, [captain, socket, isConnected]);

useEffect(() => {
  if (!socket || !isConnected) {
    return;
  }

  // Listen for new ride requests
  socket.on('new-ride', (data) => {
    console.log('🚨 New ride request received:', {
      rideId: data._id,
      pickup: data.pickup,
      destination: data.destination,
      user: data.user?.fullname?.firstname || 'Unknown'
    });
    setRide(data);
    setRidePopupPanel(true);
  });

  return () => {
    socket.off('new-ride');
  };
}, [socket, isConnected]);

 
 async function confirmRide() {
   try {
     if (!ride || !ride._id) {
       console.error('❌ No ride data available');
       alert('No ride data available');
       return;
     }

     if (!captain || !captain._id) {
       console.error('❌ No captain data available');
       alert('Captain data not available');
       return;
     }

     console.log('🚨 Captain confirming ride:', {
       rideId: ride._id,
       captainId: captain._id,
       captainName: `${captain.fullname?.firstname} ${captain.fullname?.lastname}`
     });

     const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm`, {
       rideId: ride._id,
       captainId: captain._id,
     }, {
       headers: {
         Authorization: `Bearer ${localStorage.getItem('token')}`
       }
     });

     console.log('✅ Ride confirmed successfully:', response.data);
 
     setRidePopupPanel(false);
     setConfirmRidePopupPanel(true);
     
   } catch (error) {
     console.error('❌ Error confirming ride:', error);
     console.error('Error details:', error.response?.data);
     alert('Error confirming ride. Please try again.');
   }
 }


  useGSAP(function () {
    if (ridePopupPanel) {
      gsap.to(ridePopupPanelref.current, {
        transform: 'translateY(0)'
      })
    } else {
      gsap.to(ridePopupPanelref.current, {
        transform: 'translateY(100%)'
      })
    }

  }, [ridePopupPanel])

  useGSAP(function () {
    if (confirmRidePopupPanel) {
      gsap.to(ConfirmRidePopupPanelref.current, {
        transform: 'translateY(0)'
      })
    } else {
      gsap.to(ConfirmRidePopupPanelref.current, {
        transform: 'translateY(100%)'
      })
    }

  }, [confirmRidePopupPanel])

  return (
    <div className='h-screen'>

      <div className='fixed p-6 top-0 flex items-center justify-between w-screen'>
        <img className='w-16' src='https://freelogopng.com/images/all_img/1659761100uber-logo-png.png' />
        <Link to='/captain-login' className='  h-10 w-10 bg-white flex items-center justify-center rounded-full'>
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
      </div>



      <div className='h-3/5 '>

        <img className='w-full h-full object-cover ' src='https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif' />


      </div>


      <div className='h-2/5 mt-6 p-6'>
        <CaptainDetails />
      </div>


      <div ref={ridePopupPanelref} className='fixed w-full z-10 bottom-0  translate-y-full bg-white px-3 py-10 pt-12'>
        <RidePopup 
        ride={ride} 
        setRidePopupPanel={setRidePopupPanel} 
        setConfirmRidePopupPanel={setConfirmRidePopupPanel}
        confirmRide={confirmRide}
        />
      </div>

      <div ref={ConfirmRidePopupPanelref} className='fixed w-full  h-screen z-10 bottom-0  translate-y-full bg-white px-3 py-10 pt-12'>
        <ConfirmRidePopup
          ride={ride}
          setRidePopupPanel={setRidePopupPanel}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
        />
      </div>

    </div>
  )
}

export default CaptainHome
