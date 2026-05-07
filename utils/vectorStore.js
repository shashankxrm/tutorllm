/**
 * Vector Store Utility
 * Simple in-memory vector store for embeddings
 * Stores chunks with their embeddings and metadata
 */

class VectorStore {
  constructor() {
    // Array to store all documents with embeddings
    this.documents = [];
    this.documentIndex = 0;
  }

  /**
   * Add documents with embeddings to the store
   *
   * @param {Array<Object>} chunks - Array of chunk objects with text and metadata
   * @param {Array<Array>} embeddings - Array of embedding vectors (same length as chunks)
   * @returns {Object} - Summary of added documents
   */
  addDocuments(chunks, embeddings) {
    if (!Array.isArray(chunks) || !Array.isArray(embeddings)) {
      throw new Error('Chunks and embeddings must be arrays');
    }

    if (chunks.length !== embeddings.length) {
      throw new Error('Chunks and embeddings must have the same length');
    }

    const addedDocuments = [];

    for (let i = 0; i < chunks.length; i++) {
      const document = {
        id: this.documentIndex++,
        text: chunks[i].text,
        embedding: embeddings[i],
        metadata: chunks[i].metadata || {},
        addedAt: new Date().toISOString(),
      };

      this.documents.push(document);
      addedDocuments.push(document.id);
    }

    return {
      success: true,
      documentsAdded: addedDocuments.length,
      totalDocuments: this.documents.length,
      documentIds: addedDocuments,
    };
  }

  /**
   * Get all documents from the store
   *
   * @returns {Array} - All stored documents
   */
  getAllDocuments() {
    return this.documents;
  }

  /**
   * Get documents by file key
   *
   * @param {string} fileKey - S3 file key to filter by
   * @returns {Array} - Documents matching the fileKey
   */
  getDocumentsByFileKey(fileKey) {
    return this.documents.filter(
      (doc) => doc.metadata.fileKey === fileKey
    );
  }

  /**
   * Get document count
   *
   * @returns {number} - Total number of documents in store
   */
  getDocumentCount() {
    return this.documents.length;
  }

  /**
   * Clear all documents
   *
   * @returns {Object} - Confirmation of cleared documents
   */
  clearAll() {
    const clearedCount = this.documents.length;
    this.documents = [];
    return {
      success: true,
      clearedCount,
      remainingDocuments: this.documents.length,
    };
  }

  /**
   * Get statistics about the vector store
   *
   * @returns {Object} - Store statistics
   */
  getStats() {
    const fileKeys = new Set(
      this.documents.map((doc) => doc.metadata.fileKey)
    );

    return {
      totalDocuments: this.documents.length,
      totalFiles: fileKeys.size,
      fileKeys: Array.from(fileKeys),
      embeddingDimension: this.documents.length > 0
        ? this.documents[0].embedding.length
        : 0,
    };
  }
}

// Create singleton instance
const vectorStore = new VectorStore();

export default vectorStore;
