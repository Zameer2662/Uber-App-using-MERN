import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const CaptainLogin = () => {

        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [captainData, setCaptainData] = useState({})
    
        const submitHandler = (e) => {
            e.preventDefault();
            setCaptainData({
                email:email,
                password:password
            })
            //console.log(userData);
            setEmail('');
            setPassword('');
        }
    return (
        <div className='p-7 h-screen flex flex-col justify-between'>

            {/* email and password login ki inpute neeche wale div mai hai */}
            <div>
                <img src='https://www.svgrepo.com/show/505031/uber-driver.svg' alt='Uber Logo' className='w-20 mb-2 ' />
                <form  onSubmit={(e) => { submitHandler(e) }}>
                    <h3 className='text-lg font-medium mb-2'>What's your Email</h3>

                    <input
                        className=" bg-[#eeeeee]  mb-7 rounded px-4 py-2  w-full text-lg border placeholder:text-base "
                        value={email}
                        onChange={(e) => { setEmail(e.target.value) }}
                        type='email'
                        required
                        placeholder='email@example.com'
                    />

                    <h3 className=' mb-2 text-lg font-medium'>Enter Password</h3>

                    <input
                        className=" bg-[#eeeeee]  mb-7 rounded px-4 py-2  w-full text-lg border placeholder:text-base "
                        value={password}
                        onChange={(e) => { setPassword(e.target.value) }}
                        type='password'
                        required
                        placeholder='password'
                    />

                    <button className=" bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2  w-full placeholder:text-base ">Login</button>

                </form>

                <p className='text-center'> Join a fleet?<Link to="/captain-signup" className='text-blue-600'> Register as a Captain </Link></p>

            </div>

            <div>
                <Link to="/login " className=" flex items-center justify-center bg-[#d5622a] text-white font-semibold mb-4 rounded px-4 py-2  w-full placeholder:text-base ">Sign in as a User</Link>
            </div>


        </div>
    )
}

export default CaptainLogin
