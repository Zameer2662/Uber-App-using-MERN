import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const ConfirmRidePopup = (props) => {

    const [otp , setOtp] = useState()
    const navigate = useNavigate()

    const submitHandler = async (e) => {
        e.preventDefault()

        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/start-ride`, {
            params: {
                rideId: props.ride._id,
                otp: otp
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        if (response.status === 200) {
            props.setConfirmRidePopupPanel(false)
            props.setRidePopupPanel(false)
            // Navigate with ride data
            navigate('/captain-riding', { 
                state: { 
                    ride: props.ride,
                    rideStarted: true 
                } 
            })
            
        } else {
            alert('Failed to confirm ride')
        }


    }
    return (
        <div className='max-h-screen overflow-y-auto p-4 pb-6'>
            <h5 className='p-1 text-center absolute w-[93%] top-0 ' onClick={() => {
                props.setConfirmRidePopupPanel(false)
            }}><i className=" text-3xl text-gray-200 ri-arrow-down-wide-fill"></i></h5>

            <h3 className='text-xl font-semibold mb-3 mt-8'>Confirm Ride to Start!</h3>

            <div className='flex items-center justify-between p-2 bg-yellow-400 rounded-lg mt-2'>
                <div className='flex items-center gap-2'>
                    <img className='h-10 w-10 rounded-full object-cover' src='https://img.freepik.com/free-photo/close-up-portrait-curly-handsome-european-male_176532-8133.jpg?semt=ais_hybrid&w=740' />
                    <h2 className='text-base font-medium capitalize'>{props.ride?.user.fullname.firstname}</h2>
                </div>
                <h5 className='text-base font-semibold'>2.2 KM</h5>
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

            <div className='mt-4 w-full'>
                <form onSubmit={submitHandler} className='flex flex-col gap-2'>
                    <input value={otp} onChange={(e)=>setOtp(e.target.value)} type="text" className="bg-[#eee] px-4 py-3 font-mono text-base rounded-lg w-full" placeholder='Enter OTP' />

                    <button className='text-base flex justify-center w-full mt-2 bg-green-600 text-white font-semibold p-3 rounded-lg'>Confirm</button>

                    <button type="button" onClick={() => {
                        props.setConfirmRidePopupPanel(false)
                        props.setRidePopupPanel(false)
                    }} className='w-full text-base bg-red-700 text-white font-semibold p-2 rounded-lg'>Cancel</button>
                </form>
            </div>

        </div>
    )
}

export default ConfirmRidePopup

