# AI Study Assistant - Backend (Development Notes)

**Internal documentation for development team - Project plans, architecture decisions, and technical roadmap.**

---

## Project Overview (Internal)

**AI Study Assistant** is a comprehensive RAG system designed to help students learn by:
1. Uploading study materials (PDFs)
2. Converting them into embeddings and storing them in a vector database
3. Processing user queries to retrieve relevant context
4. Generating structured responses using an LLM (Google Gemini)

This repository contains the **backend foundation** for the entire system.

### What Makes This Different?

- **Retrieval-Augmented Generation**: Rather than passing entire documents to the LLM, we retrieve only the most relevant chunks, reducing costs and latency
- **Modular Architecture**: Clean separation of concerns (routes → controllers → services)
- **Production-Ready**: Proper error handling, environment configuration, and deployment readiness
- **Scalable**: Designed to evolve with additional features without major rewrites

### Long-Term Vision

This system will evolve into a full-stack application:
- PDF processing and embeddings generation
- Vector database storage (FAISS)
- Multi-mode query support (summary, explanation, question generation)
- Docker containerization
- AWS EC2 deployment with S3 integration

---

## Phase 1 Scope: Backend Foundation

### What's Implemented

✓ Clean Node.js project structure using ES Modules
✓ Express.js server with middleware setup
✓ Environment configuration management
✓ Health check endpoint (GET /)
✓ Global error handling middleware
✓ .gitignore and .env template

### Why This Structure Matters

Phase 1 establishes a **solid foundation** that follows industry best practices:

1. **Separation of Concerns**: Routes, controllers, and config are isolated
   - Routes handle HTTP concerns (methods, paths, status codes)
   - Controllers contain business logic
   - Config centralizes environment access

2. **Scalability**: Easy to add new routes, controllers, and services later
   - Adding a new endpoint takes minutes, not hours
   - Error handling is consistent across all endpoints

3. **Maintainability**: Clear folder structure makes code navigation simple
   - New developers can understand the codebase quickly
   - Changes are localized to relevant modules

4. **DevOps-Ready**: Environment configuration is production-safe
   - Secrets are never hardcoded
   - Different environments (.env, .env.production) work seamlessly

---

## Folder Structure Explanation

```
project/
├── server.js                     # Main Express application entry point
├── package.json                  # Project dependencies and metadata
├── .env                          # Environment variables (gitignored)
├── .gitignore                    # Git ignore rules
│
├── routes/
│   └── index.js                  # Route definitions and paths
│
├── controllers/
│   └── healthController.js       # Health check logic (no inline route logic)
│
├── config/
│   └── env.js                    # Centralized environment configuration
│
├── utils/                        # Utility functions (to be populated)
│
├── myreadme.md                   # This file (internal dev notes)
└── README.md                     # Public project documentation
```

### File Descriptions

| File | Purpose |
|------|---------|
| `server.js` | Core Express app: middleware setup, error handling, server startup |
| `package.json` | Dependencies (express, dotenv) and project metadata |
| `.env` | Environment variables (PORT, API keys, AWS config) |
| `.gitignore` | Prevents secrets and dependencies from being committed |
| `routes/index.js` | Maps HTTP routes to controller functions |
| `controllers/healthController.js` | Business logic for endpoints |
| `config/env.js` | Single source of truth for environment variables |

---

## Development Setup

### Prerequisites

- Node.js (v16 or later)
- npm (comes with Node.js)

### Installation

1. **Clone the repository** (or use the current directory)
   ```bash
   cd ai-study-assistant-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env` template and update values:
   ```bash
   # Create a local .env file (or update the existing one)
   # Edit the following variables:
   PORT=3000
   NODE_ENV=development
   GEMINI_API_KEY=your_api_key_here
   AWS_ACCESS_KEY=your_aws_key_here
   AWS_SECRET_KEY=your_aws_secret_here
   AWS_REGION=us-east-1
   S3_BUCKET_NAME=your_bucket_name_here
   ```

4. **Start the server**
   ```bash
   npm start
   ```

