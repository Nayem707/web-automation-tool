const axios = require("axios");
const cheerio = require("cheerio");
const { v4: uuidv4 } = require("uuid");
const Logger = require("../utils/logger");
const fs = require("fs").promises;
const path = require("path");

/**
 * NBA Manual Scraper Service
 * Specialized service for scraping NBA player data with career statistics
 */
class ManualService {
  constructor() {
    this.baseUrl = "https://www.nba.com";
    this.playersUrl = "https://www.nba.com/players";
    this.dataPath = path.join(__dirname, "../data/players.json");
    this.maxRetries = 3;
    this.retryDelay = 1000;
    this.concurrencyLimit = 5;
    this.requestDelay = 500;
  }

  /**
   * Main scraper function - orchestrates the entire unlimited scraping process
   */
  async scrapeNBAPlayers() {
    try {
      Logger.info("🚀 Starting UNLIMITED NBA players scraping process...");

      // Reset any leftover stop flag from a previous run
      global.shouldStop = false;

      // Set up graceful interruption handling
      this.setupGracefulShutdown();

      // Step 1: Scrape ALL players from all pages
      Logger.info("📋 Fetching complete players list (all pages)...");
      const playersListData = await this.scrapePlayersList();

      Logger.success(
        `🎯 Found ${playersListData.length} total players across all pages`,
      );

      if (playersListData.length === 0) {
        throw new Error("No players found on NBA.com players page");
      }

      // Step 2: Process ALL players for detailed stats with progressive saving
      Logger.info("📊 Starting detailed player data extraction...");
      Logger.info(
        "💡 TIP: You can stop this process anytime with Ctrl+C and your progress will be saved!",
      );

      const detailedPlayers =
        await this.processPlayersWithStats(playersListData);

      // Step 3: Final save (redundant but safe)
      await this.savePlayersData(detailedPlayers);

      const successRate = Math.round(
        (detailedPlayers.length / playersListData.length) * 100,
      );

      Logger.success(
        `🎉 Successfully scraped ${detailedPlayers.length}/${playersListData.length} NBA players (${successRate}% success rate)`,
      );

      return {
        totalPlayers: detailedPlayers.length,
        totalFound: playersListData.length,
        successRate: `${successRate}%`,
        timestamp: new Date().toISOString(),
        players: detailedPlayers,
      };
    } catch (error) {
      Logger.error("❌ Error in NBA scraping process:", error.message);

      // Even on error, try to return any data we managed to collect
      try {
        const existingPlayers = await this.loadPlayersData();
        if (existingPlayers && existingPlayers.length > 0) {
          Logger.info(
            `💾 Returning ${existingPlayers.length} players from saved progress`,
          );
          return {
            totalPlayers: existingPlayers.length,
            timestamp: new Date().toISOString(),
            players: existingPlayers,
            error: error.message,
          };
        }
      } catch (loadError) {
        Logger.warn("Could not load existing data on error recovery");
      }

      throw error;
    }
  }

  /**
   * Setup graceful shutdown handling
   */
  setupGracefulShutdown() {
    // Handle SIGINT (Ctrl+C) gracefully
    process.on("SIGINT", () => {
      Logger.warn("🛑 Received interrupt signal (Ctrl+C)");
      Logger.info("🔄 Finishing current chunk and saving progress...");
      Logger.info("💡 Your scraped data has been saved and will be preserved!");
      global.shouldStop = true;
    });

    // Handle SIGTERM (process termination)
    process.on("SIGTERM", () => {
      Logger.warn("🛑 Received termination signal");
      Logger.info("💾 Saving progress before exit...");
      global.shouldStop = true;
    });
  }

  /**
   * Fetch all active NBA players using the NBA Stats JSON API.
   * stats.nba.com/stats/commonallplayers returns ALL players in one request —
   * no pagination needed. NBA.com/players is a React SPA and only has 50
   * players in static HTML, so direct HTML scraping is intentionally avoided.
   */
  async scrapePlayersList() {
    const currentYear = new Date().getFullYear();
    // NBA season format: if we're past June use current year, otherwise previous
    const seasonStart =
      new Date().getMonth() >= 6 ? currentYear : currentYear - 1;
    const season = `${seasonStart}-${String(seasonStart + 1).slice(-2)}`;

    const statsApiUrl =
      `https://stats.nba.com/stats/commonallplayers` +
      `?IsOnlyCurrentSeason=1&LeagueID=00&Season=${season}`;

    Logger.info(
      `Fetching all active players from NBA Stats API (season ${season})...`,
    );
    Logger.info(`URL: ${statsApiUrl}`);

    try {
      const response = await this.makeStatsApiRequest(statsApiUrl);

      const resultSet =
        response.data &&
        response.data.resultSets &&
        response.data.resultSets[0];

      if (!resultSet || !Array.isArray(resultSet.rowSet)) {
        throw new Error("Unexpected response structure from NBA Stats API");
      }

      const headers = resultSet.headers; // e.g. ["PERSON_ID","DISPLAY_LAST_COMMA_FIRST",...]
      const rows = resultSet.rowSet;

      const idIdx = headers.indexOf("PERSON_ID");
      const nameIdx = headers.indexOf("DISPLAY_LAST_COMMA_FIRST"); // "James, LeBron"
      const firstIdx = headers.indexOf("DISPLAY_FIRST_LAST"); // "LeBron James"
      const activeIdx = headers.indexOf("ROSTERSTATUS"); // 1 = rostered

      Logger.info(`NBA Stats API returned ${rows.length} players`);

      const players = [];
      for (const row of rows) {
        const playerId = String(row[idIdx]);
        if (!playerId || playerId === "0") continue;

        // Prefer "LeBron James" format; fall back to reversing "James, LeBron"
        let fullName = firstIdx >= 0 ? row[firstIdx] : "";
        if (!fullName && nameIdx >= 0 && row[nameIdx]) {
          const parts = row[nameIdx].split(", ");
          fullName =
            parts.length === 2 ? `${parts[1]} ${parts[0]}` : row[nameIdx];
        }
        fullName = (fullName || "").trim();

        const nameParts = fullName.split(/\s+/);
        const firstName = nameParts[0] || "Unknown";
        const lastName = nameParts.slice(1).join(" ") || "Player";

        players.push({
          playerId,
          rawText: fullName,
          firstName,
          lastName,
          extractedAt: new Date().toISOString(),
        });
      }

      Logger.success(
        `Extracted ${players.length} active NBA players from Stats API`,
      );
      return players;
    } catch (error) {
      Logger.error("Error fetching players from NBA Stats API:", error.message);
      throw error;
    }
  }

