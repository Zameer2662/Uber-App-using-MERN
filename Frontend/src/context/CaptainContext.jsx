import { createContext, useContext, useState } from 'react';

// Create the context
const CaptainDataContext = createContext();

  
// Create the context provider component
export const CaptainContext = ({ children }) => {
    const [captain, setCaptain] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to store captain data
    const storeCaptain = (captainData) => {
        setCaptain(captainData);
    };

    // Function to clear captain data (logout)
    const clearCaptain = () => {
        setCaptain(null);
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