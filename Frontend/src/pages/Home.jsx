import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>

      <div className='h-screen bg-cover bg-center bg-[url(https://images.unsplash.com/photo-1557404763-69708cd8b9ce?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dHJhZmZpYyUyMGxpZ2h0fGVufDB8fDB8fHww)] pt-8  flex justify-between flex-col w-full'>

        <img src='https://freelogopng.com/images/all_img/1659761100uber-logo-png.png' alt='Uber Logo' className='w-16 ml-8 ' />
        <div className='bg-white py-4 px-4 pb-7'>
            <h2 className='text-[30px] font-semibold'>Get Started With Uber</h2>
            <Link to="/login" className=' flex items-center justify-center w-full bg-black text-white mt-5 py-3 rounded-lg'>Continue</Link>
        </div>
      </div>
    </div>
  )
}

export default Home
