import { PDFDocument } from 'pdf-lib';

export interface PDFValidationResult {
  isValid: boolean;
  error?: string;
  fileSize: number;
  pageCount?: number;
}

export async function validatePDF(file: File): Promise<PDFValidationResult> {
  try {
    // Basic file type check
    if (!file.type || !file.type.includes('pdf')) {
      return {
        isValid: false,
        error: 'Not a PDF file',
        fileSize: file.size
      };
    }

    // Read the file as ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    try {
      // Try to load the PDF document
      const pdfDoc = await PDFDocument.load(arrayBuffer, {
        updateMetadata: false
      });

      // Get page count
      const pageCount = pdfDoc.getPageCount();

      return {
        isValid: true,
        fileSize: file.size,
        pageCount
      };
    } catch (e) {
      return {
        isValid: false,
        error: 'Corrupted PDF file',
        fileSize: file.size
      };
    }
  } catch (e) {
    return {
      isValid: false,
      error: `Error validating PDF: ${e.message}`,
      fileSize: file.size
    };
  }
}

export async function validatePDFPath(filePath: string): Promise<PDFValidationResult> {
  try {
    // Use node's fs module to read the file
    const fs = require('fs');
    const fileBuffer = fs.readFileSync(filePath);
    const fileSize = fs.statSync(filePath).size;

    try {
      // Try to load the PDF document
      const pdfDoc = await PDFDocument.load(fileBuffer, {
        updateMetadata: false
      });

      // Get page count
      const pageCount = pdfDoc.getPageCount();

      return {
        isValid: true,
        fileSize,
        pageCount
      };
    } catch (e) {
      return {
        isValid: false,
        error: 'Corrupted PDF file',
        fileSize
      };
    }
  } catch (e) {
    return {
      isValid: false,
      error: `Error validating PDF: ${e.message}`,
      fileSize: 0
    };
  }
}
