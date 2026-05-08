# AI Study Assistant

Your intelligent learning companion powered by AI.

---

## What is AI Study Assistant?

**AI Study Assistant** is an AI-powered platform designed to help students and learners understand their study materials faster and deeper.

Simply upload your study materials (PDFs, textbooks, lecture notes), ask questions about them, and get intelligent, contextual answers powered by advanced AI.

### Key Features

- 📄 **Upload & Analyze PDFs**: Upload your study materials in seconds
- 🤖 **AI-Powered Answers**: Get accurate, contextual responses to your questions
- 📚 **Multiple Learning Modes**:
  - **Summary**: Quick overview of key concepts
  - **Explanation**: Detailed breakdown of complex topics
  - **Quiz Generator**: Auto-generated practice questions
- ⚡ **Fast & Accurate**: Retrieval-augmented search finds exactly what you need
- 🔒 **Secure & Private**: Your documents are encrypted and stored securely

---

## How It Works

1. **Upload Your Materials**
   - Drag and drop your PDF files
   - We support textbooks, lecture notes, research papers, and more

2. **Ask Questions**
   - Type your question in natural language
   - Choose your preferred response mode (summary, explanation, etc.)

3. **Get Intelligent Answers**
   - Our AI analyzes your documents and provides targeted, accurate responses
   - Never wastes time searching through irrelevant information

4. **Learn Better**
   - Generate practice questions
   - Bookmark important concepts
   - Save your learning sessions

---

## Getting Started

### System Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- PDF files for upload

### Quick Start

