import express from 'express';
import { healthCheck } from '../controllers/healthController.js';

const router = express.Router();

/**
 * Health Check Endpoint
 * GET /
 * Returns server status
 */
router.get('/', healthCheck);

export default router;
