import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Centralized environment variable configuration
 * This ensures all environment variables are accessed through a single module
 * and provides default values where appropriate
 */
const env = {
  // Server configuration
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Gemini API (for embeddings and LLM responses)
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,

  // AWS configuration (for S3 and EC2 deployment)
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
};

export default env;
