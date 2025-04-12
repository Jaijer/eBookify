// src/app/api/conversion/download/[jobId]/route.js
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { conversionJobs } from '../../upload/route';
import { cleanupFile } from '@/lib/conversion';

export async function GET(request, { params }) {
  try {
    // Properly destructure params
    const jobId = params?.jobId;
    
    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' }, 
        { status: 400 }
      );
    }

    const job = conversionJobs.get(jobId);
    
    if (!job || job.status !== 'complete') {
      return NextResponse.json(
        { error: 'Download not available' }, 
        { status: 404 }
      );
    }
    
    // Check if the file exists
    try {
      await fs.access(job.outputPath);
    } catch (error) {
      return NextResponse.json(
        { error: 'File not found' }, 
        { status: 404 }
      );
    }
    
    // Read the file content
    const fileContent = await fs.readFile(job.outputPath, 'utf-8');
    
    // Prepare filename - sanitize and ensure ASCII-only
    const originalName = job.originalFilename || 'document';
    const baseName = originalName.replace(/\.[^/.]+$/, ''); // Remove extension
    const safeName = baseName.replace(/[^\x00-\x7F]/g, ''); // Remove non-ASCII chars
    const downloadName = `${safeName}.txt` || 'converted.txt';
    
    // Create response with file content
    const response = new NextResponse(fileContent);
    
    // Set headers for file download
    response.headers.set('Content-Disposition', `attachment; filename="${encodeURIComponent(downloadName)}"`);
    response.headers.set('Content-Type', 'text/plain; charset=utf-8');
    
    // Schedule cleanup after download (async)
    setTimeout(async () => {
      try {
        if (job.filePath) await cleanupFile(job.filePath);
        if (job.outputPath) await cleanupFile(job.outputPath);
      } catch (cleanupError) {
        console.error('Cleanup failed:', cleanupError);
      }
    }, 5000);
    
    return response;
    
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Download failed: ' + error.message }, 
      { status: 500 }
    );
  }
}