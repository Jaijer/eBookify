'use client';

import { useState } from 'react';
import FileItem from './FileItem';

export default function FileList() {
  const [files, setFiles] = useState([
    { id: 1, name: 'Image.png', size: '2 MB', type: 'image', status: 'ready' },
    { id: 2, name: 'document.pdf', size: '4 MB', type: 'pdf', status: 'ready' },
    { id: 3, name: 'document2.pdf', size: '8 MB', type: 'pdf', status: 'uploading', progress: 60 }
  ]);

  const addMoreFiles = () => {
    // This would open a file dialog in a real implementation
    alert("File dialog would open here");
  };

  const removeFile = (id) => {
    setFiles(files.filter(file => file.id !== id));
  };

  return (
    <div className="w-full mb-8">
      <div className="flex flex-col gap-4 mb-4">
        {files.map((file) => (
          <FileItem key={file.id} file={file} onRemove={removeFile} />
        ))}
      </div>
      
      <button 
        className="w-full border border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 font-medium text-gray-700"
        onClick={addMoreFiles}
      >
        + Add more files
      </button>
    </div>
  );
}