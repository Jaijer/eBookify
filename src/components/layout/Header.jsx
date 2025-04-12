'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import DonationPopup from './DonationPopup';

export default function Header() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [isDonationPopupOpen, setIsDonationPopupOpen] = useState(false);

  return (
    <header className="flex justify-between items-center mb-12">
      <Link href="/" className="cursor-pointer">
        <h1 className="text-2xl font-bold text-[#6246ea]">EBOOKIFY</h1>
      </Link>
      
      <div className="flex items-center gap-4">
        <div 
          className="relative cursor-pointer"
          onClick={toggleDarkMode}
        >
          <div className={`w-[50px] h-[26px] rounded-[13px] relative transition-colors duration-300 ${
            darkMode ? 'bg-[#555]' : 'bg-[#e0e0e0]'
          }`}>
            <div 
              className={`w-[22px] h-[22px] rounded-full absolute top-[2px] left-[2px] transition-all duration-300 ${
                darkMode ? 'transform translate-x-[24px] bg-[#ff9999]' : 'bg-white'
              }`}
            ></div>
          </div>
        </div>
        
        <button 
          className="bg-[#6246ea] text-white border-none rounded-full py-2 px-6 text-base font-semibold hover:bg-[#5438d0] transition-colors duration-300 flex items-center justify-center gap-2"
          onClick={() => setIsDonationPopupOpen(true)}
        >
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0"
          >
            <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill="white"/>
          </svg>
          <span>Donate</span>
        </button>
      </div>
      
      {/* Donation Popup */}
      <DonationPopup
        isOpen={isDonationPopupOpen}
        onClose={() => setIsDonationPopupOpen(false)}
      />
    </header>
  );
}