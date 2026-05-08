/**
 * Query Controller
 * Handles query requests and orchestrates response using query service
 */

import { processQuery, getQueryStats as getVectorStoreStats } from '../services/queryService.js';

/**
 * Handle POST /query - Process user query with RAG
 *
 * Request body:
 * {
 *   "query": "user question string",
 *   "mode": "summary|explain|questions" (optional, default: "summary"),
 *   "topK": number (optional, default: 3)
 * }
 *
 * Response:
 * {
 *   "success": boolean,
 *   "answer": "generated answer string",
 *   "sources": [
 *     {
 *       "chunkIndex": number,
 *       "preview": "first 100 chars of chunk",
 *       "fileKey": "S3 file key",
 *       "similarity": number (0-1)
 *     }
 *   ],
 *   "stats": { ... }
 * }
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
export const queryDocument = async (req, res, next) => {
  try {
    console.log('\n--- Query Request Received ---');

    const { query, mode = 'summary', topK = 3 } = req.body;

    // Validation
    if (!query) {
      console.warn('Query missing in request body');
      return res.status(400).json({
        success: false,
        error: 'Missing required field',
        message: 'Please provide a "query" field in the request body',
        example: {
          query: 'What is machine learning?',
          mode: 'explain',
          topK: 3,
        },
      });
    }

    // Validate query type
    if (typeof query !== 'string') {
      console.warn('Query is not a string');
      return res.status(400).json({
        success: false,
        error: 'Invalid query format',
        message: 'Query must be a string',
      });
    }

    // Validate mode
    const validModes = ['summary', 'explain', 'questions'];
    if (!validModes.includes(mode)) {
      console.warn(`Invalid mode: ${mode}`);
      return res.status(400).json({
        success: false,
        error: 'Invalid mode',
        message: `Mode must be one of: ${validModes.join(', ')}`,
      });
    }

    // Validate topK
    if (!Number.isInteger(topK) || topK < 1 || topK > 10) {
      console.warn(`Invalid topK: ${topK}`);
      return res.status(400).json({
        success: false,
        error: 'Invalid topK',
        message: 'topK must be an integer between 1 and 10',
      });
    }

    // Process query
    const result = await processQuery(query, mode, topK);

    // Return response
    if (result.success) {
      console.log('Query processed successfully');
      return res.status(200).json(result);
    } else {
      // Check error type to determine appropriate status code
      if (
        result.error === 'No documents in vector store' ||
        result.error === 'No relevant documents found'
      ) {
        console.warn(`Query returned: ${result.error}`);
        return res.status(404).json(result);
      } else {
        console.error(`Query error: ${result.error}`);
        return res.status(500).json(result);
      }
    }
  } catch (error) {
    console.error(`Query controller error: ${error.message}`);
    next(error);
  }
};

/**
 * Handle GET /query/stats - Get vector store statistics
 *
 * Response:
 * {
 *   "success": true,
 *   "vectorStore": {
 *     "totalDocuments": number,
 *     "totalFiles": number,
 *     "embeddingDimension": number,
 *     "fileKeys": [array of file keys]
 *   }
 * }
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getQueryStats = (req, res) => {
  try {
    console.log('\n--- Query Stats Request Received ---');

    const stats = getVectorStoreStats();

    console.log('Stats retrieved successfully');

    return res.status(200).json({
      success: true,
      vectorStore: stats,
      message: 'Vector store statistics retrieved successfully',
    });
  } catch (error) {
    console.error(`Stats controller error: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: error.message,
      message: 'Failed to retrieve statistics',
    });
  }
};
