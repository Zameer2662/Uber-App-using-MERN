import React, { createContext, useContext, useEffect } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();
 const socket  = io(`${import.meta.env.VITE_BASE_URL}`); // Change URL as needed

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {


  useEffect(() => {
   
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    // return () => {
    //   socketRef.current.disconnect();
    // };
  }, []);

 

  return (
    <SocketContext.Provider value={{ socket }}> 
      {children}
    </SocketContext.Provider>
  );
 
};
 export default SocketContext;


