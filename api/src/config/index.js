require("dotenv").config();

module.exports = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || "development",

  // NBA API Configuration
  nba: {
    apiBaseUrl:
      process.env.NBA_API_BASE_URL || "https://www.nba.com/stats/players/list",
    playersEndpoint:
      process.env.NBA_PLAYERS_ENDPOINT ||
      "https://stats.nba.com/stats/playerindex",
    requestDelay: parseInt(process.env.REQUEST_DELAY) || 1000, // Increased for production stability
    batchSize: parseInt(process.env.BATCH_SIZE) || 50, // Process in batches
    maxRetries: parseInt(process.env.MAX_RETRIES) || 3,
  },

  // HTTP Client Configuration
  http: {
    timeout: parseInt(process.env.HTTP_TIMEOUT) || 30000, // 30 seconds
    maxSockets: parseInt(process.env.MAX_SOCKETS) || 10,
    maxFreeSockets: parseInt(process.env.MAX_FREE_SOCKETS) || 5,
    keepAlive: process.env.KEEP_ALIVE !== "false", // Default true
    keepAliveMsecs: parseInt(process.env.KEEP_ALIVE_MSECS) || 30000,
  },

  // Scraping Queue Configuration
  queue: {
    concurrency: parseInt(process.env.SCRAPING_CONCURRENCY) || 3, // Max concurrent requests
    requestDelay: parseInt(process.env.REQUEST_DELAY) || 1000, // Delay between requests
    batchSize: parseInt(process.env.BATCH_SIZE) || 50, // Process in batches
    checkpointInterval: parseInt(process.env.CHECKPOINT_INTERVAL) || 100, // Save progress every N items
    maxRetries: parseInt(process.env.MAX_RETRIES) || 3,
    retryDelay: parseInt(process.env.RETRY_DELAY) || 1000, // Base delay for exponential backoff
  },

  // File paths
  files: {
    dataPath: process.env.DATA_FILE_PATH || "./src/data/players.json",
    backupPath: process.env.BACKUP_PATH || "./src/data/backups",
    checkpointPath:
      process.env.CHECKPOINT_PATH || "./src/data/.scraping-checkpoint.json",
    maxBackups: parseInt(process.env.MAX_BACKUPS) || 10,
  },

  // Default player schema values
  defaults: {
    era: "2020s",
    difficulty: 1,
    championships: 0,
    isActive: true,
    addedBy: null,
  },

  // Rate Limiting Configuration
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 60000, // 1 minute window
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX) || 100, // Max requests per window
    skipSuccessfulRequests: process.env.RATE_LIMIT_SKIP_SUCCESS === "true",
    skipFailedRequests: process.env.RATE_LIMIT_SKIP_FAILED === "true",
  },

  // Monitoring Configuration
  monitoring: {
    enableStats: process.env.ENABLE_STATS !== "false", // Default true
    statsInterval: parseInt(process.env.STATS_INTERVAL) || 30000, // 30 seconds
    enableDiskSpace: process.env.ENABLE_DISK_SPACE !== "false", // Default true
    enableMemory: process.env.ENABLE_MEMORY !== "false", // Default true
  },

  // Production Settings
  production: {
    gracefulShutdownTimeout:
      parseInt(process.env.GRACEFUL_SHUTDOWN_TIMEOUT) || 30000, // 30 seconds
    enableCompression: process.env.ENABLE_COMPRESSION !== "false", // Default true
    logLevel: process.env.LOG_LEVEL || "info",
    enableMetrics: process.env.ENABLE_METRICS !== "false", // Default true
  },
};
