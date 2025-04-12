'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiSettings, FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '@/contexts/ThemeContext';

const EReaderComponent = ({ text, title }) => {
  const { darkMode } = useTheme();
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [fontSize, setFontSize] = useState(18);
  const [readerTheme, setReaderTheme] = useState('sepia');
  const [showSettings, setShowSettings] = useState(false);
  const [fontFamily, setFontFamily] = useState('sans-serif');
  const [lineHeight, setLineHeight] = useState(1.6);
  const [processedPages, setProcessedPages] = useState([text || 'No content to display']);
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  
  const documentTitle = title || 'Converted Document';
  
  // Modified to handle scrolling instead of pagination
  const prepareText = () => {
    if (!text) return 'No content to display';
    
    // Split text by paragraphs
    const paragraphs = text.split(/\n\s*\n/);
    
    // Join paragraphs with proper spacing
    return paragraphs
      .filter(p => p.trim())
      .join('\n\n');
  };
  
  const goToNextPage = () => {
    if (contentRef.current) {
      // Scroll down by viewport height
      const scrollAmount = contentRef.current.clientHeight * 0.9;
      contentRef.current.scrollTop += scrollAmount;
    }
  };
  
  const goToPrevPage = () => {
    if (contentRef.current) {
      // Scroll up by viewport height
      const scrollAmount = contentRef.current.clientHeight * 0.9;
      contentRef.current.scrollTop -= scrollAmount;
    }
  };
  
  const toggleReaderTheme = () => {
    setReaderTheme(readerTheme === 'light' ? 'dark' : readerTheme === 'dark' ? 'sepia' : 'light');
  };
  
  useEffect(() => {
    // Initialize the content when text changes
    const formattedText = prepareText();
    setProcessedPages([formattedText]);
    
    // Reset scroll position when text changes
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [text]);
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown') {
        goToNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
        goToPrevPage();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  const getThemeStyles = () => {
    switch (readerTheme) {
      case 'dark':
        return {
          background: '#121212',
          text: '#e0e0e0',
          border: '#333333',
          hoverBg: 'rgba(255,255,255,0.05)'
        };
      case 'sepia':
        return {
          background: '#f8f2e4',
          text: '#5b4636',
          border: '#e8decb',
          hoverBg: 'rgba(0,0,0,0.05)'
        };
      default: // light
        return {
          background: '#ffffff',
          text: '#333333',
          border: '#e0e0e0',
          hoverBg: 'rgba(0,0,0,0.05)'
        };
    }
  };
  
  const themeStyles = getThemeStyles();
  
  return (
    <div className="w-full px-4">
      <div className="mx-auto max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative w-full"
          style={{
            boxShadow: darkMode ? '0 10px 25px rgba(0,0,0,0.3)' : '0 10px 25px rgba(0,0,0,0.1)'
          }}
        >
          {/* Device frame */}
          <div 
            ref={containerRef}
            className="relative overflow-hidden border w-full"
            style={{ 
              borderRadius: '12px',
              aspectRatio: '0.75',
              maxHeight: '80vh',
              borderColor: themeStyles.border,
              backgroundColor: themeStyles.background
            }}
          >
            {/* E-reader screen */}
            <div 
              className="h-full flex flex-col"
              style={{ 
                backgroundColor: themeStyles.background,
                color: themeStyles.text,
                transition: 'background-color 0.3s, color 0.3s'
              }}
            >
              {/* Header */}
              <div 
                className="px-5 py-4 flex justify-between items-center border-b"
                style={{ borderColor: themeStyles.border }}
              >
                <h3 className="text-lg font-medium truncate flex-1 text-center">
                  {documentTitle}
                </h3>
                <button 
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-2 rounded-full hover:bg-opacity-10"
                  style={{ ":hover": { backgroundColor: themeStyles.hoverBg } }}
                  aria-label="Settings"
                >
                  <FiSettings size={18} />
                </button>
              </div>
              
              {/* Content */}
              <div className="flex-1 flex relative overflow-hidden">
                {/* Settings panel */}
                <div 
                  className="absolute inset-y-0 right-0 w-64 border-l p-4 transform transition-transform z-10"
                  style={{ 
                    borderColor: themeStyles.border,
                    backgroundColor: themeStyles.background,
                    transform: showSettings ? 'translateX(0)' : 'translateX(100%)'
                  }}
                >
                  <h4 className="font-medium mb-4">Reading Settings</h4>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm mb-2">Theme</label>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setReaderTheme('light')}
                          className={`p-2 rounded-md flex items-center justify-center ${readerTheme === 'light' ? 'bg-[#6246ea] text-white' : ''}`}
                          style={{ backgroundColor: readerTheme === 'light' ? '#6246ea' : '' }}
                          aria-label="Light theme"
                        >
                          <FiSun size={16} />
                        </button>
                        <button 
                          onClick={() => setReaderTheme('sepia')}
                          className={`p-2 rounded-md flex items-center justify-center ${readerTheme === 'sepia' ? 'bg-[#6246ea] text-white' : ''}`}
                          style={{ backgroundColor: readerTheme === 'sepia' ? '#6246ea' : '' }}
                          aria-label="Sepia theme"
                        >
                          <span className="text-sm">Aa</span>
                        </button>
                        <button 
                          onClick={() => setReaderTheme('dark')}
                          className={`p-2 rounded-md flex items-center justify-center ${readerTheme === 'dark' ? 'bg-[#6246ea] text-white' : ''}`}
                          style={{ backgroundColor: readerTheme === 'dark' ? '#6246ea' : '' }}
                          aria-label="Dark theme"
                        >
                          <FiMoon size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm mb-2">Font Size</label>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => setFontSize(Math.max(14, fontSize - 1))}
                          className="p-1 rounded-md border"
                          style={{ borderColor: themeStyles.border }}
                          aria-label="Decrease font size"
                        >
                          <span className="text-sm">A-</span>
                        </button>
                        <input
                          type="range"
                          min="14"
                          max="24"
                          value={fontSize}
                          onChange={(e) => setFontSize(parseInt(e.target.value))}
                          className="flex-1"
                          aria-label="Font size"
                        />
                        <button 
                          onClick={() => setFontSize(Math.min(24, fontSize + 1))}
                          className="p-1 rounded-md border"
                          style={{ borderColor: themeStyles.border }}
                          aria-label="Increase font size"
                        >
                          <span className="text-sm">A+</span>
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm mb-2">Font</label>
                      <select
                        value={fontFamily}
                        onChange={(e) => setFontFamily(e.target.value)}
                        className="w-full p-2 rounded-md"
                        style={{ 
                          backgroundColor: themeStyles.background,
                          color: themeStyles.text,
                          borderColor: themeStyles.border,
                          border: `1px solid ${themeStyles.border}`
                        }}
                        aria-label="Font family"
                      >
                        <option value="sans-serif">Sans-serif</option>
                        <option value="serif">Serif</option>
                        <option value="monospace">Monospace</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm mb-2">Line Spacing</label>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => setLineHeight(Math.max(1.2, lineHeight - 0.1))}
                          className="p-1 rounded-md border"
                          style={{ borderColor: themeStyles.border }}
                          aria-label="Decrease line spacing"
                        >
                          <span className="text-sm">-</span>
                        </button>
                        <input
                          type="range"
                          min="1.2"
                          max="2.0"
                          step="0.1"
                          value={lineHeight}
                          onChange={(e) => setLineHeight(parseFloat(e.target.value))}
                          className="flex-1"
                          aria-label="Line spacing"
                        />
                        <button 
                          onClick={() => setLineHeight(Math.min(2.0, lineHeight + 0.1))}
                          className="p-1 rounded-md border"
                          style={{ borderColor: themeStyles.border }}
                          aria-label="Increase line spacing"
                        >
                          <span className="text-sm">+</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Page content with scrollbar hidden but functional */}
                <div 
                  ref={contentRef}
                  className="flex-1 p-5 overflow-y-auto scrollbar-hide whitespace-pre-wrap"
                  style={{ 
                    fontSize: `${fontSize}px`,
                    fontFamily: fontFamily,
                    lineHeight: lineHeight,
                    scrollbarWidth: 'none', /* Firefox */
                    msOverflowStyle: 'none', /* IE and Edge */
                  }}
                >
                  {processedPages[0]}
                </div>
                
                {/* Navigation buttons - keep them for page-like navigation */}
                <button 
                  onClick={goToPrevPage}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 rounded-r-md"
                  style={{ backgroundColor: themeStyles.hoverBg }}
                  aria-label="Scroll up"
                >
                  <FiChevronLeft size={24} />
                </button>
                
                <button 
                  onClick={goToNextPage}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 rounded-l-md"
                  style={{ backgroundColor: themeStyles.hoverBg }}
                  aria-label="Scroll down"
                >
                  <FiChevronRight size={24} />
                </button>
              </div>
              
              {/* Footer without pagination indicators */}
              <div 
                className="px-5 py-3 flex justify-between items-center border-t"
                style={{ 
                  borderColor: themeStyles.border,
                  backgroundColor: themeStyles.background
                }}
              >
                <div className="w-8"></div> {/* Spacer */}
                <div className="text-sm">
                  {/* Show scroll position indicator instead of pages */}
                  Scroll to read
                </div>
                <button 
                  onClick={toggleReaderTheme}
                  className="p-1 rounded-full hover:bg-opacity-10"
                  style={{ ":hover": { backgroundColor: themeStyles.hoverBg } }}
                  aria-label="Toggle theme"
                >
                  {readerTheme === 'light' ? <FiSun size={16} /> : readerTheme === 'dark' ? <FiMoon size={16} /> : <span className="text-xs px-1">Aa</span>}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Add CSS to hide scrollbars globally */}
      <style jsx global>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-hide {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  );
};

export default EReaderComponent;