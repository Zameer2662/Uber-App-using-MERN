import React from 'react'

const RidePopup = (props) => {
    return (
        <div>
            <h5 className='p-1 text-center absolute w-[93%] top-0 ' onClick={() => {
                props.setRidePopupPanel(false)
            }}><i className=" text-3xl text-gray-200 ri-arrow-down-wide-fill"></i></h5>

            <h3 className='text-2xl font-semibold mb-5'>New Ride Available!</h3>


            <div className=' flex items-center justify-between p-3 bg-yellow-400 rounded-lg mt-3'>
                <div className='flex items-center gap-3  '>
                    <img className='h-12 w-12 rounded-full object-cover' src='https://img.freepik.com/free-photo/close-up-portrait-curly-handsome-european-male_176532-8133.jpg?semt=ais_hybrid&w=740' />
                    <h2 className='text-lg font-medium'>{props.ride?.user.fullname.firstname + " " + props.ride?.user.fullname.lastname}</h2>
                </div>
                <h5 className='text-lg font-semibold'>2.2 KM</h5>
            </div>

            <div className='flex gap-2 flex-col justify-between items-center'>


                <div className='w-full mt-5 '>
                    <div className='flex items-center gap-5  p-3 border-b-1'>
                        <i className=" text-lg ri-map-pin-line"></i>
                        <div className=''>
                            <h3 className='text-lg font-medium'>562/11-A</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.ride?.pickup}</p>
                        </div>
                    </div>

                    <div className='flex items-center gap-5 p-3 border-b-1'>
                        <i className="ri-map-pin-fill"></i>
                        <div className=''>
                            <h3 className='text-lg font-medium'>562/11-A</h3>
                            <p className='text-sm -mt-1 text-gray-600'>{props.ride?.destination}</p>
                        </div>
                    </div>

                    <div className='flex items-center gap-5  p-3 '>
                        <i className="ri-currency-fill"></i>
                        <div className=''>
                            <h3 className='text-lg font-medium'>{props.ride?.fare}</h3>
                            <p className='text-sm -mt-1 text-gray-600'>Cash Cash</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className='   mt-5 flex w-full items-center justify-between' >

                <button onClick={() => {
                    props.setRidePopupPanel(false)
                }} className=' mt-1 bg-gray-400 text-white font-semibold p-3 px-8 rounded-lg'>Ignore</button>

                <button onClick={() => {
                    props.setConfirmRidePopupPanel(true)
                    props.confirmRide()
                       
                }} className=' bg-green-600 text-white font-semibold p-3 px-8 rounded-lg'>Accept</button>


            </div>

        </div>
    )
}

export default RidePopup
