// src/lib/conversion.js
import { promises as fs } from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import FormData from 'form-data';

/**
 * Convert a PDF or image file to text
 */
export async function convertToText(inputPath, outputPath, options = {}) {
  try {
    // Create output directory if it doesn't exist
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
export async function convertPdfToText(pdfPath, outputPath) {
  try {
    // Verify the input file exists
    try {
      await fs.access(pdfPath);
    } catch (err) {
      throw new Error(`Input PDF not found: ${pdfPath}`);
    }

    // Read the PDF file
    const dataBuffer = await fs.readFile(pdfPath);

    // Use a clean require instead of import to avoid test file issues
    const pdfParse = (await import('pdf-parse/lib/pdf-parse.js')).default;
    
    // Parse with options to skip test file checks
    const data = await pdfParse(dataBuffer, {
      pkgPath: null, // Disable package path checks
      max: 0 // Disable length checks
    });

    // Save the extracted text
    await fs.writeFile(outputPath, data.text);
    return outputPath;
  } catch (error) {
    console.error('PDF conversion error:', error);
    
    // Provide a more helpful error message
    let errorMessage = `PDF text extraction failed. `;
    if (error.message.includes('ENOENT')) {
      errorMessage += `The PDF parser encountered an internal file access error.`;
    } else {
      errorMessage += `Reason: ${error.message}`;
    }
    
    await fs.writeFile(outputPath, errorMessage);
    return outputPath;
  }
}

/**
 * Convert image to text using OCR.space API
 */
async function convertImageToText(imagePath, outputPath, options = {}) {
  try {
    // Check if the file exists
    try {
      await fs.access(imagePath);
    } catch (error) {
      console.error(`File does not exist at path: ${imagePath}`);
      throw new Error(`Image file not found: ${error.message}`);
    }
    
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
      // Check if file exists before attempting to delete
      try {
        await fs.access(filePath);
        await fs.unlink(filePath);
        console.log(`Successfully cleaned up file: ${filePath}`);
      } catch (err) {
        // File doesn't exist, no need to delete
        console.log(`File does not exist, skipping cleanup: ${filePath}`);
      }
    }
  } catch (error) {
    console.error('Cleanup error:', error);
  }
}