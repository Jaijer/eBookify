import { NextResponse } from 'next/server';

// This would be fetched from a database in a real app
const conversionJobs = new Map();

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
    });
    
  } catch (error) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check status' }, 
      { status: 500 }
    );
  }
}