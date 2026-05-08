/**
 * Query Service
 * Handles RAG retrieval: query embedding → similarity search → context building → LLM generation
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import env from '../config/env.js';
import vectorStore from '../utils/vectorStore.js';
import { cosineSimilarity, getTopKDocuments } from '../utils/similarity.js';
import { buildPrompt } from '../utils/promptBuilder.js';

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

/**
 * Generate embedding for a single query string
 * Uses the SAME model as ingestion pipeline (gemini-embedding-2)
 *
 * @param {string} query - User query string
 * @returns {Promise<Array<number>>} - Query embedding vector
 * @throws {Error} - If embedding generation fails
 */
const generateQueryEmbedding = async (query) => {
  try {
    if (!query || query.trim().length === 0) {
      throw new Error('Query cannot be empty');
    }

    console.log('Generating query embedding...');

    const model = genAI.getGenerativeModel({
      model: 'gemini-embedding-2', // Same model as ingestion
    });

    // Limit query length for embedding (same as ingestion)
    const limitedQuery = query.substring(0, 3000);

    const result = await model.embedContent(limitedQuery);
    const embedding = result.embedding.values;

    console.log(`✓ Query embedding generated (dimension: ${embedding.length})`);

    return embedding;
  } catch (error) {
    console.error(`Failed to generate query embedding: ${error.message}`);
    throw new Error(`Embedding generation error: ${error.message}`);
  }
};

/**
 * Generate response using Gemini LLM
 *
 * @param {string} prompt - Complete prompt with context and instructions
 * @returns {Promise<string>} - Generated response from LLM
 * @throws {Error} - If generation fails
 */
const generateResponse = async (prompt) => {
  try {
    console.log('Generating response with Gemini LLM...');

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash', // Use Gemini for text generation
    });

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    console.log('✓ Response generated successfully');

    return response;
  } catch (error) {
    console.error(`Failed to generate response: ${error.message}`);
    throw new Error(`LLM generation error: ${error.message}`);
  }
};

/**
 * Retrieves relevant documents and generates answer
 * Core RAG pipeline: embedding → search → prompt → generate
 *
 * @param {string} query - User query
 * @param {string} mode - Response mode: 'summary' | 'explain' | 'questions'
 * @param {number} topK - Number of top documents to retrieve (default: 3)
 * @returns {Promise<Object>} - Query response with answer and sources
 *   Format: { success, answer, sources: [{chunkIndex, preview, fileKey, similarity}], stats }
 * @throws {Error} - If any step fails
 */
export const processQuery = async (query, mode = 'summary', topK = 3) => {
  const startTime = Date.now();

  try {
    console.log(`\n=== Processing Query ===`);
    console.log(`Query: "${query}"`);
    console.log(`Mode: ${mode}, Top-K: ${topK}`);

    // Step 1: Validate query
    if (!query || query.trim().length === 0) {
      return {
        success: false,
        error: 'Query cannot be empty',
        message: 'Please provide a valid query',
      };
    }

    // Step 2: Check if vector store has documents
    const allDocuments = vectorStore.getAllDocuments();
    if (allDocuments.length === 0) {
      return {
        success: false,
        error: 'No documents in vector store',
        message:
          'Upload and ingest documents first before querying. Use POST /process to ingest a PDF.',
      };
    }

    // Step 3: Generate query embedding
    const queryEmbedding = await generateQueryEmbedding(query);

    // Step 4: Similarity search
    console.log(`Searching for top-${topK} similar documents...`);
    const topDocuments = getTopKDocuments(
      allDocuments,
      queryEmbedding,
      topK
    );

    // Check if any relevant documents found
    if (topDocuments.length === 0 || topDocuments[0].similarity < 0.1) {
      return {
        success: false,
        error: 'No relevant documents found',
        message:
          'No relevant content found for your query. Try rephrasing your question.',
        stats: {
          totalDocumentsSearched: allDocuments.length,
          relevantDocumentsFound: 0,
          processingTime: Date.now() - startTime,
        },
      };
    }

    console.log(`✓ Found ${topDocuments.length} relevant documents`);
    topDocuments.forEach((doc, index) => {
      console.log(`  ${index + 1}. Similarity: ${doc.similarity.toFixed(3)}`);
    });

    // Step 5: Build prompt
    const prompt = buildPrompt(topDocuments, query, mode);

    // Step 6: Generate response
    const answer = await generateResponse(prompt);

    // Step 7: Format sources
    const sources = topDocuments.map((doc) => ({
      chunkIndex: doc.metadata.chunkIndex,
      preview: doc.text.substring(0, 100) + '...',
      fileKey: doc.metadata.fileKey,
      similarity: parseFloat(doc.similarity.toFixed(3)),
    }));

    const processingTime = Date.now() - startTime;

    console.log(`✓ Query processed successfully in ${processingTime}ms`);

    return {
      success: true,
      answer,
      sources,
      stats: {
        query,
        mode,
        topK,
        totalDocumentsSearched: allDocuments.length,
        relevantDocumentsFound: topDocuments.length,
        processingTime,
      },
    };
  } catch (error) {
    console.error(`Query processing failed: ${error.message}`);
    return {
      success: false,
      error: error.message,
      message: 'Failed to process query. Please try again.',
    };
  }
};

/**
 * Get statistics about the vector store
 *
 * @returns {Object} - Vector store statistics
 */
export const getQueryStats = () => {
  return vectorStore.getStats();
};
