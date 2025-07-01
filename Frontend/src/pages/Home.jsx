import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import axios from 'axios';
import 'remixicon/fonts/remixicon.css';

import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRide from '../components/ConfirmRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import socketContext from '../context/SocketContext';
import userContext, { UserDataContext } from '../context/userContext';
import { useEffect } from 'react';
import { use } from 'react';
import { useContext } from 'react';
const Home = () => {
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);

  const [panelOpen, setPanelOpen] = useState(false);
  const [vehiclePanelOpen, setVehiclePanelOpen] = useState(false);
  const [confirmRidePanel, setConfirmRidePanel] = useState(false);
  const [vehicleFound, setvehicleFound] = useState(false);
  const [waitingForDriver, setWaitingForDriver] = useState(false);
  const [fare, setFare] = useState({});
  const [vehicleType, setVehicleType] = useState(null);

  const { socket } = useContext(socketContext);
  const { user } = userContext(UserDataContext);
  // Refs for GSAP animations

  const panelRef = useRef(null);
  const vehiclePanelref = useRef(null);
  const confirmRidePanelref = useRef(null);
  const vehicleFoundRef = useRef(null);
  const waitingForDriverRef = useRef(null);
  const panelCloseRef = useRef(null);

  const handlePickupChange = async (e) => {
    const value = e.target.value;
    setPickup(value);
    setActiveField('pickup');

    if (!value.trim()) {
      setPickupSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
        {
          params: { input: e.target.value },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })

      setPickupSuggestions(response.data);
    } catch (error) {
      setPickupSuggestions([]);
      console.error('Pickup suggestion error:', error);
    }
  };

  const handleDestinationChange = async (e) => {
    setDestination(e.target.value);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
        {
          params: { input: e.target.value },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
      setDestinationSuggestions(response.data);
    } catch (error) {
      setDestinationSuggestions([]);
      console.error('Destination suggestion error:', error);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
  };

  // GSAP animations
  useGSAP(() => {
    gsap.to(panelRef.current, {
      height: panelOpen ? '70%' : '0',
      duration: 0.5,
      padding: panelOpen ? '24' : '0',
      opacity: panelOpen ? 1 : 0
    });

    gsap.to(panelCloseRef.current, {
      opacity: panelOpen ? 1 : 0,
      duration: 0.5
    });
  }, [panelOpen]);

  useGSAP(() => {
    gsap.to(vehiclePanelref.current, {
      transform: vehiclePanelOpen ? 'translateY(0)' : 'translateY(100%)'
    });
  }, [vehiclePanelOpen]);

  useGSAP(() => {
    gsap.to(confirmRidePanelref.current, {
      transform: confirmRidePanel ? 'translateY(0)' : 'translateY(100%)'
    });
  }, [confirmRidePanel]);

  useGSAP(() => {
    gsap.to(vehicleFoundRef.current, {
      transform: vehicleFound ? 'translateY(0)' : 'translateY(100%)'
    });
  }, [vehicleFound]);

  useGSAP(() => {
    gsap.to(waitingForDriverRef.current, {
      transform: waitingForDriver ? 'translateY(0)' : 'translateY(100%)'
    });
  }, [waitingForDriver]);


  async function findTrip() {
    setVehiclePanelOpen(true)
    setPanelOpen(false)


    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
      params: { pickup, destination },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    setFare(response.data);

    console.log(response.data);


  }

  async function createRide() {
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
      pickup,
      destination,
      vehicleType
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    console.log(response.data);

  }

  useEffect(() => {
   socket.emit('join', { userType: 'user', userId: user._id });
  },[user])

  return (
    <div className='h-screen relative overflow-hidden'>
      <img
        className='w-16 ml-8 absolute top-5'
        src='https://freelogopng.com/images/all_img/1659761100uber-logo-png.png'
        alt='Uber Logo'
      />

      <div className='h-screen w-screen'>
        <img
          className='w-full h-full object-cover'
          src='https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif'
        />
      </div>

      <div className='flex flex-col h-screen justify-end absolute top-0 w-full'>
        <div className='h-[36%] p-6 bg-white relative'>
          <h5
            ref={panelCloseRef}
            onClick={() => setPanelOpen(false)}
            className='absolute top-6 right-6 text-2xl opacity-0 cursor-pointer'
          >
            <i className='ri-arrow-down-wide-line'></i>
          </h5>

          <h4 className='text-2xl font-semibold'>Find a Trip</h4>
          <form onSubmit={submitHandler}>
            <div className='line absolute h-16 w-1 top-[45%] left-8 bg-gray-900 rounded-full'></div>

            <input
              value={pickup}
              onChange={handlePickupChange}
              onClick={() => {
                setPanelOpen(true);
                setActiveField('pickup');
              }}
              className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-5'
              type='text'
              placeholder='Add a pick-up location'
            />

            <input
              value={destination}
              onChange={handleDestinationChange}
              onClick={() => {
                setPanelOpen(true);
                setActiveField('destination');
              }}
              className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-3'
              type='text'
              placeholder='Enter your destination'
            />
          </form>
          <button onClick={findTrip} className='bg-black text-white text-base px-4 py-2 rounded-lg mt-3  w-full flex justify-center '>
            Find Trip
          </button>
        </div>

        <div ref={panelRef} className='bg-white h-0 overflow-hidden'>
          <LocationSearchPanel
            setPanelOpen={setPanelOpen}
            setVehiclePanel={setVehiclePanelOpen}
            activeField={activeField}
            suggestions={
              activeField === 'pickup' ? pickupSuggestions : destinationSuggestions
            }
            setPickup={setPickup}
            setDestination={setDestination}
          />
        </div>
      </div>

      <div
        ref={vehiclePanelref}
        className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'
      >
        <VehiclePanel
          selectVehicle={setVehicleType}
          fare={fare}
          setConfirmRidePanel={setConfirmRidePanel}
          setVehiclePanel={setVehiclePanelOpen}
        />
      </div>

      <div
        ref={confirmRidePanelref}
        className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'
      >
        <ConfirmRide
          pickup={pickup}
          destination={destination}
          fare={fare}
          vehicleType={vehicleType}
          createRide={createRide}
          setConfirmRidePanel={setConfirmRidePanel}
          setvehicleFound={setvehicleFound}
          setVehiclePanelOpen={setVehiclePanelOpen}
        />
      </div>

      <div
        ref={vehicleFoundRef}
        className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'
      >
        <LookingForDriver
          createRide={createRide}
          pickup={pickup}
          destination={destination}
          fare={fare}
          vehicleType={vehicleType}
          setvehicleFound={setvehicleFound}
        />
      </div>

      <div
        ref={waitingForDriverRef}
        className='fixed w-full z-10 bottom-0 bg-white px-3 py-6 pt-12'
      >
        <WaitingForDriver waitingForDriver={waitingForDriver} />
      </div>
    </div>
  );
};

export default Home;
