import React from 'react'

const VehiclePanel = (props) => {
  return (
    <div>
         <h5 className='p-1 text-center absolute w-[93%] top-0 ' onClick={()=>{
          props.setVehiclePanel(false)
        }}><i className=" text-3xl text-gray-200 ri-arrow-down-wide-fill"></i></h5>
        <h3 className='text-2xl font-semibold mb-5'>Choose a Vehicle</h3>

        <div onClick={() => {
            props.setConfirmRidePanel(true)
            props.selectVehicle('car')
        }} className='flex border-2 mb-2 rounded-xl p-3 w-full items-center justify-between border-gray-400 active:border-black'>
          <img className='h-12' src='https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1682350473/assets/97/e2a99c-c349-484f-b6b0-3cea1a8331b5/original/UberBlack.png' />
          <div className='0 w-1/2'>
            <h4 className='font-medium text-base'>UberGo <span><i className="ri-user-fill"></i>4</span></h4>
            <h5 className=' font-medium text-sm'>2 min away</h5>
            <p className=' font-normal text-xs'>Affordable compact Rides</p>
          </div>
          <h2 className='text-lg font-semibold'>Rs.{props.fare.car}</h2>
        </div>

        <div onClick={() => {
            props.setConfirmRidePanel(true)
            props.selectVehicle('auto')
        }} className='flex border-2  mb-2 rounded-xl p-3 w-full items-center justify-between border-gray-400 active:border-black'>
          <img className='h-12' src='https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1648431773/assets/1d/db8c56-0204-4ce4-81ce-56a11a07fe98/original/Uber_Auto_558x372_pixels_Desktop.png' />
          <div className='0 w-1/2'>
            <h4 className='font-medium text-base'>Uber auto <span><i className="ri-user-fill"></i>3</span></h4>
            <h5 className=' font-medium text-sm'>2 min away</h5>
            <p className=' font-normal text-xs'>Affordable Rickshaw Rides</p>
          </div>

          <h2 className='text-lg font-semibold'>Rs.{props.fare.auto}</h2>
        </div>

        <div onClick={() => {
            props.setConfirmRidePanel(true)
            props.selectVehicle('moto')
        }} className='flex border-2 mb-2 rounded-xl p-3 w-full items-center justify-between border-gray-400 active:border-black'>
          <img className='h-12' src='https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_538,w_956/v1698944322/assets/92/00189a-71c0-4f6d-a9de-1b6a85239079/original/UberMoto-India-Orange.png' />
          <div className=' mr-4 w-1/2'>
            <h4 className='font-medium text-base'>Moto <span><i className="ri-user-fill"></i>1</span></h4>
            <h5 className=' font-medium text-sm'>2 min away</h5>
            <p className=' font-normal text-xs'>Affordable Motorcycle Ride</p>
          </div>

          <h2 className='text-lg font-semibold'>Rs.{props.fare.moto}</h2>
        </div>
    </div>
  )
}

export default VehiclePanel
