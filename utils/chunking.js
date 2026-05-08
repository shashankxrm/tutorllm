/**
 * Text Chunking Utility
 * Splits text into overlapping chunks for RAG pipeline
 */

const validateChunkOptions = (chunkSize, overlapSize) => {
  if (!Number.isInteger(chunkSize) || chunkSize <= 0) {
    throw new Error('chunkSize must be a positive integer');
  }

  if (!Number.isInteger(overlapSize) || overlapSize < 0) {
    throw new Error('overlapSize must be a non-negative integer');
  }

  if (overlapSize >= chunkSize) {
    throw new Error('overlapSize must be smaller than chunkSize');
  }
};

/**
 * Split text into chunks by word count with overlap
 *
 * @param {string} text - The text to split
 * @param {number} chunkSize - Number of words per chunk (default: 500)
 * @param {number} overlapSize - Number of words to overlap between chunks (default: 50)
 * @returns {Array<string>} - Array of text chunks
 */
export const chunkTextByWords = (text, chunkSize = 500, overlapSize = 50) => {
  if (!text || typeof text !== 'string') {
    throw new Error('Text must be a non-empty string');
  }

  validateChunkOptions(chunkSize, overlapSize);

  // Split text into words
  const words = text.split(/\s+/).filter((word) => word.length > 0);

  if (words.length === 0) {
    return [];
  }

  const chunks = [];
  let startIndex = 0;
  const stepSize = chunkSize - overlapSize;

  while (startIndex < words.length) {
    const endIndex = Math.min(startIndex + chunkSize, words.length);
    const chunk = words.slice(startIndex, endIndex).join(' ');

    chunks.push(chunk);

    if (endIndex === words.length) {
      break;
    }

    // Move start index for next chunk (with overlap)
    startIndex += stepSize;
  }

  return chunks;
};

/**
 * Split text into chunks by character count with overlap
 *
 * @param {string} text - The text to split
 * @param {number} chunkSize - Number of characters per chunk (default: 3000)
 * @param {number} overlapSize - Number of characters to overlap (default: 300)
 * @returns {Array<string>} - Array of text chunks
 */
export const chunkTextByCharacters = (
  text,
  chunkSize = 3000,
  overlapSize = 300
) => {
  if (!text || typeof text !== 'string') {
    throw new Error('Text must be a non-empty string');
  }

  validateChunkOptions(chunkSize, overlapSize);

  const chunks = [];
  let startIndex = 0;
  const stepSize = chunkSize - overlapSize;

  while (startIndex < text.length) {
    const endIndex = Math.min(startIndex + chunkSize, text.length);
    const chunk = text.slice(startIndex, endIndex);

    chunks.push(chunk);

    if (endIndex === text.length) {
      break;
    }

    // Move start index for next chunk (with overlap)
    startIndex += stepSize;
  }

  return chunks;
};

/**
 * Create chunk objects with metadata
 *
 * @param {Array<string>} chunks - Array of text chunks
 * @param {string} fileKey - S3 file key for metadata
 * @param {string} originalName - Original file name
 * @returns {Array<Object>} - Chunks with metadata
 */
export const createChunkObjects = (chunks, fileKey, originalName) => {
  return chunks.map((text, index) => ({
    text,
    metadata: {
      fileKey,
      originalName,
      chunkIndex: index,
      chunkCount: chunks.length,
      processedAt: new Date().toISOString(),
    },
  }));
};

/**
 * Main function to split document text into chunks
 *
 * @param {string} text - Document text to split
 * @param {string} fileKey - S3 file key
 * @param {string} originalName - Original filename
 * @param {Object} options - Chunking options
 * @returns {Array<Object>} - Chunk objects with metadata
 */
export const splitDocumentIntoChunks = (
  text,
  fileKey,
  originalName,
  options = {}
) => {
  const {
    method = 'word', // 'word' or 'character'
    chunkSize = method === 'word' ? 500 : 3000,
    overlapSize = method === 'word' ? 50 : 300,
  } = options;

  let chunks = [];

  if (method === 'word') {
    chunks = chunkTextByWords(text, chunkSize, overlapSize);
  } else if (method === 'character') {
    chunks = chunkTextByCharacters(text, chunkSize, overlapSize);
  } else {
    throw new Error(`Unknown chunking method: ${method}`);
  }

  return createChunkObjects(chunks, fileKey, originalName);
};

export default {
  chunkTextByWords,
  chunkTextByCharacters,
  createChunkObjects,
  splitDocumentIntoChunks,
};
