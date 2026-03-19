const express = require("express");
const ManualController = require("../controllers/manual.controller");

const router = express.Router();
const manualController = new ManualController();

// Bind controller methods to preserve 'this' context
const scrapeNBAPlayers =
  manualController.scrapeNBAPlayers.bind(manualController);
const getPlayers = manualController.getPlayers.bind(manualController);
const getStatus = manualController.getStatus.bind(manualController);
const getPlayersByTeam =
  manualController.getPlayersByTeam.bind(manualController);
const searchPlayers = manualController.searchPlayers.bind(manualController);
const getStatsSummary = manualController.getStatsSummary.bind(manualController);

/**
 * @route POST /api/manual/scrape-nba
 * @desc Start NBA players scraping process
 * @access Public
 */
router.post("/scrape-nba", scrapeNBAPlayers);

/**
 * @route GET /api/manual/players
 * @desc Get all current players data
 * @access Public
 */
router.get("/players", getPlayers);

/**
 * @route GET /api/manual/status
 * @desc Get scraping status and statistics
 * @access Public
 */
router.get("/status", getStatus);

/**
 * @route GET /api/manual/players/team/:teamName
 * @desc Get players by team
 * @access Public
 */
router.get("/players/team/:teamName", getPlayersByTeam);

/**
 * @route GET /api/manual/players/search
 * @desc Search players by name
 * @query {string} q - Search query
 * @access Public
 */
router.get("/players/search", searchPlayers);

/**
 * @route GET /api/manual/stats
 * @desc Get detailed statistics summary
 * @access Public
 */
router.get("/stats", getStatsSummary);

module.exports = router;
