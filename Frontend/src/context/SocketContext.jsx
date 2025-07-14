import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  useEffect(() => {
    // Check if backend URL is available
    const backendUrl = import.meta.env.VITE_BASE_URL;
    
    if (!backendUrl) {
      console.error('VITE_BASE_URL is not defined in environment variables');
      setConnectionError('Backend URL not configured');
      return;
    }

    // Check if backend server is running
    fetch(`${backendUrl}/health`)
      .then(response => {
        if (!response.ok) {
          console.warn('Backend server might have issues');
        }
      })
      .catch(() => {
        console.error('Backend server not responding. Please start: node server.js');
      });

    // Create socket connection with proper error handling
    const newSocket = io(backendUrl, {
      transports: ['polling', 'websocket'], // Start with polling, then try websocket
      timeout: 20000, // 20 second timeout
      reconnection: true,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 10000,
      reconnectionAttempts: 3,
      maxHttpBufferSize: 1e8,
      forceNew: true,
      autoConnect: true
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      setConnectionError(null);
    });

    newSocket.on('disconnect', (reason) => {
      setIsConnected(false);
      // Only reconnect if server disconnected, not if user refreshed page
      if (reason === 'io server disconnect') {
        newSocket.connect();
      }
    });

    newSocket.on('connect_error', (error) => {
      setConnectionError(error.message);
      setIsConnected(false);
      
      if (error.message.includes('xhr poll error') || error.message.includes('websocket error')) {
        console.error('Backend server not running. Start with: node server.js');
      }
    });

    newSocket.on('reconnect', () => {
      setIsConnected(true);
      setConnectionError(null);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Add global ride completion handler
  useEffect(() => {
    if (socket && isConnected) {
        const handleGlobalRideCompletion = (data) => {
            console.log('🌍 Global ride completion event:', data);
            // This can be used for any global state updates
        };

        socket.on('ride-ended', handleGlobalRideCompletion);
        socket.on('ride-completed', handleGlobalRideCompletion);
        socket.on('payment-completed', handleGlobalRideCompletion);

        return () => {
            socket.off('ride-ended', handleGlobalRideCompletion);
            socket.off('ride-completed', handleGlobalRideCompletion);
            socket.off('payment-completed', handleGlobalRideCompletion);
        };
    }
}, [socket, isConnected]);

  return (
    <SocketContext.Provider value={{ 
      socket, 
      isConnected, 
      connectionError 
    }}> 
      {children}
    </SocketContext.Provider>
  );
 
};
 export default SocketContext;


