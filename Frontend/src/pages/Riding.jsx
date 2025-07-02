import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const Riding = () => {
  const location = useLocation()
  const [rideData, setRideData] = useState(null)

  // Extract ride data from navigation state
  useEffect(() => {
    if (location.state && location.state.ride) {
      setRideData(location.state.ride)
      console.log('🚗 Ride data received in Riding:', location.state.ride)
    } else {
      console.warn('⚠️ No ride data found in navigation state')
    }
  }, [location.state])

  // Emergency test function - remove after debugging
  useEffect(() => {
    window.testRidingComponent = () => {
      console.log('🧪 Manual test: Testing Riding component with sample data');
      const testRide = {
        _id: 'test-ride-riding-123',
        captain: {
          fullname: { firstname: 'Test', lastname: 'Captain' },
          vehicle: { plate: 'TEST123', color: 'White', vehicleType: 'car' }
        },
        pickup: 'Test Pickup Location',
        destination: 'Test Destination',
        fare: 250,
        status: 'ongoing'
      };
      setRideData(testRide);
    };
    return () => delete window.testRidingComponent;
  }, []);

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
    <div className='h-screen overflow-hidden'>

        <Link to='/home' className='fixed right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full z-10'>
            <i className="text-lg font-medium ri-home-4-line"></i>
        </Link>



       <div className='h-1/2 '>


        <img className='w-full h-full object-cover ' src='https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif' />


       </div>


       <div className='h-1/2 p-4 overflow-y-auto'>

        {/* Ride Status */}
        <div className='bg-green-100 border border-green-400 rounded-lg p-2 mb-3'>
            <div className='text-center'>
                <p className='text-green-800 font-medium text-sm'>🚗 Ride in Progress!</p>
                <p className='text-xs text-green-600'>
                    {rideData?.status === 'ongoing' ? 'Your ride has started' : 'Ride confirmed'}
                </p>
                {rideData?._id && (
                    <p className='text-xs text-gray-500'>ID: {rideData._id.slice(-6)}</p>
                )}
            </div>
        </div>

        <div className='flex items-center justify-between mb-3'>
                 <img className="h-12 w-16 object-contain" src='https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1682350473/assets/97/e2a99c-c349-484f-b6b0-3cea1a8331b5/original/UberBlack.png' />
                 <div className='text-right'>
                        <h2 className='text-base font-medium'>
                            {rideData?.captain?.fullname ? 
                                `${rideData.captain.fullname.firstname} ${rideData.captain.fullname.lastname}` : 
                                'Captain'
                            }
                        </h2>
                        <h4 className='text-lg font-semibold -mt-1'>
                            {rideData?.captain?.vehicle?.plate || 'Vehicle Number'}
                        </h4>
                        <p className='text-xs text-gray-600'>
                            {rideData?.captain?.vehicle?.color || 'Color'} {rideData?.captain?.vehicle?.vehicleType || 'Vehicle'}
                        </p>
                 </div>
            </div>

            <div className='flex flex-col gap-1'>
            <div className='w-full'>
               
                <div className='flex items-center gap-3 p-2 border-b border-gray-200'>
                    <i className="text-base ri-map-pin-line text-green-600"></i>
                    <div className=''>
                        <h3 className='text-sm font-medium'>Pickup</h3>
                        <p className='text-xs text-gray-600'>{rideData?.pickup || 'Your Location'}</p>
                    </div>
                </div>

                <div className='flex items-center gap-3 p-2 border-b border-gray-200'>
                    <i className="text-base ri-map-pin-fill text-red-600"></i>
                    <div className=''>
                        <h3 className='text-sm font-medium'>Destination</h3>
                        <p className='text-xs text-gray-600'>{rideData?.destination || 'Your Destination'}</p>
                    </div>
                </div>

                <div className='flex items-center gap-3 p-2'>
                    <i className="text-base ri-currency-fill text-yellow-600"></i>
                    <div className=''>
                        <h3 className='text-sm font-medium'>Rs.{rideData?.fare || '0'}</h3>
                        <p className='text-xs text-gray-600'>Cash Payment</p>
                    </div>
                </div>
            </div>
            </div>
        <button className='w-full mt-3 bg-green-600 text-white font-semibold p-2 rounded-lg text-sm'>
            Pay Rs.{rideData?.fare || '0'} - Complete Ride
        </button>
       </div>
    </div>
  )
}

export default Riding
