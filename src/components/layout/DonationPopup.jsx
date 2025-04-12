'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { FiX } from 'react-icons/fi';

export default function DonationPopup({ isOpen, onClose }) {
  const { darkMode } = useTheme();
  const popupRef = useRef(null);
  
  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  // Close on escape key
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  const donationReasons = [
    'Help us keep eBookify free for everyone',
    'Support ongoing development of new features',
    'Enable us to maintain and improve our servers',
    'Fund research into better conversion algorithms',
    'Allow us to build a mobile app version',
    'Help us reach more people in need of accessible e-books'
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          >
            {/* Popup */}
            <motion.div
              ref={popupRef}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`relative w-full max-w-md p-6 rounded-xl shadow-xl ${
                darkMode ? 'bg-[#1f1f1f] text-white' : 'bg-white text-gray-800'
              }`}
            >
              {/* Close button */}
              <button
                onClick={onClose}
                className={`absolute top-4 right-4 p-1 rounded-full ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                } transition-colors duration-200`}
              >
                <FiX size={24} />
              </button>
              
              {/* Header */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-[#6246ea]">EBOOKIFY</h2>
                <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Support our mission to make literature accessible to everyone
                </p>
              </div>
              
              {/* Donation Reasons */}
              <div className="space-y-3 mb-6">
                {donationReasons.map((reason, index) => (
                  <div key={index} className="flex items-center">
                    <div className="flex-shrink-0 w-1 h-1 mr-3 rounded-full bg-[#6246ea]"></div>
                    <p className={darkMode ? 'text-gray-200' : 'text-gray-700'}>
                      {reason}
                    </p>
                  </div>
                ))}
              </div>
              
              {/* Donation Options */}
              <div className={`mb-6 p-4 rounded-lg ${
                darkMode ? 'bg-gray-800' : 'bg-gray-50'
              }`}>
                <p className={`text-center mb-3 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Choose a donation amount:
                </p>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <button className={`py-2 rounded-lg font-medium transition-colors duration-200 ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-[#6246ea] text-white' 
                      : 'bg-gray-200 hover:bg-[#6246ea] hover:text-white'
                  }`}>$5</button>
                  <button className={`py-2 rounded-lg font-medium transition-colors duration-200 ${
                    darkMode 
                      ? 'bg-[#6246ea] text-white' 
                      : 'bg-[#6246ea] text-white'
                  }`}>$10</button>
                  <button className={`py-2 rounded-lg font-medium transition-colors duration-200 ${
                    darkMode 
                      ? 'bg-gray-700 hover:bg-[#6246ea] text-white' 
                      : 'bg-gray-200 hover:bg-[#6246ea] hover:text-white'
                  }`}>$25</button>
                </div>
                <p className={`text-center text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Every contribution helps us keep going
                </p>
              </div>
              
              {/* Buttons */}
              <div className="flex flex-col gap-3">
                <button className="w-full py-3 px-4 bg-[#6246ea] hover:bg-[#5438d0] text-white font-medium rounded-lg transition-colors duration-300">
                  Donate Now
                </button>
                <button 
                  onClick={onClose}
                  className={`w-full py-3 px-4 font-medium rounded-lg transition-colors duration-300 ${
                    darkMode 
                      ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  Maybe Later
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}