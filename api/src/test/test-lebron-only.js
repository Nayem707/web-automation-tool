/**
 * Quick test for LeBron James specifically
 */

const ManualService = require("../services/manual.service");

async function testLeBronOnly() {
  console.log("🏀 Testing LeBron James Profile Extraction...\n");

  const service = new ManualService();

  try {
    const playerData = {
      playerId: "2544",
      rawText: "LeBron James",
    };

    const result = await service.scrapePlayerProfile(playerData);

    console.log("✅ LeBron James Extraction Results:");
    console.log(`   👤 Name: ${result.firstName} ${result.lastName}`);
    console.log(`   🏀 Team: ${result.team}`);
    console.log(`   📍 Position: ${result.position}`);
    console.log(`   📏 Height: ${result.height}`);
    console.log(`   ⚖️ Weight: ${result.weight}`);
    console.log(`   🎂 Birth Date: ${result.birthDate}`);
    console.log(`   🏳️ Nationality: ${result.nationality}`);
    console.log(
      `   📊 Stats: ${result.avgPoints} PPG, ${result.avgRebounds} RPG, ${result.avgAssists} APG`,
    );

    // Expected: Lakers, Forward, USA
    const expectedTeam = "Lakers";
    const expectedCountry = "USA";

    console.log(`\n🎯 Accuracy Check:`);
    console.log(
      `   Team: ${result.team.includes("Lakers") ? "✅" : "❌"} (Expected: Lakers)`,
    );
    console.log(
      `   Country: ${result.nationality === "USA" ? "✅" : "❌"} (Expected: USA)`,
    );
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

// Run test
testLeBronOnly().catch(console.error);
