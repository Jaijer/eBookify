'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

const EntranceLines = () => {
  const linesContainerRef = useRef(null);
  const { darkMode } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    // Adjusted time for lines to appear - longer than 2.5s but shorter than 5s
    const timer = setTimeout(() => {
      setMounted(false);
    }, 3500); // 3.5 seconds - a balance between too short and too long
    return () => clearTimeout(timer);
  }, []);

  // Line properties - including full border around screen
  const lines = [
    { 
      position: 'top', 
      delay: 0.2,
      width: '100%', 
      height: '3px',
      initialScale: 0,
      finalScale: 1,
      initialOpacity: 0,
      finalOpacity: 0.9,
      direction: 'horizontal',
      offset: '0px'
    },
    { 
      position: 'bottom', 
      delay: 0.5,
      width: '100%', 
      height: '3px',
      initialScale: 0,
      finalScale: 1,
      initialOpacity: 0,
      finalOpacity: 0.9, 
      direction: 'horizontal',
      offset: '0px'
    },
    { 
      position: 'left', 
      delay: 0.3,
      width: '3px', 
      height: '100%',
      initialScale: 0,
      finalScale: 1,
      initialOpacity: 0,
      finalOpacity: 0.9,
      direction: 'vertical',
      offset: '0px'
    },
    { 
      position: 'right', 
      delay: 0.4,
      width: '3px', 
      height: '100%',
      initialScale: 0,
      finalScale: 1,
      initialOpacity: 0,
      finalOpacity: 0.9,
      direction: 'vertical',
      offset: '0px'
    }
  ];

  if (!mounted) return null;

  return (
    <div 
      ref={linesContainerRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ overflow: 'hidden' }}
    >
      {lines.map((line, index) => {
        // Set position styles based on the line's position
        let positionStyles = {};
        
        if (line.position === 'top') {
          positionStyles = { top: line.offset, left: '0', right: '0' };
        } else if (line.position === 'bottom') {
          positionStyles = { bottom: line.offset, left: '0', right: '0' };
        } else if (line.position === 'left') {
          positionStyles = { left: line.offset, top: '0', bottom: '0' };
        } else if (line.position === 'right') {
          positionStyles = { right: line.offset, top: '0', bottom: '0' };
        }

        // Set transform origin based on direction
        const transformOrigin = line.direction === 'horizontal' ? 'left center' : 'center top';

        // Use solid color instead of gradient for cleaner border effect
        const lineColor = darkMode ? '#6246ea' : '#6246ea';

        return (
          <motion.div
            key={index}
            className="absolute"
            style={{
              ...positionStyles,
              width: line.width,
              height: line.height,
              backgroundColor: lineColor,
              transformOrigin,
              boxShadow: `0 0 8px ${lineColor}80`
            }}
            initial={{ 
              scaleX: line.direction === 'horizontal' ? line.initialScale : 1,
              scaleY: line.direction === 'vertical' ? line.initialScale : 1,
              opacity: line.initialOpacity 
            }}
            animate={{ 
              scaleX: line.direction === 'horizontal' ? line.finalScale : 1,
              scaleY: line.direction === 'vertical' ? line.finalScale : 1,
              opacity: line.finalOpacity 
            }}
            exit={{
              opacity: 0,
              transition: { duration: 0.5 }
            }}
            transition={{
              duration: 1.0,
              delay: line.delay,
              ease: [0.25, 0.1, 0.25, 1] // Custom easing for a smoother animation
            }}
          />
        );
      })}
    </div>
  );
};

export default EntranceLines;