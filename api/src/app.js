/**
 * NBA Players Scraper Application
 * Express app configuration and middleware setup
 */

const express = require("express");
const cors = require("cors");
const config = require("./config");
const Logger = require("./utils/logger");
const routes = require("./routes");

// Create Express app
const app = express();

// Middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  Logger.info(`${req.method} ${req.path}`);
  next();
});

// API routes
app.use("/api", routes);

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "NBA Players Scraper API",
    version: "1.0.0",
    description:
      "A production-ready NBA players scraper with local JSON storage",
    endpoints: {
      api: "/api",
      health: "/api/health",
      scrape: "/api/scrape (POST)",
      players: "/api/players",
      manual: {
        scrapeNBA: "/api/manual/scrape-nba (POST)",
        getPlayers: "/api/manual/players (GET)",
        status: "/api/manual/status (GET)",
        teamPlayers: "/api/manual/players/team/:teamName (GET)",
        searchPlayers: "/api/manual/players/search?q=term (GET)",
        stats: "/api/manual/stats (GET)",
      },
    },
    author: "NBA Scraper Team",
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  Logger.error("Unhandled error:", err.message, err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: "Internal server error",
    error:
      config.nodeEnv === "development" ? err.message : "Something went wrong",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
    path: req.originalUrl,
    availableEndpoints: {
      api: "/api",
      health: "/api/health",
      scrape: "/api/scrape (POST)",
      players: "/api/players",
      manual: {
        scrapeNBA: "/api/manual/scrape-nba (POST)",
        getPlayers: "/api/manual/players (GET)",
        status: "/api/manual/status (GET)",
        teamPlayers: "/api/manual/players/team/:teamName (GET)",
        searchPlayers: "/api/manual/players/search?q=term (GET)",
        stats: "/api/manual/stats (GET)",
      },
    },
  });
});

module.exports = app;
