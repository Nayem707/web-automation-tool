const ScrapeService = require("../services/scrape.service");
const Logger = require("../utils/logger");

/**
 * Scrape Controller
 * Handles HTTP requests for the scraper tool
 */
class ScrapeController {
  constructor() {
    this.scrapeService = new ScrapeService();
  }

  /**
   * Scrape public JSON data from a URL
   * POST /api/scrape
   */
  async scrapeUrl(req, res) {
    try {
      const { url, itemCount: requestedItemCount, params } = req.body;

      // Validate request body
      if (!url) {
        return res.status(400).json({
          success: false,
          message: "URL is required in request body",
          error: "Missing 'url' field",
        });
      }

      // Build URL with query parameters for server-side limiting
      const finalUrl = this.buildUrlWithParams(url, params, requestedItemCount);

      // Fetch data from URL
      const data = await this.scrapeService.fetchPublicData(finalUrl);

      // Calculate total item count
      const totalItemCount = this.calculateItemCount(data);

      // Apply item limit if requested
      let limitedData = data;
      let isLimited = false;

      if (
        requestedItemCount &&
        typeof requestedItemCount === "number" &&
        requestedItemCount > 0
      ) {
        limitedData = this.limitItems(data, requestedItemCount);
        isLimited = true;
      }

      // Return success response
      res.status(200).json({
        success: true,
        message: "Data fetched successfully",
        data: limitedData,
        metadata: {
          url: finalUrl,
          originalUrl: url,
          totalItems: totalItemCount,
          returnedItems: isLimited
            ? this.calculateItemCount(limitedData)
            : totalItemCount,
          limited: isLimited,
          serverSideLimited: params || finalUrl !== url,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      Logger.error("Scraper error:", error.message);

      // Check if it's a non-JSON response error
      if (error.message === "Response is not JSON format") {
        return res.status(400).json({
          success: false,
          message: "No public JSON data found at this URL",
          error: "The URL did not return JSON data",
        });
      }

      // Handle validation errors
      if (
        error.message.includes("Invalid URL") ||
        error.message.includes("required")
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid URL provided",
          error: error.message,
        });
      }

      // Handle network errors
      if (
        error.message.includes("not found") ||
        error.message.includes("timeout") ||
        error.message.includes("unreachable")
      ) {
        return res.status(404).json({
          success: false,
          message: "Unable to reach the URL",
          error: error.message,
        });
      }

      // Generic error response
      res.status(500).json({
        success: false,
        message: "Failed to scrape URL",
        error: error.message,
      });
    }
  }

  /**
   * Calculate the number of items in the scraped data
   * Handles various data structures intelligently
   * @param {*} data - The scraped data
   * @returns {number} The count of items
   */
  calculateItemCount(data) {
    // If data is null or undefined
    if (data == null) {
      return 0;
    }

    // If data is an array
    if (Array.isArray(data)) {
      return data.length;
    }

    // If data is an object
    if (typeof data === "object") {
      // Check for common data structures

      // NBA API format (resultSets with rowSet)
      if (data.resultSets && Array.isArray(data.resultSets)) {
        // Count items in all resultSets
        let totalCount = 0;
        data.resultSets.forEach((resultSet) => {
          if (resultSet.rowSet && Array.isArray(resultSet.rowSet)) {
            totalCount += resultSet.rowSet.length;
          }
        });
        return totalCount;
      }

      // Common API format with "data" field
      if (data.data && Array.isArray(data.data)) {
        return data.data.length;
      }

      // Common API format with "results" field
      if (data.results && Array.isArray(data.results)) {
        return data.results.length;
      }

      // Common API format with "items" field
      if (data.items && Array.isArray(data.items)) {
        return data.items.length;
      }

      // If object has a "length" or "count" property
      if (typeof data.length === "number") {
        return data.length;
      }
      if (typeof data.count === "number") {
        return data.count;
      }
      if (typeof data.total === "number") {
        return data.total;
      }

      // Otherwise, count the number of keys in the object
      return Object.keys(data).length;
    }

    // For primitive values (string, number, boolean)
    return 1;
  }

  /**
   * Build URL with query parameters for server-side limiting
   * @param {string} baseUrl - The base URL
   * @param {Object} params - Optional query parameters
   * @param {number} itemCount - Optional item count for automatic limiting
   * @returns {string} URL with query parameters
   */
  buildUrlWithParams(baseUrl, params = {}, itemCount = null) {
    try {
      const url = new URL(baseUrl);

      // Add custom parameters from request
      if (params && typeof params === "object") {
        Object.keys(params).forEach((key) => {
          url.searchParams.set(key, params[key]);
        });
      }

      // Auto-detect and add common limit parameters if itemCount provided and no limit param exists
      if (itemCount && typeof itemCount === "number" && itemCount > 0) {
        const hasLimitParam = [
          "limit",
          "count",
          "per_page",
          "pageSize",
          "page_size",
          "size",
        ].some(
          (param) => url.searchParams.has(param) || (params && params[param]),
        );

        if (!hasLimitParam) {
          // Try common limit parameter names based on the URL
          if (baseUrl.includes("github.com")) {
            url.searchParams.set("per_page", itemCount);
          } else if (baseUrl.includes("jsonplaceholder.typicode.com")) {
            url.searchParams.set("_limit", itemCount);
          } else {
            // Use 'limit' as default - most common
            url.searchParams.set("limit", itemCount);
          }

          Logger.info(
            `Server-side limiting enabled with itemCount: ${itemCount}`,
          );
        }
      }

      return url.toString();
    } catch (error) {
      Logger.warn("Failed to parse URL for parameters, using original URL");
      return baseUrl;
    }
  }

  /**
   * Limit the number of items in the scraped data
   * @param {*} data - The scraped data
   * @param {number} limit - Maximum number of items to return
   * @returns {*} Limited data
   */
  limitItems(data, limit) {
    // If data is null or undefined, return as is
    if (data == null) {
      return data;
    }

    // If data is an array
    if (Array.isArray(data)) {
      return data.slice(0, limit);
    }

    // If data is an object
    if (typeof data === "object") {
      // NBA API format (resultSets with rowSet)
      if (data.resultSets && Array.isArray(data.resultSets)) {
        const limitedData = { ...data };
        limitedData.resultSets = data.resultSets.map((resultSet) => {
          if (resultSet.rowSet && Array.isArray(resultSet.rowSet)) {
            return {
              ...resultSet,
              rowSet: resultSet.rowSet.slice(0, limit),
            };
          }
          return resultSet;
        });
        return limitedData;
      }

      // Common API format with "data" field
      if (data.data && Array.isArray(data.data)) {
        return {
          ...data,
          data: data.data.slice(0, limit),
        };
      }

      // Common API format with "results" field
      if (data.results && Array.isArray(data.results)) {
        return {
          ...data,
          results: data.results.slice(0, limit),
        };
      }

      // Common API format with "items" field
      if (data.items && Array.isArray(data.items)) {
        return {
          ...data,
          items: data.items.slice(0, limit),
        };
      }

      // If no known array structure, return as is
      return data;
    }

    // For primitive values, return as is
    return data;
  }
}

module.exports = ScrapeController;
