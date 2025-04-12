// src/app/api/conversion/download/[jobId]/route.js
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { conversionJobs } from '../../upload/route';
import { cleanupFile } from '@/lib/conversion';

export async function GET(request, { params }) {
  try {
    const { jobId } = params;
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
    const fileBuffer = await fs.readFile(job.outputPath);
    
    // Prepare filename
    const originalName = job.originalFilename || 'document';
    const downloadName = originalName.replace(/\.(pdf|jpg|jpeg|png|tiff|bmp|webp)$/i, '.txt');
    
    // Return file as a response
    const response = new NextResponse(fileBuffer);
    
    // Set headers for file download
    response.headers.set('Content-Disposition', `attachment; filename="${downloadName}"`);
    response.headers.set('Content-Type', 'text/plain; charset=utf-8');
    
    // Schedule cleanup after download (async)
    setTimeout(() => {
      // Only clean up files after download, keep job info
      if (job.filePath) cleanupFile(job.filePath);
      if (job.outputPath) cleanupFile(job.outputPath);
    }, 5000);
    
    return response;
    
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Download failed' }, 
      { status: 500 }
    );
  }
}