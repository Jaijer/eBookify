import { NextResponse } from 'next/server';
import { conversionJobs } from '../../upload/route';

// Clean up expired jobs
function cleanupExpiredJobs() {
  const now = Date.now();
  for (const [jobId, job] of conversionJobs.entries()) {
    if (job.expiresAt && job.expiresAt < now) {
      conversionJobs.delete(jobId);
    }
  }
}

export async function GET(request, { params }) {
  try {
    // Periodically clean up expired jobs
    cleanupExpiredJobs();
    
    // Destructure params asynchronously
    const { jobId } = await params; // <-- Add 'await' here
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
      { error: 'Failed to check status' }, 
      { status: 500 }
    );
  }
}