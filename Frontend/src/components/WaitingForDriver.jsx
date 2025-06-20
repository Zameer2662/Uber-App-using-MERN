 import React from 'react'
 
 const WaitingForDriver = (props) => {
   return (
     <div>
            <h5 className='p-1 text-center absolute w-[93%] top-0 ' onClick={() => {
                props.WaitingForDriver(false)
            }}><i className=" text-3xl text-gray-200 ri-arrow-down-wide-fill"></i></h5>

            <div className=' flex items-center justify-between'>
                 <img className="h-15" src='https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1682350473/assets/97/e2a99c-c349-484f-b6b0-3cea1a8331b5/original/UberBlack.png' />
                 <div className='text-right'>
                        <h2 className='text-lg font-medium'>Zameer</h2>
                        <h4 className='text-xl font-semibold -mt-1 -mb-1'>RNA 3028 </h4>
                        <p className='text-sm text-gray-600 '>Honda Civic Rebirth</p>
                 </div>
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

        </div>
   )
 }
 
 export default WaitingForDriver
 