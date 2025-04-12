'use client';

import Link from 'next/link';
import { useTheme } from "@/contexts/ThemeContext";

export default function Footer() {
  const { darkMode } = useTheme();

  return (
    <footer className={`mt-16 py-6 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm">
        
        {/* Left: Copyright */}
        <div className={`mb-4 md:mb-0 w-full md:w-1/3 text-left ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          © 2025 eBookify. All rights reserved.
        </div>

        {/* Center: Made with ❤️ */}
        <div className="mb-4 md:mb-0 w-full md:w-1/3 flex justify-center items-center">
          <span className={`flex items-center justify-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Made with&nbsp;
            <svg
              width="16"
              height="16"
              viewBox="0 0 25 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mx-1"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.2677 22.6502L22.8554 14.0625C24.2852 12.6327 25 10.9068 25 8.88483C25 6.86283 24.2852 5.13694 22.8554 3.70716C21.4255 2.27739 19.6996 1.5625 17.6777 1.5625C15.6556 1.5625 13.9298 2.27739 12.5 3.70716C11.0702 2.27739 9.3443 1.5625 7.32233 1.5625C5.30033 1.5625 3.57444 2.27739 2.14466 3.70716C0.714888 5.13694 0 6.86283 0 8.88483C0 10.9068 0.714888 12.6327 2.14466 14.0625L10.7323 22.6502C11.7085 23.6264 13.2915 23.6264 14.2677 22.6502Z"
                fill="url(#paint0_radial_26_44)"
              />
              <defs>
                <radialGradient
                  id="paint0_radial_26_44"
                  cx="0"
                  cy="0"
                  r="1"
                  gradientUnits="userSpaceOnUse"
                  gradientTransform="translate(6.31248 9.1106) rotate(59.8757) scale(14.6326 16.0056)"
                >
                  <stop stopColor="#FFAA00" />
                  <stop offset="1" stopColor="#F05206" />
                </radialGradient>
              </defs>
            </svg>
            by The Crew
          </span>
        </div>

        {/* Right: Links - with equal width each */}
        <div className="w-full md:w-1/3 flex justify-end">
          <div className="grid grid-cols-3 w-full gap-2">
            <Link
              href="/terms"
              className={`text-center hover:text-[#6246ea] transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className={`text-center hover:text-[#6246ea] transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
            >
              Privacy
            </Link>
            <Link
              href="/contact"
              className={`text-center hover:text-[#6246ea] transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}