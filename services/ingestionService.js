import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import pdfParse from 'pdf-parse';
import { GoogleGenerativeAI } from '@google/generative-ai';
import env from '../config/env.js';
import { splitDocumentIntoChunks } from '../utils/chunking.js';
import vectorStore from '../utils/vectorStore.js';

/**
 * Ingestion Service
 * Handles PDF processing: fetch → extract → chunk → embed → store
 */

// Initialize S3 client
const s3Client = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY,
    secretAccessKey: env.AWS_SECRET_KEY,
  },
});

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

/**
 * Fetch PDF file from S3
 *
 * @param {string} fileKey - S3 file key
 * @returns {Promise<Buffer>} - File buffer
 * @throws {Error} - If file fetch fails
 */
const fetchFileFromS3 = async (fileKey) => {
  try {
    console.log(`Fetching file from S3: ${fileKey}`);

    const params = {
      Bucket: env.S3_BUCKET_NAME,
      Key: fileKey,
    };

    const command = new GetObjectCommand(params);
    const response = await s3Client.send(command);

    // Convert stream to buffer
    const chunks = [];
    for await (const chunk of response.Body) {
      chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks);
    console.log(`✓ File fetched: ${fileKey} (${buffer.length} bytes)`);

    return buffer;
  } catch (error) {
    console.error(`Failed to fetch file from S3: ${error.message}`);
    throw new Error(`S3 fetch error: ${error.message}`);
  }
};

/**
 * Extract text from PDF buffer
 *
 * @param {Buffer} pdfBuffer - PDF file buffer
 * @returns {Promise<string>} - Extracted text
 * @throws {Error} - If PDF parsing fails
 */
const extractTextFromPDF = async (pdfBuffer) => {
  try {
    console.log('Extracting text from PDF...');

    const pdfData = await pdfParse(pdfBuffer);
    const text = pdfData.text;

    console.log(
      `✓ Text extracted: ${text.length} characters, ${pdfData.numpages} pages`
    );

    return text;
  } catch (error) {
    console.error(`Failed to extract text from PDF: ${error.message}`);
    throw new Error(`PDF extraction error: ${error.message}`);
  }
};

/**
 * Generate embeddings for text chunks using Gemini
 *
 * @param {Array<string>} texts - Array of text chunks
 * @returns {Promise<Array<Array<number>>>} - Array of embedding vectors
 * @throws {Error} - If embedding generation fails
 */
const generateEmbeddings = async (texts) => {
  try {
    console.log(`Generating embeddings for ${texts.length} chunks...`);

    const model = genAI.getGenerativeModel({
      model: 'embedding-001',
    });

    const embeddings = [];

    // Process in batches to avoid rate limiting
    const batchSize = 10;
    for (let i = 0; i < texts.length; i += batchSize) {
      const batch = texts.slice(i, i + batchSize);

      for (const text of batch) {
        // Safety: limit text length for embedding
        const limitedText = text.substring(0, 3000);

        const result = await model.embedContent(limitedText);
        embeddings.push(result.embedding.values);
      }

      console.log(
        `Generated embeddings: ${Math.min(i + batchSize, texts.length)}/${texts.length}`
      );
    }

    console.log(`✓ Embeddings generated: ${embeddings.length} vectors`);

    return embeddings;
  } catch (error) {
    console.error(`Failed to generate embeddings: ${error.message}`);
    throw new Error(`Embedding generation error: ${error.message}`);
  }
};

/**
 * Main ingestion pipeline
 *
 * @param {string} fileKey - S3 file key
 * @param {string} originalName - Original filename
 * @param {Object} options - Ingestion options
 * @returns {Promise<Object>} - Ingestion result
 * @throws {Error} - If any step fails
 */
export const ingestDocument = async (fileKey, originalName, options = {}) => {
  const startTime = Date.now();

  try {
    console.log(`\n=== Starting Document Ingestion ===`);
    console.log(`File: ${originalName} (${fileKey})`);

    // Step 1: Fetch file from S3
    const pdfBuffer = await fetchFileFromS3(fileKey);

    // Step 2: Extract text from PDF
    const text = await extractTextFromPDF(pdfBuffer);

    // Step 3: Split into chunks
    console.log('Splitting text into chunks...');
    const chunks = splitDocumentIntoChunks(text, fileKey, originalName, {
      method: options.chunkMethod || 'word',
      chunkSize: options.chunkSize || 500,
      overlapSize: options.overlapSize || 50,
    });

    console.log(`✓ Chunks created: ${chunks.length} chunks`);

    // Step 4: Generate embeddings
    const chunkTexts = chunks.map((chunk) => chunk.text);
    const embeddings = await generateEmbeddings(chunkTexts);

    // Step 5: Store in vector store
    console.log('Storing embeddings in vector store...');
    const storeResult = vectorStore.addDocuments(chunks, embeddings);

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    const result = {
      success: true,
      message: 'Document ingested successfully',
      fileKey,
      originalName,
      stats: {
        textLength: text.length,
        chunksCreated: chunks.length,
        embeddingsGenerated: embeddings.length,
        documentsAdded: storeResult.documentsAdded,
        totalDocumentsInStore: storeResult.totalDocuments,
        processingTimeSeconds: parseFloat(duration),
      },
      vectorStoreStats: vectorStore.getStats(),
    };

    console.log(`✓ Ingestion completed in ${duration}s`);
    console.log(`✓ Total documents in store: ${storeResult.totalDocuments}`);
    console.log(`=== Ingestion Success ===\n`);

    return result;
  } catch (error) {
    console.error(`✗ Ingestion failed: ${error.message}`);
    throw error;
  }
};

/**
 * Get vector store statistics
 *
 * @returns {Object} - Vector store statistics
 */
export const getVectorStoreStats = () => {
  return {
    ...vectorStore.getStats(),
    allDocuments: vectorStore.getAllDocuments().length,
  };
};

export default {
  ingestDocument,
  getVectorStoreStats,
};
