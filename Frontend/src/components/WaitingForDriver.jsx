import React from 'react'
 
 const WaitingForDriver = (props) => {
   const { ride, pickup, destination, setWaitingForDriver } = props;
   
   // Add debug logging
   console.log('🔍 WaitingForDriver rendered with:', {
     hasRide: !!ride,
     rideId: ride?._id,
     pickup,
     destination,
     captain: ride?.captain?.fullname || 'No captain data',
     otp: ride?.otp || 'No OTP'
   });
   
   return (
     <div>
            <h5 className='p-1 text-center absolute w-[93%] top-0 ' onClick={() => {
                setWaitingForDriver && setWaitingForDriver(false)
            }}><i className=" text-3xl text-gray-200 ri-arrow-down-wide-fill"></i></h5>

            <h3 className='text-2xl font-semibold mb-5'>Captain is Coming!</h3>

            <div className=' flex items-center justify-between'>
                 <img className="h-15" src='https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1682350473/assets/97/e2a99c-c349-484f-b6b0-3cea1a8331b5/original/UberBlack.png' />
                 <div className='text-right'>
                        <h2 className='text-lg font-medium'>
                            {ride?.captain?.fullname ? 
                                `${ride.captain.fullname.firstname} ${ride.captain.fullname.lastname}` : 
                                'Captain'
                            }
                        </h2>
                        <h4 className='text-xl font-semibold -mt-1 -mb-1'>
                            {ride?.captain?.vehicle?.plate || 'Vehicle Number'}
                        </h4>
                        <p className='text-sm text-gray-600'>
                            {ride?.captain?.vehicle?.color || 'Color'} {ride?.captain?.vehicle?.vehicleType || 'Vehicle'}
                        </p>
                 </div>
            </div>

            {/* OTP Display */}
            {ride?.otp && (
                <div className='bg-yellow-100 border border-yellow-400 rounded-lg p-4 mt-4'>
                    <div className='text-center'>
                        <h3 className='text-lg font-semibold text-yellow-800'>Ride OTP</h3>
                        <div className='text-3xl font-bold text-yellow-900 tracking-widest mt-2'>
                            {ride.otp}
                        </div>
                        <p className='text-sm text-yellow-700 mt-2'>Share this OTP with your captain</p>
                    </div>
                </div>
            )}

            {/* Status Message */}
            <div className='bg-green-100 border border-green-400 rounded-lg p-3 mt-4'>
                <div className='text-center'>
                    <p className='text-green-800 font-medium'>🚗 Captain is on the way!</p>
                    <p className='text-sm text-green-600'>Please wait at your pickup location</p>
                </div>
            </div>

            <div className='flex gap-2 flex-col justify-between items-center'>
            <div className='w-full mt-5 '>
                <div className='flex items-center gap-5  p-3 border-b-1'>
                    <i className=" text-lg ri-map-pin-line"></i>
                    <div className=''>
                        <h3 className='text-lg font-medium'>Pickup</h3>
                        <p className='text-sm -mt-1 text-gray-600'>{pickup || 'Your Location'}</p>
                    </div>
                </div>

                <div className='flex items-center gap-5 p-3 border-b-1'>
                    <i className="ri-map-pin-fill"></i>
                    <div className=''>
                        <h3 className='text-lg font-medium'>Destination</h3>
                        <p className='text-sm -mt-1 text-gray-600'>{destination || 'Your Destination'}</p>
                    </div>
                </div>

                <div className='flex items-center gap-5  p-3 '>
                    <i className="ri-currency-fill"></i>
                    <div className=''>
                        <h3 className='text-lg font-medium'>Rs.{ride?.fare || '0'}</h3>
                        <p className='text-sm -mt-1 text-gray-600'>Cash Payment</p>
                    </div>
                </div>
            </div>
            </div>

        </div>
   )
 }
 
 export default WaitingForDriver
