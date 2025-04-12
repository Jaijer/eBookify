// src/app/api/conversion/upload/route.js
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { convertPdfToEpub } from '@/lib/conversion';

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
    if (!file.type || !file.type.includes('pdf')) {
      return NextResponse.json(
        { error: 'Only PDF files are supported' }, 
        { status: 400 }
      );
    }

    // Generate a unique ID for this job
    const jobId = uuidv4();
    
    // Create temp directory if it doesn't exist
    const tmpDir = path.join(os.tmpdir(), 'ebookify');
    await fs.mkdir(tmpDir, { recursive: true });
    
    // Save file to disk
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(tmpDir, `${jobId}.pdf`);
    await fs.writeFile(filePath, buffer);
    
    // Define output path
    const outputPath = path.join(tmpDir, `${jobId}.epub`);
    
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
    
    // Progress updates every 2 seconds
    const progressInterval = setInterval(() => {
      if (job.progress >= 90) {
        clearInterval(progressInterval);
        return;
      }
      updateProgress(job.progress + 10);
    }, 2000);
    
    try {
      // Perform the actual conversion
    //   await convertPdfToEpub(job.filePath, job.outputPath);
      
      // Set job to complete
      job.status = 'complete';
      job.progress = 100;
      job.resultUrl = `/api/conversion/download/${jobId}`;
      
      clearInterval(progressInterval);
    } catch (err) {
      job.status = 'error';
      job.error = `Conversion failed: ${err.message}`;
      clearInterval(progressInterval);
      console.error('PDF conversion error:', err);
    }
    
  } catch (error) {
    job.status = 'error';
    job.error = 'Conversion process failed';
    console.error('Conversion error:', error);
  }
}