'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  // Initialize theme from localStorage
  useEffect(() => {
    // Use localStorage only in browser environment
    if (typeof window !== 'undefined') {
      const isDarkMode = localStorage.getItem('darkMode') === 'true';
      setDarkMode(isDarkMode);
      if (isDarkMode) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    
    // Use localStorage only in browser environment
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', newMode);
    }
    
    if (newMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}