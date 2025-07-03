import React from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';

const FinishRide = (props) => {
  const { ride } = props;
  const navigate = useNavigate();
  const { socket, isConnected } = useSocket();

  async function endRide() {
    try {
      if (!ride || !ride._id) {
        alert('Ride information not available');
        return;
      }

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/end-ride`,
          { rideId: ride._id },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      )

      if (response.status === 200) {
          // Close panel
          props.setFinishRidePanel(false);
          // Notify user via socket
          if (socket && isConnected) {
            socket.emit('ride-ended', { rideId: ride._id });
          }
          // Redirect captain home
          navigate('/captain-home');
      }
    } catch (error) {
      console.error('Error ending ride:', error);
      alert('Error completing ride. Please try again.');
    }
}
  
  return (
     <div className='h-screen max-h-screen overflow-y-auto p-2 pb-6'>
            <h5 className='p-1 text-center absolute w-[93%] top-0 ' onClick={() => {
                props.setFinishRidePanel(false)
            }}><i className=" text-3xl text-gray-200 ri-arrow-down-wide-fill"></i></h5>

            <h3 className='text-2xl font-semibold mb-3 mt-8'>Complete This Ride!</h3>


            <div className=' flex items-center justify-between p-3 border-2 border-yellow-400 rounded-lg mt-2'>
                <div className='flex items-center gap-3  '>
                    <img className='h-10 w-10 rounded-full object-cover' src='https://img.freepik.com/free-photo/close-up-portrait-curly-handsome-european-male_176532-8133.jpg?semt=ais_hybrid&w=740' />
                    <div>
                        <h2 className='text-base font-medium'>
                            {ride?.user?.fullname ? 
                                `${ride.user.fullname.firstname} ${ride.user.fullname.lastname}` : 
                                'Passenger'
                            }
                        </h2>
                        <p className='text-xs text-gray-600'>
                            Passenger • {ride?.user?.phone || 'Contact Number'}
                        </p>
                    </div>
                </div>
                <div className='text-center'>
                    <h5 className='text-base font-semibold'>Rs.{ride?.fare || '0'}</h5>
                    <p className='text-xs text-gray-600'>Earning</p>
                </div>
            </div>

            <div className='flex gap-2 flex-col justify-between items-center'>


                <div className='w-full mt-3'>
                    <div className='flex items-center gap-4 p-2 border-b-1'>
                        <i className=" text-base ri-map-pin-line"></i>
                        <div className=''>
                            <h3 className='text-base font-medium'>Pickup</h3>
                            <p className='text-xs -mt-1 text-gray-600'>{ride?.pickup || 'Your Location'}</p>
                        </div>
                    </div>

                    <div className='flex items-center gap-4 p-2 border-b-1'>
                        <i className="ri-map-pin-fill"></i>
                        <div className=''>
                            <h3 className='text-base font-medium'>Destination</h3>
                            <p className='text-xs -mt-1 text-gray-600'>{ride?.destination || 'Your Destination'}</p>
                        </div>
                    </div>

                    <div className='flex items-center gap-4 p-2'>
                        <i className="ri-currency-fill"></i>
                        <div className=''>
                            <h3 className='text-base font-medium'>Rs.{ride?.fare || '0'}</h3>
                            <p className='text-xs -mt-1 text-gray-600'>Your Earning</p>
                        </div>
                    </div>
                </div>
            </div>



            <div className='mt-6 w-full'>
                    <div className='flex flex-col gap-2'>
                        <div className='bg-yellow-100 border border-yellow-400 rounded-lg p-2 text-center'>
                            <p className='text-yellow-800 font-medium text-sm'>🚗 Ready to Complete Ride!</p>
                            <p className='text-xs text-yellow-600'>Passenger has reached destination</p>
                        </div>
                        
                        <button onClick={endRide} 
                            className='flex justify-center text-base w-full bg-green-600 text-white font-semibold p-3 rounded-lg'
                        >
                            Finish Ride & Collect Payment
                        </button>
                        
                        <button 
                            onClick={() => props.setFinishRidePanel(false)}
                            className='flex justify-center text-base w-full bg-gray-600 text-white font-semibold p-2 rounded-lg'
                        >
                            Cancel
                        </button>
                    </div>
            </div>

        </div>
  )
}

export default FinishRide
