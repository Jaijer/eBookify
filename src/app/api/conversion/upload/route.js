// src/app/api/conversion/upload/route.js
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { convertToText } from '@/lib/conversion';
import jobStore from '@/lib/jobStore'; // Use the new job store

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
    const tmpDir = path.join(os.tmpdir(), 'ebookify');
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
    
    // Register the job using our persistent job store
    await jobStore.set(jobId, {
      originalFilename: file.name,
      filePath,
      outputPath,
      status: 'uploaded',
      progress: 10,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 3600000).toISOString() // 1 hour TTL
    });
    
    console.log("Job registered in persistent store, starting conversion process");
    
    // Start conversion process asynchronously
    startConversion(jobId).catch(err => {
      console.error("Conversion process failed:", err);
      jobStore.update(jobId, {
        status: 'error',
        error: `Conversion failed: ${err.message}`
      }).catch(storeErr => {
        console.error("Failed to update job status:", storeErr);
      });
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
  
  // Get the job from our persistent store
  const job = await jobStore.get(jobId);
  
  if (!job) {
    console.log("Job not found:", jobId);
    return;
  }
  
  // Update job status
  await jobStore.update(jobId, {
    status: 'processing'
  });
  
  let shouldContinue = true;

  try {
    const updateProgress = async (progress) => {
      if (!shouldContinue) return;
      await jobStore.update(jobId, { progress });
      console.log(`Job ${jobId} progress updated to ${progress}%`);
    };
    
    await updateProgress(20);
    
    const progressUpdates = [
      { progress: 30, delay: 500 },
      { progress: 50, delay: 1000 },
      { progress: 70, delay: 1000 },
      { progress: 90, delay: 500 }
    ];
    
    // Schedule progress updates
    for (const update of progressUpdates) {
      if (!shouldContinue) break;
      
      await new Promise(resolve => setTimeout(resolve, update.delay));
      await updateProgress(update.progress);
    }
    
    try {
      console.log("Starting actual conversion process for file:", job.filePath);
      await convertToText(job.filePath, job.outputPath);
      console.log("Conversion completed successfully");

      // Update job with completion status
      await jobStore.update(jobId, {
        status: 'complete',
        progress: 100,
        resultUrl: `/api/conversion/download/${jobId}`
      });
      
    } catch (conversionError) {
      shouldContinue = false;
      console.error('Conversion process error:', conversionError);
      
      await jobStore.update(jobId, {
        status: 'error',
        progress: 0,
        error: `Conversion failed: ${conversionError.message}`
      });
    }
    
  } catch (error) {
    shouldContinue = false;
    console.error('Conversion wrapper error:', error);
    
    await jobStore.update(jobId, {
      status: 'error',
      error: 'Conversion process failed'
    });
  }
}