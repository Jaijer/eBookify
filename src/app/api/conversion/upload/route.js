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
    console.log("Upload route handler started");
    
    // Parse form data with error handling
    let formData;
    try {
      formData = await request.formData();
      console.log("Form data parsed successfully");
    } catch (formError) {
      console.error("Failed to parse form data:", formError);
      return NextResponse.json(
        { error: 'Failed to parse request data' }, 
        { status: 400 }
      );
    }
    
    const file = formData.get('file');
    
    if (!file) {
      console.log("No file found in request");
      return NextResponse.json(
        { error: 'No file uploaded' }, 
        { status: 400 }
      );
    }

    console.log("File received:", file.name, "Type:", file.type, "Size:", file.size);

    // Validate file type
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/tiff', 'image/bmp', 'image/webp'];
    if (!file.type || !validTypes.includes(file.type)) {
      console.log("Invalid file type:", file.type);
      return NextResponse.json(
        { error: 'File type not supported. Please upload PDF or image files (JPEG, PNG, TIFF, BMP, WEBP)' }, 
        { status: 400 }
      );
    }

    // Generate a unique ID for this job
    const jobId = uuidv4();
    console.log("Generated job ID:", jobId);
    
    // Create temp directory if it doesn't exist
    const tmpDir = path.join(os.tmpdir(), 'textify');
    try {
      await fs.mkdir(tmpDir, { recursive: true });
      console.log("Temp directory created/confirmed:", tmpDir);
    } catch (dirError) {
      console.error("Failed to create temp directory:", dirError);
      return NextResponse.json(
        { error: 'Server configuration error' }, 
        { status: 500 }
      );
    }
    
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
    const filePath = path.join(tmpDir, `${jobId}${fileExtension}`);
    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(filePath, buffer);
      console.log("File saved successfully at:", filePath);
    } catch (fileError) {
      console.error("Failed to save file:", fileError);
      return NextResponse.json(
        { error: 'Failed to save uploaded file' }, 
        { status: 500 }
      );
    }
    
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
    
    console.log("Job registered, starting conversion process");
    
    // Start conversion process asynchronously
    startConversion(jobId).catch(err => {
      console.error("Conversion process failed:", err);
      const job = conversionJobs.get(jobId);
      if (job) {
        job.status = 'error';
        job.error = `Conversion failed: ${err.message}`;
      }
    });
    
    console.log("Returning successful response with jobId:", jobId);
    return NextResponse.json({ jobId });
    
  } catch (error) {
    console.error('Upload route unhandled error:', error);
    return NextResponse.json(
      { error: 'File upload failed: ' + error.message }, 
      { status: 500 }
    );
  }
}

async function startConversion(jobId) {
  console.log("Starting conversion for job:", jobId);
  const job = conversionJobs.get(jobId);
  
  if (!job) {
    console.log("Job not found:", jobId);
    return;
  }
  
  job.status = 'processing';
  
  try {
    // Update progress at intervals to simulate steps
    const updateProgress = (progress) => {
      job.progress = progress;
      console.log(`Job ${jobId} progress updated to ${progress}%`);
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
    
    // Use timeouts instead of intervals for more reliable execution
    let currentUpdateIndex = 0;
    
    const scheduleNextUpdate = () => {
      if (currentUpdateIndex >= progressUpdates.length) return;
      
      const update = progressUpdates[currentUpdateIndex];
      setTimeout(() => {
        updateProgress(update.progress);
        currentUpdateIndex++;
        scheduleNextUpdate();
      }, update.delay);
    };
    
    scheduleNextUpdate();
    
    try {
      console.log("Starting actual conversion process for file:", job.filePath);
      // Perform the actual conversion
      await convertToText(job.filePath, job.outputPath);
      console.log("Conversion completed successfully");

      // Set job to complete
      job.status = 'complete';
      job.progress = 100;
      job.resultUrl = `/api/conversion/download/${jobId}`;
      
    } catch (conversionError) {
      console.error('Conversion process error:', conversionError);
      job.status = 'error';
      job.error = `Conversion failed: ${conversionError.message}`;
    }
    
  } catch (error) {
    console.error('Conversion wrapper error:', error);
    job.status = 'error';
    job.error = 'Conversion process failed';
  }
}