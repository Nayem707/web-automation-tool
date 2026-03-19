const config = require("../config");
const Logger = require("../utils/logger");
const EnhancedNbaScraperService = require("../services/enhancedNbaScraperService");
const PlayersService = require("../services/playersService");

/**
 * Test script for the enhanced NBA scraping system
 * Run this to test all the enhanced features
 */
async function testEnhancedScraping() {
  Logger.info("🧪 Starting Enhanced NBA Scraper Tests...");

  const enhancedScraper = new EnhancedNbaScraperService();
  const playersService = new PlayersService();

  try {
    // Test 1: Check configuration
    Logger.info("\n📋 Test 1: Configuration Check");
    Logger.info("Concurrency:", config.queue.concurrency);
    Logger.info("Request Delay:", config.queue.requestDelay);
    Logger.info("Max Retries:", config.queue.maxRetries);
    Logger.info("✅ Configuration loaded successfully");

    // Test 2: Check backup system
    Logger.info("\n💾 Test 2: Backup System");
    try {
      const backupInfo = await playersService.getBackupInfo();
      Logger.info(`Current file exists: ${backupInfo.currentFile.exists}`);
      Logger.info(`Existing backups: ${backupInfo.totalBackups}`);
      Logger.info("✅ Backup system operational");
    } catch (error) {
      Logger.warn("⚠️ Backup system test failed:", error.message);
    }

    // Test 3: Data integrity validation
    Logger.info("\n🔍 Test 3: Data Integrity");
    try {
      const validation = await playersService.validateDataIntegrity();
      Logger.info(
        `Players: ${validation.totalPlayers} (${validation.validPlayers} valid, ${validation.invalidPlayers} invalid)`,
      );
      Logger.info(`Duplicates: ${validation.duplicateGroups} groups`);
      Logger.info("✅ Data integrity check completed");
    } catch (error) {
      Logger.warn("⚠️ Data integrity test failed:", error.message);
    }

    // Test 4: HTTP Client connectivity
    Logger.info("\n🌐 Test 4: HTTP Client Connectivity");
    try {
      // Test basic connectivity to NBA API
      const response = await enhancedScraper.httpClient.get(
        "https://stats.nba.com/stats/commonallplayers",
        {
          params: {
            IsOnlyCurrentSeason: "1",
            LeagueID: "00",
            Season: "2023-24",
          },
          headers: enhancedScraper.getNbaHeaders(),
        },
      );

      const playerCount = response.data?.resultSets?.[0]?.rowSet?.length || 0;
      Logger.info(`NBA API accessible: ${playerCount} players found`);
      Logger.info("✅ HTTP Client connectivity successful");
    } catch (error) {
      Logger.error("❌ HTTP Client connectivity failed:", error.message);
      Logger.warn(
        "This might be due to NBA API rate limiting or network issues",
      );
    }

    // Test 5: Monitoring service
    Logger.info("\n📊 Test 5: Monitoring Service");
    try {
      const monitoring = enhancedScraper.monitoringService;
      monitoring.start();

      // Simulate some metrics
      monitoring.startScrapingSession(100, 1);
      monitoring.updateScrapingProgress(25, 2);
      monitoring.recordHttpRequest(true, 500);
      monitoring.recordHttpRequest(false, 1000, new Error("Test error"));

      const metrics = monitoring.getMetrics();
      const health = monitoring.getHealthStatus();

      Logger.info(
        `System memory: ${metrics.current.system.memory.percentage}%`,
      );
      Logger.info(`Health status: ${health.status}`);
      Logger.info("✅ Monitoring service operational");

      monitoring.stop();
    } catch (error) {
      Logger.warn("⚠️ Monitoring service test failed:", error.message);
    }

    // Test 6: Queue system (with dummy data)
    Logger.info("\n📬 Test 6: Queue System");
    try {
      const scrapingQueue = enhancedScraper.scrapingQueue;

      // Add test tasks
      const testTasks = [
        { id: "test1", data: { name: "Test Player 1" } },
        { id: "test2", data: { name: "Test Player 2" } },
        { id: "test3", data: { name: "Test Player 3" } },
      ];

      scrapingQueue.add(testTasks);

      // Process with dummy processor
      let processedCount = 0;
      await scrapingQueue.start(async (data) => {
        await new Promise((resolve) => setTimeout(resolve, 100)); // Simulate processing
        processedCount++;
        return { processed: true, name: data.name };
      });

      const status = scrapingQueue.getStatus();
      Logger.info(`Processed: ${status.completed} tasks`);
      Logger.info("✅ Queue system operational");

      scrapingQueue.cleanup();
    } catch (error) {
      Logger.warn("⚠️ Queue system test failed:", error.message);
    }

    Logger.info("\n🎉 Enhanced NBA Scraper Tests Completed!");
    Logger.info("\nTo start production scraping, run:");
    Logger.info("curl http://localhost:3001/api/enhanced/scrape");
  } catch (error) {
    Logger.error("❌ Test suite failed:", error.message);
  } finally {
    // Cleanup
    try {
      enhancedScraper.cleanup();
    } catch (cleanupError) {
      Logger.warn("Cleanup warning:", cleanupError.message);
    }
  }
}

