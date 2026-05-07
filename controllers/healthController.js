/**
 * Health Controller
 * Handles health check endpoints for server status verification
 */

export const healthCheck = (req, res) => {
  res.status(200).json({
    status: 'Server running',
  });
};
