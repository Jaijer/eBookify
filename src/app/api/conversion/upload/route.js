// src/app/api/conversion/upload/route.js - updated version
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { convertPdfToEpub } from '@/lib/conversion';

// In a real app, you'd use a database or service for job tracking
const conversionJobs = new Map();

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
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    
    // Save file to disk
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(tmpDir, `${jobId}.pdf`);
    fs.writeFileSync(filePath, buffer);
    
    // Register the job (in a real app, this would be stored in a database)
    conversionJobs.set(jobId, {
      originalFilename: file.name,
      filePath,
      status: 'uploaded',
      progress: 10,
      createdAt: new Date(),
    });
    
    // Start conversion process (would be a background job in a real app)
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
    // Update progress at intervals to simulate conversion steps
    const updateProgress = (progress) => {
      job.progress = progress;
    };
    
    // Set initial progress
    updateProgress(20);
    
    // Progress updates
    const progressInterval = setInterval(() => {
      if (job.progress >= 90) {
        clearInterval(progressInterval);
        return;
      }
      updateProgress(job.progress + 10);
    }, 2000);
    
    // Output path for the converted file
    const outputDir = path.join(os.tmpdir(), 'ebookify');
    const outputPath = path.join(outputDir, `${jobId}.epub`);
    
    // In a real app, this would be an actual conversion
    // For demo, we'll just wait a bit and create a mock file
    setTimeout(async () => {
      try {
        // In production, call the real conversion function:
        // await convertPdfToEpub(job.filePath, outputPath);
        
        // For demo, just create a mock file
        fs.writeFileSync(outputPath, 'Mock EPUB content');
        
        // Set job to complete
        job.status = 'complete';
        job.progress = 100;
        job.resultUrl = `/api/conversion/download/${jobId}`;
        job.outputPath = outputPath;
        
        clearInterval(progressInterval);
      } catch (err) {
        job.status = 'error';
        job.error = 'Conversion failed';
        clearInterval(progressInterval);
      }
    }, 8000);
    
  } catch (error) {
    job.status = 'error';
    job.error = 'Conversion process failed';
    console.error('Conversion error:', error);
  }
}