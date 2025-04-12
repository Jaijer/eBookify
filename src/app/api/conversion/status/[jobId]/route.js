// src/app/api/conversion/status/[jobId]/route.js
import { NextResponse } from 'next/server';
import { conversionJobs } from '../../upload/route';

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
    
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      status: job.status,
      progress: job.progress,
      resultUrl: job.resultUrl,
      error: job.error,
      originalFilename: job.originalFilename
    });
    
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: 'Status check failed' }, 
      { status: 500 }
    );
  }
}