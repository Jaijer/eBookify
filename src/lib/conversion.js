// src/lib/conversion.js
import { promises as fs } from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import fetch from 'node-fetch';
import FormData from 'form-data';

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
 * Convert PDF to text using pdf-parse
 */
export async function convertPdfToText(pdfPath, outputPath, options = {}) {
  try {
    // Read the file data
    const dataBuffer = await fs.readFile(pdfPath);
    
    // Extract text from PDF
    const data = await pdfParse(dataBuffer);
    
    // Write the extracted text to file
    await fs.writeFile(outputPath, data.text);
    return outputPath;
  } catch (error) {
    console.error('PDF conversion error:', error);
    
    // Write a fallback message if conversion fails
    const fallbackMessage = `PDF text extraction failed. This might be due to security settings in the PDF or text stored as images.`;
    await fs.writeFile(outputPath, fallbackMessage);
    
    return outputPath;
  }
}

/**
 * Convert image to text using OCR.space API
 */
async function convertImageToText(imagePath, outputPath, options = {}) {
  try {
    // Get the API key from environment variables
    const apiKey = process.env.OCR_SPACE_API_KEY || options.apiKey;
    
    if (!apiKey) {
      // Fallback message if no API key is available
      await fs.writeFile(outputPath, 'Image text extraction requires an OCR service API key. Please configure OCR_SPACE_API_KEY environment variable.');
      return outputPath;
    }
    
    // Read the image file
    const imageBuffer = await fs.readFile(imagePath);
    
    // Create a multipart form-data object
    const formData = new FormData();
    formData.append('apikey', apiKey);
    formData.append('language', 'eng');
    formData.append('OCREngine', '2');
    formData.append('file', imageBuffer, {
      filename: path.basename(imagePath),
      contentType: getContentType(path.extname(imagePath))
    });
    
    console.log(`Sending OCR request for file: ${path.basename(imagePath)}`);
    
    // Call the OCR.space API
    const response = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    console.log('OCR API response status:', result.OCRExitCode);
    
    if (result.OCRExitCode !== 1 || !result.ParsedResults || result.ParsedResults.length === 0) {
      throw new Error('OCR processing failed: ' + (result.ErrorMessage || JSON.stringify(result)));
    }
    
    // Write the extracted text to the output file
    const extractedText = result.ParsedResults[0].ParsedText || 'No text detected in image.';
    await fs.writeFile(outputPath, extractedText);
    
    return outputPath;
  } catch (error) {
    console.error('Image OCR error:', error);
    
    // Write a placeholder message
    await fs.writeFile(outputPath, `Image text extraction failed: ${error.message}. Please try a different image or a PDF file.`);
    return outputPath;
  }
}

/**
 * Get the content type based on file extension
 */
function getContentType(extension) {
  const contentTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.tiff': 'image/tiff',
    '.bmp': 'image/bmp',
    '.webp': 'image/webp'
  };
  
  return contentTypes[extension.toLowerCase()] || 'application/octet-stream';
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