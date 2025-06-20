import React, { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRide from '../components/ConfirmRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
const Home = () => {

  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const panelRef = useRef(null);
  const vehiclePanelref = useRef(null)
  const panelCloseRef = useRef(null);
  const vehicleFoundRef = useRef(null);
    const waitingForDriverRef = useRef(null);
  const confirmRidePanelref = useRef(null)
  const [vehiclePanelOpen, setVehiclePanelOpen] = useState(false)
 const [confirmRidePanel , setConfirmRidePanel] = useState(false)
  const [vehicleFound, setvehicleFound] = useState(false)
    const [waitingForDriver, setWaitingForDriver] = useState(false)

  const submitHandler = (e) => {
    e.preventDefault();

  }

  useGSAP(function () {
    gsap.to(panelRef.current, {
      height: panelOpen ? '70%' : '0',
      duration: 0.5,
      padding: panelOpen ? '24' : '0',
      opacity: panelOpen ? 1 : 0,
    })

    gsap.to(panelCloseRef.current, {
      opacity: panelOpen ? 1 : 0,
      duration: 0.5,
    })

  }, [panelOpen]);

  useGSAP(function () {
    if (vehiclePanelOpen) {
      gsap.to(vehiclePanelref.current, {
        transform: 'translateY(0)'
      })
    } else {
      gsap.to(vehiclePanelref.current, {
        transform: 'translateY(100%)'
      })
    }

  }, [vehiclePanelOpen])


  useGSAP(function () {
    if (confirmRidePanel) {
      gsap.to(confirmRidePanelref.current, {
        transform: 'translateY(0)'
      })
    } else {
      gsap.to(confirmRidePanelref.current, {
        transform: 'translateY(100%)'
      })
    }

  }, [confirmRidePanel])


    useGSAP(function () {
    if (vehicleFound) {
      gsap.to(vehicleFoundRef.current, {
        transform: 'translateY(0)'
      })
    } else {
      gsap.to(vehicleFoundRef.current, {
        transform: 'translateY(100%)'
      })
    }

  }, [vehicleFound])

     useGSAP(function () {
    if (waitingForDriver) {
      gsap.to(waitingForDriverRef.current, {
        transform: 'translateY(0)'
      })
    } else {
      gsap.to(waitingForDriverRef.current, {
        transform: 'translateY(100%)'
      })
    }

  }, [waitingForDriver])




  return (
    <div className='h-screen relative overflow-hidden'>
      <img className='w-16 ml-8 absolute top-5 ' src='https://freelogopng.com/images/all_img/1659761100uber-logo-png.png' alt='Uber Logo' />

      <div className='h-screen w-screen '>
        {/* image for temporary use  */}
        <img className='w-full h-full object-cover ' src='https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif' />
      </div>

      <div className='  flex flex-col h-screen justify-end absolute top-0 w-full  '>
        <div className=' h-[30%] p-6 bg-white relative'>
          <h5 ref={panelCloseRef} onClick={() => {
            setPanelOpen(false)
          }} className='absolute top-6 right-6 text-2xl opacity-0'>
            <i className="ri-arrow-down-wide-line"></i>
          </h5>

          <h4 className='text-2xl font-semibold'>Find a Trip</h4>
          <form onSubmit={(e) => {
            submitHandler(e)
          }}>

            <div className='line absolute h-16 w-1 top-[45%] left-8 bg-gray-900 rounded-full'></div>
            <input
              onClick={() => setPanelOpen(true)}
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-5"
              type='text'
              placeholder='Add a pick-up location' />
            <input
              onClick={() => setPanelOpen(true)}
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-3"
              type='text'
              placeholder='Enter your destination'
            />
          </form>

        </div>

        <div ref={panelRef} className=' bg-white  h-0   ' >
          <LocationSearchPanel setPanelOpen={setPanelOpen} setVehiclePanel={setVehiclePanelOpen} />
        </div>
      </div>

      <div ref={vehiclePanelref} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
        <VehiclePanel setConfirmRidePanel = {setConfirmRidePanel} setVehiclePanel={setVehiclePanelOpen} />
      </div>

      <div ref={confirmRidePanelref} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
        <ConfirmRide  setConfirmRidePanel={setConfirmRidePanel} setvehicleFound = {setvehicleFound} />
      </div>

       <div ref={vehicleFoundRef}   className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
       <LookingForDriver setvehicleFound = {setvehicleFound}/>
      </div>

       <div ref={waitingForDriverRef}   className='fixed w-full z-10 bottom-0 bg-white px-3 py-6 pt-12'>
       <WaitingForDriver waitingForDriver = {waitingForDriver} />
      </div>

    </div>
  )
}

export default Home
