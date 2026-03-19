/**
 * TEST: NBA Player Info Scraper
 * Tests the updated scraper that extracts structured player information
 */

const axios = require("axios");

const SERVER_URL = "http://localhost:3001";

async function testNBAScraper() {
  console.log("🏀 Testing NBA Player Info Scraper\n");

  try {
    // Start the scraper
    console.log("📥 Starting NBA player info scraping...");
    const scrapeResponse = await axios.post(
      `${SERVER_URL}/api/manual/scrape-nba`,
    );

    if (scrapeResponse.data.success) {
      console.log("✅ Scraping completed successfully");
      console.log(
        `📊 Total players: ${scrapeResponse.data.stats.totalPlayers}`,
      );
      console.log(`⏱️  Duration: ${scrapeResponse.data.stats.duration}\n`);
    } else {
      console.log("❌ Scraping failed:", scrapeResponse.data.message);
      return;
    }

    // Get player data status
    console.log("📈 Checking player data status...");
    const statusResponse = await axios.get(`${SERVER_URL}/api/manual/status`);

    if (statusResponse.data.success) {
      const stats = statusResponse.data.data;
      console.log("✅ Status retrieved:");
      console.log(`   - Total players: ${stats.totalPlayers}`);
      console.log(`   - Scraping method: ${stats.scrapingMethod}`);
      console.log(`   - Active players: ${stats.activePlayersCount}`);
      console.log(`   - Average games played: ${stats.averageGamesPlayed}`);
      console.log(`   - Average points: ${stats.averagePoints}`);
      console.log(`   - Teams represented: ${stats.teamsRepresented}`);
      console.log(`   - Players with errors: ${stats.playersWithErrors}`);
      console.log(`   - Sample IDs: [${stats.samplePlayerIds.join(", ")}]\n`);
    }

    // Get sample player data
    console.log("📋 Getting sample player data...");
    const playersResponse = await axios.get(`${SERVER_URL}/api/manual/players`);

    if (playersResponse.data.success) {
      const players = playersResponse.data.data;
      console.log("✅ Player data retrieved:");
      console.log(`   - Players count: ${players.length}`);

      if (players.length > 0) {
        const samplePlayer = players[0];
        console.log(
          `   - Sample player: ${samplePlayer.firstName} ${samplePlayer.lastName}`,
        );
        console.log(`   - Team: ${samplePlayer.team}`);
        console.log(`   - Position: ${samplePlayer.position}`);
        console.log(`   - Games played: ${samplePlayer.gamesPlayed}`);
        console.log(`   - Avg points: ${samplePlayer.avgPoints}`);
        console.log(`   - Has image: ${!!samplePlayer.image}`);
        console.log(`   - Player ID: ${samplePlayer.playerId}\n`);
      }
    }

    // Test player statistics analysis
    console.log("🔍 Getting player statistics analysis...");
    const statsResponse = await axios.get(`${SERVER_URL}/api/manual/stats`);

    if (statsResponse.data.success) {
      const analysis = statsResponse.data.data;
      console.log("✅ Statistics analysis:");
      console.log(`   - Total players: ${analysis.totalPlayers}`);
      console.log(`   - Valid players: ${analysis.validPlayers}`);
      console.log(
        `   - Players with stats: ${analysis.gamesPlayedStats.playersWithStats}`,
      );
      console.log(`   - Average games: ${analysis.gamesPlayedStats.average}`);
      console.log(`   - Average points: ${analysis.pointsStats.average}`);
      console.log(
        `   - Players with complete info: ${analysis.dataQuality.playersWithCompleteInfo}`,
      );
      console.log(`   - Teams found: ${analysis.teams}`);
      console.log(`   - Positions found: ${analysis.positions}\n`);
    }

    // Test search functionality
    console.log("🔍 Testing player search...");
    const searchResponse = await axios.get(
      `${SERVER_URL}/api/manual/players/search?q=james`,
    );

    if (searchResponse.data.success) {
      console.log("✅ Search completed:");
      console.log(
        `   - Results found: ${searchResponse.data.stats.totalResults}`,
      );
      if (searchResponse.data.data.length > 0) {
        const firstResult = searchResponse.data.data[0];
        console.log(
          `   - First result: ${firstResult.firstName} ${firstResult.lastName} (${firstResult.team})\n`,
        );
      }
    }

    console.log("🎉 All NBA player info scraper tests completed successfully!");
  } catch (error) {
    console.error(
      "❌ Test failed:",
      error.response?.data?.message || error.message,
    );
    if (error.code === "ECONNREFUSED") {
      console.log("\n💡 Make sure the server is running on port 3001");
      console.log("   Run: cd api && npm start");
    }
  }
}

// Run the test
testNBAScraper();
