import express from 'express';
import { healthCheck } from '../controllers/healthController.js';
import uploadRoutes from './upload.js';
import processRoutes from './process.js';

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

/**
 * Document Processing Routes
 * POST /process - Trigger ingestion pipeline
 * GET /process/stats - Get vector store statistics
 */
router.use('/process', processRoutes);

export default router;
