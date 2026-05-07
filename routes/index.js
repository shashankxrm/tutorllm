import express from 'express';
import { healthCheck } from '../controllers/healthController.js';
import uploadRoutes from './upload.js';

const router = express.Router();

/**
 * Health Check Endpoint
 * GET /
 * Returns server status
 */
router.get('/', healthCheck);

/**
 * File Upload Routes
 * POST /upload - Upload PDF file to S3
 */
router.use('/upload', uploadRoutes);

export default router;
