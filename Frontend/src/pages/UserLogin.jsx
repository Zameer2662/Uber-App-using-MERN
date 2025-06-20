import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'  ;  
import axios from 'axios';
import { UserDataContext } from '../context/userContext';


const UserLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userData, setUserData] = useState({});

    const navigate = useNavigate();
    
    const { user , setUser} = React.useContext(UserDataContext);

    const submitHandler = async (e) => {
        e.preventDefault();
        const userData = {
            email: email,
            password: password
        }

        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, userData);
        if (response.status === 200) {
            const data = response.data;
            setUser(data.user);
            localStorage.setItem('token', data.token);
            navigate('/home');
        }

        setEmail('');
        setPassword('');

    }
    return (
        <div className='p-7 h-screen flex flex-col justify-between'>

            {/* email and password login ki inpute neeche wale div mai hai */}
            <div>
                <img src='https://freelogopng.com/images/all_img/1659761100uber-logo-png.png' alt='Uber Logo' className='w-16 mb-10 ' />
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

                <p className='text-center'> New here?<Link to="/signup" className='text-blue-600'> Create new Account </Link></p>

            </div>

            <div>
                <Link to="/captain-login" className=" flex items-center justify-center bg-[#10b461] text-white font-semibold mb-4 rounded px-4 py-2  w-full placeholder:text-base ">Sign in as a Captain</Link>
            </div>


        </div>
    )
}

export default UserLogin
