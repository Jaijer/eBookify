// src/lib/conversion.js
import { promises as fs } from 'fs';
import path from 'path';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import { createCanvas } from 'canvas';

// Set the PDF.js worker source
pdfjsLib.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.js';

/**
 * Convert a PDF or image file to text
 */
export async function convertToText(inputPath, outputPath, options = {}) {
  try {
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    const ext = path.extname(inputPath).toLowerCase();

    if (ext === '.pdf') {
      return await convertPdfToText(inputPath, outputPath, options);
    } else if (['.jpg', '.jpeg', '.png', '.tiff', '.bmp', '.webp'].includes(ext)) {
      return await convertImageToText(inputPath, outputPath, options);
    } else {
      throw new Error('Unsupported file format');
    }
  } catch (error) {
    console.error('Conversion error:', error);
    throw new Error(`Failed to convert to text: ${error.message}`);
  }
}

/**
 * Convert PDF to text using pdf.js
 */
export async function convertPdfToText(pdfPath, outputPath, options = {}) {
  try {
    // Read the file data
    const data = await fs.readFile(pdfPath);
    const buffer = new Uint8Array(data);
    
    // Load the PDF document
    const pdfDocument = await pdfjsLib.getDocument({ data: buffer }).promise;
    let textContent = '';
    
    // Extract text from each page
    for (let i = 1; i <= pdfDocument.numPages; i++) {
      const page = await pdfDocument.getPage(i);
      const content = await page.getTextContent();
      
      // Concatenate the text items
      const pageText = content.items.map(item => item.str).join(' ');
      textContent += pageText + '\n\n';
    }
    
    // Write the text to the output file
    await fs.writeFile(outputPath, textContent);
    return outputPath;
  } catch (error) {
    console.error('PDF conversion error:', error);
    throw new Error(`PDF conversion failed: ${error.message}`);
  }
}

/**
 * Convert image to text
 * This uses pdf.js with canvas to extract any text that might be in the image
 * For better OCR results, consider integrating with a service like OCR.space API
 */
async function convertImageToText(imagePath, outputPath, options = {}) {
  try {
    // For images, we'll use a third-party OCR API service
    console.log("MY API KEY:", process.env.OCR_SPACE_API_KEY)
    const apiKey = process.env.OCR_SPACE_API_KEY || options.apiKey;
    
    if (!apiKey) {
      // Fallback to basic text extraction
      await fs.writeFile(outputPath, 'Image text extraction requires an OCR service API key. Please configure OCR_SPACE_API_KEY environment variable.');
      return outputPath;
    }
    
    // Read the image file
    const imageBuffer = await fs.readFile(imagePath);
    
    // Create a multipart form data
    const formData = new FormData();
    formData.append('apikey', apiKey);
    formData.append('language', 'eng');
    formData.append('OCREngine', '2');
    formData.append('file', new Blob([imageBuffer]), path.basename(imagePath));
    
    // Call the OCR.space API
    const response = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    
    if (!result.ParsedResults || result.ParsedResults.length === 0) {
      throw new Error('OCR processing failed: ' + (result.ErrorMessage || 'Unknown error'));
    }
    
    // Write the extracted text to the output file
    const extractedText = result.ParsedResults[0].ParsedText;
    await fs.writeFile(outputPath, extractedText);
    
    return outputPath;
  } catch (error) {
    console.error('Image conversion error:', error);
    
    // Write a placeholder message
    await fs.writeFile(outputPath, 'Image text extraction failed. Please try a different image or a PDF file.');
    return outputPath;
  }
}

/**
 * Clean up temporary files
 */
export async function cleanupFile(filePath) {
  try {
    if (filePath) {
      await fs.unlink(filePath).catch(() => {});
    }
  } catch (error) {
    console.error('Cleanup error:', error);
  }
}