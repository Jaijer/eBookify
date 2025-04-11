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
    <div className="w-full max-w-xl mx-auto">
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
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
            isDragActive ? 'border-[#6246ea] bg-purple-50' : 'border-gray-300 hover:border-[#6246ea]'
          } ${darkMode ? 'bg-[#222]' : 'bg-white'}`}
          style={{ position: 'relative', zIndex: 1 }}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className={`p-4 rounded-full ${isDragActive ? 'bg-purple-100' : darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <svg className={`w-10 h-10 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
            </div>
            <div>
              {isDragActive ? (
                <p className="text-lg font-medium text-[#6246ea]">Drop your files here</p>
              ) : (
                <>
                  <p className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Drag & drop your files here</p>
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
        <button className="w-full bg-[#6246ea] text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center mt-6 hover:bg-[#5438d0] transition-colors duration-300">
          <span className="mr-2">↻</span> Convert Now
        </button>
      )}
    </div>
  );
}