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
