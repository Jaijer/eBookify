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
  
  const documentTitle = title || 'Converted Document';
  
  const processTextIntoPages = () => {
    if (!text || !containerRef.current) return [text || 'No content to display'];
    
    // Create temporary content element to measure text
    const tempContent = document.createElement('div');
    tempContent.style.fontSize = `${fontSize}px`;
    tempContent.style.fontFamily = fontFamily;
    tempContent.style.lineHeight = lineHeight;
    tempContent.style.width = `${containerRef.current.clientWidth - 40}px`; // Account for padding
    tempContent.style.height = `${containerRef.current.clientHeight - 120}px`; // Account for header/footer
    tempContent.style.position = 'absolute';
    tempContent.style.visibility = 'hidden';
    tempContent.style.overflow = 'hidden'; // No scrollbar in measurement
    tempContent.style.padding = '0 10px';
    document.body.appendChild(tempContent);
    
    // Split text by paragraphs with improved handling
    const paragraphs = text.split(/\n\s*\n/);
    const pages = [];
    let currentPageText = [];
    let currentHeight = 0;
    
    // Reserve a small buffer at the bottom to ensure text isn't cut off
    const heightBuffer = 5; // 5px buffer
    const availableHeight = tempContent.clientHeight - heightBuffer;
    
    for (const paragraph of paragraphs) {
      if (!paragraph.trim()) continue;
      
      // Try to add the whole paragraph
      tempContent.textContent = paragraph;
      const paragraphHeight = tempContent.scrollHeight;
      
      if (currentHeight + paragraphHeight > availableHeight) {
        // Paragraph doesn't fit on current page
        if (currentPageText.length === 0) {
          // If this is the first paragraph on the page, we need to split it
          const words = paragraph.split(' ');
          let testText = '';
          let remainingText = '';
          
          // Try adding words until we reach the height limit
          for (let i = 0; i < words.length; i++) {
            const previousText = testText;
            testText += (i > 0 ? ' ' : '') + words[i];
            tempContent.textContent = testText;
            
            if (tempContent.scrollHeight > availableHeight) {
              // We've exceeded the height, go back one word
              testText = previousText;
              remainingText = words.slice(i).join(' ');
              break;
            }
          }
          
          // Add the portion that fits to the current page
          if (testText.trim()) {
            pages.push(testText);
          }
          
          // Start a new page with the remaining text
          currentPageText = remainingText ? [remainingText] : [];
          
          // Recalculate height for the new page
          tempContent.textContent = remainingText;
          currentHeight = remainingText ? tempContent.scrollHeight : 0;
        } else {
          // Add the current page text to pages
          pages.push(currentPageText.join('\n\n'));
          // Start a new page with this paragraph
          currentPageText = [paragraph];
          currentHeight = paragraphHeight;
        }
      } else {
        // Paragraph fits, add it to current page
        currentPageText.push(paragraph);
        currentHeight += paragraphHeight;
      }
    }
    
    // Add the last page if there's any content left
    if (currentPageText.length > 0) {
      pages.push(currentPageText.join('\n\n'));
    }
    
    // Clean up
    document.body.removeChild(tempContent);
    
    return pages.length > 0 ? pages : [text || 'No content to display'];
  };
  
  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const toggleReaderTheme = () => {
    setReaderTheme(readerTheme === 'light' ? 'dark' : readerTheme === 'dark' ? 'sepia' : 'light');
  };
  
  useEffect(() => {
    const handleResize = () => {
      const pages = processTextIntoPages();
      setProcessedPages(pages);
      setTotalPages(Math.max(1, pages.length));
      if (currentPage >= pages.length) {
        setCurrentPage(0);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [text, fontSize, fontFamily, lineHeight, currentPage]);
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        goToNextPage();
      } else if (e.key === 'ArrowLeft') {
        goToPrevPage();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentPage, totalPages]);
  
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
                
                {/* Page content with no scrollbar */}
                <div 
                  className="flex-1 p-5 overflow-hidden whitespace-pre-wrap"
                  style={{ 
                    fontSize: `${fontSize}px`,
                    fontFamily: fontFamily,
                    lineHeight: lineHeight,
                  }}
                >
                  {processedPages[currentPage]}
                </div>
                
                {/* Navigation buttons */}
                {currentPage > 0 && (
                  <button 
                    onClick={goToPrevPage}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 rounded-r-md"
                    style={{ backgroundColor: themeStyles.hoverBg }}
                    aria-label="Previous page"
                  >
                    <FiChevronLeft size={24} />
                  </button>
                )}
                
                {currentPage < totalPages - 1 && (
                  <button 
                    onClick={goToNextPage}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 rounded-l-md"
                    style={{ backgroundColor: themeStyles.hoverBg }}
                    aria-label="Next page"
                  >
                    <FiChevronRight size={24} />
                  </button>
                )}
              </div>
              
              {/* Footer */}
              <div 
                className="px-5 py-3 flex justify-between items-center border-t"
                style={{ 
                  borderColor: themeStyles.border,
                  backgroundColor: themeStyles.background
                }}
              >
                <div className="w-8"></div> {/* Spacer */}
                <div className="text-sm">
                  {currentPage + 1} of {totalPages}
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
    </div>
  );
};

export default EReaderComponent;