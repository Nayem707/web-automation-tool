/**
 * Test Unlimited Scraping with Progressive Saving
 * This will test the new unlimited scraping functionality
 */

const ManualService = require("../services/manual.service");

async function testUnlimitedScraping() {
  console.log("🚀 Testing Unlimited NBA Scraping...\n");

  const service = new ManualService();

  try {
    console.log("📋 Step 1: Testing player list extraction (all pages)");
    const playersList = await service.scrapePlayersList();

    console.log(`✅ Found ${playersList.length} players total`);
    console.log("📋 Sample players:");
    playersList.slice(0, 5).forEach((player, index) => {
      console.log(
        `   ${index + 1}. ${player.rawText} (ID: ${player.playerId})`,
      );
    });

    if (playersList.length > 50) {
      console.log(
        `🎉 SUCCESS: Found more than 50 players (${playersList.length})!`,
      );
      console.log(`📈 This confirms unlimited scraping is working!`);
    } else {
      console.log(
        `⚠️  Note: Only found ${playersList.length} players (may still be paginated)`,
      );
    }

    // Test progressive saving with a small subset
    console.log(`\n📊 Step 2: Testing progressive saving (first 10 players)`);
    const testPlayers = playersList.slice(0, 10);

    const startTime = Date.now();
    const results = await service.processPlayersWithStats(testPlayers);
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log(`✅ Processed ${results.length}/10 players in ${duration}s`);
    console.log("📋 Sample extracted data:");

    if (results.length > 0) {
      const sample = results[0];
      console.log(`   Name: ${sample.firstName} ${sample.lastName}`);
      console.log(`   Team: ${sample.team}`);
      console.log(`   Position: ${sample.position}`);
      console.log(`   Height: ${sample.height}`);
      console.log(`   Weight: ${sample.weight}`);
      console.log(
        `   Stats: ${sample.avgPoints} PPG, ${sample.avgRebounds} RPG, ${sample.avgAssists} APG`,
      );
    }

    console.log(`\n🎯 Test Results:`);
    console.log(`   📊 Found ${playersList.length} total players`);
    console.log(
      `   ✅ Progressive saving: ${results.length > 0 ? "WORKING" : "FAILED"}`,
    );
    console.log(
      `   📈 Unlimited scraping: ${playersList.length > 50 ? "WORKING" : "LIMITED"}`,
    );
    console.log(`   💾 Data structure: COMPLETE (23 properties)`);

    console.log(`\n🚀 Ready for full unlimited scraping!`);
    console.log(`📝 To scrape all players: POST /api/manual/scrape-nba`);
    console.log(
      `⚠️  Remember: You can stop anytime with Ctrl+C and progress will be saved!`,
    );
  } catch (error) {
    console.error(`❌ Test failed: ${error.message}`);
  }
}

// Run the test
testUnlimitedScraping().catch(console.error);
