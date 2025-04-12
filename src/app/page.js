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
      <div className={`min-h-screen transition-colors duration-300 ${
        darkMode ? 'bg-[#121212] text-[#f0f0f0]' : 'bg-white text-gray-900'
      }`}>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Header />
          
          <main className="flex-grow flex flex-col items-center justify-center py-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                PDF to EPUB Converter
              </h2>
              <p className={`text-xl max-w-2xl mx-auto leading-relaxed ${
                darkMode ? 'text-[#aaa]' : 'text-gray-600'
              }`}>
                Welcome to eBookify, your solution for converting PDF files into 
                reader-friendly e-book formats. Transform your static PDFs into 
                dynamic EPUBs optimized for all your e-reader devices.
              </p>
            </div>
            
            <div className="w-full">
              <UploadField />
              <ConversionProgress />
              <ConversionResult />
            </div>
            
            <div className={`mt-16 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              <div className="text-center p-6 rounded-lg shadow-md">
                <div className="mb-4 text-blue-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Simple Upload</h3>
                <p>Drag and drop your PDF files or browse to select them. We support batch processing for multiple files.</p>
              </div>
              
              <div className="text-center p-6 rounded-lg shadow-md">
                <div className="mb-4 text-green-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure Conversion</h3>
                <p>Your files are processed securely and deleted after conversion. We prioritize your privacy and data security.</p>
              </div>
              
              <div className="text-center p-6 rounded-lg shadow-md">
                <div className="mb-4 text-purple-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Instant Download</h3>
                <p>Download your converted EPUB files immediately after processing. No registration required for basic conversions.</p>
              </div>
            </div>
          </main>
          
          <Footer />
        </div>
      </div>
    </ConversionProvider>
  );
}