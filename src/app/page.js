'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { ConversionProvider } from '@/contexts/ConversionContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import UploadField from '@/components/upload/UploadField';
import ConversionProgress from '@/components/conversion/ConversionProgress';
import ConversionResult from '@/components/conversion/ConversionResult';

export default function Home() {
  const { darkMode } = useTheme();

  return (
    <ConversionProvider>
      <div className={`min-h-screen p-8 transition-colors duration-300 ${
        darkMode ? 'bg-[#121212] text-[#f0f0f0]' : 'bg-white text-gray-900'
      }`}>
        <div className="max-w-6xl mx-auto">
          <Header />
          
          <main className="flex-grow container mx-auto flex flex-col items-center justify-center">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                PDF File Converter
              </h2>
              <p className={`text-xl max-w-2xl mx-auto leading-tight ${
                darkMode ? 'text-[#aaa]' : 'text-gray-600'
              } text-justify`}>
                  Welcome to eBookify, your go-to platform for converting PDF files into 
                e-book file formats. We designed eBookify for digital bookworms, making it easy for you
                to enjoy your content in its new e-book format.
              </p>
            </div>
            
            <UploadField />
            <ConversionProgress />
            <ConversionResult />
          </main>
          
          <Footer />
        </div>
      </div>
    </ConversionProvider>
  );
}