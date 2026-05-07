import { uploadFileToS3 } from '../services/s3Service.js';

/**
 * Upload Controller
 * Handles file upload logic and validation
 */

const ALLOWED_MIME_TYPES = ['application/pdf'];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

/**
 * Generate unique filename to avoid S3 collisions
 *
 * Format: timestamp_randomId_originalname
 *
 * @param {string} originalFilename - Original name of uploaded file
 * @returns {string} - Unique filename
 */
const generateUniqueFilename = (originalFilename) => {
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 8);
  const fileExtension = originalFilename.split('.').pop();

  return `${timestamp}_${randomId}.${fileExtension}`;
};

/**
 * Handle PDF file upload
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const uploadFile = async (req, res, next) => {
  try {
    // Check if file was provided
    if (!req.file) {
      return res.status(400).json({
        error: 'Missing File',
        message: 'No file was provided. Please upload a PDF file.',
      });
    }

    const { file } = req;

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return res.status(400).json({
        error: 'File Too Large',
        message: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / (1024 * 1024)}MB.`,
      });
    }

    // Validate file type (MIME type check)
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return res.status(400).json({
        error: 'Invalid File Type',
        message: 'Only PDF files are allowed. Please upload a PDF file.',
      });
    }

    // Generate unique filename for S3
    const uniqueFilename = generateUniqueFilename(file.originalname);

    // Upload file to S3
    const s3Response = await uploadFileToS3(
      uniqueFilename,
      file.buffer,
      file.mimetype
    );

    // Return success response
    return res.status(200).json({
      message: 'File uploaded successfully',
      fileUrl: s3Response.fileUrl,
      fileKey: s3Response.fileKey,
      originalName: file.originalname,
      fileSize: file.size,
      uploadedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Upload Error:', error.message);

    // Pass to global error handler
    return res.status(500).json({
      error: 'Upload Failed',
      message: error.message,
    });
  }
};

export default {
  uploadFile,
};
