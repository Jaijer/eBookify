// src/lib/conversion.js
import { exec } from 'child_process';
import { promisify } from 'util';
import { promises as fs } from 'fs';
import path from 'path';

const execPromise = promisify(exec);

/**
 * Convert a PDF file to EPUB format using Calibre's ebook-convert
 * @param {string} pdfPath - Path to the PDF file
 * @param {string} outputPath - Path where the EPUB file should be saved
 * @param {object} options - Conversion options
 * @returns {Promise<string>} - Path to the generated EPUB file
 */
export async function convertPdfToEpub(pdfPath, outputPath, options = {}) {
  try {
    // Create directory if it doesn't exist
    const outputDir = path.dirname(outputPath);
    await fs.mkdir(outputDir, { recursive: true });

    // Build the Calibre command
    const command = `ebook-convert "${pdfPath}" "${outputPath}" --enable-heuristics --chapter-mark=pagebreak --page-breaks-before=/ --max-toc-links=0 --pretty-print`;
    
    // Execute the command
    const { stdout, stderr } = await execPromise(command);
    
    // Check if the file was created
    try {
      await fs.access(outputPath);
      return outputPath;
    } catch (error) {
      throw new Error(`EPUB file was not created: ${stderr}`);
    }
  } catch (error) {
    console.error('Conversion error:', error);
    throw new Error(`Failed to convert PDF to EPUB: ${error.message}`);
  }
}

/**
 * Clean up temporary files
 * @param {string} filePath - Path to the file to delete
 */
export async function cleanupFile(filePath) {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.error(`Failed to delete file ${filePath}:`, error);
  }
}