'use client';

import { motion } from 'framer-motion';
import { useConversion } from '@/contexts/ConversionContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function ConversionProgress() {
  const { status, progress, file } = useConversion();
  const { darkMode } = useTheme();
  
  // Don't show if we're idle or complete
  if (status === 'idle' || status === 'complete') {
    return null;
  }
  
  // Status messages
  const statusMessages = {
    uploading: 'Uploading your PDF...',
    processing: 'Processing your document...'
  };
  
  // Processing stage descriptions
  const progressStages = [
    { threshold: 10, message: 'Analyzing document structure...' },
    { threshold: 30, message: 'Extracting text and images...' }, 
    { threshold: 50, message: 'Applying AI formatting...' },
    { threshold: 70, message: 'Building e-book structure...' },
    { threshold: 90, message: 'Finalizing conversion...' },
    { threshold: 100, message: 'Conversion complete!' }
  ];
  
  // Find current stage message
  const currentStageMessage = progressStages.find(stage => progress <= stage.threshold)?.message;
  
  return (
    <div className={`w-full max-w-xl mx-auto mt-8 rounded-lg shadow-md p-6 ${
      darkMode ? 'bg-[#222] text-[#f0f0f0]' : 'bg-white text-gray-900'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">
          {statusMessages[status]}
        </h3>
        <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {Math.round(progress)}%
        </span>
      </div>
      
      {/* Progress bar */}
      <div className={`w-full rounded-full h-2.5 mb-4 ${darkMode ? 'bg-[#333]' : 'bg-gray-200'}`}>
        <motion.div 
          className="bg-[#6246ea] h-2.5 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      
      {/* Current stage message */}
      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{currentStageMessage}</p>
      
      {/* File information */}
      {file && (
        <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className={`flex items-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <span className="font-medium mr-2">File:</span>
            <span className="truncate">{file.name}</span>
          </div>
          <div className={`flex items-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
            <span className="font-medium mr-2">Size:</span>
            <span>{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
          </div>
        </div>
      )}
    </div>
  );
}