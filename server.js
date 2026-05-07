import express from 'express';
import env from './config/env.js';
import routes from './routes/index.js';

const app = express();

// ============================================
// Middleware Setup
// ============================================

// JSON parser middleware
app.use(express.json());

// Request logging middleware (basic)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ============================================
// Routes
// ============================================

app.use('/', routes);

// ============================================
// Error Handling Middleware
// ============================================

/**
 * 404 Not Found Handler
 */
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.path} not found`,
  });
});

/**
 * Global Error Handler
 * Catches all errors thrown in route handlers or middleware
 */
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);

  // Default to 500 Internal Server Error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: 'Server Error',
    message,
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ============================================
// Server Startup
// ============================================

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`✓ Server is running on http://localhost:${PORT}`);
  console.log(`✓ Environment: ${env.NODE_ENV}`);
  console.log(`✓ Health check: GET http://localhost:${PORT}/`);
});

export default app;
