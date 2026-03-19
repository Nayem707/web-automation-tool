const axios = require("axios");
const Logger = require("../utils/logger");

/**
 * Scrape Service
 * Handles fetching and validating public JSON data from URLs
 */
class ScrapeService {
  /**
   * Fetch public JSON data from a given URL
   * @param {string} url - The URL to scrape
   * @param {number} retries - Number of retries left
   * @returns {Promise<Object>} The JSON data from the URL
   */
  async fetchPublicData(url, retries = 2) {
    try {
      // Validate URL format
      this.validateUrl(url);

      Logger.info(`Fetching data from: ${url}`);

      // Prepare headers based on URL
      const headers = this.getHeadersForUrl(url);

      // Get appropriate timeout for this URL
      const timeout = this.getTimeoutForUrl(url);

      // Make request with timeout and proper headers
      const response = await axios.get(url, {
        timeout,
        headers,
        validateStatus: (status) => status >= 200 && status < 300,
      });

      // Check if response is JSON
      const contentType = response.headers["content-type"];
      if (!contentType || !contentType.includes("application/json")) {
        // Try to parse as JSON anyway
        if (typeof response.data === "object") {
          Logger.success(`Successfully fetched JSON data from: ${url}`);
          return response.data;
        }
        throw new Error("Response is not JSON format");
      }

      Logger.success(`Successfully fetched JSON data from: ${url}`);
      return response.data;
    } catch (error) {
      // Retry on timeout errors
      if (
        (error.code === "ETIMEDOUT" || error.code === "ECONNABORTED") &&
        retries > 0
      ) {
        Logger.warn(`Request timeout, retrying... (${retries} retries left)`);
        await this.delay(2000); // Wait 2 seconds before retry
        return this.fetchPublicData(url, retries - 1);
      }

      Logger.error(`Error fetching data from ${url}:`, error.message);
      throw this.handleError(error);
    }
  }

  /**
   * Get appropriate timeout based on the URL
   * @param {string} url - The URL to fetch
   * @returns {number} Timeout in milliseconds
   */
  getTimeoutForUrl(url) {
    // NBA Stats API is notoriously slow
    if (url.includes("stats.nba.com") || url.includes("data.nba.com")) {
      return 60000; // 60 seconds
    }

    // Default timeout for other APIs
    return 30000; // 30 seconds
  }

  /**
   * Delay helper for retries
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise<void>}
   */
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Get appropriate headers based on the URL
   * @param {string} url - The URL to fetch
   * @returns {Object} Headers object
   */
  getHeadersForUrl(url) {
    const baseHeaders = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "application/json, text/plain, */*",
    };

    // Special headers for NBA Stats API
    if (url.includes("stats.nba.com")) {
      return {
        ...baseHeaders,
        Referer: "https://www.nba.com/",
        Origin: "https://www.nba.com",
        "x-nba-stats-origin": "stats",
        "x-nba-stats-token": "true",
      };
    }

    // Special headers for data.nba.com
    if (url.includes("data.nba.com")) {
      return {
        ...baseHeaders,
        Referer: "https://www.nba.com/",
        Origin: "https://www.nba.com",
      };
    }

    // Default headers for other URLs
    return baseHeaders;
  }

  /**
   * Validate URL format
   * @param {string} url - The URL to validate
   */
  validateUrl(url) {
    if (!url || typeof url !== "string") {
      throw new Error("URL is required and must be a string");
    }

    // Basic URL validation
    try {
      const urlObj = new URL(url);
      if (!["http:", "https:"].includes(urlObj.protocol)) {
        throw new Error("URL must use HTTP or HTTPS protocol");
      }
    } catch (error) {
      throw new Error("Invalid URL format");
    }
  }

  /**
   * Handle and format errors
   * @param {Error} error - The error to handle
   * @returns {Error} Formatted error
   */
  handleError(error) {
    if (error.message === "Invalid URL format") {
      return new Error("Invalid URL format");
    }

    if (error.code === "ENOTFOUND") {
      return new Error("URL not found or unreachable");
    }

    if (error.code === "ETIMEDOUT" || error.code === "ECONNABORTED") {
      return new Error("Request timeout - URL took too long to respond");
    }

    if (error.response) {
      // Server responded with error status
      return new Error(
        `Server responded with status ${error.response.status}: ${error.response.statusText}`,
      );
    }

    if (error.request) {
      // Request made but no response
      return new Error("No response received from the URL");
    }

    return error;
  }
}

module.exports = ScrapeService;
