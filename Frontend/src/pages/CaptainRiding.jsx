import { useGSAP } from '@gsap/react'
import React, { useRef, useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import FinishRide from '../components/FinishRide'
import LiveTracking from '../components/LiveTracking'

const CaptainRiding = () => {

    const [finishRidePanel, setFinishRidePanel] = useState(false)
    const finishRidePanelRef = useRef(null)
    const location = useLocation()
    const [rideData, setRideData] = useState(null)

    // Extract ride data from navigation state
    useEffect(() => {
        try {
            if (location.state && location.state.ride) {
                setRideData(location.state.ride)
                console.log('🚗 Ride data received in CaptainRiding:', location.state.ride)
            } else {
                console.warn('⚠️ No ride data found in navigation state')
            }
        } catch (error) {
            console.error('❌ Error extracting ride data:', error)
        }
    }, [location.state])

    // GSAP animation - must be called after all other hooks
    useGSAP(function () {
        if (finishRidePanelRef.current) {
            if (finishRidePanel) {
                gsap.to(finishRidePanelRef.current, {
                    transform: 'translateY(0)',
                    duration: 0.3
                })
            } else {
                gsap.to(finishRidePanelRef.current, {
                    transform: 'translateY(100%)',
                    duration: 0.3
                })
            }
        }
    }, [finishRidePanel])

    // Show loading state if no ride data - AFTER all hooks
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
        <div className='h-screen'>

            <div className='fixed p-6 top-0 flex items-center justify-between w-screen z-20'>
                <img className='w-16' src='https://freelogopng.com/images/all_img/1659761100uber-logo-png.png' />
                
                {/* Captain Status Indicator */}
                <div className='flex items-center gap-2 bg-green-100 px-3 py-1 rounded-full'>
                    <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                    <span className='text-green-700 text-sm font-medium'>On Trip</span>
                </div>
                
                <Link to='/captain-home' className='h-10 w-10 bg-white flex items-center justify-center rounded-full'>
                    <i className="text-lg font-medium ri-home-4-line"></i>
                </Link>
            </div>

            <div className='h-4/5 relative'>
                <LiveTracking ride={rideData} userType="captain" />
            </div>

            {/* Trip Progress Overlay */}
            <div className='absolute top-20 left-4 bg-white rounded-lg shadow-lg p-3 z-10'>
                <div className='flex items-center gap-2 mb-2'>
                    <i className="text-green-500 ri-navigation-fill"></i>
                    <span className='text-sm font-medium'>Trip in Progress</span>
                </div>
                {rideData && (
                    <div className='text-xs text-gray-600'>
                        <p>Started: {new Date(rideData.startTime || Date.now()).toLocaleTimeString()}</p>
                        <p>Ride ID: {rideData._id?.slice(-6)}</p>
                    </div>
                )}
            </div>

            <div className='h-1/5  p-6 bg-yellow-400  flex  items-center justify-between relative '
            onClick={()=>{
                setFinishRidePanel(true)
            }} >
                <h5 className='p-1 text-center absolute w-[93%] top-0 '><i className=" text-3xl text-gray-800 ri-arrow-up-wide-fill"></i></h5>
                <div>
                    <h4 className='text-xl font-semibold '>
                        {rideData?.user?.fullname ? 
                            `${rideData.user.fullname.firstname} ${rideData.user.fullname.lastname}` : 
                            'Loading...'
                        }
                    </h4>
                    <p className='text-sm text-gray-700'>
                        {rideData ? `Earning: Rs.${rideData.fare}` : 'Loading ride info...'}
                    </p>
                    {/* <p className='text-xs text-gray-600 mt-1'>
                        {rideData ? `${rideData.pickup} → ${rideData.destination}` : 'Route loading...'}
                    </p> */}
                </div>
                <button className=' h-12 bg-green-600 text-white font-semibold p-3 px-8 rounded-lg'>Complete Ride</button>
            </div>


            <div ref={finishRidePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 max-h-[90vh] overflow-hidden'>
                <FinishRide 
                    setFinishRidePanel={setFinishRidePanel} 
                    ride={rideData}
                />
            </div>

        </div>
    )
}

export default CaptainRiding