5. **Verify the server is running**
   ```bash
   curl http://localhost:3000
   ```
   Expected response:
   ```json
   {
     "status": "Server running"
   }
   ```

---

## Environment Variables (Development Reference)

All environment variables are defined in `.env` and accessed through `config/env.js`:

| Variable | Type | Required | Purpose | Default |
|----------|------|----------|---------|---------|
| `PORT` | Number | No | Server port | 3000 |
| `NODE_ENV` | String | No | Environment (development/production) | development |
| `GEMINI_API_KEY` | String | Yes* | Google Gemini API key for LLM | None |
| `AWS_ACCESS_KEY` | String | Yes* | AWS access key for S3 | None |
| `AWS_SECRET_KEY` | String | Yes* | AWS secret key | None |
| `AWS_REGION` | String | No | AWS region | us-east-1 |
| `S3_BUCKET_NAME` | String | Yes* | S3 bucket for PDF storage | None |

*Required once Phase 2+ is implemented

---

## Current API Endpoints

### Health Check
```
GET /

Response (200 OK):
{
  "status": "Server running"
}
```

---

## Error Handling Strategy

The backend includes global error handling middleware:

1. **404 Not Found**: Returns meaningful error for undefined routes
2. **5xx Server Errors**: Caught and logged with stack traces (in development)
3. **Consistent Response Format**:
   ```json
   {
     "error": "Error Type",
     "message": "Human-readable description"
   }
   ```

---

## Development Standards & Code Quality

### Code Quality Standards

- **No inline logic in routes**: All business logic lives in controllers
- **Clean imports/exports**: ES Module syntax throughout
- **Comments for clarity**: Complex logic is explained
- **Consistent naming**: camelCase for variables, descriptive names

### Architecture Principles

1. **Layer Separation**:
   - `routes/` - HTTP routing only
   - `controllers/` - Business logic
   - `config/` - Configuration management
   - `utils/` - Helper functions
   - `services/` - External service integrations (upcoming)

2. **No Hardcoded Values**: All configuration through environment variables

3. **Consistent Error Responses**: All endpoints return structured errors

### Future Integration Points

- `config/env.js` will be extended as new services are added
- `utils/` folder will contain helper functions for PDF processing, embeddings, DB queries
- `routes/index.js` will grow with new endpoints (upload, query, etc.)
- `controllers/` will have separate modules for each feature
- `services/` folder will be created for external integrations (Gemini, AWS S3, FAISS)

---

## Implementation Roadmap

### Phase 1: Backend Foundation ✓ COMPLETE
- ✓ Express.js setup
- ✓ Environment configuration
- ✓ Health check endpoint
- ✓ Error handling middleware
- ✓ Project structure

### Phase 2: File Upload & S3 Integration ✓ IN PROGRESS
- ✓ Multer middleware setup for file uploads
- ✓ AWS S3 client configuration
- ✓ File validation (PDF only, max 50MB)
- ✓ Unique filename generation to prevent collisions
- ✓ Upload endpoint: `POST /upload`
- ✓ S3 integration with proper error handling
- ✓ File URL response with S3 public link
- **Files**: `services/s3Service.js`, `controllers/uploadController.js`, `routes/upload.js`

### Phase 3: RAG Ingestion Pipeline ✓ IN PROGRESS
- ✓ PDF text extraction from S3
- ✓ Text chunking with overlap (word-based)
- ✓ Embedding generation using Gemini API
- ✓ In-memory vector database setup
- ✓ Process endpoints: `POST /process`, `GET /process/stats`
- ✓ Complete ingestion pipeline: extract → chunk → embed → store
- **Files**: `services/ingestionService.js`, `controllers/processController.js`, `routes/process.js`, `utils/chunking.js`, `utils/vectorStore.js`

### Phase 4: RAG Query & Response (UPCOMING)
- Query embedding and similarity search
- Context augmentation from vector store
- LLM response generation with Gemini
- Structured response formatting (summary, explanation, Q&A modes)
- **New endpoints**: `POST /query`, `GET /query/:id/result`

