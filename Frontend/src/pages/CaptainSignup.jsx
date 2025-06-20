import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { CaptainDataContext } from '../context/CaptainContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const CaptainSignup = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');



    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');




    const [vehicleColor, setVehicleColor] = useState('');
    const [vehiclePlate, setVehiclePlate] = useState('');
    const [vehicleType, setVehicleType] = useState('');
    const [vehicleCapacity, setVehicleCapacity] = useState('');


    const { storeCaptain } = React.useContext(CaptainDataContext);


    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            const captainData = {
                fullname: {
                    firstname: firstName,
                    lastname: lastName
                },
                email: email,
                password: password,
                vehicle: {
                    color: vehicleColor,
                    plate: vehiclePlate,
                    capacity: Number(vehicleCapacity),
                    vehicleType: vehicleType
                }
            };

            const response = await axios.post('http://localhost:4000/captains/register', captainData);

            if (response.status === 201) {
                const data = response.data;
                storeCaptain(data.captain);
                localStorage.setItem('token', data.token);
                navigate('/captain-home');
            }

            // Reset form fields
            setEmail('');
            setPassword('');
            setFirstName('');
            setLastName('');
            setVehicleColor('');
            setVehiclePlate('');
            setVehicleType('');
            setVehicleCapacity('');
        } catch (err) {
            // Error handling: print backend validation errors in console
            if (err.response && err.response.data) {
                console.log('Registration Error:', err.response.data);
                alert(
                    err.response.data.errors
                        ? err.response.data.errors.map(e => e.msg).join('\n')
                        : err.response.data.message || 'Registration failed'
                );
            } else {
                console.log('Unknown Error:', err);
                alert('Something went wrong!');
            }
        }
    };
    return (
        <div className='py-5 px-5 h-screen flex flex-col justify-between'>

            {/* email and password login ki inpute neeche wale div mai hai */}
            <div>
                <img src='https://www.svgrepo.com/show/505031/uber-driver.svg' alt='Uber Logo' className='w-16  ' />
                <form onSubmit={(e) => { submitHandler(e) }}>

                    <h3 className='text-lg font-medium mb-2 w-full'>What's your Captain's Name</h3>
                    <div className='flex gap-4 mb-5 '>
                        <input
                            className=" bg-[#eeeeee] w-1/2 rounded px-4 py-2   text-lg  placeholder:text-base "
                            type='text'
                            value={firstName}
                            onChange={(e) => { setFirstName(e.target.value) }}
                            required
                            placeholder='First name'
                        />
                        <input
                            className=" bg-[#eeeeee] w-1/2  rounded px-4 py-2   text-lg  placeholder:text-base"
                            value={lastName}
                            onChange={(e) => { setLastName(e.target.value) }}
                            type='text'
                            required
                            placeholder='Last name'
                        />
                    </div>
                    <h3 className='text-lg font-medium mb-2 w-full'>What's your  Captain's Email</h3>

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
                        required-type='password'
                        value={password}
                        onChange={(e) => { setPassword(e.target.value) }}
                        placeholder='password'
                    />
                    <h3 className='text-lg font-medium mb-2 w-full'>Vehicle Details</h3>
                    <div className='flex gap-4 mb-5'>
                        <input
                            className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 text-lg placeholder:text-base"
                            type='text'
                            value={vehicleColor}
                            onChange={(e) => setVehicleColor(e.target.value)}
                            required
                            placeholder='Vehicle Color'
                        />
                        <input
                            className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 text-lg placeholder:text-base"
                            value={vehiclePlate}
                            onChange={(e) => setVehiclePlate(e.target.value)}
                            type='text'
                            required
                            placeholder='Vehicle Plate'
                        />
                    </div>
                    <div className='flex gap-4 mb-5'>
                        <select
                            className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 text-lg"
                            value={vehicleType}
                            onChange={(e) => setVehicleType(e.target.value)}
                            required
                        >
                            <option value="">Select Vehicle Type</option>
                            <option value="car">Car</option>
                            <option value="auto">Auto</option>
                            <option value="motorcycle">Motorcycle</option>
                        </select>
                        <input
                            className="bg-[#eeeeee] w-1/2 rounded px-4 py-2 text-lg placeholder:text-base"
                            value={vehicleCapacity}
                            onChange={(e) => setVehicleCapacity(e.target.value)}
                            type='number'
                            required
                            placeholder='Seating Capacity'
                            min="1"
                        />
                    </div>


                    <button className=" bg-[#111] text-white font-semibold mb-1 rounded px-4 py-2  w-full placeholder:text-base ">Create Captain account</button>

                </form>

                <p className='text-center mb-3'>Already have an Account?<Link to="/captain-login" className='text-blue-600'> Login here</Link></p>

            </div>

            <div>
                {/* <Link to="/captain-signup" className=" flex items-center justify-center bg-[#10b461] text-white font-semibold mb-4 rounded px-4 py-2  w-full placeholder:text-base ">Signup as a Captain</Link> */}

                <p className='text-[10px] leading-tight'>This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy
                    Policy</span> and <span>Terms of Service</span> apply</p>
            </div>



        </div>
    )

}

export default CaptainSignup
