import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CaptainDataContext } from '../context/CaptainContext';

const CaptainProtectedWrapper = ({ children }) => {
    const context = useContext(CaptainDataContext);
    const navigate = useNavigate();

    // Check if context is available
    if (!context) {
        console.error('CaptainProtectedWrapper must be used within CaptainContext');
        return <div>Context Error</div>;
    }

    const { captain, loading, isLoggedIn } = context;

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token || (!isLoggedIn && !loading)) {
            navigate('/captain-login');
        }
    }, [navigate, isLoggedIn, loading]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-lg">Loading captain data...</div>
            </div>
        );
    }

    if (!isLoggedIn || !captain) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-lg">Redirecting to login...</div>
            </div>
        );
    }

    return children;
};

export default CaptainProtectedWrapper;
