import React, { useContext, useState } from 'react'
import { CaptainDataContext } from '../context/CaptainContext'
import axios from 'axios'

const RidePopup = (props) => {
    const context = useContext(CaptainDataContext);
    const [completing, setCompleting] = useState(false);

    // Check if context is available
    if (!context) {
        console.error('RidePopup must be used within CaptainContext');
        return <div>Context Error</div>;
    }

    const { captain, setCaptain } = context;

    const handleCompleteRide = async () => {
        if (!props.ride || !props.ride._id) {
            alert('Invalid ride data');
            return;
        }

        setCompleting(true);
        try {
            const token = localStorage.getItem('token');
            
            if (!token) {
                alert('Authentication required');
                return;
            }
            
            // Call backend API to complete ride
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/rides/complete/${props.ride._id}`,
                {
                    fare: props.ride.fare,
                    distance: props.ride.distance || 0
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Update captain data with new earnings and stats
            if (response.data.captain) {
                setCaptain(response.data.captain);
                console.log('Captain data updated:', response.data.captain);
            }
            
            props.setRidePopupPanel(false);
            props.setConfirmRidePopupPanel(false);
            
            alert(`Ride completed successfully! Earned Rs.${props.ride.fare}`);
            
        } catch (error) {
            console.error('Error completing ride:', error);
            alert('Error completing ride. Please try again.');
        } finally {
            setCompleting(false);
        }
    };

    return (
        <div className='max-h-screen overflow-y-auto p-4 pb-6'>
            <h5 className='p-1 text-center absolute w-[93%] top-0 ' onClick={() => {
                props.setRidePopupPanel(false)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-fill"></i></h5>

            <h3 className='text-xl font-semibold mb-3 mt-8'>New Ride Available!</h3>

            <div className='flex items-center justify-between p-2 bg-yellow-400 rounded-lg mt-2'>
                <div className='flex items-center gap-2'>
                    <img className='h-10 w-10 rounded-full object-cover' src='https://img.freepik.com/free-photo/close-up-portrait-curly-handsome-european-male_176532-8133.jpg?semt=ais_hybrid&w=740' />
                    <h2 className='text-base font-medium'>{props.ride?.user.fullname.firstname + " " + props.ride?.user.fullname.lastname}</h2>
                </div>
                <h5 className='text-base font-semibold'>{props.ride?.distance ? `${props.ride.distance} KM` : '0.0 KM'}</h5>
            </div>

            <div className='w-full mt-3'>
                <div className='flex items-center gap-4 p-2 border-b-1'>
                    <i className="text-base ri-map-pin-line"></i>
                    <div>
                        <h3 className='text-base font-medium'>Pickup</h3>
                        <p className='text-xs -mt-1 text-gray-600'>{props.ride?.pickup}</p>
                    </div>
                </div>

                <div className='flex items-center gap-4 p-2 border-b-1'>
                    <i className="text-base ri-map-pin-fill"></i>
                    <div>
                        <h3 className='text-base font-medium'>Destination</h3>
                        <p className='text-xs -mt-1 text-gray-600'>{props.ride?.destination}</p>
                    </div>
                </div>

                <div className='flex items-center gap-4 p-2'>
                    <i className="text-base ri-currency-fill"></i>
                    <div>
                        <h3 className='text-base font-medium'>Rs.{props.ride?.fare}</h3>
                        <p className='text-xs -mt-1 text-gray-600'>Cash Payment</p>
                    </div>
                </div>
            </div>

            <div className='mt-3 flex w-full items-center justify-between gap-2'>
                <button onClick={() => {
                    props.setRidePopupPanel(false)
                }} className='bg-gray-400 text-white font-semibold p-2 px-6 rounded-lg text-sm'>Ignore</button>

                <button onClick={() => {
                    props.setConfirmRidePopupPanel(true)
                    props.confirmRide()
                }} className='bg-green-600 text-white font-semibold p-2 px-6 rounded-lg text-sm'>Accept</button>
            </div>

        </div>
    )
}

export default RidePopup

