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

### Phase 2: PDF Processing & Embeddings (UPCOMING)
- PDF text extraction (PDFKit or similar)
- Text chunking strategies
- Embedding generation using Gemini API
- Vector database setup (FAISS)
- **New endpoints**: `POST /upload`, `POST /process`

### Phase 3: RAG Pipeline (UPCOMING)
- Query embedding and retrieval
- Context augmentation
- LLM response generation with Gemini
- Structured response formatting (summary, explanation, Q&A modes)
- **New endpoints**: `POST /query`, `GET /query/:id/result`

### Phase 4: AWS Integration (UPCOMING)
- S3 bucket configuration and PDF upload
- IAM roles and permissions setup
- S3 file lifecycle management
- **Enhanced**: `/upload` endpoint with S3 storage

### Phase 5: Deployment (UPCOMING)
- Dockerfile and docker-compose setup
- AWS EC2 instance configuration
- Environment-specific deployments (dev, staging, production)
- CI/CD pipeline (GitHub Actions or similar)

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
