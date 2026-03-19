/**
 * NBA Roster Scraper - CLI Script
 * Scrapes all NBA team rosters and outputs clean JSON
 *
 * Usage:
 *   node scripts/scrape-rosters.js > output.json
 *   node scripts/scrape-rosters.js --team lakers
 *   node scripts/scrape-rosters.js --preview
 */

const NbaRosterScraperService = require("../src/services/nbaRosterScraperService");

// Parse command line arguments
const args = process.argv.slice(2);
const isPreview = args.includes("--preview");
const teamIndex = args.indexOf("--team");
const specificTeam = teamIndex !== -1 ? args[teamIndex + 1] : null;

// Suppress logs for clean JSON output
const originalLog = console.log;
const originalError = console.error;
const originalWarn = console.warn;

console.log = () => {};
console.error = () => {};
console.warn = () => {};

async function scrapeRosters() {
  try {
    const scraperService = new NbaRosterScraperService();

    if (specificTeam) {
      // Scrape specific team
      const team = scraperService.nbaTeams.find(
        (t) =>
          t.slug === specificTeam.toLowerCase() ||
          t.name.toLowerCase() === specificTeam.toLowerCase(),
      );

      if (!team) {
        throw new Error(`Team not found: ${specificTeam}`);
      }

      const players = await scraperService.scrapeTeamRoster(team);
      originalLog(JSON.stringify(players, null, 2));
    } else if (isPreview) {
      // Preview mode - scrape first 3 teams
      const teamsToScrape = scraperService.nbaTeams.slice(0, 3);
      const allPlayers = [];

      for (const team of teamsToScrape) {
        const players = await scraperService.scrapeTeamRoster(team);
        allPlayers.push(...players);
        await scraperService.delay(2000);
      }

      originalLog(JSON.stringify(allPlayers, null, 2));
    } else {
      // Scrape all teams
      const allPlayers = await scraperService.scrapeAllTeamRosters();
      originalLog(JSON.stringify(allPlayers, null, 2));
    }
  } catch (error) {
    originalError(`Error: ${error.message}`, { isError: true });
    process.exit(1);
  }
}

// Run scraper
scrapeRosters()
  .then(() => process.exit(0))
  .catch((error) => {
    originalError(`Fatal error: ${error.message}`);
    process.exit(1);
  });
