import { ingestDocument, getVectorStoreStats } from '../services/ingestionService.js';

/**
 * Process Controller
 * Handles document ingestion and processing endpoints
 */

/**
 * Process uploaded document
 * Initiates the ingestion pipeline: extract → chunk → embed → store
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const processDocument = async (req, res) => {
  try {
    const { fileKey, originalName } = req.body;

    // Validate input
    if (!fileKey || !originalName) {
      return res.status(400).json({
        error: 'Missing Parameters',
        message: 'fileKey and originalName are required',
      });
    }

    // Start ingestion pipeline
    const result = await ingestDocument(fileKey, originalName);

    return res.status(200).json(result);
  } catch (error) {
    console.error('Process Error:', error.message);

    return res.status(500).json({
      error: 'Processing Failed',
      message: error.message,
    });
  }
};

/**
 * Get vector store statistics
 * Returns information about stored embeddings
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
export const getStats = async (req, res) => {
  try {
    const stats = getVectorStoreStats();

    return res.status(200).json({
      success: true,
      vectorStore: stats,
    });
  } catch (error) {
    console.error('Stats Error:', error.message);

    return res.status(500).json({
      error: 'Failed to get statistics',
      message: error.message,
    });
  }
};

export default {
  processDocument,
  getStats,
};
