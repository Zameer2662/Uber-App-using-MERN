import React from 'react'
import { Link } from 'react-router-dom'

const FinishRide = (props) => {
  return (
     <div >
            <h5 className='p-1 text-center absolute w-[93%] top-0 ' onClick={() => {
                props.setFinishRidePanel(false)
            }}><i className=" text-3xl text-gray-200 ri-arrow-down-wide-fill"></i></h5>

            <h3 className='text-2xl font-semibold mb-5'>Finish this Ride</h3>


            <div className=' flex items-center justify-between p-4 border-2 border-yellow-400 rounded-lg mt-3'>
                <div className='flex items-center gap-3  '>
                    <img className='h-12 w-12 rounded-full object-cover' src='https://img.freepik.com/free-photo/close-up-portrait-curly-handsome-european-male_176532-8133.jpg?semt=ais_hybrid&w=740' />
                    <h2 className='text-lg font-medium'>Guggo</h2>
                </div>
                <h5 className='text-lg font-semibold'>2.2 KM</h5>
            </div>

            <div className='flex gap-2 flex-col justify-between items-center'>


                <div className='w-full mt-5 '>
                    <div className='flex items-center gap-5  p-3 border-b-1'>
                        <i className=" text-lg ri-map-pin-line"></i>
                        <div className=''>
                            <h3 className='text-lg font-medium'>562/11-A</h3>
                            <p className='text-sm -mt-1 text-gray-600'>Trust Colony,Rahim yar Khan</p>
                        </div>
                    </div>

                    <div className='flex items-center gap-5 p-3 border-b-1'>
                        <i className="ri-map-pin-fill"></i>
                        <div className=''>
                            <h3 className='text-lg font-medium'>562/11-A</h3>
                            <p className='text-sm -mt-1 text-gray-600'>Trust Colony,Rahim yar Khan</p>
                        </div>
                    </div>

                    <div className='flex items-center gap-5  p-3 '>
                        <i className="ri-currency-fill"></i>
                        <div className=''>
                            <h3 className='text-lg font-medium'>5.31$</h3>
                            <p className='text-sm -mt-1 text-gray-600'>Cash Cash</p>
                        </div>
                    </div>
                </div>
            </div>



            <div className='mt-16 w-full'>
                    <Link to='/captain-home' className=' flex justify-center text-lg w-full mt-5 bg-green-600 text-white font-semibold p-3 rounded-lg'>Finish Ride</Link>
                   
            </div>

        </div>
  )
}

export default FinishRide
