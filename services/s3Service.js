import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import env from '../config/env.js';

/**
 * S3 Service
 * Handles all S3 operations for file uploads
 */

// Initialize S3 client with AWS credentials
const s3Client = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY,
    secretAccessKey: env.AWS_SECRET_KEY,
  },
});

/**
 * Upload file to S3
 *
 * @param {string} fileKey - Unique identifier for the file in S3
 * @param {Buffer} fileBuffer - File content as buffer
 * @param {string} mimeType - File MIME type
 * @returns {Promise<Object>} - S3 upload response
 * @throws {Error} - If upload fails
 */
export const uploadFileToS3 = async (fileKey, fileBuffer, mimeType) => {
  try {
    const params = {
      Bucket: env.S3_BUCKET_NAME,
      Key: fileKey,
      Body: fileBuffer,
      ContentType: mimeType,
    };

    const command = new PutObjectCommand(params);
    const uploadResponse = await s3Client.send(command);

    // Generate S3 file URL
    const fileUrl = `https://${env.S3_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${fileKey}`;

    return {
      success: true,
      fileUrl,
      fileKey,
      etag: uploadResponse.ETag,
    };
  } catch (error) {
    console.error('S3 Upload Error:', error.message);
    throw new Error(`Failed to upload file to S3: ${error.message}`);
  }
};

export default {
  uploadFileToS3,
};
