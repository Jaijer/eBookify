'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

const PageLoader = ({ onFinish }) => {
  const [visible, setVisible] = useState(true);
  const { darkMode } = useTheme();
  const textRef = useRef(null);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (typeof onFinish === 'function') {
        onFinish();
      }
    }, 2200); // Slightly longer overall duration

    return () => clearTimeout(timer);
  }, [onFinish]);

  if (!visible) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ 
        duration: 0.8,
        delay: 1.6, // Delay the fade-out to let EBOOKIFY + underline linger
        ease: "easeInOut"
      }}
      style={{
        backgroundColor: darkMode ? '#121212' : '#ffffff',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ 
          opacity: [0, 1, 1],
          scale: [0.5, 1.2, 1] 
        }}
        transition={{ 
          duration: 1.6,
          times: [0, 0.6, 1],
          ease: "easeInOut"
        }}
        className="flex flex-col items-center"
      >
        <div 
          ref={textRef}
          className="text-[#6246ea] text-6xl md:text-7xl font-bold tracking-wider relative inline-block"
        >
          EBOOKIFY
          <motion.div 
            className="absolute bottom-0 left-[2%] h-[3px] bg-[#6246ea]"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }} // Slightly longer underline animation
            style={{ 
              transformOrigin: 'left',
              width: '96%',
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PageLoader;
