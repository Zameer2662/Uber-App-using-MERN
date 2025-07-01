import React, {useContext, useEffect} from 'react'
import { UserDataContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserProtectedWrapper = ({
    children
}) => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserDataContext);
  const [isLoading, setIsLoading] = React.useState(true);

   useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token]);

  axios.get('http://localhost:4000/users/profile', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  .then(response => {
    if (response.status === 200) {
      setUser(response.data);
    }
    setIsLoading(false);
  })
  .catch(error => {
    console.error('Error fetching user profile:', error);
    localStorage.removeItem('token');
    navigate('/login');
  });

  if (isLoading) {
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

export default UserProtectedWrapper
