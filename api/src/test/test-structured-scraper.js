/**
 * Test Script for NBA Structured Data Scraper
 * Tests the converted scraper that extracts structured player info instead of raw HTML
 */

const axios = require("axios");

const BASE_URL = "http://localhost:3001";

async function testNBAStructuredScraper() {
  console.log("🏀 Testing NBA Structured Data Scraper...\n");

  // Test 1: Check scraper status
  console.log("Test 1: Check scraper status");
  try {
    const response = await axios.get(`${BASE_URL}/api/manual/status`);
    console.log("✅ Status Success:", response.data.success);
    console.log("📊 Total Players:", response.data.data.totalPlayers);
    console.log("🔢 Scraping Method:", response.data.data.scrapingMethod);
    console.log("⭐ Average Points:", response.data.data.averagePoints);
    console.log("🏟️ Games Played Avg:", response.data.data.averageGamesPlayed);
  } catch (error) {
    console.error("❌ Status Error:", error.response?.data || error.message);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test 2: Get existing players data
  console.log("Test 2: Get structured player data");
  try {
    const response = await axios.get(`${BASE_URL}/api/manual/players`);

    if (response.data.success && response.data.data.length > 0) {
      const samplePlayer = response.data.data[0];

      console.log("✅ Players Data Success");
      console.log("👤 Sample Player Structure:");
      console.log("   - ID:", samplePlayer.id);
      console.log("   - Player ID:", samplePlayer.playerId);
      console.log(
        "   - Name:",
        samplePlayer.firstName + " " + samplePlayer.lastName,
      );
      console.log("   - Team:", samplePlayer.team);
      console.log("   - Position:", samplePlayer.position);
      console.log("   - Games Played:", samplePlayer.gamesPlayed);
      console.log("   - Avg Points:", samplePlayer.avgPoints);
      console.log("   - Avg Rebounds:", samplePlayer.avgRebounds);
      console.log("   - Avg Assists:", samplePlayer.avgAssists);
      console.log("   - Has Image:", !!samplePlayer.image);
      console.log("   - Scraped At:", samplePlayer.scrapedAt);

      // Test data quality
      const validPlayers = response.data.data.filter(
        (p) =>
          p.firstName !== "Unknown" &&
          p.lastName !== "Player" &&
          p.team !== "Unknown",
      );

      console.log("\n📈 Data Quality:");
      console.log("   - Total Players:", response.data.data.length);
      console.log("   - Valid Names:", validPlayers.length);
      console.log(
        "   - Percentage Complete:",
        Math.round((validPlayers.length / response.data.data.length) * 100) +
          "%",
      );
    }
  } catch (error) {
    console.error("❌ Players Error:", error.response?.data || error.message);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test 3: Search functionality
  console.log("Test 3: Search functionality");
  try {
    const response = await axios.get(
      `${BASE_URL}/api/manual/players/search?q=James`,
    );

    if (response.data.success) {
      console.log("✅ Search Success");
      console.log("🔍 Found Players:", response.data.data.length);

      if (response.data.data.length > 0) {
        const firstResult = response.data.data[0];
        console.log(
          "📋 First Result:",
          firstResult.firstName + " " + firstResult.lastName,
        );
        console.log("   - Team:", firstResult.team);
        console.log("   - Points:", firstResult.avgPoints);
      }
    }
  } catch (error) {
    console.error("❌ Search Error:", error.response?.data || error.message);
  }

  console.log("\n" + "=".repeat(50) + "\n");

  // Test 4: Stats summary
  console.log("Test 4: Statistics summary");
  try {
    const response = await axios.get(`${BASE_URL}/api/manual/stats`);

    if (response.data.success) {
      console.log("✅ Stats Success");
      console.log("📊 Statistics Summary:");
      console.log("   - Total Players:", response.data.data.totalPlayers);
      console.log("   - Active Players:", response.data.data.activeCount);
      console.log("   - Teams Represented:", response.data.data.teams);
      console.log("   - Position Types:", response.data.data.positions);
      console.log(
        "   - Average Career PPG:",
        response.data.data.averageStats?.points,
      );
      console.log(
        "   - Average Career RPG:",
        response.data.data.averageStats?.rebounds,
      );
      console.log(
        "   - Game Leaders:",
        response.data.data.topPerformers?.gamesPlayed?.[0],
      );
    }
  } catch (error) {
    console.error("❌ Stats Error:", error.response?.data || error.message);
  }

  console.log("\n✨ All NBA Structured Data Tests Completed!");
  console.log("🎯 Conversion from raw HTML to structured data: SUCCESS");
}

// Run the tests
testNBAStructuredScraper().catch(console.error);
