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
    const [location, setLocation] = useState(null);

    const { storeCaptain } = React.useContext(CaptainDataContext);

    // Get user's current location
    const getCurrentLocation = () => {
        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const coords = [position.coords.longitude, position.coords.latitude];
                        console.log('Got coordinates:', coords);
                        resolve(coords);
                    },
                    (error) => {
                        console.log('Location error:', error);
                        // Fallback to default location if geolocation fails
                        const fallbackCoords = [77.2090, 28.6139]; // New Delhi coordinates as fallback
                        console.log('Using fallback coordinates:', fallbackCoords);
                        resolve(fallbackCoords);
                    }
                );
            } else {
                const fallbackCoords = [77.2090, 28.6139]; // New Delhi coordinates as fallback
                console.log('Geolocation not supported, using fallback coordinates:', fallbackCoords);
                resolve(fallbackCoords);
            }
        });
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            // Get current location
            let coordinates = [77.2090, 28.6139]; // Default coordinates
            
            try {
                coordinates = await getCurrentLocation();
                console.log('Final coordinates to send:', coordinates);
            } catch (locationError) {
                console.log('Location fetch failed, using default:', locationError);
            }
            
            const captainData = {
                fullname: {
                    firstname: firstName.trim(),
                    lastname: lastName.trim()
                },
                email: email.trim(),
                password: password,
                vehicle: {
                    color: vehicleColor.trim(),
                    plate: vehiclePlate.trim(),
                    capacity: Number(vehicleCapacity),
                    vehicleType: vehicleType
                },
                location: {
                    type: "Point",
                    coordinates: coordinates
                }
            };

            console.log('Sending captain data:', JSON.stringify(captainData, null, 2));
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
                console.log('Error Status:', err.response.status);
                
                // Check if response is HTML (server error page)
                if (typeof err.response.data === 'string' && err.response.data.includes('<!DOCTYPE html>')) {
                    // Try to extract error message from HTML
                    const errorMatch = err.response.data.match(/<pre>(.*?)<\/pre>/s);
                    if (errorMatch) {
                        const errorText = errorMatch[1]
                            .replace(/&nbsp;/g, ' ')
                            .replace(/&#39;/g, "'")
                            .replace(/&quot;/g, '"')
                            .replace(/<br>/g, '\n');
                        
                        console.log('Extracted Error:', errorText);
                        
                        // Show specific error message
                        if (errorText.includes('ValidationError')) {
                            alert('Validation error: Please check all required fields are filled correctly.');
                        } else if (errorText.includes('MongoServerError')) {
                            alert('Database error: Please check if all required fields are properly filled.');
                        } else if (errorText.includes('duplicate key')) {
                            alert('Captain with this email already exists.');
                        } else {
                            alert('Server error occurred. Please try again later.');
                        }
                    } else {
                        alert('Server error occurred. Please try again later.');
                    }
                } else {
                    // Handle JSON error responses
                    if (err.response.data.errors) {
                        const errorMessages = err.response.data.errors.map(e => e.msg || e.message).join('\n');
                        alert(errorMessages);
                    } else if (err.response.data.message) {
                        alert(err.response.data.message);
                    } else {
                        alert('Registration failed. Please try again.');
                    }
                }
            } else {
                console.log('Unknown Error:', err);
                alert('Network error. Please check your connection and try again.');
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
                        type='password'
                        value={password}
                        onChange={(e) => { setPassword(e.target.value) }}
                        required
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
