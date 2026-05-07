import express from 'express';
import { processDocument, getStats } from '../controllers/processController.js';

const router = express.Router();

/**
 * Document Processing Endpoints
 *
 * POST /process - Start document ingestion pipeline
 * GET /process/stats - Get vector store statistics
 */

/**
 * POST /process
 * Trigger ingestion pipeline for uploaded document
 *
 * Request body:
 * {
 *   "fileKey": "1715000000_abc123.pdf",
 *   "originalName": "lecture_notes.pdf"
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "message": "Document ingested successfully",
 *   "stats": {
 *     "textLength": 50000,
 *     "chunksCreated": 100,
 *     "embeddingsGenerated": 100,
 *     "documentsAdded": 100,
 *     "totalDocumentsInStore": 200
 *   }
 * }
 */
router.post('/', processDocument);

/**
 * GET /process/stats
 * Get current vector store statistics and metadata
 *
 * Response:
 * {
 *   "success": true,
 *   "vectorStore": {
 *     "totalDocuments": 200,
 *     "totalFiles": 2,
 *     "fileKeys": ["file1.pdf", "file2.pdf"],
 *     "embeddingDimension": 768
 *   }
 * }
 */
router.get('/stats', getStats);

export default router;
