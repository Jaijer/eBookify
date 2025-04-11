'use client';

import { createContext, useContext, useState } from 'react';
import { uploadFile, checkStatus, downloadFile } from '@/lib/api';

const ConversionContext = createContext();

export function ConversionProvider({ children }) {
  const [file, setFile] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, uploading, processing, complete, error
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState(null);
  const [error, setError] = useState(null);

  const handleFileUpload = async (selectedFile) => {
    try {
      setFile(selectedFile);
      setStatus('uploading');
      setProgress(10);
      
      const { jobId } = await uploadFile(selectedFile);
      setJobId(jobId);
      setStatus('processing');
      
      // Start polling for status
      const statusInterval = setInterval(async () => {
        const statusData = await checkStatus(jobId);
        setProgress(statusData.progress);
        
        if (statusData.status === 'complete') {
          setStatus('complete');
          setResultUrl(statusData.resultUrl);
          clearInterval(statusInterval);
        } else if (statusData.status === 'error') {
          setStatus('error');
          setError(statusData.error);
          clearInterval(statusInterval);
        }
      }, 2000);
      
    } catch (err) {
      setStatus('error');
      setError(err.message || 'An error occurred during conversion');
    }
  };

  const downloadResult = async () => {
    if (jobId && status === 'complete') {
      await downloadFile(jobId);
    }
  };

  const resetConversion = () => {
    setFile(null);
    setJobId(null);
    setStatus('idle');
    setProgress(0);
    setResultUrl(null);
    setError(null);
  };

  return (
    <ConversionContext.Provider value={{
      file,
      status,
      progress,
      resultUrl,
      error,
      handleFileUpload,
      downloadResult,
      resetConversion
    }}>
      {children}
    </ConversionContext.Provider>
  );
}

export function useConversion() {
  return useContext(ConversionContext);
}