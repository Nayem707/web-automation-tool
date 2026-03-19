/**
 * Test Complete Object Structure
 * Verify all required properties are present
 */

const ManualService = require("../services/manual.service");

async function testCompleteObjectStructure() {
  console.log("🧩 Testing Complete Object Structure...\n");

  const service = new ManualService();

  try {
    const playerData = {
      playerId: "2544",
      rawText: "LeBron James",
    };

    const result = await service.scrapePlayerProfile(playerData);

    console.log("📝 Complete Player Object Structure:");
    console.log(JSON.stringify(result, null, 2));

    // Check for all required properties
    const requiredProperties = [
      "id",
      "firstName",
      "lastName",
      "team",
      "era",
      "position",
      "image",
      "height",
      "weight",
      "birthDate",
      "nationality",
      "yearsActive",
      "championships",
      "biography",
      "gamesPlayed",
      "avgPoints",
      "avgRebounds",
      "avgAssists",
      "difficulty",
      "isActive",
      "addedBy",
      "createdAt",
      "updatedAt",
    ];

    console.log("\n✅ Property Validation:");

    let allPropertiesPresent = true;
    requiredProperties.forEach((prop) => {
      const hasProperty = result.hasOwnProperty(prop);
      console.log(
        `   ${hasProperty ? "✅" : "❌"} ${prop}: ${hasProperty ? "PRESENT" : "MISSING"}`,
      );
      if (!hasProperty) allPropertiesPresent = false;
    });

    // Check for unwanted properties
    const unwantedProperties = ["playerId", "scrapedAt", "error"];
    const unwantedFound = [];

    unwantedProperties.forEach((prop) => {
      if (result.hasOwnProperty(prop)) {
        unwantedFound.push(prop);
      }
    });

    if (unwantedFound.length > 0) {
      console.log("\n❌ Unwanted Properties Found:");
      unwantedFound.forEach((prop) => console.log(`   ❌ ${prop}`));
      allPropertiesPresent = false;
    }

    // Data format validation
    console.log("\n🔍 Data Format Validation:");
    console.log(
      `   Height format: ${result.height} ${result.height && result.height.endsWith("cm") ? "✅" : "❌"}`,
    );
    console.log(
      `   Weight format: ${result.weight} ${result.weight && result.weight.endsWith("kg") ? "✅" : "❌"}`,
    );
    console.log(
      `   Era: ${result.era} ${result.era === "2020s" ? "✅" : "❌"}`,
    );
    console.log(
      `   Difficulty: ${result.difficulty} ${result.difficulty === 1 ? "✅" : "❌"}`,
    );

    console.log(
      `\n🎯 Overall Structure: ${allPropertiesPresent ? "🟢 PERFECT" : "🟡 NEEDS FIX"}`,
    );
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

// Run test
testCompleteObjectStructure().catch(console.error);
