/**
 * Debug NBA.com players page to see actual player count
 */

const axios = require("axios");
const cheerio = require("cheerio");

async function debugNBAPlayersPage() {
  console.log("🔍 Debugging NBA.com Players Page...\n");

  try {
    const response = await axios.get("https://www.nba.com/players", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    const $ = cheerio.load(response.data);

    console.log("📄 Page loaded successfully");

    // Count player links
    const playerLinks = $('a[href*="/player/"]');
    console.log(`🏀 Found ${playerLinks.length} player links`);

    // Extract unique player IDs
    const playerIds = new Set();
    const players = [];

    playerLinks.each((i, elem) => {
      const $elem = $(elem);
      const href = $elem.attr("href");
      const match = href.match(/\/player\/(\d+)/);

      if (match && match[1]) {
        const playerId = match[1];
        const rawText = $elem.text().trim();

        if (!playerIds.has(playerId)) {
          playerIds.add(playerId);
          players.push({
            playerId: playerId,
            name: rawText,
            href: href,
          });
        }
      }
    });

    console.log(`👥 Unique players found: ${players.length}`);
    console.log("\n📋 First 10 players:");
    players.slice(0, 10).forEach((player, index) => {
      console.log(`   ${index + 1}. ${player.name} (ID: ${player.playerId})`);
    });

    // Check for pagination elements
    const paginationElements = [
      ".pagination",
      ".pager",
      '[class*="page"]',
      '[class*="next"]',
      '[class*="load"]',
      'button[class*="more"]',
      'a[class*="more"]',
    ];

    console.log("\n🔗 Pagination Elements Found:");
    paginationElements.forEach((selector) => {
      const elements = $(selector);
      if (elements.length > 0) {
        console.log(`   ✅ ${selector}: ${elements.length} elements`);
        elements.each((i, elem) => {
          const text = $(elem).text().trim();
          if (text) console.log(`      - "${text}"`);
        });
      }
    });

    // Look for load more or infinite scroll indicators
    console.log("\n⚡ Load More/Infinite Scroll Indicators:");
    const loadMoreElements = $("button").filter((i, elem) => {
      const text = $(elem).text().toLowerCase();
      return (
        text.includes("load") || text.includes("more") || text.includes("show")
      );
    });

    if (loadMoreElements.length > 0) {
      console.log(
        `   📦 Found ${loadMoreElements.length} potential load-more buttons:`,
      );
      loadMoreElements.each((i, elem) => {
        console.log(`      - "${$(elem).text().trim()}"`);
      });
    } else {
      console.log("   ❌ No load-more buttons found");
    }

    // Check if this is the complete list
    console.log(`\n🎯 Analysis:`);
    console.log(`   - Total links: ${playerLinks.length}`);
    console.log(`   - Unique players: ${players.length}`);
    console.log(
      `   - Likely complete? ${players.length > 400 ? "YES" : "POSSIBLE PAGINATION"}`,
    );
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
  }
}

// Run debug
debugNBAPlayersPage().catch(console.error);
