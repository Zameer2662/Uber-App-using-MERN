import React from 'react'
import { Link } from 'react-router-dom'

const FinishRide = (props) => {
  const { ride } = props;
  
  return (
     <div >
            <h5 className='p-1 text-center absolute w-[93%] top-0 ' onClick={() => {
                props.setFinishRidePanel(false)
            }}><i className=" text-3xl text-gray-200 ri-arrow-down-wide-fill"></i></h5>

            <h3 className='text-2xl font-semibold mb-5'>Complete This Ride!</h3>


            <div className=' flex items-center justify-between p-4 border-2 border-yellow-400 rounded-lg mt-3'>
                <div className='flex items-center gap-3  '>
                    <img className='h-12 w-12 rounded-full object-cover' src='https://img.freepik.com/free-photo/close-up-portrait-curly-handsome-european-male_176532-8133.jpg?semt=ais_hybrid&w=740' />
                    <div>
                        <h2 className='text-lg font-medium'>
                            {ride?.user?.fullname ? 
                                `${ride.user.fullname.firstname} ${ride.user.fullname.lastname}` : 
                                'Passenger'
                            }
                        </h2>
                        <p className='text-sm text-gray-600'>
                            Passenger • {ride?.user?.phone || 'Contact Number'}
                        </p>
                    </div>
                </div>
                <div className='text-center'>
                    <h5 className='text-lg font-semibold'>Rs.{ride?.fare || '0'}</h5>
                    <p className='text-sm text-gray-600'>Earning</p>
                </div>
            </div>

            <div className='flex gap-2 flex-col justify-between items-center'>


                <div className='w-full mt-5 '>
                    <div className='flex items-center gap-5  p-3 border-b-1'>
                        <i className=" text-lg ri-map-pin-line"></i>
                        <div className=''>
                            <h3 className='text-lg font-medium'>Pickup</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{ride?.pickup || 'Your Location'}</p>
                        </div>
                    </div>

                    <div className='flex items-center gap-5 p-3 border-b-1'>
                        <i className="ri-map-pin-fill"></i>
                        <div className=''>
                            <h3 className='text-lg font-medium'>Destination</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{ride?.destination || 'Your Destination'}</p>
                        </div>
                    </div>

                    <div className='flex items-center gap-5  p-3 '>
                        <i className="ri-currency-fill"></i>
                        <div className=''>
                            <h3 className='text-lg font-medium'>Rs.{ride?.fare || '0'}</h3>
                            <p className='text-sm -mt-1 text-gray-600'>Your Earning</p>
                        </div>
                    </div>
                </div>
            </div>



            <div className='mt-16 w-full'>
                    <div className='flex flex-col gap-3'>
                        <div className='bg-yellow-100 border border-yellow-400 rounded-lg p-3 text-center'>
                            <p className='text-yellow-800 font-medium'>🚗 Ready to Complete Ride!</p>
                            <p className='text-sm text-yellow-600'>Passenger has reached destination</p>
                        </div>
                        
                        <button 
                            className='flex justify-center text-lg w-full bg-green-600 text-white font-semibold p-3 rounded-lg'
                        >
                            Finish Ride & Collect Payment
                        </button>
                        
                        <button 
                            onClick={() => props.setFinishRidePanel(false)}
                            className='flex justify-center text-lg w-full bg-gray-600 text-white font-semibold p-3 rounded-lg'
                        >
                            Cancel
                        </button>
                    </div>
            </div>

        </div>
  )
}

export default FinishRide