### Phase 5: Deployment (UPCOMING)
- Dockerfile and docker-compose setup
- AWS EC2 instance configuration
- Environment-specific deployments (dev, staging, production)
- CI/CD pipeline (GitHub Actions or similar)

---

## Phase 2 Implementation Details

### What Was Built

**File Upload & S3 Integration** adds secure PDF file storage to the backend:

1. **Multer Middleware** (`routes/upload.js`)
   - Handles multipart/form-data requests
   - Stores files in memory before S3 upload
   - File size limit: 50MB
   - Field name: "file"

2. **S3 Service** (`services/s3Service.js`)
   - AWS SDK v3 S3Client initialization
   - Credentials from environment variables
   - Async file upload with error handling
   - Returns public S3 URL

3. **Upload Controller** (`controllers/uploadController.js`)
   - File type validation (PDF only)
   - File size validation
   - Unique filename generation (timestamp_randomId.pdf)
   - Error responses for invalid files

### Architecture

```
Client → POST /upload (multipart/form-data)
  ↓
routes/upload.js (multer middleware)
  ↓
uploadController.js (validation)
  ↓
services/s3Service.js (AWS SDK)
  ↓
AWS S3 Bucket
  ↓
Return: { fileUrl, fileKey, originalName, fileSize }
```

### Key Files

| File | Purpose |
|------|---------|
| `services/s3Service.js` | AWS S3 client and PutObjectCommand |
| `controllers/uploadController.js` | File validation and business logic |
| `routes/upload.js` | Express route and multer setup |
| `routes/index.js` | Mount upload router at `/upload` |

### Error Handling

| Error | Status | Cause |
|-------|--------|-------|
| Missing File | 400 | No file in request |
| Invalid Type | 400 | File is not PDF |
| File Too Large | 400 | Size exceeds 50MB |
| Upload Failed | 500 | S3 upload error |

### Testing the Implementation

**Using cURL:**
```bash
curl -X POST http://localhost:3000/upload \
  -F "file=@/path/to/your/file.pdf"
```

**Using Postman:**
1. POST to `http://localhost:3000/upload`
2. Body → form-data
3. Key: "file", Type: "File"
4. Select PDF file
5. Send

**Using Node.js/JavaScript:**
```javascript
const formData = new FormData();
const file = new File([pdfBlob], "document.pdf", { type: "application/pdf" });
formData.append("file", file);

const response = await fetch("http://localhost:3000/upload", {
  method: "POST",
  body: formData,
});

const data = await response.json();
console.log(data.fileUrl);
```

### AWS Configuration Required

Before running Phase 2, ensure:

1. **AWS IAM User created** with programmatic access
2. **S3 bucket created** in your specified region
3. **IAM permissions** granted:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "s3:PutObject",
           "s3:GetObject",
           "s3:DeleteObject"
         ],
         "Resource": "arn:aws:s3:::your-bucket-name/*"
       }
     ]
   }
   ```
4. **.env file** updated with:
   ```
   AWS_ACCESS_KEY=your_iam_access_key
   AWS_SECRET_KEY=your_iam_secret_key
   AWS_REGION=us-east-1
   S3_BUCKET_NAME=your_bucket_name
   ```

### Production Considerations

- **File Size Limit**: Currently 50MB. Adjust in multer config if needed
- **File Type Validation**: Currently PDF only. Can extend in `uploadController.js`
- **Filename Collision**: Unique filenames prevent overwrites (safe)
- **Error Logging**: All S3 errors logged to console for debugging
- **CORS**: May need to configure for frontend requests
- **Authentication**: Not implemented yet (coming in later phases)

### Future Enhancements (Phase 3+)

- File metadata database (store fileKey, uploadedAt, userId, etc.)
- File listing/deletion endpoints
- Signed S3 URLs for secure access
- File processing pipeline
- Document versioning

---

## Phase 3 Implementation Details

### What Was Built

**RAG Ingestion Pipeline** processes uploaded PDFs into embeddings for semantic search:

1. **Ingestion Service** (`services/ingestionService.js`)
   - Fetches PDF from S3 using AWS SDK
   - Parses PDF and extracts plain text
   - Splits text into overlapping chunks
   - Generates embeddings using Gemini API
   - Stores in vector database

2. **Chunking Utility** (`utils/chunking.js`)
   - Word-based chunking (500 words per chunk)
   - 50-word overlap between chunks
   - Metadata attachment (fileKey, chunkIndex, etc.)
   - Flexible chunking strategies (word/character)

3. **Vector Store** (`utils/vectorStore.js`)
   - In-memory database for embeddings
   - Stores: text, embedding vector, metadata
   - Functions: add, retrieve, stats
   - No external dependencies (prototype-friendly)

4. **Process Controller** (`controllers/processController.js`)
   - Validates request parameters
   - Triggers ingestion pipeline
   - Returns processing statistics
   - Handles errors gracefully

### Architecture

```
POST /process (fileKey, originalName)
  ↓
