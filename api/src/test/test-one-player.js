/**
 * Quick Test: Scrape ONE NBA Player
 * Run this after starting the server with: npm run dev
 */

const axios = require("axios");

async function testOnePlayer() {
  console.log("🏀 Testing: Scrape ONE NBA Player\n");
  console.log("⏳ Fetching data... (may take 30-60 seconds)\n");

  try {
    const response = await axios.post("http://localhost:3002/api/scrape", {
      url: "https://stats.nba.com/stats/commonallplayers?LeagueID=00&Season=2023-24&IsOnlyCurrentSeason=1",
      itemCount: 1, // Get only ONE player
    });

    console.log("✅ Success!\n");

    // Display metadata
    console.log("📊 Metadata:");
    console.log("  Total Items Available:", response.data.metadata.totalItems);
    console.log("  Items Returned:", response.data.metadata.returnedItems);
    console.log("  Limited:", response.data.metadata.limited);

    // Get the player data
    const resultSet = response.data.data.resultSets[0];
    const headers = resultSet.headers;
    const player = resultSet.rowSet[0];

    console.log("\n👤 Player Data:");
    console.log("  Player ID:", player[0]);
    console.log("  Name:", player[1]);
    console.log("  Last, First:", player[2]);

    console.log("\n🎯 Complete Player Array:");
    console.log(JSON.stringify(player, null, 2));

    console.log("\n📋 Available Headers:");
    console.log(headers.join(", "));

    console.log(
      "\n💡 Tip: Without itemCount parameter, you would get all",
      response.data.metadata.totalItems,
      "players!",
    );
  } catch (error) {
    console.error(
      "\n❌ Error:",
      error.response?.data?.message || error.message,
    );

    if (error.code === "ECONNREFUSED") {
      console.log("\n💡 Server is not running!");
      console.log("   Start it with: npm run dev");
    } else {
      console.log("\n💡 Make sure:");
      console.log("   1. Server is running (npm run dev)");
      console.log("   2. Wait 30-60 seconds - NBA API is slow");
      console.log("   3. Check your internet connection");
    }
  }
}

// Run the test
testOnePlayer();
