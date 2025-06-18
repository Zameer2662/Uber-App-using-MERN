import React, { useState } from 'react'
import { Link } from 'react-router-dom'



const UserSignup = () => {
     const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [firstName, setFirstName] = useState('');
         const [lastName, setLastName] = useState('');
         const [userData , setUserData] = useState({})
    
        const submitHandler = (e) => {
            e.preventDefault();
            setUserData({
                fullName:{
                    firstName:firstName,
                    lastName:lastName
                },
                email:email,
                password:password
            })

            //console.log(userData);
            setEmail('');
            setPassword('');
            setFirstName('');
            setLastName('');

        }

    return (
        <div className='p-7 h-screen flex flex-col justify-between'>

            {/* email and password login ki inpute neeche wale div mai hai */}
            <div>
                <img src='https://freelogopng.com/images/all_img/1659761100uber-logo-png.png' alt='Uber Logo' className='w-16 mb-10 ' />
                <form onSubmit={(e) => { submitHandler(e) }}>

                    <h3 className='text-lg font-medium mb-2'>What's your Name</h3>
                    <div className='flex gap-4 mb-5 '>
                        <input
                            className=" bg-[#eeeeee] w-1/2 rounded px-4 py-2   text-lg  placeholder:text-base "
                            type='text'
                            value={firstName}
                            onChange={(e)=>{setFirstName(e.target.value)}}
                            required
                            placeholder='First name'
                        />
                        <input
                            className=" bg-[#eeeeee] w-1/2  rounded px-4 py-2   text-lg  placeholder:text-base"
                            value={lastName}
                            onChange={(e)=>{setLastName(e.target.value)}}
                            type='text'
                            required
                            placeholder='Last name'
                        />
                    </div>
                    <h3 className='text-lg font-medium mb-2'>What's your Email</h3>

                    <input
                        className=" bg-[#eeeeee]  mb-6 rounded px-4 py-2  w-full text-lg  placeholder:text-base "
                        value={email}
                        onChange={(e) => { setEmail(e.target.value) }}
                        type='email'
                        required
                        placeholder='email@example.com'
                    />

                    <h3 className=' mb-2 text-lg font-medium'>Enter Password</h3>

                    <input
                        className=" bg-[#eeeeee]  mb-6 rounded px-4 py-2  w-full text-lg  placeholder:text-base "
                        required
                        value={password}
                        onChange={(e) => { setPassword(e.target.value) }}
                        placeholder='password'
                    />

                    <button className=" bg-[#111] text-white font-semibold mb-3 rounded px-4 py-2  w-full placeholder:text-base ">Signup</button>

                </form>

                <p className='text-center'>Already have an Account?<Link to="/login" className='text-blue-600'> Login here</Link></p>

            </div>

             <div>
                {/* <Link to="/captain-signup" className=" flex items-center justify-center bg-[#10b461] text-white font-semibold mb-4 rounded px-4 py-2  w-full placeholder:text-base ">Signup as a Captain</Link> */}

                <p className='text-[10px] leading-tight'>This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy
                     Policy</span> and <span>Terms of Service</span> apply</p>
            </div>
            


        </div>
    )
}

export default UserSignup
