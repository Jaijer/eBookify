import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// This would be fetched from a database in a real app
const conversionJobs = new Map();

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
    
    // In a real app, you'd check if the file exists
    if (!job.outputPath || !fs.existsSync(job.outputPath)) {
      return NextResponse.json(
        { error: 'File not found' }, 
        { status: 404 }
      );
    }
    
    // Read the file content
    const fileBuffer = fs.readFileSync(job.outputPath);
    
    // Prepare filename - replace .pdf with .epub
    const originalName = job.originalFilename || 'download.pdf';
    const downloadName = originalName.replace(/\.pdf$/i, '.epub');
    
    // Return file as a response
    const response = new NextResponse(fileBuffer);
    
    // Set headers for file download
    response.headers.set('Content-Disposition', `attachment; filename="${downloadName}"`);
    response.headers.set('Content-Type', 'application/epub+zip');
    
    return response;
    
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Download failed' }, 
      { status: 500 }
    );
  }
}