import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CaptainDataContext } from '../context/CaptainContext';

const CaptainProtectedWrapper = ({
    children
}) => {
      const navigate = useNavigate();
    const token = localStorage.getItem('token');
  
    const { captain, setCaptain } = useContext(CaptainDataContext);

    const [isLoading, setIsLoading] = useState(false);

    
    useEffect(() => {
        if (!token) {
            navigate('/captain-login');
        }
    }, [token, navigate]);


    axios.get('http://localhost:4000/captains/profile', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => {
        if (response.status !== 200) {
            setCaptain(response.data.captain);
            setIsLoading(false);
        }
    })
    .catch(error => {
        console.log(error);
        localStorage.removeItem('token');
        navigate('/captain-login');
        
    });

   if(isLoading){
        return (
            <div>Loading...</div>
        )
   }

    return (
        <>
            {children}
        </>
    )
}

export default CaptainProtectedWrapper
