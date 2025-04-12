// src/lib/conversion.js
import { exec } from 'child_process';
import { promisify } from 'util';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

const execPromise = promisify(exec);

// Tesseract.js dynamic import to avoid SSR issues
let tesseract;
if (typeof window === 'undefined') {
  tesseract = await import('tesseract.js');
}

/**
 * Convert a PDF or image file to text using OCR
 */
export async function convertToText(inputPath, outputPath, options = {}) {
  try {
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    const ext = path.extname(inputPath).toLowerCase();

    if (ext === '.pdf') {
      return await convertPdfToText(inputPath, outputPath, options);
    } else {
      return await convertImageToText(inputPath, outputPath, options);
    }
  } catch (error) {
    console.error('Conversion error:', error);
    throw new Error(`Failed to convert to text: ${error.message}`);
  }
}

/**
 * Convert PDF to text using either Tesseract.js or native Tesseract
 */
export async function convertPdfToText(pdfPath, outputPath, options = {}) {
  try {
    // First try Tesseract.js
    if (tesseract) {
      return await convertWithTesseractJs(pdfPath, outputPath);
    }
    
    // Fallback to native Tesseract
    return await convertWithNativeTesseract(pdfPath, outputPath);
  } catch (error) {
    throw new Error(`PDF conversion failed: ${error.message}`);
  }
}

/**
 * Convert using Tesseract.js (pure JavaScript)
 */
async function convertWithTesseractJs(imagePath, outputPath) {
  try {
    const worker = await tesseract.createWorker({
      workerPath: path.join(process.cwd(), 'node_modules', 'tesseract.js', 'dist', 'worker.min.js'),
      langPath: path.join(process.cwd(), 'node_modules', 'tesseract.js-core', 'tesseract-core.wasm.js'),
      corePath: path.join(process.cwd(), 'node_modules', 'tesseract.js-core', 'tesseract-core.wasm.js'),
      logger: m => console.log(m)
    });

    await worker.loadLanguage('eng+osd');
    await worker.initialize('eng+osd');
    await worker.setParameters({ tessedit_pageseg_mode: '1' });

    const { data } = await worker.recognize(imagePath);
    await fs.writeFile(outputPath, data.text);
    await worker.terminate();
    return outputPath;
  } catch (error) {
    console.error('Tesseract.js error:', error);
    throw error;
  }
}

/**
 * Convert using native Tesseract CLI
 */
async function convertWithNativeTesseract(imagePath, outputPath) {
  try {
    const outputBase = outputPath.replace('.txt', '');
    const { stderr } = await execPromise(
      `tesseract "${imagePath}" "${outputBase}" -l eng+osd --psm 1 txt`
    );

    if (stderr?.includes('Error')) {
      throw new Error(stderr);
    }

    const generatedPath = `${outputBase}.txt`;
    if (generatedPath !== outputPath) {
      await fs.rename(generatedPath, outputPath);
    }

    return outputPath;
  } catch (error) {
    console.error('Native Tesseract error:', error);
    throw new Error(`Native Tesseract not available: ${error.message}`);
  }
}

/**
 * Convert image to text
 */
async function convertImageToText(imagePath, outputPath, options = {}) {
  try {
    if (tesseract) {
      return await convertWithTesseractJs(imagePath, outputPath);
    }
    return await convertWithNativeTesseract(imagePath, outputPath);
  } catch (error) {
    throw new Error(`Image conversion failed: ${error.message}`);
  }
}

/**
 * Clean up temporary files
 */
export async function cleanupFile(filePath) {
  try {
    await fs.unlink(filePath).catch(() => {});
  } catch (error) {
    console.error('Cleanup error:', error);
  }
}