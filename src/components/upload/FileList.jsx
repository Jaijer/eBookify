'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import FileItem from './FileItem';

export default function FileList({ files: propFiles, setFiles: propSetFiles }) {
  const { darkMode } = useTheme();
  const [files, setFiles] = useState(propFiles || [
    { id: 1, name: 'Image.png', size: '2 MB', type: 'image', status: 'ready' },
    { id: 2, name: 'document.pdf', size: '4 MB', type: 'pdf', status: 'ready' },
    { id: 3, name: 'document2.pdf', size: '8 MB', type: 'pdf', status: 'uploading', progress: 60 }
  ]);

  const setFilesFunc = propSetFiles || setFiles;

  const addMoreFiles = () => {
    // This would open a file dialog in a real implementation
    alert("File dialog would open here");
  };

  const removeFile = (id) => {
    setFilesFunc(files.filter(file => file.id !== id));
  };

  return (
    <div className="w-full mb-8">
      <div className="flex flex-col gap-4 mb-4">
        {files.map((file) => (
          <FileItem key={file.id} file={file} onRemove={removeFile} />
        ))}
      </div>
      
      <button 
        className={`w-full border-2 border-dashed rounded-lg p-4 text-center font-medium transition-all ${
          darkMode 
            ? 'border-[#444] text-[#aaa] hover:border-[#6246ea] hover:text-[#6246ea] hover:bg-[#222]' 
            : 'border-gray-300 text-gray-700 hover:border-[#6246ea] hover:text-[#6246ea] hover:bg-gray-50'
        }`}
        onClick={addMoreFiles}
      >
        + Add more files
      </button>
    </div>
  );
}