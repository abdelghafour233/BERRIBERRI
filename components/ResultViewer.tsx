import React from 'react';
import { ResultViewerProps } from '../types';

export const ResultViewer: React.FC<ResultViewerProps> = ({ result, onReset }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = result.generated;
    link.download = `mohaweel-generated-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-grow flex items-center justify-center bg-slate-900/50 rounded-lg overflow-hidden relative group">
        <img 
          src={result.generated} 
          alt="Generated result" 
          className="max-h-full max-w-full object-contain shadow-2xl rounded-lg"
        />
        
        {/* Simple badge */}
        <div className="absolute top-4 right-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
          تم التحويل بنجاح
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <button
          onClick={handleDownload}
          className="w-full py-3 px-4 bg-green-600 hover:bg-green-500 text-white rounded-xl font-medium shadow-lg shadow-green-900/20 flex items-center justify-center gap-2 transition-all hover:translate-y-[-2px]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4-4v12" />
          </svg>
          تحميل الصورة
        </button>
        
        <button
          onClick={onReset}
          className="w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          تحويل صورة أخرى
        </button>
      </div>
    </div>
  );
};