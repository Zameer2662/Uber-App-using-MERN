import React, { useContext, useState } from 'react'
import { CaptainDataContext } from '../context/CaptainContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import SuccessPopup from './SuccessPopup'
import { useSocket } from '../context/SocketContext'

const FinishRide = (props) => {
    const context = useContext(CaptainDataContext);
    const [completing, setCompleting] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const navigate = useNavigate();
    const { socket } = useSocket();

    // Check if context is available
    if (!context) {
        console.error('FinishRide must be used within CaptainContext');
        return <div>Context Error</div>;
    }

    const { captain, setCaptain } = context;

    const handleCompletePayment = async () => {
        if (!props.ride || !props.ride._id) {
            console.error('No ride data available');
            navigate('/captain-home');
            return;
        }

        setCompleting(true);
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                localStorage.removeItem('token');
                navigate('/captain-login');
                return;
            }
            
            console.log('Completing ride with ID:', props.ride._id);
            
            // Call backend API to complete ride
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/rides/complete/${props.ride._id}`,
                {
                    fare: Number(props.ride.fare) || 0,
                    distance: Number(props.ride.distance) || 0,
                    completedBy: 'captain'
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                }
            );

            console.log('Ride completion response:', response.data);

            // Update captain data with new earnings and stats
            if (response.data.captain) {
                setCaptain(response.data.captain);
                console.log('Captain earnings updated to:', response.data.captain.earnings);
            }
            
            // Emit socket event to ensure user gets notified
            if (socket) {
                console.log('🔔 Emitting ride-ended event to user');
                socket.emit('ride-ended', {
                    rideId: props.ride._id,
                    ride: props.ride,
                    completedBy: 'captain'
                });
            }
            
            // Show success popup for captain
            setShowSuccessPopup(true);
            
        } catch (error) {
            console.error('Error completing payment:', error);
            navigate('/captain-home');
        } finally {
            setCompleting(false);
        }
    };

    const handlePopupClose = () => {
        setShowSuccessPopup(false);
        navigate('/captain-home');
    };

    return (
        <>
            <div className='p-4'>
                <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center gap-3'>
                        <img className='h-12 w-12 rounded-full object-cover' src='https://img.freepik.com/free-photo/close-up-portrait-curly-handsome-european-male_176532-8133.jpg?semt=ais_hybrid&w=740' />
                        <div>
                            <h3 className='font-medium text-lg'>
                                {props.ride?.user?.fullname ? 
                                    `${props.ride.user.fullname.firstname} ${props.ride.user.fullname.lastname}` : 
                                    'Loading...'
                                }
                            </h3>
                            <p className='text-sm text-gray-600'>{props.ride?.distance ? `${props.ride.distance} KM` : '2.2 KM'}</p>
                        </div>
                    </div>
                    <div className='text-right'>
                        <h3 className='font-semibold text-xl'>Rs.{props.ride?.fare}</h3>
                        <p className='text-sm text-gray-600'>Cash</p>
                    </div>
                </div>
                
                <button 
                    onClick={handleCompletePayment}
                    disabled={completing}
                    className={`w-full ${completing ? 'bg-gray-400' : 'bg-green-600'} text-white font-semibold py-3 rounded-lg`}
                >
                    {completing ? 'Processing...' : `Complete Payment Rs.${props.ride?.fare || 0}`}
                </button>
            </div>

            <SuccessPopup 
                isVisible={showSuccessPopup}
                onClose={handlePopupClose}
                message="Payment Completed Successfully!"
                amount={props.ride?.fare}
            />
        </>
    )
}

export default FinishRide

