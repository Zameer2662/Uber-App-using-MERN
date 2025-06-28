import React from 'react'

const ConfirmRide = (props) => {
    return (
        <div>
            <h5 className='p-1 text-center absolute w-[93%] top-0 ' onClick={() => {
                props.setVehiclePanelOpen(false)
            }}><i className=" text-3xl text-gray-200 ri-arrow-down-wide-fill"></i></h5>

            <h3 className='text-2xl font-semibold mb-5'>Confirm Your Ride</h3>

            <div className='flex gap-2 flex-col justify-between items-center'>
                <img className="h-20" src='https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1682350473/assets/97/e2a99c-c349-484f-b6b0-3cea1a8331b5/original/UberBlack.png' />
            </div>

            <div className='w-full mt-5 '>
                <div className='flex items-center gap-5  p-3 border-b-1'>
                    <i className=" text-lg ri-map-pin-line"></i>
                    <div className=''>
                        <h3 className='text-lg font-medium'>562/11-A</h3>
                        <p className='text-sm -mt-1 text-gray-600'>{props.pickup}</p>
                    </div>
                </div>

                <div  className='flex items-center gap-5 p-3 border-b-1'>
                    <i className="ri-map-pin-fill"></i>
                    <div className=''>
                        <h3 className='text-lg font-medium'>562/11-A</h3>
                        <p className='text-sm -mt-1 text-gray-600'>{props.destination}</p>
                    </div>
                </div>

                <div  className='flex items-center gap-5  p-3 '>
                    <i className="ri-currency-fill"></i>
                    <div className=''>
                        <h3 className='text-lg font-medium'>Rs.{props.fare[props.vehicleType]}</h3>
                        <p className='text-sm -mt-1 text-gray-600'>Cash Cash</p>
                    </div>
                </div>
            </div>

            <div>
                <button onClick={()=> {
                    props.setvehicleFound(true)
                    props.setConfirmRidePanel(false)
                    props.createRide()
                }} className='w-full mt-5 bg-green-600 text-white font-semibold p-2 rounded-lg'>Confirm</button>
            </div>


        </div>
    )
}

export default ConfirmRide
