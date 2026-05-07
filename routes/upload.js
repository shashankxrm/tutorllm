import express from 'express';
import multer from 'multer';
import { uploadFile } from '../controllers/uploadController.js';

const router = express.Router();

/**
 * Configure multer for file upload
 * Uses memory storage - files loaded into memory before S3 upload
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

/**
 * File Upload Endpoint
 * POST /upload
 *
 * Accepts:
 *   - Field name: "file"
 *   - File type: PDF only
 *   - Max size: 50MB
 *
 * Returns:
 *   - fileUrl: S3 public URL
 *   - fileKey: S3 object key
 *   - originalName: Original filename
 *   - fileSize: File size in bytes
 *   - uploadedAt: ISO timestamp
 */
router.post('/', upload.single('file'), uploadFile);

export default router;
