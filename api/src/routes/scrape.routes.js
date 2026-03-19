const express = require("express");
const ScrapeController = require("../controllers/scrape.controller");

const router = express.Router();
const scrapeController = new ScrapeController();

// Bind controller method to preserve 'this' context
const scrapeUrl = scrapeController.scrapeUrl.bind(scrapeController);

/**
 * @route POST /api/scrape
 * @desc Scrape public JSON data from a given URL
 * @body {string} url - The URL to scrape
 * @access Public
 */
router.post("/", scrapeUrl);

module.exports = router;
