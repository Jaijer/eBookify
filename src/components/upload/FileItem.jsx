'use client';

import { useTheme } from '@/contexts/ThemeContext';

export default function FileItem({ file, onRemove }) {
  const { darkMode } = useTheme();
  
  return (
    <div className={`flex justify-between items-center border rounded-lg p-4 ${
      darkMode ? 'border-[#333] bg-[#222] text-[#f0f0f0]' : 'border-gray-200 bg-gray-50 text-gray-900'
    }`}>
      <div className="flex items-center gap-4">
        <div className={`flex justify-center items-center w-10 h-10 rounded text-white text-xs font-bold ${
          file.type === 'pdf' ? 'bg-red-500' : 'bg-blue-500'
        }`}>
          {file.type === 'pdf' ? 'PDF' : 'JPEG'}
        </div>
        
        <div>
          <span className="font-medium">{file.name} </span>
          <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>({file.size})</span>
        </div>
      </div>
      
      {file.status === 'ready' ? (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Convert to</span>
            <button className={`w-8 h-8 rounded ${darkMode ? 'bg-[#333] text-[#eee]' : 'bg-[#efefef] text-[#555]'} flex items-center justify-center`}>...</button>
          </div>
          <button 
            className={`w-8 h-8 flex items-center justify-center text-xl ${darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-600 hover:text-red-500'}`}
            onClick={() => onRemove(file.id)}
          >
            ×
          </button>
        </div>
      ) : (
        <div className="w-40">
          <div className={`w-full ${darkMode ? 'bg-[#333]' : 'bg-gray-200'} rounded-full h-2`}>
            <div 
              className="bg-[#6246ea] h-2 rounded-full"
              style={{ width: `${file.progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}