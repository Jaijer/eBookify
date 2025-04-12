// src/app/api/conversion/cleanup/route.js
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { conversionJobs } from '../conversion/upload/route';
import { cleanupFile } from '@/lib/conversion';

// This route could be called by a scheduled task or explicitly
export async function POST(request) {
  try {
    const tmpDir = path.join(os.tmpdir(), 'ebookify');
    let filesDeleted = 0;
    
    // Remove old files
    try {
      const files = await fs.readdir(tmpDir);
      
      for (const file of files) {
        try {
          // Consider files older than 1 hour as stale
          const filePath = path.join(tmpDir, file);
          const stats = await fs.stat(filePath);
          const fileAge = Date.now() - stats.mtime.getTime();
          
          // Delete files older than 1 hour
          if (fileAge > 3600000) {
            await fs.unlink(filePath);
            filesDeleted++;
          }
        } catch (err) {
          console.error(`Failed to process file ${file}:`, err);
        }
      }
    } catch (err) {
      console.error('Failed to read temp directory:', err);
    }
    
    // Cleanup expired jobs
    const now = Date.now();
    let jobsDeleted = 0;
    
    for (const [jobId, job] of conversionJobs.entries()) {
      if (job.expiresAt && job.expiresAt < now) {
        // Clean up files
        if (job.filePath) await cleanupFile(job.filePath);
        if (job.outputPath) await cleanupFile(job.outputPath);
        // Delete job
        conversionJobs.delete(jobId);
        jobsDeleted++;
      }
    }
    
    return NextResponse.json({
      success: true,
      filesDeleted,
      jobsDeleted,
      jobsRemaining: conversionJobs.size
    });
    
  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json(
      { error: 'Cleanup failed' }, 
      { status: 500 }
    );
  }
}