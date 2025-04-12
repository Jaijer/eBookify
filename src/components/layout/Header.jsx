'use client';

import Link from 'next/link';
import { useTheme } from '@/contexts/ThemeContext';

export default function Header() {
  const { darkMode, toggleDarkMode } = useTheme();

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
        
        <button className="bg-[#6246ea] text-white border-none rounded-full py-2 px-6 text-base font-semibold hover:bg-[#5438d0] transition-colors duration-300 flex items-center justify-center gap-2">
          <svg 
            width="28" 
            height="28" 
            viewBox="0 0 26 26" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="flex-shrink-0"
          >
            <path d="M21.5635 19.5614C19.9689 19.9443 18.3042 19.9258 16.7185 19.5075C15.1327 19.0891 13.6755 18.284 12.4773 17.1643C11.2791 16.0446 10.3773 14.6452 9.85264 13.0914C9.32798 11.5376 9.19686 9.878 9.47101 8.26111C9.42994 8.30205 9.38587 8.33988 9.33918 8.37428C9.01251 8.62278 8.60418 8.71494 7.78751 8.89927L7.04668 9.06728C4.17668 9.71711 2.74168 10.0414 2.39984 11.1393C2.05918 12.2359 3.03684 13.3804 4.99334 15.6683L5.49968 16.2598C6.05501 16.9096 6.33384 17.2351 6.45868 17.6364C6.58351 18.0389 6.54151 18.4729 6.45751 19.3398L6.38051 20.1296C6.08534 23.1828 5.93718 24.7088 6.83084 25.3866C7.72451 26.0644 9.06851 25.4473 11.7542 24.2094L12.4507 23.8898C13.2137 23.5374 13.5952 23.3624 14 23.3624C14.4048 23.3624 14.7863 23.5374 15.5505 23.8898L16.2447 24.2094C18.9315 25.4461 20.2755 26.0644 21.168 25.3878C22.0628 24.7088 21.9147 23.1828 21.6195 20.1296L21.5635 19.5614Z" fill="white"/>
            <path opacity="0.5" d="M10.6785 6.30937L10.2958 6.99537C9.87582 7.74904 9.66582 8.12587 9.33915 8.37437C9.38582 8.33937 9.42976 8.30165 9.47099 8.26121C9.19676 9.87822 9.32788 11.538 9.8526 13.0919C10.3773 14.6458 11.2792 16.0453 12.4776 17.165C13.676 18.2848 15.1333 19.0898 16.7192 19.5081C18.3051 19.9263 19.9699 19.9447 21.5647 19.5615L21.5413 19.3399C21.4585 18.473 21.4165 18.039 21.5413 17.6365C21.6662 17.2352 21.9438 16.9097 22.5003 16.2599L23.0067 15.6684C24.9632 13.3817 25.9408 12.2372 25.599 11.1394C25.2583 10.0415 23.8233 9.71604 20.9533 9.06737L20.2113 8.89937C19.3958 8.71504 18.9875 8.62287 18.6597 8.37437C18.333 8.12587 18.123 7.74904 17.703 6.99537L17.3215 6.30937C15.8433 3.65871 15.1048 2.33337 14 2.33337C12.8952 2.33337 12.1567 3.65871 10.6785 6.30937Z" fill="white"/>
          </svg>
          <span>Go Premium</span>
        </button>
      </div>
    </header>
  );
}