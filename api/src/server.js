/**
 * NBA Players Scraper Server
 * Server startup and lifecycle management
 */

const app = require("./app");
const config = require("./config");
const Logger = require("./utils/logger");

const PORT = 3001;

// Graceful shutdown handlers
process.on("SIGINT", () => {
  Logger.info("Received SIGINT, shutting down gracefully...");
  process.exit(0);
});

process.on("SIGTERM", () => {
  Logger.info("Received SIGTERM, shutting down gracefully...");
  process.exit(0);
});

// Start server
const server = app.listen(PORT, () => {
  Logger.info(`Environment: ${config.nodeEnv}`);
  Logger.success(`API is running on port ${PORT}`);
  Logger.info(`Base URL: http://localhost:${PORT}/api`);
});

module.exports = server;
