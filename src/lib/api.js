// src/lib/api.js
// These functions handle API communication for the conversion process

/**
 * Upload a file for conversion
 * @param {File} file - The file to upload
 * @returns {Promise<Object>} - Response with jobId
 */
export async function uploadFile(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/conversion/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Upload failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API upload error:', error);
    throw error;
  }
}

/**
 * Check the status of a conversion job
 * @param {string} jobId - The job ID
 * @returns {Promise<Object>} - Job status data
 */
export async function checkStatus(jobId) {
  try {
    // Add a cache-busting parameter to avoid caching issues
    const cacheBuster = new Date().getTime();
    const url = `/api/conversion/status/${jobId}?_=${cacheBuster}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Status check failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API status check error:', error);
    throw error;
  }
}

/**
 * Download a converted file
 * @param {string} jobId - The job ID
 * @param {boolean} view - Whether to view or download the file
 * @returns {Promise<void>}
 */
export async function downloadFile(jobId, view = false) {
  try {
    // Add a cache-busting parameter to avoid caching issues
    const cacheBuster = new Date().getTime();
    let url = `/api/conversion/download/${jobId}?_=${cacheBuster}`;
    
    // If this is a view request, add the view parameter
    if (view) {
      url += '&view=true';
    }
    
    // For downloads, we use a different approach than fetch
    // This will trigger the browser's download behavior
    if (!view) {
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }
    
    // For view requests, just return the fetch response
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Download failed: ${response.status} ${response.statusText}`);
    }
    
    return response;
  } catch (error) {
    console.error('API download error:', error);
    throw error;
  }
}

/**
 * Fetch the text content for the e-reader
 * @param {string} jobId - The job ID
 * @returns {Promise<string>} - The text content
 */
export async function fetchTextContent(jobId) {
  try {
    console.log('Fetching text content for job:', jobId);
    
    // Add a cache-busting parameter to avoid caching issues
    const cacheBuster = new Date().getTime();
    const url = `/api/conversion/download/${jobId}?view=true&_=${cacheBuster}`;
    
    console.log('Fetching from URL:', url);
    const response = await fetch(url);
    
    if (!response.ok) {
      // Try to parse error JSON
      try {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to fetch text content: ${response.status} ${response.statusText}`);
      } catch (jsonError) {
        // If we can't parse JSON, use the status text
        throw new Error(`Failed to fetch text content: ${response.status} ${response.statusText}`);
      }
    }
    
    const text = await response.text();
    console.log('Successfully fetched text content, length:', text.length);
    return text;
  } catch (error) {
    console.error('API fetch text error:', error);
    throw error;
  }
}