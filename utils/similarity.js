/**
 * Similarity utilities for vector operations
 * Used for RAG retrieval to find relevant chunks
 */

/**
 * Computes cosine similarity between two vectors
 * Formula: (A · B) / (||A|| * ||B||)
 *
 * @param {Array<number>} vec1 - First embedding vector
 * @param {Array<number>} vec2 - Second embedding vector
 * @returns {number} Cosine similarity score between -1 and 1
 */
function cosineSimilarity(vec1, vec2) {
  if (!vec1 || !vec2 || vec1.length === 0 || vec2.length === 0) {
    return 0;
  }

  if (vec1.length !== vec2.length) {
    throw new Error('Vectors must have the same dimension');
  }

  // Compute dot product: A · B
  let dotProduct = 0;
  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
  }

  // Compute magnitude of vec1: ||A||
  let mag1 = 0;
  for (let i = 0; i < vec1.length; i++) {
    mag1 += vec1[i] * vec1[i];
  }
  mag1 = Math.sqrt(mag1);

  // Compute magnitude of vec2: ||B||
  let mag2 = 0;
  for (let i = 0; i < vec2.length; i++) {
    mag2 += vec2[i] * vec2[i];
  }
  mag2 = Math.sqrt(mag2);

  // Avoid division by zero
  if (mag1 === 0 || mag2 === 0) {
    return 0;
  }

  return dotProduct / (mag1 * mag2);
}

/**
 * Retrieves top-k similar documents from vector store
 *
 * @param {Array<Object>} documents - Documents from vector store
 * @param {Array<number>} queryEmbedding - Query embedding vector
 * @param {number} k - Number of top similar documents to retrieve (default: 3)
 * @returns {Array<Object>} Top-k documents sorted by similarity (descending)
 *   Each item: { ...document, similarity: number }
 */
function getTopKDocuments(documents, queryEmbedding, k = 3) {
  if (!documents || documents.length === 0) {
    return [];
  }

  if (!queryEmbedding || queryEmbedding.length === 0) {
    return [];
  }

  // Calculate similarity for each document
  const documentScores = documents.map((doc) => ({
    ...doc,
    similarity: cosineSimilarity(queryEmbedding, doc.embedding),
  }));

  // Sort by similarity (descending) and take top-k
  return documentScores
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, k);
}

module.exports = {
  cosineSimilarity,
  getTopKDocuments,
};
