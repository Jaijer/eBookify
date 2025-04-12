// src/app/api/conversion/download/[jobId]/route.js
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import jobStore from '@/lib/jobStore'; // Use the new job store
import { cleanupFile } from '@/lib/conversion';

export async function GET(request, { params }) {
  try {
    console.log("Download route called with params:", params);
    
    // Properly destructure params
    const jobId = params?.jobId;
    
    if (!jobId) {
      console.log("No job ID provided");
      return NextResponse.json(
        { error: 'Job ID is required' }, 
        { status: 400 }
      );
    }

    // Get job from our persistent store
    const job = await jobStore.get(jobId);
    console.log("Job retrieval result:", job ? `Found job with status: ${job.status}` : "Job not found");
    
    if (!job || job.status !== 'complete') {
      console.log("Job not available for download:", job ? `Status: ${job.status}` : "Not found");
      return NextResponse.json(
        { error: 'Download not available' }, 
        { status: 404 }
      );
    }
    
    // Check if the file exists
    try {
      await fs.access(job.outputPath);
      console.log("Output file exists at:", job.outputPath);
    } catch (error) {
      console.error("File access error:", error);
      return NextResponse.json(
        { error: 'File not found' }, 
        { status: 404 }
      );
    }
    
    // Read the file content
    console.log("Reading file content from:", job.outputPath);
    const fileContent = await fs.readFile(job.outputPath, 'utf-8');
    console.log("File content read successfully, length:", fileContent.length);
    
    // Prepare filename - sanitize and ensure ASCII-only
    const originalName = job.originalFilename || 'document';
    const baseName = originalName.replace(/\.[^/.]+$/, ''); // Remove extension
    const safeName = baseName.replace(/[^\x00-\x7F]/g, ''); // Remove non-ASCII chars
    const downloadName = `${safeName}.txt` || 'converted.txt';
    
    // Check if this is a view request (from the e-reader) or a download request
    const url = new URL(request.url);
    const isViewRequest = url.searchParams.get('view') === 'true';
    console.log("Request type:", isViewRequest ? "View request" : "Download request");
    
    // Create response with file content
    const response = new NextResponse(fileContent);
    
    // Set headers based on the request type
    if (isViewRequest) {
      // For viewing in the e-reader, just set the content type
      response.headers.set('Content-Type', 'text/plain; charset=utf-8');
    } else {
      // For downloading the file, add the Content-Disposition header
      response.headers.set('Content-Disposition', `attachment; filename="${encodeURIComponent(downloadName)}"`);
      response.headers.set('Content-Type', 'text/plain; charset=utf-8');
    }
    
    console.log("Returning response with proper headers");
    
    // Only schedule cleanup for download requests, not for view requests
    if (!isViewRequest) {
      setTimeout(async () => {
        try {
          if (job.filePath) await cleanupFile(job.filePath);
          if (job.outputPath) await cleanupFile(job.outputPath);
          await jobStore.delete(jobId);
        } catch (cleanupError) {
          console.error('Cleanup failed:', cleanupError);
        }
      }, 5000);
    }
    
    return response;
    
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Download failed: ' + error.message }, 
      { status: 500 }
    );
  }
}