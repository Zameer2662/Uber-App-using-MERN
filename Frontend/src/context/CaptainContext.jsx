import { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const CaptainDataContext = createContext();

  
// Create the context provider component
export const CaptainContext = ({ children }) => {
    const [captain, setCaptain] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load captain data from localStorage on initial load
    useEffect(() => {
        const token = localStorage.getItem('token');
        const captainData = localStorage.getItem('captain');
        
        if (token && captainData) {
            try {
                const parsedCaptain = JSON.parse(captainData);
                setCaptain(parsedCaptain);
            } catch (error) {
                console.error('Error parsing captain data:', error);
                localStorage.removeItem('captain');
            }
        }
        setLoading(false);
    }, []);

    // Function to store captain data
    const storeCaptain = (captainData) => {
        setCaptain(captainData);
        localStorage.setItem('captain', JSON.stringify(captainData));
    };

    // Function to clear captain data (logout)
    const clearCaptain = () => {
        setCaptain(null);
        localStorage.removeItem('captain');
        localStorage.removeItem('token');
    };

    // Create the context value object
    const value = {
        captain,
        loading,
        error,
        storeCaptain,
        clearCaptain,
        setLoading,
        setError,
        
    };

    // Return the provider with the value
    return (
        <CaptainDataContext.Provider value={value}>
            {children}
        </CaptainDataContext.Provider>
    );
};

export default CaptainContext;
export { CaptainDataContext };