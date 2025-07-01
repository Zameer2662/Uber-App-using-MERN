import React, { useContext } from 'react';
import SocketContext from '../context/SocketContext';

const ConnectionStatus = () => {
  const { isConnected, connectionError } = useContext(SocketContext);

  if (isConnected) {
    return (
      <div className="fixed top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm z-50">
        <i className="ri-wifi-line mr-1"></i>
        Connected
      </div>
    );
  }

  if (connectionError) {
    return (
      <div className="fixed top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm z-50">
        <i className="ri-wifi-off-line mr-1"></i>
        Disconnected
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm z-50">
      <i className="ri-loader-4-line mr-1 animate-spin"></i>
      Connecting...
    </div>
  );
};

export default ConnectionStatus;
