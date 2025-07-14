import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const CaptainDataContext = createContext();

const CaptainContext = ({ children }) => {
    const [captain, setCaptain] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Load captain data from localStorage on initial load
    useEffect(() => {
        const token = localStorage.getItem('token');
        const captainData = localStorage.getItem('captain');
        
        if (token && captainData) {
            try {
                const parsedCaptain = JSON.parse(captainData);
                setCaptain(parsedCaptain);
                setIsLoggedIn(true);
            } catch (error) {
                console.error('Error parsing captain data:', error);
                localStorage.removeItem('captain');
            }
        }
        setLoading(false);
    }, []);

    const getCaptain = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                setIsLoggedIn(false);
                return;
            }

            console.log('Fetching captain profile with token:', token);

            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            console.log('Captain profile response:', response.data);
            
            if (response.status === 200 && response.data.success) {
                const captainData = {
                    ...response.data.captain,
                    earnings: Number(response.data.captain.earnings) || 0,
                    stats: {
                        hoursOnline: Number(response.data.captain.stats?.hoursOnline) || 0,
                        totalRides: Number(response.data.captain.stats?.totalRides) || 0,
                        totalDistance: Number(response.data.captain.stats?.totalDistance) || 0,
                        rating: Number(response.data.captain.stats?.rating) || 5.0,
                        totalRatings: Number(response.data.captain.stats?.totalRatings) || 0
                    }
                };
                
                console.log('Setting captain data:', captainData);
                setCaptain(captainData);
                setIsLoggedIn(true);
            }
        } catch (error) {
            console.error('Error fetching captain:', error);
            console.error('Error response:', error.response?.data);
            
            if (error.response?.status === 401) {
                localStorage.removeItem('token');
                setIsLoggedIn(false);
                setCaptain(null);
            } else {
                // For other errors, don't clear the token immediately
                console.error('Server error, keeping token for retry');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCaptain();
    }, []);

    const storeCaptain = (captainData) => {
        setCaptain(captainData);
        localStorage.setItem('captain', JSON.stringify(captainData));
    };

    // Function to clear captain data (logout)
    const clearCaptain = () => {
        setCaptain(null);
        localStorage.removeItem('captain');
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    };

    const updateEarnings = async (amount) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.patch(
                `${import.meta.env.VITE_BASE_URL}/captains/update-earnings`,
                { amount },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setCaptain(response.data.captain);
        } catch (error) {
            console.error('Error updating earnings:', error);
        }
    };

    const updateStats = async (stats) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.patch(
                `${import.meta.env.VITE_BASE_URL}/captains/update-stats`,
                stats,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setCaptain(response.data.captain);
        } catch (error) {
            console.error('Error updating stats:', error);
        }
    };

    const updateCaptainStats = async (rideData) => {
        try {
            const token = localStorage.getItem('token');
            
            // Update earnings
            const newEarnings = (captain.earnings || 0) + rideData.fare;
            const newTotalRides = (captain.stats?.totalRides || 0) + 1;
            const newTotalDistance = (captain.stats?.totalDistance || 0) + rideData.distance;
            
            // Update locally first for immediate UI update
            setCaptain(prev => ({
                ...prev,
                earnings: newEarnings,
                stats: {
                    ...prev.stats,
                    totalRides: newTotalRides,
                    totalDistance: newTotalDistance
                }
            }));
            
            // Then sync with backend
            await axios.patch(
                `${import.meta.env.VITE_BASE_URL}/captains/update-earnings`,
                { amount: rideData.fare },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            await axios.patch(
                `${import.meta.env.VITE_BASE_URL}/captains/update-stats`,
                { 
                    totalRides: newTotalRides,
                    totalDistance: newTotalDistance
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            
        } catch (error) {
            console.error('Error updating captain stats:', error);
            // Refresh captain data on error
            getCaptain();
        }
    };

    const completeRide = async (rideData) => {
        try {
            const token = localStorage.getItem('token');
            
            // Update earnings
            await axios.patch(
                `${import.meta.env.VITE_BASE_URL}/captains/update-earnings`,
                { amount: rideData.fare },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Update stats
            await axios.patch(
                `${import.meta.env.VITE_BASE_URL}/captains/update-stats`,
                { 
                    totalRides: (captain.stats?.totalRides || 0) + 1,
                    totalDistance: (captain.stats?.totalDistance || 0) + rideData.distance
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Refresh captain data
            await getCaptain();
            
        } catch (error) {
            console.error('Error completing ride:', error);
        }
    };

    // Create the context value object
    const value = {
        captain,
        setCaptain,
        loading,
        isLoggedIn,
        setIsLoggedIn,
        storeCaptain,
        clearCaptain,
        setLoading,
        updateEarnings,
        updateStats,
        completeRide,
        updateCaptainStats,
        
    };

    // Return the provider with the value
    return (
        <CaptainDataContext.Provider value={value}>
            {children}
        </CaptainDataContext.Provider>
    );
};

export default CaptainContext;