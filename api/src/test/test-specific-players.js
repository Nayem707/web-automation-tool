/**
 * Test Specific Player Profile Extraction
 * Test to verify our improved extraction logic works for known players
 */

const ManualService = require("../services/manual.service");

async function testSpecificPlayer() {
  console.log("🏀 Testing Specific Player Profile Extraction...\n");

  const service = new ManualService();

  // Test LeBron James (ID: 2544) - a well-known player with complete profile
  const testPlayers = [
    { playerId: "2544", name: "LeBron James" },
    { playerId: "203507", name: "Giannis Antetokounmpo" },
    { playerId: "201939", name: "Stephen Curry" },
  ];

  for (const testPlayer of testPlayers) {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`🏆 Testing: ${testPlayer.name} (ID: ${testPlayer.playerId})`);
    console.log(`${"=".repeat(60)}`);

    try {
      const playerData = {
        playerId: testPlayer.playerId,
        rawText: testPlayer.name,
      };

      const result = await service.scrapePlayerProfile(playerData);

      console.log("✅ SUCCESS! Extracted Player Information:");
      console.log(`   🆔 Player ID: ${result.playerId}`);
      console.log(`   👤 Name: ${result.firstName} ${result.lastName}`);
      console.log(`   🏀 Team: ${result.team}`);
      console.log(`   📍 Position: ${result.position}`);
      console.log(`   📏 Height: ${result.height || "Not found"}`);
      console.log(`   ⚖️ Weight: ${result.weight || "Not found"}`);
      console.log(`   🎂 Birth Date: ${result.birthDate || "Not found"}`);
      console.log(`   🏳️ Nationality: ${result.nationality}`);
      console.log(`   📊 Games Played: ${result.gamesPlayed}`);
      console.log(`   🎯 Avg Points: ${result.avgPoints}`);
      console.log(`   🏀 Avg Rebounds: ${result.avgRebounds}`);
      console.log(`   🤝 Avg Assists: ${result.avgAssists}`);
      console.log(`   📸 Has Image: ${result.image ? "YES" : "NO"}`);

      // Data quality check
      const isComplete =
        result.firstName !== "Unknown" &&
        result.lastName !== "Player" &&
        result.team !== "Unknown" &&
        result.position !== "Unknown";

      console.log(
        `   ✨ Data Quality: ${isComplete ? "🟢 COMPLETE" : "🟡 PARTIAL"}`,
      );

      if (!isComplete) {
        console.log(
          "   ⚠️ Missing fields detected - extraction needs improvement",
        );
      }
    } catch (error) {
      console.error(`❌ FAILED: ${error.message}`);
    }

    // Wait between requests
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  console.log(`\n${"=".repeat(60)}`);
  console.log("🎯 Test Complete!\n");
}

// Run the test
testSpecificPlayer().catch(console.error);
