import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import SuccessPopup from './SuccessPopup'
import { useSocket } from '../context/SocketContext'

const WaitingForDriver = React.memo(({ ride, pickup, destination, setWaitingForDriver }) => {
    const [completing, setCompleting] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const navigate = useNavigate();
    const { socket, isConnected } = useSocket();
   
    // Add debug logging
    console.log('🔍 WaitingForDriver rendered with:', {
     hasRide: !!ride,
     rideId: ride?._id,
     pickup,
     destination,
     captain: ride?.captain?.fullname || 'No captain data',
     otp: ride?.otp || 'No OTP'
   });
    
    // Setup socket listener for captain ride completion
    useEffect(() => {
        if (socket && isConnected && ride?._id) {
            console.log('🔗 Setting up ride completion listeners in WaitingForDriver for ride:', ride._id);
            
            const handleRideEnded = (data) => {
                console.log('🏁 Ride ended event received:', data);
                if (data.rideId === ride._id || data.ride?._id === ride._id) {
                    setShowSuccessPopup(true);
                }
            };

            const handleRideCompleted = (data) => {
                console.log('🎉 Ride completed event received:', data);
                if (data.rideId === ride._id || data.ride?._id === ride._id) {
                    setShowSuccessPopup(true);
                }
            };

            const handlePaymentCompleted = (data) => {
                console.log('💰 Payment completed event received:', data);
                if (data.rideId === ride._id || data.ride?._id === ride._id) {
                    setShowSuccessPopup(true);
                }
            };

            // Listen for all possible completion events
            socket.on('ride-ended', handleRideEnded);
            socket.on('ride-completed', handleRideCompleted);
            socket.on('payment-completed', handlePaymentCompleted);

            return () => {
                console.log('🧹 Cleaning up all ride completion listeners');
                socket.off('ride-ended', handleRideEnded);
                socket.off('ride-completed', handleRideCompleted);
                socket.off('payment-completed', handlePaymentCompleted);
            };
        }
    }, [socket, isConnected, ride?._id]);
    
    // Optimize finish ride handler
    const handleFinishRide = useCallback(async () => {
        if (!ride?._id || completing) return;

        setCompleting(true);
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                localStorage.removeItem('token');
                navigate('/login');
                return;
            }
            
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/rides/complete/${ride._id}`,
                {
                    fare: ride.fare || 0,
                    distance: ride.distance || 0,
                    completedBy: 'user'
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                }
            );

            // Show success popup instead of direct navigation
            setShowSuccessPopup(true);
            
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            } else {
                navigate('/home');
            }
        } finally {
            setCompleting(false);
        }
    }, [ride, completing, navigate]);

    // Handle popup close and redirect to user home
    const handlePopupClose = useCallback(() => {
        setShowSuccessPopup(false);
        if (setWaitingForDriver) {
            setWaitingForDriver(false);
        }
        navigate('/home');
    }, [navigate, setWaitingForDriver]);

   return (
        <>
            <div className='h-full bg-white flex flex-col'>
                {/* Header with close button */}
                <div className='flex-shrink-0 p-3 border-b border-gray-200'>
                    <div className='flex justify-center'>
                        <button 
                            onClick={() => setWaitingForDriver && setWaitingForDriver(false)}
                            className='p-2 hover:bg-gray-100 rounded-full'
                        >
                            <i className="text-xl text-gray-400 ri-arrow-down-wide-fill"></i>
                        </button>
                    </div>
                </div>

                {/* Main content */}
                <div className='flex-1 overflow-y-auto p-4 space-y-4'>
                    {/* Title */}
                    <div className='text-center'>
                        <h3 className='text-lg font-bold text-gray-900'>Captain is Coming!</h3>
                        <p className='text-sm text-gray-600'>Your ride has been confirmed</p>
                    </div>

                    {/* Captain info */}
                    <div className='bg-gray-50 rounded-lg p-3'>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center space-x-3'>
                                <div className='w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center'>
                                    <i className="text-white ri-user-line"></i>
                                </div>
                                <div>
                                    <h2 className='text-sm font-semibold text-gray-900'>
                                        {ride?.captain?.fullname ? 
                                            `${ride.captain.fullname.firstname} ${ride.captain.fullname.lastname}` : 
                                            'Captain'
                                        }
                                    </h2>
                                    <p className='text-xs text-gray-600'>
                                        {ride?.captain?.vehicle?.color || 'Color'} {ride?.captain?.vehicle?.vehicleType || 'Vehicle'}
                                    </p>
                                </div>
                            </div>
                            <div className='bg-white px-2 py-1 rounded border'>
                                <span className='text-xs font-semibold text-gray-900'>
                                    {ride?.captain?.vehicle?.plate || 'Vehicle Number'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* OTP */}
                    {ride?.otp && (
                        <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center'>
                            <h3 className='text-sm font-semibold text-gray-900'>Ride OTP</h3>
                            <div className='text-xl font-bold text-gray-900 my-1'>
                                {ride.otp}
                            </div>
                            <p className='text-xs text-gray-600'>Share with captain</p>
                        </div>
                    )}

                    {/* Trip details */}
                    <div className='bg-gray-50 rounded-lg p-3'>
                        <h4 className='text-sm font-semibold text-gray-900 mb-2'>Trip Details</h4>
                        
                        <div className='space-y-2'>
                            <div className='flex items-start space-x-2'>
                                <div className='w-4 h-4 bg-green-500 rounded-full mt-1'></div>
                                <div>
                                    <p className='text-xs font-medium text-gray-900'>Pickup</p>
                                    <p className='text-xs text-gray-600'>{pickup || 'Your Location'}</p>
                                </div>
                            </div>

                            <div className='flex items-start space-x-2'>
                                <div className='w-4 h-4 bg-red-500 rounded-full mt-1'></div>
                                <div>
                                    <p className='text-xs font-medium text-gray-900'>Destination</p>
                                    <p className='text-xs text-gray-600'>{destination || 'Your Destination'}</p>
                                </div>
                            </div>

                            <div className='flex items-start space-x-2'>
                                <div className='w-4 h-4 bg-yellow-500 rounded-full mt-1'></div>
                                <div>
                                    <p className='text-xs font-medium text-gray-900'>Fare</p>
                                    <p className='text-xs text-gray-600'>Rs.{ride?.fare || '0'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom section */}
                <div className='flex-shrink-0 bg-white border-t border-gray-200 p-4'>

                    <button 
                        onClick={handleFinishRide}
                        disabled={completing}
                        className={`w-full py-3 rounded-lg font-semibold text-white ${
                            completing 
                                ? 'bg-gray-400' 
                                : 'bg-green-600'
                        }`}
                    >
                        {completing ? 'Completing...' : 'Complete Ride'}
                    </button>
                </div>
            </div>

            <SuccessPopup 
                isVisible={showSuccessPopup}
                onClose={handlePopupClose}
                message="Ride Completed Successfully!"
                amount={ride?.fare}
            />
        </>
    );
});

WaitingForDriver.displayName = 'WaitingForDriver';

export default WaitingForDriver;

