'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { FiDownload, FiRefreshCw, FiBook, FiFileText, FiAlertCircle } from 'react-icons/fi';
import { useConversion } from '@/contexts/ConversionContext';
import { useTheme } from '@/contexts/ThemeContext';
import EReaderComponent from '@/components/reader/EReaderComponent';
import { fetchTextContent } from '@/lib/api';

export default function ConversionResult() {
  const { status, file, downloadResult, resetConversion, error, jobId } = useConversion();
  const { darkMode } = useTheme();
  const [viewMode, setViewMode] = useState('info');
  const [documentText, setDocumentText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const isMounted = useRef(true);
  
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  useEffect(() => {
    if (status === 'complete' && viewMode === 'reader' && jobId && !documentText) {
      const getTextContent = async () => {
        try {
          setIsLoading(true);
          setFetchError(null);
          
          const text = await fetchTextContent(jobId);
          
          if (!text) {
            throw new Error('Received empty text content');
          }
          
          if (isMounted.current) {
            setDocumentText(text);
          }
        } catch (err) {
          if (isMounted.current) {
            setFetchError(err.message || 'Failed to load document');
          }
        } finally {
          if (isMounted.current) {
            setIsLoading(false);
          }
        }
      };
      
      getTextContent();
    }
  }, [status, viewMode, jobId, documentText]);

  if (status !== 'complete' && status !== 'error') {
    return null;
  }
  
  const handleRetry = () => {
    setDocumentText('');
    setFetchError(null);
  };

  return (
    <div className="w-full mx-auto mt-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-lg shadow-md p-6 max-w-4xl mx-auto ${
          darkMode ? 'bg-[#222] text-[#f0f0f0]' : 'bg-white text-gray-900'
        }`}
      >
        {status === 'complete' ? (
          <>
            <div className={`flex border-b mb-6 ${darkMode? "border-gray-600":"border-gray-200"}`}>
              <button
                onClick={() => setViewMode('info')}
                className={`py-3 px-5 font-medium flex items-center ${
                  viewMode === 'info' 
                    ? `border-b-2 border-[#6246ea] text-[#6246ea]` 
                    : darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                <FiFileText className="mr-2" />
                File Info
              </button>
              <button
                onClick={() => setViewMode('reader')}
                className={`py-3 px-5 font-medium flex items-center ${
                  viewMode === 'reader' 
                    ? `border-b-2 border-[#6246ea] text-[#6246ea]` 
                    : darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                <FiBook className="mr-2" />
                E-Reader View
              </button>
            </div>
            
            {viewMode === 'info' ? (
              <div className="space-y-6">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
                
                <h3 className="text-xl font-medium text-center mb-2">
                  Conversion Complete!
                </h3>
                
                <div className={`rounded-lg p-4 mb-6 ${darkMode ? 'bg-[#1a1a1a]' : 'bg-gray-50'}`}>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-primary-100 rounded p-2">
                      <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="text-sm font-medium">
                        {file?.name ? file.name.replace(/\.[^/.]+$/, '.txt') : 'converted.txt'}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="min-h-[400px] flex justify-center">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 border-4 border-t-[#6246ea] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-lg">Preparing your document...</p>
                  </div>
                ) : documentText ? (
                  <div className="w-full flex justify-center">
                    <EReaderComponent 
                      text={documentText} 
                      title={file?.name ? file.name.replace(/\.[^/.]+$/, '') : 'Converted Document'}
                    />
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="flex flex-col items-center justify-center mb-6">
                      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                        <FiAlertCircle className="w-8 h-8 text-amber-500" />
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-medium mb-4">
                      Unable to Load Document
                    </h3>
                    
                    {fetchError && (
                      <p className="mb-4 text-red-500">
                        {fetchError}
                      </p>
                    )}
                    
                    <button
                      onClick={handleRetry}
                      className="px-4 py-2 bg-[#6246ea] text-white rounded-md hover:bg-[#5438d0]"
                    >
                      <FiRefreshCw className="inline mr-2" />
                      Retry Loading
                    </button>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={downloadResult}
                className="flex-1 bg-[#6246ea] hover:bg-[#5438d0] text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center"
              >
                <FiDownload className="mr-2" />
                Download Text File
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={resetConversion}
                className={`flex-1 font-medium py-3 px-4 rounded-lg flex items-center justify-center ${
                  darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <FiRefreshCw className="mr-2" />
                Convert Another
              </motion.button>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            
            <h3 className="text-xl font-medium text-center mb-2">
              Conversion Failed
            </h3>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={resetConversion}
              className="w-full bg-[#6246ea] hover:bg-[#5438d0] text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center"
            >
              <FiRefreshCw className="mr-2" />
              Try Again
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  );
}