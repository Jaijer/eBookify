// src/contexts/ConversionContext.jsx - updated version
'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import { uploadFile, checkStatus, downloadFile } from '@/lib/api';

const ConversionContext = createContext();

export function ConversionProvider({ children }) {
  const [file, setFile] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, uploading, processing, complete, error
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState(null);
  const [error, setError] = useState(null);

  const handleFileUpload = useCallback(async (selectedFile) => {
    try {
      setFile(selectedFile);
      setStatus('uploading');
      setProgress(10);
      
      const response = await uploadFile(selectedFile);
      
      if (!response || !response.jobId) {
        throw new Error('Invalid response from server');
      }
      
      setJobId(response.jobId);
      setStatus('processing');
      setProgress(20);
      
      // Start polling for status
      const statusInterval = setInterval(async () => {
        try {
          const statusData = await checkStatus(response.jobId);
          
          if (!statusData) {
            throw new Error('Could not get conversion status');
          }
          
          setProgress(statusData.progress || progress);
          
          if (statusData.status === 'complete') {
            setStatus('complete');
            setResultUrl(statusData.resultUrl);
            clearInterval(statusInterval);
          } else if (statusData.status === 'error') {
            setStatus('error');
            setError(statusData.error || 'An error occurred during conversion');
            clearInterval(statusInterval);
          }
        } catch (statusErr) {
          console.error('Status check error:', statusErr);
          setStatus('error');
          setError('Failed to check conversion status');
          clearInterval(statusInterval);
        }
      }, 2000);
      
    } catch (err) {
      console.error('Upload error:', err);
      setStatus('error');
      setError(err.message || 'An error occurred during file upload');
    }
  }, [progress]);

  const downloadResult = useCallback(async () => {
    if (!jobId || status !== 'complete') {
      return;
    }
    
    try {
      await downloadFile(jobId);
    } catch (err) {
      console.error('Download error:', err);
      setError('Failed to download the converted file');
    }
  }, [jobId, status]);

  const resetConversion = useCallback(() => {
    setFile(null);
    setJobId(null);
    setStatus('idle');
    setProgress(0);
    setResultUrl(null);
    setError(null);
  }, []);

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
  const context = useContext(ConversionContext);
  if (context === undefined) {
    throw new Error('useConversion must be used within a ConversionProvider');
  }
  return context;
}