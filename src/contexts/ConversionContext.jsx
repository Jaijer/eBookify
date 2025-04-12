'use client';

import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { uploadFile, checkStatus, downloadFile } from '@/lib/api';

const ConversionContext = createContext();

export function ConversionProvider({ children }) {
  const [file, setFile] = useState(null);
  const [jobId, setJobId] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, uploading, processing, complete, error
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState(null);
  const [error, setError] = useState(null);
  // Use a ref for the status interval to clean it up properly
  const statusIntervalRef = useRef(null);
  // Store the current progress value in a ref to avoid dependency issues
  const progressRef = useRef(0);

  // Keep progressRef in sync with the state value
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  const handleFileUpload = useCallback(async (selectedFile) => {
    try {
      // Clear any existing interval
      if (statusIntervalRef.current) {
        clearInterval(statusIntervalRef.current);
        statusIntervalRef.current = null;
      }
      
      setFile(selectedFile);
      setStatus('uploading');
      setProgress(10);
      
      const response = await uploadFile(selectedFile);
      
      if (!response || !response.jobId) {
        throw new Error('Invalid response from server');
      }
      
      const responseJobId = response.jobId;
      setJobId(responseJobId);
      setStatus('processing');
      setProgress(20);
      
      // Start polling for status
      statusIntervalRef.current = setInterval(async () => {
        try {
          console.log('Checking status for job:', responseJobId);
          const statusData = await checkStatus(responseJobId);
          
          if (!statusData) {
            throw new Error('Could not get conversion status');
          }
          
          // Use the fetched progress value directly, not from state
          if (statusData.progress !== undefined && statusData.progress !== progressRef.current) {
            setProgress(statusData.progress);
          }
          
          if (statusData.status === 'complete') {
            console.log('Job complete:', responseJobId);
            setStatus('complete');
            setResultUrl(statusData.resultUrl);
            clearInterval(statusIntervalRef.current);
            statusIntervalRef.current = null;
          } else if (statusData.status === 'error') {
            console.log('Job error:', responseJobId);
            setStatus('error');
            setError(statusData.error || 'An error occurred during conversion');
            clearInterval(statusIntervalRef.current);
            statusIntervalRef.current = null;
          }
        } catch (statusErr) {
          console.error('Status check error:', statusErr);
          setStatus('error');
          setError('Failed to check conversion status');
          clearInterval(statusIntervalRef.current);
          statusIntervalRef.current = null;
        }
      }, 2000);
      
    } catch (err) {
      console.error('Upload error:', err);
      setStatus('error');
      setError(err.message || 'An error occurred during file upload');
    }
  }, []); // Empty dependency array since we're using refs

  // Clean up interval when component unmounts
  useEffect(() => {
    return () => {
      if (statusIntervalRef.current) {
        clearInterval(statusIntervalRef.current);
        statusIntervalRef.current = null;
      }
    };
  }, []);

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
    // Clear any existing interval
    if (statusIntervalRef.current) {
      clearInterval(statusIntervalRef.current);
      statusIntervalRef.current = null;
    }
    
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
      jobId,
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