import React, { useEffect } from 'react'

const SuccessPopup = ({ isVisible, onClose, message, amount }) => {
    useEffect(() => {
        if (isVisible) {
            console.log('✅ Success popup shown');
            const timer = setTimeout(() => {
                console.log('⏰ Auto-closing success popup');
                onClose();
            }, 2500); // Reduced to 2.5 seconds for faster redirect

            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-2xl p-6 mx-4 max-w-sm w-full transform transition-all duration-300 scale-100 animate-bounce'>
                <div className='text-center'>
                    {/* Success Icon */}
                    <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                        <i className="ri-check-line text-3xl text-green-600"></i>
                    </div>
                    
                    {/* Success Message */}
                    <h3 className='text-xl font-bold text-gray-900 mb-2'>
                        {message || 'Ride Completed Successfully!'}
                    </h3>
                    
                    {/* Amount */}
                    {amount && (
                        <p className='text-lg font-semibold text-green-600 mb-4'>
                            Rs.{amount}
                        </p>
                    )}
                    
                    {/* Description */}
                    <p className='text-gray-600 text-sm mb-6'>
                        Thank you for using our service!
                    </p>
                    
                    {/* Loading Animation */}
                    <div className='flex justify-center items-center space-x-1'>
                        <div className='w-2 h-2 bg-green-500 rounded-full animate-bounce'></div>
                        <div className='w-2 h-2 bg-green-500 rounded-full animate-bounce' style={{animationDelay: '0.1s'}}></div>
                        <div className='w-2 h-2 bg-green-500 rounded-full animate-bounce' style={{animationDelay: '0.2s'}}></div>
                    </div>
                    
                    <p className='text-xs text-gray-500 mt-2'>Redirecting to home...</p>
                </div>
            </div>
        </div>
    );
};

export default SuccessPopup;
