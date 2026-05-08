/**
 * Query Routes
 * RAG retrieval and response generation endpoints
 */

import express from 'express';
import { queryDocument, getQueryStats } from '../controllers/queryController.js';

const router = express.Router();

/**
 * POST /query
 * Process user query with RAG pipeline (retrieve + generate)
 *
 * Request:
 * {
 *   "query": "user question",
 *   "mode": "summary|explain|questions" (optional),
 *   "topK": number (optional)
 * }
 *
 * Response:
 * {
 *   "success": true,
 *   "answer": "generated response",
 *   "sources": [{ chunkIndex, preview, fileKey, similarity }],
 *   "stats": { ... }
 * }
 */
router.post('/', queryDocument);

/**
 * GET /query/stats
 * Get vector store statistics
 *
 * Response:
 * {
 *   "success": true,
 *   "vectorStore": { totalDocuments, totalFiles, embeddingDimension, fileKeys }
 * }
 */
router.get('/stats', getQueryStats);

export default router;