// Function to test specific components individually
async function testComponent(componentName) {
  switch (componentName) {
    case "http":
      await testHttpClient();
      break;
    case "backup":
      await testBackupSystem();
      break;
    case "monitoring":
      await testMonitoring();
      break;
    case "validation":
      await testValidation();
      break;
    default:
      Logger.error(`Unknown component: ${componentName}`);
      Logger.info("Available components: http, backup, monitoring, validation");
  }
}

async function testHttpClient() {
  Logger.info("🌐 Testing HTTP Client...");
  const enhancedScraper = new EnhancedNbaScraperService();

  try {
    const start = Date.now();
    const response = await enhancedScraper.httpClient.get(
      "https://stats.nba.com/stats/commonallplayers",
      {
        params: { IsOnlyCurrentSeason: "1", LeagueID: "00", Season: "2023-24" },
        headers: enhancedScraper.getNbaHeaders(),
      },
    );
    const duration = Date.now() - start;

    Logger.info(`✅ HTTP request successful in ${duration}ms`);
    Logger.info(
      `Response data: ${response.data?.resultSets?.[0]?.rowSet?.length || 0} players`,
    );

    // Test connection stats
    const stats = enhancedScraper.httpClient.getStats();
    Logger.info("Connection stats:", stats);
  } catch (error) {
    Logger.error("❌ HTTP client test failed:", error.message);
  } finally {
    enhancedScraper.cleanup();
  }
}

async function testBackupSystem() {
  Logger.info("💾 Testing Backup System...");
  const playersService = new PlayersService();

  try {
    const backupInfo = await playersService.getBackupInfo();
    Logger.info("Backup information:", backupInfo);

    if (backupInfo.totalBackups > 0) {
      Logger.info("Latest backup:", backupInfo.backups[0]);
    }

    Logger.info("✅ Backup system test completed");
  } catch (error) {
    Logger.error("❌ Backup system test failed:", error.message);
  }
}

async function testMonitoring() {
  Logger.info("📊 Testing Monitoring System...");
  const MonitoringService = require("../services/monitoringService");
  const monitoring = new MonitoringService();

  try {
    monitoring.start();

    // Simulate monitoring data
    monitoring.startScrapingSession(1000);
    monitoring.updateScrapingProgress(250, 10);
    monitoring.recordHttpRequest(true, 300);
    monitoring.recordHttpRequest(false, 5000, new Error("Timeout"));

    const metrics = monitoring.getMetrics();
    const health = monitoring.getHealthStatus();

    Logger.info("Current metrics:");
    Logger.info("- Memory:", metrics.current.system.memory);
    Logger.info(
      "- HTTP success rate:",
      metrics.current.http.totalRequests > 0
        ? `${((metrics.current.http.successfulRequests / metrics.current.http.totalRequests) * 100).toFixed(1)}%`
        : "N/A",
    );
    Logger.info("- Health status:", health.status);

    monitoring.stop();
    Logger.info("✅ Monitoring system test completed");
  } catch (error) {
    Logger.error("❌ Monitoring system test failed:", error.message);
  }
}

async function testValidation() {
  Logger.info("🔍 Testing Data Validation...");
  const playersService = new PlayersService();

  try {
    const validation = await playersService.validateDataIntegrity();

    Logger.info("Validation results:");
    Logger.info(`- Total players: ${validation.totalPlayers}`);
    Logger.info(`- Valid players: ${validation.validPlayers}`);
    Logger.info(`- Invalid players: ${validation.invalidPlayers}`);
    Logger.info(`- Duplicate groups: ${validation.duplicateGroups}`);

    if (validation.issues.length > 0) {
      Logger.warn(`Found ${validation.issues.length} validation issues`);
      validation.issues.slice(0, 3).forEach((issue) => {
        Logger.debug(`- ${issue.playerName}: ${issue.errors.join(", ")}`);
      });
    }

    Logger.info("✅ Data validation test completed");
  } catch (error) {
    Logger.error("❌ Data validation test failed:", error.message);
  }
}

// Command line interface
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    testEnhancedScraping();
  } else {
    testComponent(args[0]);
  }
}

module.exports = {
  testEnhancedScraping,
  testComponent,
  testHttpClient,
  testBackupSystem,
  testMonitoring,
  testValidation,
};
