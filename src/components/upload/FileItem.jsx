'use client';

export default function FileItem({ file, onRemove }) {
  return (
    <div className="flex justify-between items-center border border-gray-200 rounded-lg p-4 bg-gray-50">
      <div className="flex items-center gap-4">
        <div className={`flex justify-center items-center w-10 h-10 rounded text-white text-xs font-bold ${
          file.type === 'pdf' ? 'bg-red-500' : 'bg-blue-500'
        }`}>
          {file.type === 'pdf' ? 'PDF' : 'JPEG'}
        </div>
        
        <div>
          <span className="font-medium">{file.name} </span>
          <span className="text-gray-500">({file.size})</span>
        </div>
      </div>
      
      {file.status === 'ready' ? (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm">Convert to</span>
            <button className="text-xl">...</button>
          </div>
          <button 
            className="w-6 h-6 flex items-center justify-center text-xl"
            onClick={() => onRemove(file.id)}
          >
            ×
          </button>
        </div>
      ) : (
        <div className="w-40">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${file.progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}