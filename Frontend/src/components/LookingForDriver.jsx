import React from 'react'

const LookingForDriver = (props) => {
    return (
        <div className='max-h-screen overflow-y-auto p-4 pb-6'>
            <h5 className='p-1 text-center absolute w-[93%] top-0 ' onClick={() => {
                props.setvehicleFound(false)
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-fill"></i></h5>

            <h3 className='text-xl font-semibold mb-3 mt-8'>Looking for a Driver</h3>

            <div className='flex justify-center mb-3'>
                <img className="h-16 object-contain" src='https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1682350473/assets/97/e2a99c-c349-484f-b6b0-3cea1a8331b5/original/UberBlack.png' />
            </div>

            <div className='w-full'>
                <div className='flex items-center gap-4 p-2 border-b-1'>
                    <i className="text-base ri-map-pin-line"></i>
                    <div>
                        <h3 className='text-base font-medium'>Pickup</h3>
                        <p className='text-xs -mt-1 text-gray-600'>{props.pickup}</p>
                    </div>
                </div>

                <div className='flex items-center gap-4 p-2 border-b-1'>
                    <i className="text-base ri-map-pin-fill"></i>
                    <div>
                        <h3 className='text-base font-medium'>Destination</h3>
                        <p className='text-xs -mt-1 text-gray-600'>{props.destination}</p>
                    </div>
                </div>

                <div className='flex items-center gap-4 p-2'>
                    <i className="text-base ri-currency-fill"></i>
                    <div>
                        <h3 className='text-base font-medium'>Rs.{props.fare[props.vehicleType]}</h3>
                        <p className='text-xs -mt-1 text-gray-600'>Cash Payment</p>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default LookingForDriver