services/ingestionService.js
  ├→ fetchFileFromS3() - Get PDF buffer
  ├→ extractTextFromPDF() - Parse PDF
  ├→ utils/chunking.js - Split text
  ├→ generateEmbeddings() - Gemini API
  └→ utils/vectorStore.js - Store embeddings
  ↓
Return: {
  success: true,
  stats: { chunks, embeddings, time },
  vectorStoreStats: { total, files, dimension }
}
```

### Key Files

| File | Purpose |
|------|---------|
| `services/ingestionService.js` | Main ingestion orchestration |
| `controllers/processController.js` | API route handlers |
| `routes/process.js` | Express route definitions |
| `utils/chunking.js` | Text splitting logic |
| `utils/vectorStore.js` | Embedding storage |

### Ingestion Pipeline Steps

1. **Fetch from S3**
   - Use S3 GetObjectCommand
   - Stream buffer into memory
   - Error handling for missing files

2. **Extract Text**
   - Use pdf-parse library
   - Extract plain text from all pages
   - Remove formatting, preserve content

3. **Chunk Text**
   - Split by word count (500 words default)
   - Add overlap (50 words)
   - Attach metadata to each chunk

4. **Generate Embeddings**
   - Use Gemini gemini-embedding-2 model
   - 768-dimensional vectors
   - Batch processing for efficiency

5. **Store Embeddings**
   - Add to in-memory vector store
   - Index by document ID
   - Track statistics

### API Endpoints

**POST /process** - Start ingestion
```bash
curl -X POST http://localhost:3000/process \
  -H "Content-Type: application/json" \
  -d '{
    "fileKey": "1715000000_abc123.pdf",
    "originalName": "lecture_notes.pdf"
  }'
```

**GET /process/stats** - Get vector store stats
```bash
curl http://localhost:3000/process/stats
```

### Gemini Embedding Model

- **Model ID**: `gemini-embedding-2`
- **Dimension**: 768
- **Max Input**: 3000 characters per chunk
- **Rate Limiting**: Batch processing to avoid hitting limits

### Vector Store Implementation

**In-Memory Storage (Current)**
- Suitable for prototyping and development
- Fast retrieval
- Resets on server restart
- Scalable to ~10,000 documents

**Document Structure**
```javascript
{
  id: 0,
  text: "chunk text here...",
  embedding: [0.123, -0.456, ...], // 768 values
  metadata: {
    fileKey: "1715000000_abc123.pdf",
    originalName: "lecture_notes.pdf",
    chunkIndex: 0,
    chunkCount: 100,
    processedAt: "2024-05-07T12:00:00Z"
  },
  addedAt: "2024-05-07T12:00:00Z"
}
```

### Error Handling

| Error | Cause | Status |
|-------|-------|--------|
| Missing Parameters | fileKey/originalName not provided | 400 |
| File Not Found | PDF not in S3 bucket | 500 |
| PDF Parse Error | Invalid or corrupted PDF | 500 |
| Embedding Error | Gemini API failure | 500 |
| Storage Error | Vector store full | 500 |

### Performance Characteristics

- **Small PDF (10 pages)**: ~10-15 seconds
- **Medium PDF (50 pages)**: ~30-45 seconds
- **Large PDF (200 pages)**: ~2-3 minutes
- **Memory per chunk**: ~1-2 KB text + 3 KB embedding

### Testing the Ingestion

**Step 1: Upload PDF**
```bash
curl -X POST http://localhost:3000/upload \
  -F "file=@sample.pdf"
