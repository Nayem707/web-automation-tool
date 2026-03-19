/**
 * TEST: Raw NBA Data Scraper
 * Tests the updated scraper that captures raw HTML responses
 */

const axios = require("axios");

const SERVER_URL = "http://localhost:3001";

async function testRawNBAScraper() {
  console.log("🏀 Testing Raw NBA Data Scraper\n");

  try {
    // Start the scraper
    console.log("📥 Starting NBA raw data scraping...");
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

    // Get raw data status
    console.log("📈 Checking raw data status...");
    const statusResponse = await axios.get(`${SERVER_URL}/api/manual/status`);

    if (statusResponse.data.success) {
      const stats = statusResponse.data.data;
      console.log("✅ Status retrieved:");
      console.log(`   - Total players: ${stats.totalPlayers}`);
      console.log(`   - Scraping method: ${stats.scrapingMethod}`);
      console.log(`   - Has raw list data: ${stats.hasRawListData}`);
      console.log(`   - Players with sources: ${stats.playersWithSources}`);
      console.log(`   - Players with errors: ${stats.playersWithErrors}`);
      console.log(`   - Data size: ${Math.round(stats.dataSize / 1024)} KB`);
      console.log(`   - Sample IDs: [${stats.samplePlayerIds.join(", ")}]\n`);
    }

    // Get sample raw player data
    console.log("📋 Getting sample raw data...");
    const playersResponse = await axios.get(`${SERVER_URL}/api/manual/players`);

    if (playersResponse.data.success) {
      const rawDataset = playersResponse.data.data;
      console.log("✅ Raw data retrieved:");
      console.log(`   - Players count: ${rawDataset.players?.length || 0}`);
      console.log(`   - Has scraping info: ${!!rawDataset.scrapingInfo}`);
      console.log(
        `   - Scraping method: ${rawDataset.scrapingInfo?.scrapingMethod || "unknown"}`,
      );

      if (rawDataset.players && rawDataset.players.length > 0) {
        const samplePlayer = rawDataset.players[0];
        console.log(
          `   - Sample player ID: ${samplePlayer.playerId || "unknown"}`,
        );
        console.log(
          `   - Has sources: ${Object.keys(samplePlayer.sources || {}).join(", ") || "none"}`,
        );
        console.log(`   - Has roster info: ${!!samplePlayer.rosterInfo}`);
        console.log(
          `   - Player data size: ${JSON.stringify(samplePlayer).length} bytes\n`,
        );
      }
    }

    // Test raw data analysis
    console.log("🔍 Getting raw data analysis...");
    const statsResponse = await axios.get(`${SERVER_URL}/api/manual/stats`);

    if (statsResponse.data.success) {
      const analysis = statsResponse.data.data;
      console.log("✅ Raw data analysis:");
      console.log(`   - Total players: ${analysis.totalPlayers}`);
      console.log(
        `   - Players with career stats: ${analysis.dataStructure.playersWithCareerStats}`,
      );
      console.log(
        `   - Players with profiles: ${analysis.dataStructure.playersWithProfiles}`,
      );
      console.log(
        `   - Players with errors: ${analysis.dataStructure.playersWithErrors}`,
      );
      console.log(
        `   - Average data size per player: ${analysis.dataStructure.averageDataSizePerPlayer} bytes`,
      );
      console.log(
        `   - Source types found: [${analysis.sampleData.sourceTypes.join(", ")}]`,
      );
      console.log(
        `   - Player fields: [${analysis.sampleData.playerFields.join(", ")}]\n`,
      );
    }

    // Test search in raw data
    console.log("🔍 Testing raw data search...");
    const searchResponse = await axios.get(
      `${SERVER_URL}/api/manual/players/search?q=james`,
    );

    if (searchResponse.data.success) {
      console.log("✅ Search completed:");
      console.log(
        `   - Results found: ${searchResponse.data.stats.totalResults}`,
      );
      console.log(`   - Search type: ${searchResponse.data.stats.searchType}`);
      if (searchResponse.data.data.length > 0) {
        console.log(
          `   - First result ID: ${searchResponse.data.data[0].playerId || "unknown"}\n`,
        );
      }
    }

    console.log("🎉 All raw data scraper tests completed successfully!");
  } catch (error) {
    console.error(
      "❌ Test failed:",
      error.response?.data?.message || error.message,
    );
    if (error.code === "ECONNREFUSED") {
      console.log("\n💡 Make sure the server is running on port 3000");
      console.log("   Run: cd api && npm start");
    }
  }
}

// Run the test
testRawNBAScraper();
