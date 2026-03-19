/**
 * Debug NBA.com page structure to understand the layout
 */

const axios = require("axios");
const cheerio = require("cheerio");

async function debugNBAPageStructure() {
  console.log("🔍 Debugging NBA.com Page Structure for LeBron James...\n");

  try {
    const url = "https://www.nba.com/player/2544"; // LeBron James
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    const $ = cheerio.load(response.data);

    console.log("📋 Page Title:", $("title").text());

    // Check for player name
    console.log("\n👤 Player Name Selectors:");
    $("h1").each((i, elem) => {
      const text = $(elem).text().trim();
      if (text && text.length > 2) {
        console.log(`   h1[${i}]: "${text}"`);
      }
    });

    // Check for team/position info
    console.log("\n🏀 Looking for Team/Position Information:");
    const teamPositionSelectors = [
      ".PlayerHeader_info",
      ".PlayerSummary_info",
      ".player-header p",
      '[class*="team"]',
      '[class*="position"]',
      "p",
    ];

    teamPositionSelectors.forEach((selector) => {
      const elements = $(selector);
      if (elements.length > 0) {
        elements.each((i, elem) => {
          const text = $(elem).text().trim();
          if (
            text &&
            (text.includes("Lakers") ||
              text.includes("|") ||
              text.includes("Center") ||
              text.includes("Forward"))
          ) {
            console.log(`   ${selector}: "${text}"`);
          }
        });
      }
    });

    // Check overall structure
    console.log("\n📊 Key Profile Sections:");
    const profileSections = [
      ".PlayerSummary",
      ".PlayerHeader",
      ".player-profile",
      '[data-testid*="player"]',
    ];

    profileSections.forEach((selector) => {
      const element = $(selector);
      if (element.length > 0) {
        console.log(`   ✅ Found: ${selector}`);
        const text = element.text().substring(0, 200);
        console.log(`      Content preview: "${text}..."`);
      }
    });

    // Look for JSON data
    console.log("\n💾 JSON Data Sources:");
    $("script").each((i, elem) => {
      const content = $(elem).html();
      if (content && content.includes("player") && content.includes("{")) {
        console.log(`   Script[${i}] contains player data`);
        if (content.length < 500) {
          console.log(`      Content: ${content.substring(0, 200)}...`);
        }
      }
    });
  } catch (error) {
    console.error(`❌ Error debugging page: ${error.message}`);
  }
}

// Run debug
debugNBAPageStructure().catch(console.error);
