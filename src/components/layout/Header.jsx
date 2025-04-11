'use client';

import { useState } from 'react';

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <header className="flex justify-between items-center mb-12">
      <h1 className="text-2xl font-bold text-[#6246ea]">EBOOKIFY</h1>
      
      <div className="flex items-center gap-4">
        <div 
          className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer"
          onClick={toggleDarkMode}
        >
          <div 
            className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-300 ${
              darkMode ? 'translate-x-6 bg-white' : 'translate-x-0.5'
            }`}
          ></div>
        </div>
        
        <button className="bg-[#6246ea] text-white border-none rounded-full py-2 px-6 text-base font-semibold">
          Go Premium
        </button>
      </div>
    </header>
  );
}