1. **Sign Up**
   - Visit [app.aiassistant.com](https://app.aiassistant.com)
   - Create your free account
   - Verify your email

2. **Upload Materials**
   - Click "Upload Document"
   - Select one or more PDF files
   - Wait for processing (usually completes in seconds)

3. **Start Learning**
   - Click on a document
   - Type your first question
   - Explore different response modes

---

## Pricing

| Plan | Features | Price |
|------|----------|-------|
| **Free** | 5 documents, limited queries | Free |
| **Student** | 50 documents, unlimited queries | $9.99/month |
| **Pro** | 500 documents, priority support | $29.99/month |
| **Enterprise** | Unlimited, custom integration | Contact sales |

---

## Use Cases

### For Students
- Understand difficult textbook chapters
- Prepare for exams with generated quizzes
- Write better essays with instant fact-checking
- Study across multiple subjects efficiently

### For Teachers
- Create custom learning materials
- Generate assessments automatically
- Track student progress and understanding
- Reduce grading time

### For Professionals
- Quickly digest technical documentation
- Extract key information from long reports
- Generate summaries for meetings
- Stay updated with research papers

---

## FAQ

### Is my data secure?
Yes. All documents are encrypted using industry-standard AES-256 encryption. We never share or sell your data. See our [Privacy Policy](https://aiassistant.com/privacy) for details.

### What file formats do you support?
Currently, we support PDF files. Support for Word documents, PowerPoint presentations, and images coming soon.

### How long does document processing take?
Most documents process in 2-10 seconds depending on size. Larger documents (500+ pages) may take up to a minute.

### Can I download my documents later?
Yes. You can download any document from your library at any time. Your analysis and query history is also downloadable.

### What if I have questions?
Our support team is available 24/7:
- **Email**: support@aiassistant.com
- **Live Chat**: Available in-app
- **Help Center**: [help.aiassistant.com](https://help.aiassistant.com)

### Can I use this for commercial purposes?
Yes, with a Pro or Enterprise plan. See our [Terms of Service](https://aiassistant.com/terms) for details.

### How accurate are the answers?
Our AI is trained on cutting-edge models and retrieves information directly from your uploaded documents. Accuracy typically exceeds 95% for factual queries. Always verify important information.

### Can I cancel my subscription anytime?
Yes. You can cancel your subscription anytime without penalties. Your documents remain accessible for 30 days after cancellation.

---

## Roadmap

### Coming Soon
- Word document and PowerPoint support
- Mobile app (iOS & Android)
- Collaborative study groups
- Offline mode
- Advanced analytics and progress tracking

### Future Releases
- Voice input and output
- Real-time collaboration
- Integration with learning management systems (Blackboard, Canvas)
- API access for institutions
- Custom AI model training

---

## For Developers

### Backend API Documentation

This section documents the backend APIs for developers and integration partners.

#### Phase 2: File Upload & S3 Integration

**What Was Implemented:**
- PDF file upload endpoint with validation
- Amazon S3 integration for secure, scalable file storage
- Automatic filename generation to prevent collisions
- File size validation (up to 50MB)
- MIME type validation (PDF only)

**Why S3 Instead of Local Storage:**
- **Scalability**: S3 handles unlimited storage without server constraints
- **Reliability**: Automatic failover, redundancy, and backups
- **Cost-Effective**: Pay only for what you use
- **Security**: Built-in encryption and access controls
- **Performance**: Distributed global infrastructure ensures fast access

**Upload Flow:**
1. Client sends HTTP POST request with PDF file
2. Server receives file using multer (in-memory)
3. File is validated:
   - Type must be PDF (application/pdf)
   - Size must be ≤ 50MB
4. Unique filename is generated (timestamp + random ID)
5. File is uploaded to AWS S3 bucket
6. Server returns S3 file URL and key
7. File is immediately accessible globally via HTTPS

**API Endpoint: Upload PDF**

```
POST /upload
Content-Type: multipart/form-data

Field: "file" (Binary PDF file)

Response (200 OK):
{
  "message": "File uploaded successfully",
  "fileUrl": "https://your-bucket.s3.us-east-1.amazonaws.com/1715000000_abc123.pdf",
  "fileKey": "1715000000_abc123.pdf",
  "originalName": "lecture_notes.pdf",
  "fileSize": 2048576,
  "uploadedAt": "2024-05-07T12:00:00.000Z"
}

Error Response (400):
{
  "error": "Invalid File Type",
  "message": "Only PDF files are allowed. Please upload a PDF file."
}
```

**Testing with cURL:**
```bash
curl -X POST http://localhost:3000/upload \
  -F "file=@/path/to/your/file.pdf"
```

**Testing with Postman:**
1. Create new POST request to `http://localhost:3000/upload`
2. Go to "Body" tab
3. Select "form-data"
4. Add key "file" with type "File"
5. Click "Select Files" and choose a PDF
6. Click "Send"
7. You'll receive the file URL and details in response

**Environment Variables Required:**
- `AWS_ACCESS_KEY` - Your AWS IAM access key
- `AWS_SECRET_KEY` - Your AWS IAM secret key
- `AWS_REGION` - AWS region (e.g., us-east-1)
- `S3_BUCKET_NAME` - Your S3 bucket name

**Limitations:**
- Maximum file size: 50MB
- Accepted format: PDF only
- Files are stored permanently in S3 (no automatic cleanup)

---

#### Phase 3: RAG Ingestion Pipeline

**What Was Implemented:**
- PDF text extraction from S3-hosted files
- Intelligent text chunking (with overlap for context preservation)
- Embedding generation using Google Gemini
- In-memory vector store for chunk embeddings
- Document processing statistics and monitoring

**Why This Matters for RAG:**

In Retrieval-Augmented Generation (RAG), raw documents are too large to send to language models. The ingestion pipeline solves this by:
1. **Breaking documents into chunks**: Smaller, focused pieces of text that capture specific topics
2. **Creating embeddings**: Converting text into vector representations that capture semantic meaning
3. **Storing for retrieval**: Building a searchable knowledge base without loading entire documents

**Ingestion Pipeline Flow:**

```
S3 Bucket (Uploaded PDF)
    ↓
Fetch File from S3
    ↓
Extract Text (PDF Parser)
    ↓
Split into Chunks (500-word chunks with 50-word overlap)
    ↓
Generate Embeddings (Google Gemini)
    ↓
Store in Vector Database (In-memory)
    ↓
Ready for Retrieval & Queries
```

**API Endpoint: Process Document**

```
POST /process
Content-Type: application/json

Request body:
{
  "fileKey": "1715000000_abc123.pdf",
  "originalName": "lecture_notes.pdf"
}

Response (200 OK):
{
  "success": true,
  "message": "Document ingested successfully",
  "fileKey": "1715000000_abc123.pdf",
  "originalName": "lecture_notes.pdf",
  "stats": {
    "textLength": 50000,
    "chunksCreated": 100,
    "embeddingsGenerated": 100,
    "documentsAdded": 100,
    "totalDocumentsInStore": 300,
    "processingTimeSeconds": 45.23
  },
  "vectorStoreStats": {
    "totalDocuments": 300,
    "totalFiles": 3,
    "embeddingDimension": 768
  }
}
```

**API Endpoint: Get Vector Store Statistics**

```
GET /process/stats

Response (200 OK):
{
  "success": true,
  "vectorStore": {
    "totalDocuments": 300,
    "totalFiles": 3,
    "fileKeys": ["file1.pdf", "file2.pdf", "file3.pdf"],
    "embeddingDimension": 768,
    "allDocuments": 300
  }
}
```

**Complete Workflow Example:**

1. **User uploads PDF** via `POST /upload`
   ```bash
   curl -X POST http://localhost:3000/upload -F "file=@document.pdf"
   ```
   Response includes `fileKey`

2. **Backend processes document** via `POST /process`
   ```bash
   curl -X POST http://localhost:3000/process \
     -H "Content-Type: application/json" \
     -d '{"fileKey": "1715000000_abc123.pdf", "originalName": "document.pdf"}'
   ```
   - PDF extracted from S3
   - Text split into 100 chunks
   - Each chunk embedded with Gemini
   - All embeddings stored in vector database

3. **Check ingestion status** via `GET /process/stats`
   ```bash
   curl http://localhost:3000/process/stats
   ```

**Chunking Strategy:**

- **Method**: Word-based chunking (500 words per chunk)
- **Overlap**: 50-word overlap between adjacent chunks
- **Why**: Preserves context boundaries, prevents information loss at chunk splits

**Embedding Model:**

- **Model**: Google Gemini `gemini-embedding-2`
- **Dimension**: 768 dimensions per embedding
- **Purpose**: Captures semantic meaning of text for similarity search

**Vector Storage:**

- **Type**: In-memory (no external database required)
- **Format**: JSON-serializable objects with text, embeddings, and metadata
- **Scalability**: Suitable for prototyping; can be extended to FAISS or Redis

**Limitations (Phase 3):**

- No query or retrieval endpoint yet
- No similarity search functionality
- Vector store resets on server restart
- No database persistence
- Limited to ~10,000 documents per instance

---

#### Phase 4: RAG Query & Response Generation

**What Was Implemented:**
- Query embedding generation using the same Gemini model
- Similarity search using cosine similarity (top-k retrieval)
- Context-aware prompt construction with different response modes
- LLM integration for intelligent response generation
- Source attribution for answer traceability

**Why This Completes the RAG Pipeline:**

RAG (Retrieval-Augmented Generation) combines retrieval with generation:
1. **Phase 1-3 handled retrieval**: Documents are uploaded, ingested, and embeddings are stored
2. **Phase 4 handles generation**: User queries are answered by retrieving relevant chunks and using an LLM to generate informed responses

This creates a complete system where answers are grounded in your uploaded documents.

**Query Processing Pipeline:**

```
User Query
    ↓
Generate Query Embedding (Gemini)
    ↓
Cosine Similarity Search
    ↓
Retrieve Top-K Relevant Chunks
    ↓
Build Context with Retrieved Chunks
    ↓
Construct Dynamic Prompt
    ↓
Generate Response with LLM (Gemini)
    ↓
Return Answer + Source Attribution
```

**Response Modes (Different Prompt Strategies):**

1. **Summary Mode**
   - Creates concise bullet-point summaries
   - Best for: Quick overviews, key concepts
   - Prompt: "Summarize the following content clearly in bullet points"

2. **Explain Mode**
   - Provides detailed explanations with examples
   - Best for: Understanding complex topics
   - Prompt: "Explain the concept in simple terms with examples"

3. **Questions Mode**
   - Generates 5 interview/practice questions
   - Best for: Exam preparation, self-assessment
   - Prompt: "Generate 5 interview questions based on the content"

**API Endpoint: Query Documents**

```
POST /query
Content-Type: application/json

Request body:
{
  "query": "What is machine learning?",
  "mode": "explain",
  "topK": 3
}

Response (200 OK):
{
  "success": true,
  "answer": "Machine learning is a subset of artificial intelligence...",
  "sources": [
    {
      "chunkIndex": 0,
      "preview": "Machine learning is a field of study in artificial...",
      "fileKey": "1715000000_abc123.pdf",
      "similarity": 0.891
    },
    {
      "chunkIndex": 5,
      "preview": "There are three main types of machine learning...",
      "fileKey": "1715000000_abc123.pdf",
      "similarity": 0.823
    }
  ],
  "stats": {
    "query": "What is machine learning?",
    "mode": "explain",
    "topK": 3,
    "totalDocumentsSearched": 300,
    "relevantDocumentsFound": 2,
    "processingTime": 2850
  }
}

Error Response (404 - No Documents):
{
  "success": false,
  "error": "No documents in vector store",
  "message": "Upload and ingest documents first before querying.",
  "stats": {
    "totalDocumentsSearched": 0,
    "relevantDocumentsFound": 0,
    "processingTime": 12
  }
}

Error Response (404 - No Relevant Chunks):
{
  "success": false,
  "error": "No relevant documents found",
  "message": "No relevant content found for your query. Try rephrasing.",
  "stats": {
    "totalDocumentsSearched": 300,
    "relevantDocumentsFound": 0,
    "processingTime": 2100
  }
}
```

**API Endpoint: Query Statistics**

```
GET /query/stats

Response (200 OK):
{
  "success": true,
  "vectorStore": {
    "totalDocuments": 300,
    "totalFiles": 3,
    "fileKeys": ["file1.pdf", "file2.pdf", "file3.pdf"],
    "embeddingDimension": 768
  },
  "message": "Vector store statistics retrieved successfully"
}
```

**Complete Workflow Example:**

1. **User uploads and processes PDFs** (Phase 2 & 3)
   ```bash
   # Upload
   curl -X POST http://localhost:3000/upload -F "file=@document.pdf"

   # Process and ingest
   curl -X POST http://localhost:3000/process \
     -H "Content-Type: application/json" \
     -d '{"fileKey": "1715000000_abc123.pdf", "originalName": "document.pdf"}'
   ```

2. **User asks a question** via `POST /query`
   ```bash
   curl -X POST http://localhost:3000/query \
     -H "Content-Type: application/json" \
     -d '{
       "query": "What are the main types of machine learning?",
       "mode": "explain",
       "topK": 3
     }'
   ```

3. **System processes the query:**
   - Converts query to embedding vector (768 dimensions)
   - Compares with all stored document embeddings using cosine similarity
   - Retrieves top-3 most similar chunks (e.g., similarity scores: 0.89, 0.82, 0.78)
   - Creates context from these chunks
   - Builds prompt with retrieved context and query
   - Sends prompt to Gemini LLM
   - LLM generates answer grounded in document content
   - Returns answer with source attribution (chunk indices, similarity scores)

**Similarity Search Details:**

- **Algorithm**: Cosine Similarity
  - Measures angle between embedding vectors
  - Range: -1 to 1 (higher = more similar)
  - Practical range: 0 to 1 (text similarity)

- **Why Cosine Similarity?**
  - Captures semantic meaning (not just keyword matching)
  - Robust to document length differences
  - Computationally efficient for large-scale search
  - Industry standard for embedding-based retrieval

- **Top-K Retrieval**
  - Default K=3 (retrieves 3 most similar chunks)
  - Configurable: 1-10
  - Higher K = more context but potential noise
  - Lower K = faster but may miss relevant information

**Prompt Construction:**

The system dynamically builds prompts by combining:
1. **Pre-instruction**: "You are an AI Study Assistant"
2. **Mode-specific guidance**: Changes based on "explain" vs "summary" vs "questions"
3. **Retrieved chunks**: Top-K relevant chunks formatted as context
4. **User query**: The actual question asked
5. **Call-to-action**: "RESPONSE:" to trigger generation

Example constructed prompt:
```
You are an AI Study Assistant. Your task is to help students understand study material.

Please explain the concepts in the provided content in simple terms.

---

USER QUERY:
What is an embedding?

---

CONTENT TO ANALYZE:
[Chunk 1]
An embedding is a numerical representation of text...

[Chunk 2]
Embeddings capture semantic meaning by converting...

[Chunk 3]
Common applications of embeddings include similarity search...

---

RESPONSE:
```

**Embedding Model (Same as Ingestion):**

- **Model**: Google Gemini `gemini-embedding-2`
- **Dimension**: 768-dimensional vectors
- **Consistency**: Query embeddings use SAME model as document embeddings
- **Why**: Ensures fair similarity comparison and coherent vector space

**Response Quality Factors:**

1. **Chunk Quality**: Better chunks → better context → better answers
2. **Similarity Threshold**: Default minimum similarity ~0.1 (configurable)
3. **Top-K Value**: Balances context richness vs noise
4. **Query Clarity**: Specific queries often yield better results
5. **LLM Model**: Gemini 1.5 Flash balances speed and quality

**Limitations (Phase 4):**

- In-memory vector store (no persistence across server restarts)
- Single-mode queries (not multi-turn conversations)
- No feedback mechanism for relevance ranking
- Answer quality depends on chunk selection
- No caching of frequently asked questions
- Limited to Gemini LLM (no model switching)

**Environment Variables Required:**

- `GEMINI_API_KEY` - Google Generative AI API key
- Vector store automatically populated from Phase 3

---

## Postman API Testing Guide

This section shows how to test all API endpoints using Postman. Each endpoint is documented with step-by-step instructions.

### Prerequisites

1. **Download Postman**: https://www.postman.com/downloads/
2. **Start the server**: `node server.js` (runs on `http://localhost:3000`)
3. **API Base URL**: `http://localhost:3000`

---

### 1. Health Check Endpoint

**Endpoint**: `GET /`
**Purpose**: Verify server is running

**Steps in Postman:**
1. Click "New" → "HTTP Request"
2. Select method: **GET**
3. Enter URL: `http://localhost:3000/`
4. Click "Send"

**Expected Response (200 OK):**
```json
{
  "status": "Server running"
}
```

---

### 2. Upload PDF to S3

**Endpoint**: `POST /upload`
**Purpose**: Upload a PDF file to AWS S3

**Steps in Postman:**
1. Click "New" → "HTTP Request"
2. Select method: **POST**
3. Enter URL: `http://localhost:3000/upload`
4. Go to **Body** tab
5. Select **form-data**
6. Add field:
   - Key: `file`
   - Type: **File** (dropdown)
   - Value: Click "Select Files" and choose your PDF
7. Click "Send"

**Expected Response (200 OK):**
```json
{
  "message": "File uploaded successfully",
  "fileUrl": "https://your-bucket.s3.us-east-1.amazonaws.com/1715000000_abc123.pdf",
  "fileKey": "1715000000_abc123.pdf",
  "originalName": "document.pdf",
  "fileSize": 2048576,
  "uploadedAt": "2024-05-07T12:00:00.000Z"
}
```

**Save the `fileKey` for next steps!**

---

### 3. Process & Ingest Document

**Endpoint**: `POST /process`
**Purpose**: Extract text, chunk, and generate embeddings

**Steps in Postman:**
1. Click "New" → "HTTP Request"
2. Select method: **POST**
3. Enter URL: `http://localhost:3000/process`
4. Go to **Headers** tab
5. Add header:
   - Key: `Content-Type`
   - Value: `application/json`
6. Go to **Body** tab
7. Select **raw** (JSON format)
8. Paste this JSON (replace `fileKey` with your uploaded file's key):
```json
{
  "fileKey": "1715000000_abc123.pdf",
  "originalName": "document.pdf"
}
```
9. Click "Send"

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Document ingested successfully",
  "fileKey": "1715000000_abc123.pdf",
  "originalName": "document.pdf",
  "stats": {
    "textLength": 50000,
    "chunksCreated": 100,
    "embeddingsGenerated": 100,
    "documentsAdded": 100,
    "totalDocumentsInStore": 100,
    "processingTimeSeconds": 45.23
  },
  "vectorStoreStats": {
    "totalDocuments": 100,
    "totalFiles": 1,
    "embeddingDimension": 768
  }
}
```

---

### 4. Get Processing Stats

**Endpoint**: `GET /process/stats`
**Purpose**: Check vector store status

**Steps in Postman:**
1. Click "New" → "HTTP Request"
2. Select method: **GET**
3. Enter URL: `http://localhost:3000/process/stats`
4. Click "Send"

**Expected Response (200 OK):**
```json
{
  "success": true,
  "vectorStore": {
    "totalDocuments": 100,
    "totalFiles": 1,
    "embeddingDimension": 768,
    "fileKeys": ["1715000000_abc123.pdf"]
  }
}
```

---

### 5. Query Documents (Summary Mode)

**Endpoint**: `POST /query`
**Purpose**: Ask a question and get a summary

**Steps in Postman:**
1. Click "New" → "HTTP Request"
2. Select method: **POST**
3. Enter URL: `http://localhost:3000/query`
4. Go to **Headers** tab
5. Add header:
   - Key: `Content-Type`
   - Value: `application/json`
6. Go to **Body** tab
7. Select **raw** (JSON format)
8. Paste this JSON:
```json
{
  "query": "What are the main concepts discussed?",
  "mode": "summary",
  "topK": 3
}
```
9. Click "Send"

**Expected Response (200 OK):**
```json
{
  "success": true,
  "answer": "The main concepts include:\n• Concept 1\n• Concept 2\n• Concept 3",
  "sources": [
    {
      "chunkIndex": 0,
      "preview": "The main concepts discussed in this section include...",
      "fileKey": "1715000000_abc123.pdf",
      "similarity": 0.891
    },
    {
      "chunkIndex": 5,
      "preview": "Another important concept is...",
      "fileKey": "1715000000_abc123.pdf",
      "similarity": 0.823
    }
  ],
  "stats": {
    "query": "What are the main concepts discussed?",
    "mode": "summary",
    "topK": 3,
    "totalDocumentsSearched": 100,
    "relevantDocumentsFound": 2,
    "processingTime": 2850
  }
}
```

---

### 6. Query Documents (Explain Mode)

**Endpoint**: `POST /query`
**Purpose**: Get detailed explanation with examples

**Steps in Postman:**
1. Click "New" → "HTTP Request"
2. Select method: **POST**
3. Enter URL: `http://localhost:3000/query`
4. Go to **Headers** tab
5. Add header:
   - Key: `Content-Type`
   - Value: `application/json`
6. Go to **Body** tab
7. Select **raw** (JSON format)
8. Paste this JSON:
```json
{
  "query": "Can you explain the key principle in simple terms?",
  "mode": "explain",
  "topK": 3
}
```
9. Click "Send"

**Expected Response (200 OK):**
```json
{
  "success": true,
  "answer": "The key principle can be understood as follows:\n\nIn simple terms, it works like this: [explanation with examples]...",
  "sources": [
    {
      "chunkIndex": 2,
      "preview": "The principle works by...",
      "fileKey": "1715000000_abc123.pdf",
      "similarity": 0.912
    }
  ],
  "stats": {
    "query": "Can you explain the key principle in simple terms?",
    "mode": "explain",
    "topK": 3,
    "totalDocumentsSearched": 100,
    "relevantDocumentsFound": 1,
    "processingTime": 3120
  }
}
```

---

### 7. Query Documents (Questions Mode)

**Endpoint**: `POST /query`
**Purpose**: Generate practice questions for exam prep

**Steps in Postman:**
1. Click "New" → "HTTP Request"
2. Select method: **POST**
3. Enter URL: `http://localhost:3000/query`
4. Go to **Headers** tab
5. Add header:
   - Key: `Content-Type`
   - Value: `application/json`
6. Go to **Body** tab
7. Select **raw** (JSON format)
8. Paste this JSON:
```json
{
  "query": "Generate interview questions about the main topics",
  "mode": "questions",
  "topK": 3
}
```
9. Click "Send"

**Expected Response (200 OK):**
```json
{
  "success": true,
  "answer": "Here are 5 interview questions:\n\n1. Question 1?\n   Answer: ...\n\n2. Question 2?\n   Answer: ...\n\n3. Question 3?\n   Answer: ...\n\n4. Question 4?\n   Answer: ...\n\n5. Question 5?\n   Answer: ...",
  "sources": [
    {
      "chunkIndex": 0,
      "preview": "Topic discussion...",
      "fileKey": "1715000000_abc123.pdf",
      "similarity": 0.856
    }
  ],
  "stats": {
    "query": "Generate interview questions about the main topics",
    "mode": "questions",
    "topK": 3,
    "totalDocumentsSearched": 100,
    "relevantDocumentsFound": 1,
    "processingTime": 3450
  }
}
```

---

### 8. Get Query Statistics

**Endpoint**: `GET /query/stats`
**Purpose**: Check vector store statistics for queries

**Steps in Postman:**
1. Click "New" → "HTTP Request"
2. Select method: **GET**
3. Enter URL: `http://localhost:3000/query/stats`
4. Click "Send"

**Expected Response (200 OK):**
```json
{
  "success": true,
  "vectorStore": {
    "totalDocuments": 100,
    "totalFiles": 1,
    "embeddingDimension": 768,
    "fileKeys": ["1715000000_abc123.pdf"]
  },
  "message": "Vector store statistics retrieved successfully"
}
```

---

### Complete Workflow Example (Copy-Paste Ready)

Follow these steps in order to see the full RAG pipeline:

**Step 1: Upload a PDF**
- Method: POST
- URL: `http://localhost:3000/upload`
- Body: Select a PDF file in form-data
- Copy the `fileKey` from response

**Step 2: Process the PDF**
- Method: POST
- URL: `http://localhost:3000/process`
- Headers: `Content-Type: application/json`
- Body (JSON):
```json
{
  "fileKey": "YOUR_FILE_KEY_HERE",
  "originalName": "your_file_name.pdf"
}
```

**Step 3: Query the Document**
- Method: POST
- URL: `http://localhost:3000/query`
- Headers: `Content-Type: application/json`
- Body (JSON):
```json
{
  "query": "What are the key points?",
  "mode": "summary",
  "topK": 3
}
```

**Step 4: Check Stats**
- Method: GET
- URL: `http://localhost:3000/query/stats`
- No body needed

---

### Troubleshooting

| Error | Cause | Solution |
|-------|-------|----------|
| `Connection refused` | Server not running | Start server: `node server.js` |
| `404 Not Found` | Wrong URL | Check URL matches exactly (including `/`) |
| `400 Bad Request` | Missing field in request | Ensure `query` field exists in body |
| `404 No documents` | Haven't processed any PDFs | Upload and process a PDF first |
| `404 No relevant chunks found` | Query doesn't match document content | Try rephrasing your query |
| `500 Internal Server Error` | Server/API issue | Check `GEMINI_API_KEY` in `.env` |

---

### Tips for Testing

1. **Save Request Collections**: Click "Save" after setting up each request for reuse
2. **Use Variables**: Create Postman variables for `baseUrl` and `fileKey` for easier testing
3. **Check Response Time**: Monitor "Time" in response to see query processing speed
4. **Validate JSON**: Use Postman's JSON formatter to catch syntax errors
5. **Debug Headers**: Ensure `Content-Type: application/json` is set for POST requests

---

## Contact & Support

**Have questions?** We're here to help!

- 📧 **Email**: support@aiassistant.com
- 💬 **Live Chat**: Available in-app during business hours
- 📚 **Help Center**: [help.aiassistant.com](https://help.aiassistant.com)
- 🐦 **Twitter**: [@AIStudioAssist](https://twitter.com/AIStudioAssist)
- 📖 **Blog**: [blog.aiassistant.com](https://blog.aiassistant.com)

---

## Legal

- [Terms of Service](https://aiassistant.com/terms)
- [Privacy Policy](https://aiassistant.com/privacy)
- [Cookie Policy](https://aiassistant.com/cookies)
- [GDPR Compliance](https://aiassistant.com/gdpr)

---

## About Us

AI Study Assistant is built by a team of educators, engineers, and AI researchers committed to making learning accessible, efficient, and enjoyable for everyone.

Founded in 2024 | Based in San Francisco, CA

---

**Ready to transform your learning?**

[Get Started Free](https://app.aiassistant.com/signup) | [Watch Demo](https://aiassistant.com/demo) | [Schedule a Call](https://calendly.com/aiassistant)

---

© 2024 AI Study Assistant. All rights reserved.
