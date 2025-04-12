// src/app/api/conversion/status/[jobId]/route.js
import { NextResponse } from 'next/server';
import { conversionJobs } from '../../upload/route';

export async function GET(request, { params }) {
  try {
    const { jobId } = params;
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
      error: job.error
    });
    
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: 'Status check failed' }, 
      { status: 500 }
    );
  }
}