  /**
   * Extract player data from a table row
   */
  extractPlayerFromRow($, row) {
    const $row = $(row);

    // Try to extract player ID from player link
    const playerId = this.extractPlayerIdFromRow($row);
    if (!playerId) return null;

    // Extract player name from the link text or cells
    const playerNameLink = $row.find('a[href*="/player/"]').first();
    const fullName = playerNameLink.text().trim();

    // Split name into first and last
    const nameParts = fullName.split(/\s+/);
    const firstName = nameParts[0] || "Unknown";
    const lastName = nameParts.slice(1).join(" ") || "Player";

    // Extract team from team cell or link
    const teamCell =
      $row.find("td").eq(1) || $row.find('.team-cell, [data-testid="team"]');
    const teamLink = teamCell.find("a").first();
    const team = teamLink.text().trim() || teamCell.text().trim() || "Unknown";

    // Extract position
    const positionCell =
      $row.find("td").eq(3) ||
      $row.find('.position-cell, [data-testid="position"]');
    const position = positionCell.text().trim() || "Unknown";

    // Try to get player image from the row or construct it
    let imageUrl = $row.find("img").first().attr("src");
    if (!imageUrl && playerId) {
      // Construct NBA headshot URL pattern
      imageUrl = `https://cdn.nba.com/headshots/nba/latest/1040x760/${playerId}.png`;
    }

    return {
      playerId,
      firstName,
      lastName,
      team: team || "Free Agent",
      position: position || "Unknown",
      image: imageUrl,
    };
  }

  /**
   * Extract player ID from table row
   */
  extractPlayerIdFromRow($row) {
    // Look for player profile link in the row
    const playerLinks = $row.find('a[href*="/player/"]');

    for (let i = 0; i < playerLinks.length; i++) {
      const link = playerLinks.eq(i);
      const href = link.attr("href");

      if (href) {
        // Extract player ID from URL like /player/1234 or /player/1234/profile
        const match = href.match(/\/player\/(\d+)/);
        if (match && match[1]) {
          return match[1];
        }
      }
    }

    // Try data attributes as fallback
    const dataId =
      $row.attr("data-player-id") ||
      $row.find("[data-player-id]").attr("data-player-id");
    if (dataId) return dataId;

    return null;
  }

  /**
   * Extract text content with fallback handling
   */
  extractText($elem, selectors) {
    const selectorList = selectors.split(", ");

    for (const selector of selectorList) {
      const text = $elem.find(selector).first().text().trim();
      if (text) return text;
    }

    return "";
  }

  /**
   * Extract image URL with various fallbacks
   */
  extractImageUrl($elem) {
    // Try img src
    let imgSrc = $elem.find("img").first().attr("src");
    if (!imgSrc)
      imgSrc = $elem.find('[data-testid="player-image"] img').attr("src");

    if (imgSrc && imgSrc.startsWith("//")) {
      imgSrc = "https:" + imgSrc;
    } else if (imgSrc && imgSrc.startsWith("/")) {
      imgSrc = this.baseUrl + imgSrc;
    }

    return imgSrc || null;
  }

  /**
   * Fallback extraction method when main selectors fail
   */
  async fallbackPlayerExtraction($) {
    Logger.info("Attempting fallback player extraction...");
    const players = [];

    // Look for any links that contain player IDs
    $('a[href*="/player/"]').each((i, elem) => {
      const $elem = $(elem);
      const href = $elem.attr("href");
      const match = href.match(/\/player\/(\d+)/);

      if (match) {
        const playerId = match[1];
        const text = $elem.text().trim();

        // Try to parse name from text
        const nameParts = text.split(/\s+/);
        const firstName = nameParts[0] || "Unknown";
        const lastName = nameParts.slice(1).join(" ") || "Player";

        players.push({
          playerId,
          firstName,
          lastName,
          team: "Unknown",
          position: "Unknown",
          image: null,
        });
      }
    });

    return players;
  }

