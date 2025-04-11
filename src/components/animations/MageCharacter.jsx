'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function MageCharacter() {
  const [eyePosition, setEyePosition] = useState({ x: 0, y: 0 });
  const [greeting, setGreeting] = useState(true);
  const characterRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (characterRef.current) {
        const characterRect = characterRef.current.getBoundingClientRect();
        const characterCenterX = characterRect.left + characterRect.width / 2;
        const characterCenterY = characterRect.top + characterRect.height / 2;
        
        // Calculate eye movement based on cursor position
        const deltaX = (e.clientX - characterCenterX) / 20;
        const deltaY = (e.clientY - characterCenterY) / 20;
        
        // Limit eye movement
        const limitedX = Math.min(Math.max(deltaX, -10), 10);
        const limitedY = Math.min(Math.max(deltaY, -8), 8);
        
        setEyePosition({ x: limitedX, y: limitedY });
      }
    };

    // Hide greeting after 4 seconds
    const greetingTimer = setTimeout(() => {
      setGreeting(false);
    }, 4000);
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(greetingTimer);
    };
  }, []);

  return (
    <div ref={characterRef} className="relative">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-40 h-40"
      >
        {/* SVG Mage Character */}
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          {/* Hat */}
          <path d="M30 50 L50 20 L70 50 Z" fill="#6246ea" />
          
          {/* Face */}
          <circle cx="50" cy="60" r="20" fill="#f8d8be" />
          
          {/* Eyes background */}
          <circle cx="43" cy="55" r="5" fill="white" />
          <circle cx="57" cy="55" r="5" fill="white" />
          
          {/* Pupils - These will move */}
          <motion.g animate={{ x: eyePosition.x, y: eyePosition.y }}>
            <circle cx="43" cy="55" r="2.5" fill="#333" />
            <circle cx="57" cy="55" r="2.5" fill="#333" />
          </motion.g>
          
          {/* Glasses */}
          <circle cx="43" cy="55" r="6" fill="none" stroke="#6246ea" strokeWidth="1" />
          <circle cx="57" cy="55" r="6" fill="none" stroke="#6246ea" strokeWidth="1" />
          <line x1="49" y1="55" x2="51" y2="55" stroke="#6246ea" strokeWidth="1" />
          
          {/* Robe */}
          <path d="M30 70 Q50 80 70 70 L70 90 L30 90 Z" fill="#6246ea" />
          
          {/* Beard */}
          <path d="M40 65 Q50 75 60 65 L60 75 L40 75 Z" fill="#e5e5e5" />
          
          {/* Smile */}
          <path d="M42 65 Q50 70 58 65" fill="none" stroke="#333" strokeWidth="1" />
          
          {/* Magic Book */}
          <rect x="30" y="80" width="15" height="12" fill="#8b5cf6" />
          <rect x="32" y="82" width="11" height="8" fill="#ddd6fe" />
        </svg>
      </motion.div>
      
      {/* Greeting Speech Bubble */}
      {greeting && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-md"
        >
          <div className="text-sm text-center">
            Let me turn your PDFs into beautiful e-books!
          </div>
          {/* Arrow pointing down */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-3 h-3 bg-white"></div>
        </motion.div>
      )}
    </div>
  );
}