# Response: { fileKey, fileUrl, ... }
```

**Step 2: Process Document**
```bash
curl -X POST http://localhost:3000/process \
  -H "Content-Type: application/json" \
  -d '{"fileKey": "YOUR_FILE_KEY", "originalName": "sample.pdf"}'
# Response: { success, stats, vectorStoreStats }
```

**Step 3: Check Stats**
```bash
curl http://localhost:3000/process/stats
# Response: { totalDocuments, totalFiles, fileKeys, embeddingDimension }
```

### Production Considerations

- **Persistence**: Use FAISS or Redis for production
- **Scalability**: Implement async job queue for large batches
- **Monitoring**: Log processing times and errors
- **Rate Limiting**: Gemini API has rate limits
- **Concurrency**: Multiple files can be processed in parallel
- **Recovery**: Implement retry logic for transient failures

### Limitations (Phase 3)

- No query endpoint (coming Phase 4)
- No similarity search yet
- In-memory only (no persistence)
- Resets on server restart
- Limited to ~10,000 documents per instance
- Sequential processing (can be parallelized)

### Future Enhancements

- Hybrid chunking (smart boundary detection)
- Multiple embedding models
- FAISS integration for larger datasets
- Batch processing with job queue
- Document metadata database
- Incremental updates
- Vector store persistence

---

## Development Workflow

### Adding a New Endpoint

1. Create or update a controller in `controllers/`
   ```javascript
   export const newFeature = (req, res) => {
     // Logic here
   };
   ```

2. Define the route in `routes/index.js`
   ```javascript
   router.post('/endpoint', newFeature);
   ```

3. Add environment variables to `.env` if needed

4. Update `config/env.js` to expose new variables

5. Test the endpoint locally

### Adding a New Service

1. Create `services/` folder (if not exists)
2. Create service file (e.g., `services/geminiService.js`)
3. Export service functions as ES modules
4. Import and use in controllers

---

## Debugging & Troubleshooting

### Common Issues

**Issue**: Port 3000 already in use
```bash
# Change PORT in .env to 3001 or another available port
PORT=3001
```

**Issue**: Cannot find module 'express' or 'dotenv'
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Issue**: .env variables not loading
- Ensure `.env` file is in the project root
- Restart the server after editing `.env`
- Check that `dotenv` is imported in `config/env.js`

### Logging Output

Server logs include:
- Timestamp of each request
- Request method and path
- Startup confirmation with port and environment
- Error stack traces (in development mode)

---

## Performance Considerations (Future)

- Response caching strategy for frequently accessed documents
- Rate limiting for API endpoints
- Database query optimization for vector searches
- Batch processing for PDF uploads
- Async task queue for long-running operations

---

## Security Considerations (Future)

- Input validation and sanitization
- SQL injection prevention (when using databases)
- CORS configuration for frontend
- API authentication (JWT tokens)
- Rate limiting and DDoS protection
- Secure environment variable handling

---

## Contributing Guidelines

When adding new features:
1. Create a new controller in `controllers/`
2. Define routes in `routes/index.js`
3. Add environment variables to `.env` if needed
4. Update `config/env.js` to expose new variables
5. Keep error handling consistent across all endpoints
6. Follow naming conventions (camelCase for variables, descriptive names)
7. Add comments for complex logic

---

## License

ISC

---

## Internal Contacts & Notes

- **Project Lead**: [Your Name]
- **Architecture Decision Log**: See git commit messages for design decisions
- **Known Limitations**: None at Phase 1
- **Technical Debt**: None at Phase 1
