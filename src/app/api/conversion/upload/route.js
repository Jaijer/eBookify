// src/app/api/conversion/upload/route.js
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { convertToText } from '@/lib/conversion';

// In-memory job storage (will be reset on server restart)
// For production, consider using Redis or similar for persistence
const conversionJobs = new Map();

// Make conversionJobs available to other route handlers
export { conversionJobs };

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' }, 
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/tiff', 'image/bmp', 'image/webp'];
    if (!file.type || !validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'File type not supported. Please upload PDF or image files (JPEG, PNG, TIFF, BMP, WEBP)' }, 
        { status: 400 }
      );
    }

    // Generate a unique ID for this job
    const jobId = uuidv4();
    
    // Create temp directory if it doesn't exist
    const tmpDir = path.join(os.tmpdir(), 'textify');
    await fs.mkdir(tmpDir, { recursive: true });
    
    // Determine file extension
    let fileExtension = '';
    if (file.type === 'application/pdf') {
      fileExtension = '.pdf';
    } else if (file.type === 'image/jpeg') {
      fileExtension = '.jpg';
    } else if (file.type === 'image/png') {
      fileExtension = '.png';
    } else if (file.type === 'image/tiff') {
      fileExtension = '.tiff';
    } else if (file.type === 'image/bmp') {
      fileExtension = '.bmp';
    } else if (file.type === 'image/webp') {
      fileExtension = '.webp';
    }
    
    // Save file to disk
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(tmpDir, `${jobId}${fileExtension}`);
    await fs.writeFile(filePath, buffer);
    
    // Define output path
    const outputPath = path.join(tmpDir, `${jobId}.txt`);
    
    // Register the job
    conversionJobs.set(jobId, {
      originalFilename: file.name,
      filePath,
      outputPath,
      status: 'uploaded',
      progress: 10,
      createdAt: new Date(),
      // TTL in milliseconds - 1 hour
      expiresAt: Date.now() + 3600000
    });
    
    // Start conversion process
    startConversion(jobId);
    
    return NextResponse.json({ jobId });
    
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'File upload failed' }, 
      { status: 500 }
    );
  }
}

async function startConversion(jobId) {
  console.log(jobId)
  const job = conversionJobs.get(jobId);
  
  if (!job) return;
  
  job.status = 'processing';
  
  try {
    // Update progress at intervals to simulate steps
    const updateProgress = (progress) => {
      job.progress = progress;
    };
    
    // Set initial progress
    updateProgress(20);
    
    // Progress updates
    const progressUpdates = [
      { progress: 30, delay: 500 },  // Initial processing
      { progress: 50, delay: 1000 }, // Text extraction
      { progress: 70, delay: 1000 }, // Text formatting
      { progress: 90, delay: 500 }   // Finalizing
    ];
    
    let currentUpdateIndex = 0;
    
    const progressInterval = setInterval(() => {
      if (currentUpdateIndex >= progressUpdates.length) {
        clearInterval(progressInterval);
        return;
      }
      
      const update = progressUpdates[currentUpdateIndex];
      updateProgress(update.progress);
      currentUpdateIndex++;
      
    }, progressUpdates[currentUpdateIndex].delay);
    
    try {
      console.log("Before converting")
      // Perform the actual conversion
      await convertToText(job.filePath, job.outputPath);
      console.log("After converting")

      // Set job to complete
      job.status = 'complete';
      job.progress = 100;
      job.resultUrl = `/api/conversion/download/${jobId}`;
      
      clearInterval(progressInterval);
    } catch (err) {
      job.status = 'error';
      job.error = `Conversion failed: ${err.message}`;
      clearInterval(progressInterval);
      console.error('Conversion error:', err);
    }
    
  } catch (error) {
    job.status = 'error';
    job.error = 'Conversion process failed';
    console.error('Conversion error:', error);
  }
}