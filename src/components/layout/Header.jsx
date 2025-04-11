'use client';

import { useTheme } from '@/contexts/ThemeContext';

export default function Header() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <header className="flex justify-between items-center mb-12">
      <h1 className="text-2xl font-bold text-[#6246ea]">EBOOKIFY</h1>
      
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
        
        <button className="bg-[#6246ea] text-white border-none rounded-full py-2 px-6 text-base font-semibold hover:bg-[#5438d0] transition-colors duration-300">
          Go Premium
        </button>
      </div>
    </header>
  );
}