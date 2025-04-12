// src/lib/jobStore.js
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

// Create a more persistent job store that writes to disk
class JobStore {
  constructor() {
    this.jobs = new Map();
    this.storePath = path.join(os.tmpdir(), 'ebookify', 'jobs.json');
    this.initialized = false;
    this.initPromise = this.init();
  }
  
  // Initialize the store by loading from disk
  async init() {
    try {
      await fs.mkdir(path.join(os.tmpdir(), 'ebookify'), { recursive: true });
      
      try {
        const data = await fs.readFile(this.storePath, 'utf8');
        const parsedData = JSON.parse(data);
        
        // Restore the Map from the parsed data
        Object.entries(parsedData).forEach(([jobId, jobData]) => {
          this.jobs.set(jobId, jobData);
        });
        
        console.log(`Loaded ${this.jobs.size} jobs from storage`);
      } catch (readError) {
        // It's okay if the file doesn't exist yet
        if (readError.code !== 'ENOENT') {
          console.error('Error reading jobs file:', readError);
        }
      }
      
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize job store:', error);
      throw error;
    }
  }
  
  // Save the current state to disk
  async save() {
    if (!this.initialized) {
      await this.initPromise;
    }
    
    try {
      // Convert Map to a plain object for JSON serialization
      const jobsObject = {};
      for (const [jobId, jobData] of this.jobs.entries()) {
        jobsObject[jobId] = jobData;
      }
      
      await fs.writeFile(this.storePath, JSON.stringify(jobsObject, null, 2));
    } catch (error) {
      console.error('Failed to save jobs:', error);
    }
  }
  
  // Get a job by ID
  async get(jobId) {
    if (!this.initialized) {
      await this.initPromise;
    }
    
    return this.jobs.get(jobId);
  }
  
  // Set a job
  async set(jobId, jobData) {
    if (!this.initialized) {
      await this.initPromise;
    }
    
    this.jobs.set(jobId, jobData);
    await this.save();
    return jobData;
  }
  
  // Update a job
  async update(jobId, updates) {
    if (!this.initialized) {
      await this.initPromise;
    }
    
    const job = this.jobs.get(jobId);
    if (!job) return null;
    
    const updatedJob = { ...job, ...updates };
    this.jobs.set(jobId, updatedJob);
    await this.save();
    return updatedJob;
  }
  
  // Delete a job
  async delete(jobId) {
    if (!this.initialized) {
      await this.initPromise;
    }
    
    const result = this.jobs.delete(jobId);
    await this.save();
    return result;
  }
  
  // Get all jobs
  async getAll() {
    if (!this.initialized) {
      await this.initPromise;
    }
    
    return Array.from(this.jobs.entries()).map(([id, job]) => ({ id, ...job }));
  }
  
  // Clean up expired jobs
  async cleanup(maxAgeMs = 3600000) { // Default: 1 hour
    if (!this.initialized) {
      await this.initPromise;
    }
    
    const now = Date.now();
    const expiredIds = [];
    
    for (const [jobId, job] of this.jobs.entries()) {
      if (job.createdAt && (now - new Date(job.createdAt).getTime() > maxAgeMs)) {
        expiredIds.push(jobId);
      }
    }
    
    // Delete expired jobs
    for (const jobId of expiredIds) {
      this.jobs.delete(jobId);
    }
    
    if (expiredIds.length > 0) {
      await this.save();
    }
    
    return expiredIds.length;
  }
}

// Create and export a singleton instance
const jobStore = new JobStore();
export default jobStore;