  /**
   * Process players with detailed statistics from individual profiles
   * Implements progressive saving - saves data after each chunk so stopping preserves progress
   */
  async processPlayersWithStats(playersListData) {
    const results = [];
    const chunks = this.chunkArray(playersListData, this.concurrencyLimit);

    Logger.info(`🚀 Starting unlimited player processing...`);
    Logger.info(`📊 Total players to process: ${playersListData.length}`);
    Logger.info(
      `📦 Split into ${chunks.length} chunks of ${this.concurrencyLimit} players each`,
    );
    Logger.info(
      `💾 Progressive saving enabled - data will be saved after each chunk`,
    );

    for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex++) {
      const chunk = chunks[chunkIndex];
      const chunkStartTime = Date.now();

      Logger.info(
        `Processing chunk ${chunkIndex + 1}/${chunks.length} (${chunk.length} players)...`,
      );

      const promises = chunk.map(async (playerData, index) => {
        // Add delay to avoid overwhelming the server
        await this.delay(index * this.requestDelay);
        return this.scrapePlayerProfile(playerData);
      });

      const chunkResults = await Promise.allSettled(promises);
      const chunkSuccessCount = chunkResults.filter(
        (r) => r.status === "fulfilled" && r.value,
      ).length;

      chunkResults.forEach((result, index) => {
        if (result.status === "fulfilled" && result.value) {
          results.push(result.value);
        } else {
          Logger.warn(
            `Failed to process player: ${chunk[index].rawText || chunk[index].playerId}`,
          );
        }
      });

      const chunkDuration = ((Date.now() - chunkStartTime) / 1000).toFixed(2);
      Logger.success(
        `✅ Chunk ${chunkIndex + 1}/${chunks.length} completed: ${chunkSuccessCount}/${chunk.length} players successfully processed in ${chunkDuration}s`,
      );

      // 🔄 PROGRESSIVE SAVING - Save after each chunk
      try {
        await this.savePlayersData(results);
        Logger.info(`💾 Progress saved: ${results.length} players total`);
      } catch (saveError) {
        Logger.warn(
          `Failed to save progress after chunk ${chunkIndex + 1}:`,
          saveError.message,
        );
        // Don't throw here - continue processing even if save fails
      }

      // Progress report
      const totalProgress = Math.round(
        ((chunkIndex + 1) / chunks.length) * 100,
      );
      const estimatedTimeRemaining =
        ((Date.now() - chunkStartTime) / 1000) *
        (chunks.length - chunkIndex - 1);

      Logger.info(
        `📈 Progress: ${totalProgress}% complete (${results.length}/${playersListData.length} players processed)`,
      );

      if (estimatedTimeRemaining > 0) {
        Logger.info(
          `⏱️ Estimated time remaining: ${Math.round(estimatedTimeRemaining / 60)} minutes`,
        );
      }

      // Add graceful interruption handling
      if (global.shouldStop) {
        // Can be set by signal handlers
        Logger.warn(
          `⚠️ Graceful stop requested. Stopping after chunk ${chunkIndex + 1}`,
        );
        Logger.info(
          `💾 Final save with ${results.length} players completed successfully`,
        );
        break;
      }

      // Delay between chunks (longer for unlimited scraping)
      if (chunkIndex < chunks.length - 1) {
        Logger.info(`⏳ Waiting 3 seconds before next chunk...`);
        await this.delay(3000);
      }
    }

    // Final save to ensure everything is persisted
    try {
      await this.savePlayersData(results);
      Logger.success(
        `🎉 All processing complete! Final save: ${results.length} players`,
      );
    } catch (finalSaveError) {
      Logger.error(`Failed final save:`, finalSaveError.message);
    }

