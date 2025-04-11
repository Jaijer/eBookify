'use client';

import { useTheme } from '@/contexts/ThemeContext';

export default function Footer() {
  const { darkMode } = useTheme();
  
  return (
    <footer className={`mt-16 py-6 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            © 2025 eBookify. All rights reserved.
          </p>
        </div>
        
        <div className="flex space-x-6">
          <a href="#" className={`text-sm hover:text-[#6246ea] transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Terms of Service
          </a>
          <a href="#" className={`text-sm hover:text-[#6246ea] transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Privacy Policy
          </a>
          <a href="#" className={`text-sm hover:text-[#6246ea] transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
}