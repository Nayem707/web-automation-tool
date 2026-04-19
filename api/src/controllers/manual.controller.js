const ManualService = require("../services/manual.service");
const Logger = require("../utils/logger");

/**
 * Manual Controller
 * Handles NBA player scraping and manual data operations
 */
class ManualController {
  constructor() {
    this.manualService = new ManualService();
  }

  /**
   * Start NBA players scraping process
   * POST /api/manual/scrape-nba
   */
  async scrapeNBAPlayers(req, res) {
    try {
      Logger.info("Starting NBA players scraping...");
      const startTime = Date.now();

      const result = await this.manualService.scrapeNBAPlayers();

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      Logger.success(`NBA scraping completed in ${duration} seconds`);

      res.status(200).json({
        success: true,
        message: "NBA players scraped successfully",
        data: result,
        stats: {
          totalPlayers: result.totalPlayers,
          duration: `${duration}s`,
          timestamp: result.timestamp,
        },
      });
    } catch (error) {
      Logger.error("NBA scraping failed:", error.message);

      res.status(500).json({
        success: false,
        message: "Failed to scrape NBA players",
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Get current players data
   * GET /api/manual/players
   */
  async getPlayers(req, res) {
    try {
      const players = await this.manualService.getCurrentPlayers();

      res.status(200).json({
        success: true,
        message: "Players data retrieved",
        data: players,
        stats: {
          totalPlayers: players.length,
          activePlayersCount: players.filter((p) => p.isActive).length,
          averageGamesPlayed:
            players.length > 0
              ? Math.round(
                  players.reduce((sum, p) => sum + (p.gamesPlayed || 0), 0) /
                    players.length,
                )
              : 0,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      Logger.error("Error retrieving players:", error.message);

      res.status(500).json({
        success: false,
        message: "Failed to retrieve players data",
        error: error.message,
      });
    }
  }

  /**
   * Get scraping status and statistics
   * GET /api/manual/status
   */
  async getStatus(req, res) {
    try {
      const playersData = await this.manualService.getPlayersWithMetadata();
      const players = playersData.players;

      const stats = {
        totalPlayers: players.length,
        scrapingMethod: playersData.scrapingInfo.scrapingMethod,
        lastScraped: playersData.scrapingInfo.scrapedAt,
        activePlayersCount: players.filter((p) => p.isActive).length,
        averageGamesPlayed:
          players.length > 0
            ? Math.round(
                players.reduce((sum, p) => sum + (p.gamesPlayed || 0), 0) /
                  players.length,
              )
            : 0,
        averagePoints:
          players.length > 0
            ? Math.round(
                (players.reduce((sum, p) => sum + (p.avgPoints || 0), 0) /
                  players.length) *
                  10,
              ) / 10
            : 0,
        teamsRepresented: [...new Set(players.map((p) => p.team))].filter(
          (t) => t !== "Unknown",
        ).length,
        playersWithErrors: players.filter((p) => p.error).length,
        samplePlayerIds: players.slice(0, 5).map((p) => p.playerId),
      };

      res.status(200).json({
        success: true,
        message: "NBA scraper status",
        data: stats,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      Logger.error("Error getting status:", error.message);

      res.status(500).json({
        success: false,
        message: "Failed to get status",
        error: error.message,
      });
    }
  }

  /**
   * Get players by team
   * GET /api/manual/players/team/:teamName
   */
  async getPlayersByTeam(req, res) {
    try {
      const { teamName } = req.params;
      const players = await this.manualService.getCurrentPlayers();

      const teamPlayers = players.filter((player) =>
        player.team.toLowerCase().includes(teamName.toLowerCase()),
      );

      res.status(200).json({
        success: true,
        message: `Players for ${teamName}`,
        data: teamPlayers,
        stats: {
          totalPlayers: teamPlayers.length,
          teamName: teamName,
        },
      });
    } catch (error) {
      Logger.error("Error getting team players:", error.message);

      res.status(500).json({
        success: false,
        message: "Failed to get team players",
        error: error.message,
      });
    }
  }

  /**
   * Search players by name or team
   * GET /api/manual/players/search?q=searchTerm
   */
  async searchPlayers(req, res) {
    try {
      const { q } = req.query;

      if (!q || q.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: "Search query must be at least 2 characters",
          error: "Invalid search query",
        });
      }

      const players = await this.manualService.getCurrentPlayers();
      const searchTerm = q.toLowerCase().trim();

      const matchingPlayers = players.filter(
        (player) =>
          player.firstName.toLowerCase().includes(searchTerm) ||
          player.lastName.toLowerCase().includes(searchTerm) ||
          `${player.firstName} ${player.lastName}`
            .toLowerCase()
            .includes(searchTerm) ||
          player.team.toLowerCase().includes(searchTerm) ||
          player.position.toLowerCase().includes(searchTerm) ||
          player.playerId.includes(searchTerm),
      );

      res.status(200).json({
        success: true,
        message: `Search results for "${q}"`,
        data: matchingPlayers,
        stats: {
          totalResults: matchingPlayers.length,
          searchTerm: q,
        },
      });
    } catch (error) {
      Logger.error("Error searching players:", error.message);

      res.status(500).json({
        success: false,
        message: "Failed to search players",
        error: error.message,
      });
    }
  }

  /**
   * Get player statistics summary
   * GET /api/manual/stats
   */
  async getStatsSummary(req, res) {
    try {
      const players = await this.manualService.getCurrentPlayers();

      if (players.length === 0) {
        return res.status(200).json({
          success: true,
          message: "No players data available",
          data: {
            totalPlayers: 0,
            message: "Run scraper first to get statistics",
          },
        });
      }

      const validPlayers = players.filter(
        (p) => p.firstName && p.firstName !== "Unknown",
      );

      const stats = {
        totalPlayers: players.length,
        validPlayers: validPlayers.length,
        gamesPlayedStats: {
          total: players.reduce((sum, p) => sum + (p.gamesPlayed || 0), 0),
          average:
            validPlayers.length > 0
              ? Math.round(
                  players.reduce((sum, p) => sum + (p.gamesPlayed || 0), 0) /
                    validPlayers.length,
                )
              : 0,
          max:
            players.length > 0
              ? Math.max(...players.map((p) => p.gamesPlayed || 0))
              : 0,
          min:
            players.length > 0
              ? Math.min(...players.map((p) => p.gamesPlayed || 0))
              : 0,
          playersWithStats: players.filter((p) => p.gamesPlayed > 0).length,
        },
        pointsStats: {
          average:
            validPlayers.length > 0
              ? Math.round(
                  (players.reduce((sum, p) => sum + (p.avgPoints || 0), 0) /
                    validPlayers.length) *
                    10,
                ) / 10
              : 0,
          max:
            players.length > 0
              ? Math.max(...players.map((p) => p.avgPoints || 0))
              : 0,
          topScorer:
            players.length > 0
              ? players.reduce(
                  (max, p) =>
                    (p.avgPoints || 0) > (max.avgPoints || 0) ? p : max,
                  players[0],
                )
              : null,
        },
        dataQuality: {
          playersWithCompleteInfo: players.filter(
            (p) =>
              p.firstName !== "Unknown" &&
              p.lastName !== "Player" &&
              p.team !== "Unknown" &&
              p.position !== "Unknown",
          ).length,
          playersWithStats: players.filter(
            (p) =>
              p.gamesPlayed > 0 ||
              p.avgPoints > 0 ||
              p.avgRebounds > 0 ||
              p.avgAssists > 0,
          ).length,
          playersWithErrors: players.filter((p) => p.error).length,
        },
        teams: [...new Set(players.map((p) => p.team))].filter(
          (t) => t && t !== "Unknown",
        ).length,
        positions: [...new Set(players.map((p) => p.position))].filter(
          (p) => p && p !== "Unknown",
        ).length,
      };

      res.status(200).json({
        success: true,
        message: "NBA players statistics summary",
        data: stats,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      Logger.error("Error getting stats summary:", error.message);

      res.status(500).json({
        success: false,
        message: "Failed to get statistics summary",
        error: error.message,
      });
    }
  }

  /**
   * Scrape complete League Roster (5122+ players)
   * POST /api/manual/scrape-league-roster
   * Based on the comprehensive NBA League Roster interface
   */
  async scrapeLeagueRoster(req, res) {
    try {
      Logger.info("Starting complete League Roster scraping (5122+ players)...");
      const startTime = Date.now();

      const result = await this.manualService.scrapeLeagueRosterComplete();

      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      Logger.success(`League Roster scraping completed in ${duration} seconds`);

      res.status(200).json({
        success: true,
        message: "Complete League Roster scraped successfully",
        data: result,
        stats: {
          totalPlayers: result.totalPlayers,
          totalFound: result.totalFound,
          successRate: result.successRate,
          method: result.method,
          duration: `${duration}s`,
          timestamp: result.timestamp,
          breakdown: {
            teams: result.stats?.teams || 0,
            positions: result.stats?.positions || 0,
            countries: result.stats?.countries || 0,
            historicIncluded: result.stats?.historicIncluded || false,
            paginationPages: result.stats?.paginationPages || 0
          }
        },
        samplePlayers: result.players?.slice(0, 10).map(p => ({
          name: `${p.firstName} ${p.lastName}`,
          team: p.team,
          position: p.position,
          height: p.height,
          weight: p.weight,
          college: p.college,
          country: p.nationality,
          isActive: p.isActive
        })) || []
      });
    } catch (error) {
      Logger.error("League Roster scraping failed:", error.message);

      res.status(500).json({
        success: false,
        message: "Failed to scrape complete League Roster",
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    }
  }
}

module.exports = ManualController;
