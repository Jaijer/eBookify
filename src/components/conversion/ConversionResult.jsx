'use client';

import { motion } from 'framer-motion';
import { FiDownload, FiRefreshCw } from 'react-icons/fi';
import { useConversion } from '@/contexts/ConversionContext';

export default function ConversionResult() {
  const { status, resultUrl, file, downloadResult, resetConversion, error } = useConversion();
  
  // Only show when conversion is complete or there's an error
  if (status !== 'complete' && status !== 'error') {
    return null;
  }
  
  return (
    <div className="w-full max-w-xl mx-auto mt-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        {status === 'complete' ? (
          <>
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            
            <h3 className="text-xl font-medium text-center text-gray-900 mb-2">
              Conversion Complete!
            </h3>
            
            <p className="text-center text-gray-600 mb-6">
              Your e-book is ready to download
            </p>
            
            {/* File details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-primary-100 rounded p-2">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div className="ml-4 flex-1">
                  <h4 className="text-sm font-medium text-gray-900">
                    {file?.name.replace('.pdf', '.epub')}
                  </h4>
                  <p className="text-xs text-gray-500">
                    EPUB format • Compatible with most e-readers
                  </p>
                </div>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={downloadResult}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center"
              >
                <FiDownload className="mr-2" />
                Download EPUB
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={resetConversion}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg flex items-center justify-center"
              >
                <FiRefreshCw className="mr-2" />
                Convert Another
              </motion.button>
            </div>
          </>
        ) : (
          <>
            {/* Error state */}
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            
            <h3 className="text-xl font-medium text-center text-gray-900 mb-2">
              Conversion Failed
            </h3>
            
            <p className="text-center text-gray-600 mb-6">
              {error || "We encountered an error during conversion."}
            </p>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={resetConversion}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center"
            >
              <FiRefreshCw className="mr-2" />
              Try Again
            </motion.button>
          </>
        )}
      </motion.div>
    </div>
  );
}