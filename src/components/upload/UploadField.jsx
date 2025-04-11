'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import MageCharacter from '../animations/MageCharacter';
import FileList from './FileList';
import { useTheme } from '@/contexts/ThemeContext';

export default function UploadField() {
  const [files, setFiles] = useState([]);
  const { darkMode } = useTheme();

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const newFiles = acceptedFiles.map(file => ({
        id: Date.now() + Math.random().toString(36).substring(2, 9),
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        type: file.type.includes('pdf') ? 'pdf' : 'image',
        status: 'ready',
        file: file
      }));

      setFiles(prev => [...prev, ...newFiles]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpeg', '.jpg', '.png']
    }
  });

  const isEmpty = files.length === 0;

  return (
    <div className="w-full max-w-4xl mx-auto">
      {isEmpty && (
        <motion.div
          initial={{ opacity: 0, y: 200 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 1,
            duration: 1,
            ease: 'easeOut'
          }}
          className="flex justify-center"
          style={{ position: 'relative', zIndex: 0 }}
        >
          <MageCharacter />
        </motion.div>
      )}

      {isEmpty ? (
        <div
          {...getRootProps()}
          className={`relative rounded-lg p-15 text-center cursor-pointer transition-all min-h-[240px] flex flex-col justify-center items-center ${
            isDragActive ? 'border-[#634EFF] bg-purple-50' : ''
          } ${darkMode ? 'bg-[#222]' : 'bg-[#F3F4F6]'}`}
          style={{ position: 'relative', zIndex: 1 }}
        >
          {/* Custom border with the SVG styling */}
          <div className={`absolute inset-0 rounded-[20px] pointer-events-none ${
            darkMode ? 'border border-gray-700' : 'border border-[#634EFF] border-opacity-40'
          } ${isDragActive ? 'border-[#634EFF] border-opacity-100' : ''}`} 
          style={{ borderStyle: darkMode ? 'solid' : 'dashed', borderWidth: '1px', borderRadius: '20px' }}></div>
          
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-4 z-10">
            <div className={`p-4 rounded-full ${isDragActive ? 'bg-purple-100' : darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <svg className={`w-10 h-10 ${isDragActive ? 'text-[#634EFF]' : darkMode ? 'text-gray-400' : 'text-[#634EFF]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
            </div>
            <div>
              {isDragActive ? (
                <p className="text-lg font-medium text-[#634EFF]">Drop your files here</p>
              ) : (
                <>
                  <p className={`text-lg font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Drag & drop your files here</p>
                  <p className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>or click to browse files</p>
                </>
              )}
            </div>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} mt-4`}>Supports PDF files and images up to 50MB</p>
          </div>
        </div>
      ) : (
        <FileList files={files} setFiles={setFiles} />
      )}

      {!isEmpty && (
        <button className="w-full bg-[#634EFF] text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center mt-6 hover:bg-[#5438d0] transition-colors duration-300">
          <span className="mr-2">↻</span> Convert Now
        </button>
      )}
    </div>
  );
}