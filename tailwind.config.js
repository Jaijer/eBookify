/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#e0dbfc',
          200: '#c2b7f9',
          300: '#a393f6',
          400: '#856ff3',
          500: '#6246ea', // Primary color from Colors.txt
          600: '#5438d0', // Slightly darker for hover states
          700: '#462db4',
          800: '#382398',
          900: '#2a1a7c',
        },
        gray: {
          50: '#f9f9f9',
          100: '#f0f0f0',
          200: '#e0e0e0',
          300: '#cccccc',
          400: '#aaaaaa',
          500: '#888888',
          600: '#666666',
          700: '#444444',
          800: '#333333', // Light mode text color
          900: '#222222',
        },
        dark: {
          background: '#121212', // Dark mode background
          surface: '#222222',
          text: '#f0f0f0', // Dark mode text color
        }
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}