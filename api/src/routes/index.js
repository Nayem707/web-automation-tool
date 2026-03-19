const express = require("express");
const scrapeRoutes = require("./scrape.routes");
const manualRoutes = require("./manual.route");

const router = express.Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "NBA Players Scraper API is healthy",
    timestamp: new Date().toISOString(),
    version: "2.0.0-enhanced",
  });
});

// Scraper routes
router.use("/scrape", scrapeRoutes);

// Manual NBA scraper routes
router.use("/manual", manualRoutes);

module.exports = router;