    return results;
  }

  /**
   * Scrape individual player profile and extract structured information
   */
  async scrapePlayerProfile(playerData) {
    try {
      // Initialize player data with complete structure matching the expected format
      const player = {
        id: uuidv4(),
        firstName: "Unknown",
        lastName: "Player",
        team: "Unknown",
        era: "2020s", // Current era for active players
        position: "Unknown",
        image: null,
        height: null,
        weight: null,
        birthDate: null,
        nationality: "USA",
        yearsActive: null,
        championships: 0,
        biography: null,
        gamesPlayed: 0,
        avgPoints: 0,
        avgRebounds: 0,
        avgAssists: 0,
        difficulty: 1, // Default difficulty level
        isActive: true,
        addedBy: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Extract name from roster data
      if (playerData.rawText) {
        const nameParts = playerData.rawText.split(/\s+/);
        if (nameParts.length > 0) {
          player.firstName = nameParts[0];
          if (nameParts.length > 1) {
            player.lastName = nameParts.slice(1).join(" ");
          }
        }
      }

      // 1. Extract data from career stats page
      try {
        const statsUrl = `${this.baseUrl}/stats/player/${playerData.playerId}/career`;
        Logger.info(`Scraping player stats: ${statsUrl}`);
        const statsResponse = await this.makeRequest(statsUrl);
        const $stats = cheerio.load(statsResponse.data);

        const careerStats = this.extractCareerStatsFromStatsPage($stats);
        player.gamesPlayed = careerStats.gamesPlayed;
        player.avgPoints = careerStats.avgPoints;
        player.avgRebounds = careerStats.avgRebounds;
        player.avgAssists = careerStats.avgAssists;
      } catch (error) {
        Logger.warn(
          `Failed to get career stats for ${playerData.playerId}:`,
          error.message,
        );
      }

      // 2. Extract data from player profile page
      try {
        const profileUrl = `${this.baseUrl}/player/${playerData.playerId}`;
        Logger.info(`Scraping player profile: ${profileUrl}`);
        const profileResponse = await this.makeRequest(profileUrl);
        const $profile = cheerio.load(profileResponse.data);

        const profileData = this.extractPlayerInfoFromProfile(
          $profile,
          playerData.playerId,
        );

        // Merge profile data
        if (profileData.firstName) player.firstName = profileData.firstName;
        if (profileData.lastName) player.lastName = profileData.lastName;
        if (profileData.team) player.team = profileData.team;
        if (profileData.position) player.position = profileData.position;
        if (profileData.height) player.height = profileData.height;
        if (profileData.weight) player.weight = profileData.weight;
        if (profileData.birthDate) player.birthDate = profileData.birthDate;
        if (profileData.nationality)
          player.nationality = profileData.nationality;
        if (profileData.image) player.image = profileData.image;
      } catch (error) {
        Logger.warn(
          `Failed to get profile for ${playerData.playerId}:`,
          error.message,
        );
      }

      // Set default image if none found
      if (!player.image) {
        player.image = `https://cdn.nba.com/headshots/nba/latest/1040x760/${playerData.playerId}.png`;
      }

      Logger.success(
        `Player info extracted: ${player.firstName} ${player.lastName} (${player.playerId})`,
      );
      return player;
    } catch (error) {
      Logger.warn(
        `Error extracting player info for ${playerData.playerId}:`,
        error.message,
      );

      // Return basic player structure with error info
      return {
        id: uuidv4(),
        firstName: "Unknown",
        lastName: "Player",
        team: "Unknown",
        era: "2020s",
        position: "Unknown",
        image: `https://cdn.nba.com/headshots/nba/latest/1040x760/${playerData.playerId}.png`,
        height: null,
        weight: null,
        birthDate: null,
        nationality: "USA",
        yearsActive: null,
        championships: 0,
        biography: null,
        gamesPlayed: 0,
        avgPoints: 0,
        avgRebounds: 0,
        avgAssists: 0,
        difficulty: 1,
        isActive: true,
        addedBy: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  }

  /**
   * Extract career statistics from the stats page
   */
  extractCareerStatsFromStatsPage($) {
    const stats = {
      gamesPlayed: 0,
      avgPoints: 0,
      avgRebounds: 0,
      avgAssists: 0,
    };

    try {
      // Look for career totals in the stats page
      // This page typically has a summary section with career totals
      let $statsTable = null;

      // Try different selectors for stats tables
      const tableSelectors = [
        'table[data-testid="career-stats-table"]',
        ".stats-table",
        ".career-stats-table",
        "table.nba-stat-table",
        "table",
      ];

      for (const selector of tableSelectors) {
        $statsTable = $(selector);
        if ($statsTable.length > 0) {
          const tableText = $statsTable.text().toLowerCase();
          // Verify this table contains career stats
          if (
            tableText.includes("gp") ||
            tableText.includes("games") ||
            tableText.includes("pts") ||
            tableText.includes("career")
          ) {
            Logger.info(`Found stats table with selector: ${selector}`);
            break;
          }
        }
        $statsTable = null;
      }

      // If we found a stats table, extract the data
      if ($statsTable && $statsTable.length > 0) {
        // Look for the career totals row (usually the last or summary row)
        const rows = $statsTable.find("tbody tr, tr");

        // Try to find career totals row or use the last row with data
        let $careerRow = null;

        rows.each((i, row) => {
          const $row = $(row);
          const rowText = $row.text().toLowerCase();

          // Look for "career" or "total" indicators
          if (
            rowText.includes("career") ||
            rowText.includes("total") ||
            (i === rows.length - 1 && $row.find("td").length > 5)
          ) {
            $careerRow = $row;
          }
        });

        if ($careerRow) {
          stats.gamesPlayed = this.extractStatFromRow($statsTable, $careerRow, [
            "GP",
            "G",
            "Games",
          ]);
          stats.avgPoints = this.extractStatFromRow($statsTable, $careerRow, [
            "PPG",
            "PTS",
            "Points",
          ]);
          stats.avgRebounds = this.extractStatFromRow($statsTable, $careerRow, [
            "RPG",
            "REB",
            "Rebounds",
          ]);
          stats.avgAssists = this.extractStatFromRow($statsTable, $careerRow, [
            "APG",
            "AST",
            "Assists",
          ]);
        }
      }

      // If no stats found yet, try fallback extraction
      if (stats.gamesPlayed === 0) {
        Logger.warn(
          "No career stats found in main table, trying fallback extraction...",
        );
        this.extractStatsFromAnywhere($, stats);
      }
    } catch (error) {
      Logger.warn(
        "Error extracting career stats from stats page:",
        error.message,
      );
    }

    return stats;
  }

  /**
   * Fallback method to extract stats from anywhere on the page
   */
  extractStatsFromAnywhere($, stats) {
    try {
      // Look for any numbers that might be stats
      const pageText = $("body").text();

      // Try to find games played patterns
      const gpMatches = pageText.match(/(\d+)\s*(?:GP|Games\s*Played|Games)/i);
      if (gpMatches && gpMatches[1]) {
        const gp = parseInt(gpMatches[1]);
        if (gp > 0 && gp < 2000) {
          // reasonable range
          stats.gamesPlayed = gp;
        }
      }

      // Try to find points patterns
      const ptsMatches = pageText.match(/(\d+\.?\d*)\s*(?:PPG|Points|PTS)/i);
      if (ptsMatches && ptsMatches[1]) {
        const pts = parseFloat(ptsMatches[1]);
        if (pts > 0 && pts < 50) {
          // reasonable range
          stats.avgPoints = pts;
        }
      }

      // Try to find rebounds patterns
      const rebMatches = pageText.match(/(\d+\.?\d*)\s*(?:RPG|Rebounds|REB)/i);
      if (rebMatches && rebMatches[1]) {
        const reb = parseFloat(rebMatches[1]);
        if (reb > 0 && reb < 30) {
          // reasonable range
          stats.avgRebounds = reb;
        }
      }

      // Try to find assists patterns
      const astMatches = pageText.match(/(\d+\.?\d*)\s*(?:APG|Assists|AST)/i);
      if (astMatches && astMatches[1]) {
        const ast = parseFloat(astMatches[1]);
        if (ast > 0 && ast < 20) {
          // reasonable range
          stats.avgAssists = ast;
        }
      }
    } catch (error) {
      Logger.warn("Error in fallback stats extraction:", error.message);
    }
  }

  /**
   * Extract stat value from a table row by matching column headers
   */
  extractStatFromRow($table, $row, statNames) {
    try {
      // Get headers to map column positions
      const $headers = $table.find("thead th, th, .header");

      for (const statName of statNames) {
        // Find the column index for this stat
        let columnIndex = -1;

        $headers.each((i, header) => {
          const headerText = $(header).text().trim().toUpperCase();
          if (
            headerText === statName.toUpperCase() ||
            headerText.includes(statName.toUpperCase())
          ) {
            columnIndex = i;
            return false; // break
          }
        });

        if (columnIndex >= 0) {
          const $cells = $row.find("td");
          if ($cells.length > columnIndex) {
            const value = $cells.eq(columnIndex).text().trim();
            const numValue = parseFloat(value.replace(/,/g, ""));
            if (!isNaN(numValue)) {
              return numValue;
            }
          }
        }
      }

      return 0;
    } catch (error) {
      Logger.warn(`Error extracting stat from row:`, error.message);
      return 0;
    }
  }

  /**
   * Extract player information from profile page
   */
  extractPlayerInfoFromProfile($, playerId) {
    const playerInfo = {
      firstName: "Unknown",
      lastName: "Player",
      team: "Unknown",
      position: "Unknown",
      height: null,
      weight: null,
      birthDate: null,
      nationality: "USA",
      image: null,
    };

    try {
      Logger.info(`Extracting profile info for player ${playerId}`);

      // 1. Extract player name - try multiple selectors for name
      const nameSelectors = [
        'h1[class*="PlayerSummary"]',
        ".PlayerHeader h1",
        'h1[data-testid="player-name"]',
        ".player-header h1",
        ".player-name h1",
        "h1",
        ".PlayerSummary_info h1",
        ".player-summary h1",
      ];

      let fullName = "";
      for (const selector of nameSelectors) {
        const nameEl = $(selector).first();
        if (nameEl.length > 0) {
          const text = nameEl.text().trim().toUpperCase();
          if (
            text &&
            text.length > 2 &&
            !text.includes("NBA") &&
            !text.includes("STATS")
          ) {
            fullName = text;
            Logger.info(
              `Found player name: ${fullName} using selector: ${selector}`,
            );
            break;
          }
        }
      }

      // Split name into first/last
      if (fullName) {
        const nameParts = fullName.split(/\s+/);
        if (nameParts.length >= 1) {
          playerInfo.firstName = nameParts[0];
          if (nameParts.length > 1) {
            playerInfo.lastName = nameParts.slice(1).join(" ");
          }
        }
      }

      // 2. Extract team and position - target the precise NBA.com format
      let foundTeamPosition = false;

      // First, try the page title which has format: "Player Name | Position | Team | NBA.com"
      const pageTitle = $("title").text();
      if (pageTitle) {
        Logger.info(`Page title: ${pageTitle}`);
        const titleMatch = pageTitle.match(
          /.*?\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*NBA\.com/,
        );
        if (titleMatch) {
          playerInfo.position = titleMatch[1].trim();
          playerInfo.team = titleMatch[2].trim();
          Logger.info(
            `Extracted from title - Team: ${playerInfo.team}, Position: ${playerInfo.position}`,
          );
          foundTeamPosition = true;
        }
      }

      // If not found in title, look for the paragraph with "Team | #Number | Position" format
      if (!foundTeamPosition) {
        $("p").each((i, elem) => {
          const text = $(elem).text().trim();
          // Match format like "Los Angeles Lakers | #23 | Forward"
          const match = text.match(
            /^([A-Za-z\s]+(?:Lakers|Warriors|Celtics|Heat|Bulls|Bucks|Suns|Nets|76ers|Raptors|Nuggets|Jazz|Blazers|Thunder|Spurs|Rockets|Grizzlies|Pelicans|Kings|Timberwolves|Clippers|Mavericks|Pacers|Hornets|Pistons|Hawks|Cavaliers|Knicks|Magic|Wizards|[A-Za-z\s]{6,}))\s*\|\s*#\d+\s*\|\s*([A-Za-z\/\s]+)$/,
          );

          if (match) {
            playerInfo.team = match[1].trim();
            playerInfo.position = match[2].trim();
            Logger.info(
              `Extracted from paragraph - Team: ${playerInfo.team}, Position: ${playerInfo.position}`,
            );
            foundTeamPosition = true;
            return false; // Break out of each loop
          }
        });
      }

      // Fallback: look for any paragraph containing team and position keywords
      if (!foundTeamPosition) {
        $("p").each((i, elem) => {
          const text = $(elem).text().trim();
          if (text && text.includes("|") && text.length < 100) {
            // Try simpler team | position pattern
            const parts = text.split("|").map((p) => p.trim());
            if (parts.length >= 3) {
              // Format: Team | #Number | Position
              const potentialTeam = parts[0];
              const potentialPosition = parts[2];

              if (
                potentialTeam.length > 3 &&
                potentialTeam.length < 30 &&
                potentialPosition.length > 1 &&
                potentialPosition.length < 20
              ) {
                playerInfo.team = potentialTeam;
                playerInfo.position = potentialPosition;
                Logger.info(
                  `Extracted via fallback - Team: ${playerInfo.team}, Position: ${playerInfo.position}`,
                );
                foundTeamPosition = true;
                return false;
              }
            }
          }
        });
      }

      // 3. Extract physical stats
      const statsContainer = $("body");
      const bodyText = statsContainer.text();

      // Height pattern (7'2, 6'11, etc) and convert to centimeters
      const heightMatch = bodyText.match(/(\d+)'(\d+)(?:\s*\([\d.]+m\))?/);
      if (heightMatch) {
        const feet = parseInt(heightMatch[1]);
        const inches = parseInt(heightMatch[2]);
        const totalInches = feet * 12 + inches;
        const cm = Math.round(totalInches * 2.54);
        playerInfo.height = `${cm}cm`;
        Logger.info(
          `Extracted height: ${heightMatch[1]}'${heightMatch[2]} -> ${playerInfo.height}`,
        );
      }

      // Weight pattern (225lb, 200 lbs, etc) and convert to kilograms
      const weightMatch = bodyText.match(
        /(\d+)\s*(?:lb|lbs|LB)(?:s?)(?:\s*\([^)]+\))?/,
      );
      if (weightMatch) {
        const lbs = parseInt(weightMatch[1]);
        const kg = Math.round(lbs * 0.453592);
        playerInfo.weight = `${kg}kg`;
        Logger.info(
          `Extracted weight: ${weightMatch[1]}lb -> ${playerInfo.weight}`,
        );
      }

      // Birth date pattern (April 16, 1947)
      const birthDateMatch = bodyText.match(
        /((?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+\d{4})/,
      );
      if (birthDateMatch) {
        playerInfo.birthDate = birthDateMatch[1];
        Logger.info(`Extracted birth date: ${playerInfo.birthDate}`);
      }

      // Country/nationality - be more precise to avoid garbage text
      const commonCountries = [
        "USA",
        "Canada",
        "France",
        "Germany",
        "Spain",
        "Greece",
        "Nigeria",
        "Australia",
        "Brazil",
        "Argentina",
        "Serbia",
        "Slovenia",
        "Croatia",
        "Lithuania",
        "Turkey",
        "Israel",
        "Russia",
        "China",
        "Japan",
        "United States",
        "United Kingdom",
      ];

      // Try multiple precise patterns
      let foundCountry = false;

      // Pattern 1: Look for "USA", "COUNTRY USA" format
      const countryPattern1 = bodyText.match(/\b(USA|United States)\b/i);
      if (countryPattern1) {
        playerInfo.nationality = "USA";
        foundCountry = true;
        Logger.info(
          `Extracted nationality (pattern 1): ${playerInfo.nationality}`,
        );
      }

      // Pattern 2: Look for other common countries
      if (!foundCountry) {
        for (const country of commonCountries) {
          if (country === "USA" || country === "United States") continue; // Already checked

          const regex = new RegExp(`\\b${country}\\b`, "i");
          if (bodyText.match(regex)) {
            playerInfo.nationality = country;
            foundCountry = true;
            Logger.info(
              `Extracted nationality (pattern 2): ${playerInfo.nationality}`,
            );
            break;
          }
        }
      }

      // Pattern 3: Look for birth location format "Born in City, Country"
      if (!foundCountry) {
        const birthMatch = bodyText.match(
          /Born in [^,]+,\s*([A-Za-z]+)(?:\s|$)/i,
        );
        if (birthMatch && commonCountries.includes(birthMatch[1])) {
          playerInfo.nationality = birthMatch[1];
          foundCountry = true;
          Logger.info(
            `Extracted nationality (birth pattern): ${playerInfo.nationality}`,
          );
        }
      }

      // 4. Extract image URL
      const imageSelectors = [
        `img[src*="headshots"][src*="${playerId}"]`,
        ".PlayerSummary_headshot img",
        ".player-photo img",
        ".player-image img",
        'img[alt*="headshot"]',
        'img[src*="1040x760"]',
      ];

      for (const selector of imageSelectors) {
        const img = $(selector).first();
        if (img.length > 0) {
          let src = img.attr("src");
          if (src) {
            if (src.startsWith("//")) src = "https:" + src;
            else if (src.startsWith("/")) src = this.baseUrl + src;
            playerInfo.image = src;
            Logger.info(`Extracted image: ${playerInfo.image}`);
            break;
          }
        }
      }

      // 5. Try to extract from structured JSON data as fallback
      const scriptTags = $(
        'script[type="application/json"], script[type="application/ld+json"]',
      );
      scriptTags.each((i, elem) => {
        try {
          const jsonText = $(elem).html();
          if (jsonText) {
            const jsonData = JSON.parse(jsonText);
            const playerData = this.findPlayerDataInJSON(jsonData);
            if (playerData) {
              if (playerData.FIRST_NAME && playerInfo.firstName === "Unknown") {
                playerInfo.firstName = playerData.FIRST_NAME;
              }
              if (playerData.LAST_NAME && playerInfo.lastName === "Player") {
                playerInfo.lastName = playerData.LAST_NAME;
              }
              if (
                playerData.TEAM_ABBREVIATION &&
                playerInfo.team === "Unknown"
              ) {
                playerInfo.team = playerData.TEAM_ABBREVIATION;
              }
              if (playerData.POSITION && playerInfo.position === "Unknown") {
                playerInfo.position = playerData.POSITION;
              }
            }
          }
        } catch (e) {
          // Continue to next script tag
        }
      });

      Logger.info(`Final player info: ${JSON.stringify(playerInfo, null, 2)}`);
    } catch (error) {
      Logger.warn(
        `Error extracting profile info for ${playerId}:`,
        error.message,
      );
    }

    return playerInfo;
  }

  /**
   * Find player data in nested JSON object
   */
  findPlayerDataInJSON(obj) {
    if (typeof obj !== "object" || obj === null) return null;

    // Check if this object has player properties
    if (obj.PERSON_ID || obj.PLAYER_ID || obj.playerId) {
      return obj;
    }

    // Recursively search
    for (const key in obj) {
      if (key === "player" || key === "info" || key === "profile") {
        const result = this.findPlayerDataInJSON(obj[key]);
        if (result) return result;
      }
    }

    return null;
  }

  /**
   * Extract player info from HTML elements (fallback)
   */
  extractPlayerInfoFromHTML($, playerInfo) {
    // Try various selectors for name
    const nameSelectors = [
      ".PlayerSummary_name h1",
      ".player-name h1",
      ".player-header h1",
      "h1",
    ];

    for (const selector of nameSelectors) {
      const nameEl = $(selector).first();
      if (nameEl.length > 0) {
        const fullName = nameEl.text().trim();
        if (fullName && fullName.includes(" ")) {
          const nameParts = fullName.split(/\s+/);
          playerInfo.firstName = nameParts[0];
          playerInfo.lastName = nameParts.slice(1).join(" ");
          break;
        }
      }
    }

    // Extract team
    const teamSelectors = [
      ".PlayerSummary_team",
      ".player-team",
      '[data-testid="team-name"]',
    ];

    for (const selector of teamSelectors) {
      const teamEl = $(selector).first();
      if (teamEl.length > 0) {
        const team = teamEl.text().trim();
        if (team) {
          playerInfo.team = team;
          break;
        }
      }
    }

    // Extract position
    const positionSelectors = [
      ".PlayerSummary_position",
      ".player-position",
      '[data-testid="position"]',
    ];

    for (const selector of positionSelectors) {
      const posEl = $(selector).first();
      if (posEl.length > 0) {
        const position = posEl.text().trim();
        if (position) {
          playerInfo.position = position;
          break;
        }
      }
    }
  }

  /**
   * Fallback method to extract stats from anywhere on the page
   */
  extractStatsFromAnywhere($, stats) {
    try {
      // Look for any numbers that might be stats
      const pageText = $("body").text();

      // Try to find games played patterns
      const gpMatches = pageText.match(/(\d+)\s*(?:GP|Games\s*Played|Games)/i);
      if (gpMatches && gpMatches[1]) {
        const gp = parseInt(gpMatches[1]);
        if (gp > 0 && gp < 2000) {
          // reasonable range
          stats.gamesPlayed = gp;
        }
      }

      // Try to find points patterns
      const ptsMatches = pageText.match(/(\d+\.?\d*)\s*(?:PPG|Points|PTS)/i);
      if (ptsMatches && ptsMatches[1]) {
        const pts = parseFloat(ptsMatches[1]);
        if (pts > 0 && pts < 50) {
          // reasonable range
          stats.avgPoints = pts;
        }
      }

      // Try to find rebounds patterns
      const rebMatches = pageText.match(/(\d+\.?\d*)\s*(?:RPG|Rebounds|REB)/i);
      if (rebMatches && rebMatches[1]) {
        const reb = parseFloat(rebMatches[1]);
        if (reb > 0 && reb < 30) {
          // reasonable range
          stats.avgRebounds = reb;
        }
      }

      // Try to find assists patterns
      const astMatches = pageText.match(/(\d+\.?\d*)\s*(?:APG|Assists|AST)/i);
      if (astMatches && astMatches[1]) {
        const ast = parseFloat(astMatches[1]);
        if (ast > 0 && ast < 20) {
          // reasonable range
          stats.avgAssists = ast;
        }
      }
    } catch (error) {
      Logger.warn("Error in fallback stats extraction:", error.message);
    }
  }

  /**
   * Save structured players data to JSON file
   */
  async savePlayersData(players) {
    try {
      // Create backup of existing data
      try {
        const existingData = await fs.readFile(this.dataPath, "utf8");
        const backupPath =
          this.dataPath +
          ".backup." +
          new Date().toISOString().replace(/[:.]/g, "-");
        await fs.writeFile(backupPath, existingData);
        Logger.info(`Backup created: ${backupPath}`);
      } catch (error) {
        // File might not exist, that's ok
      }

      // Write structured player data
      await fs.writeFile(this.dataPath, JSON.stringify(players, null, 2));
      Logger.success(
        `Players data saved to: ${this.dataPath} (${players.length} players)`,
      );
    } catch (error) {
      Logger.error("Error saving players data:", error.message);
      throw error;
    }
  }

  /**
   * Load existing players data from JSON file
   */
  async loadPlayersData() {
    try {
      const data = await fs.readFile(this.dataPath, "utf8");
      const players = JSON.parse(data);
      return Array.isArray(players) ? players : [];
    } catch (error) {
      Logger.warn("Could not load existing players data:", error.message);
      return [];
    }
  }

  /**
   * Make HTTP request with retries and proper error handling
   */
  async makeRequest(url, attempt = 1) {
    try {
      const response = await axios.get(url, {
        timeout: 30000,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          "Accept-Encoding": "gzip, deflate",
          Connection: "keep-alive",
          "Upgrade-Insecure-Requests": "1",
        },
      });

      return response;
    } catch (error) {
      if (attempt < this.maxRetries) {
        Logger.warn(
          `Request failed (attempt ${attempt}/${this.maxRetries}), retrying: ${url}`,
        );
        await this.delay(this.retryDelay * attempt);
        return this.makeRequest(url, attempt + 1);
      }
      throw error;
    }
  }

  /**
   * Make a request to the NBA Stats API (stats.nba.com).
   * Requires special headers (Referer + Origin) — without them the API returns 403.
   */
  async makeStatsApiRequest(url, attempt = 1) {
    try {
      const response = await axios.get(url, {
        timeout: 60000, // stats.nba.com can be slow (20–60 s)
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "application/json, text/plain, */*",
          "Accept-Language": "en-US,en;q=0.9",
          "Accept-Encoding": "gzip, deflate, br",
          Referer: "https://www.nba.com/",
          Origin: "https://www.nba.com",
          Connection: "keep-alive",
          "x-nba-stats-origin": "stats",
          "x-nba-stats-token": "true",
        },
      });
      return response;
    } catch (error) {
      if (attempt <= 2) {
        Logger.warn(
          `Stats API request failed (attempt ${attempt}/2), retrying in ${2000 * attempt}ms: ${url}`,
        );
        await this.delay(2000 * attempt);
        return this.makeStatsApiRequest(url, attempt + 1);
      }
      throw error;
    }
  }

  /**
   * Utility: Create delay
   */
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Utility: Chunk array into smaller arrays
   */
  chunkArray(array, chunkSize) {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  }

  /**
   * Get current players data (structured format)
   */
  async getCurrentPlayers() {
    try {
      const data = await fs.readFile(this.dataPath, "utf8");
      const players = JSON.parse(data);
      return Array.isArray(players) ? players : [];
    } catch (error) {
      return [];
    }
  }

  /**
   * Get players data with metadata (for compatibility)
   */
  async getPlayersWithMetadata() {
    try {
      const players = await this.getCurrentPlayers();
      return {
        scrapingInfo: {
          totalPlayers: players.length,
          scrapedAt: players.length > 0 ? players[0].scrapedAt : null,
          scrapingMethod: "structured_data_extraction",
          sourceUrl: this.playersUrl,
        },
        players: players,
      };
    } catch (error) {
      return {
        scrapingInfo: {
          totalPlayers: 0,
          scrapedAt: null,
          scrapingMethod: "structured_data_extraction",
          sourceUrl: this.playersUrl,
        },
        players: [],
      };
    }
  }
}

module.exports = ManualService;
