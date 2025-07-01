import React, { useRef, useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import CaptainDetails from '../components/CaptainDetails'
import RidePopup from '../components/RidePopup'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ConfirmRidePopup from '../components/ConfirmRidePopup'

import { CaptainDataContext } from '../context/CaptainContext'
import SocketContext from '../context/SocketContext'




const CaptainHome = () => {

  const [ridePopupPanel, setRidePopupPanel] = useState(true);
  const ridePopupPanelref = useRef(null)

  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
  const ConfirmRidePopupPanelref = useRef(null)

  const { socket } = useContext(SocketContext);
  const { captain } = useContext(CaptainDataContext);


  useEffect(() => {
  if (!captain || !captain._id) return; // Prevent running if captain is not loaded

  socket.emit('join', {
    userId: captain._id,
    userType: 'captain'
  });

  const updateLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        console.log(captain._id, position.coords.latitude, position.coords.longitude);

        socket.emit('update-location-captain', {
          userId: captain._id,
          location: {
            ltd: position.coords.latitude,
            lang: position.coords.longitude
          }
        });
      });
    }
  };

  const locationInterval = setInterval(updateLocation, 10000);
  updateLocation();

  return () => clearInterval(locationInterval);
}, [captain, socket]);


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
        <RidePopup setRidePopupPanel={setRidePopupPanel} setConfirmRidePopupPanel={setConfirmRidePopupPanel} />
      </div>

      <div ref={ConfirmRidePopupPanelref} className='fixed w-full  h-screen z-10 bottom-0  translate-y-full bg-white px-3 py-10 pt-12'>
        <ConfirmRidePopup setRidePopupPanel={setRidePopupPanel} setConfirmRidePopupPanel={setConfirmRidePopupPanel} />
      </div>

    </div>
  )
}

export default CaptainHome
