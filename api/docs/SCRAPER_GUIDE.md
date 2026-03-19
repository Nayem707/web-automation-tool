# Dynamic Public Data Scraper Tool

A dynamic scraper tool that fetches public JSON data from any URL.

## 📋 Overview

This tool provides a simple POST endpoint that accepts a URL and returns any public JSON data available at that URL.

## 🚀 Quick Start

### Endpoint

```
POST /api/scrape
```

### Request Body

```json
{
  "url": "https://api.example.com/data",
  "itemCount": 10, // Optional: Limit results to first 10 items
  "params": {
    // Optional: Custom query parameters for server-side control
    "limit": 10,
    "sort": "date"
  }
}
```

**Fields:**

- `url` (required): The URL to scrape
- `itemCount` (optional): Maximum number of items to return. Automatically adds appropriate limit parameter to URL (e.g., `?_limit=10` for JSONPlaceholder, `?per_page=10` for GitHub)
- `params` (optional): Custom query parameters to append to URL for server-side filtering/limiting

### Success Response

```json
{
  "success": true,
  "message": "Data fetched successfully",
  "data": {
    // ... public JSON data from the URL (limited if requested)
  },
  "metadata": {
    "url": "https://api.example.com/data?limit=10",
    "originalUrl": "https://api.example.com/data",
    "totalItems": 150,
    "returnedItems": 10,
    "limited": true,
    "serverSideLimited": true,
    "timestamp": "2026-03-16T04:56:33.564Z"
  }
}
```

**Metadata Fields:**

- `url`: Final URL used to fetch data (with query parameters)
- `originalUrl`: Original URL from request
- `totalItems`: Total number of items in the original response
- `returnedItems`: Number of items actually returned
- `limited`: Whether the results were limited by `itemCount` parameter
- `serverSideLimited`: Whether server-side limiting was applied (via params or auto-detected)
- `timestamp`: When the request was processed

### Error Response

```json
{
  "success": false,
  "message": "No public JSON data found at this URL",
  "error": "The URL did not return JSON data"
}
```

## 📝 Examples

### Example 1: Fetch User Data

```bash
curl -X POST http://localhost:5000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "https://jsonplaceholder.typicode.com/users/1"}'
```

### Example 2: Fetch Posts

```bash
curl -X POST http://localhost:5000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "https://jsonplaceholder.typicode.com/posts/1"}'
```

### Example 3: Fetch NBA Players (Real NBA Stats API)

```bash
curl -X POST http://localhost:5000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "https://stats.nba.com/stats/commonallplayers?LeagueID=00&Season=2023-24&IsOnlyCurrentSeason=1"}'
```

**⚠️ Important**: Use `stats.nba.com` (JSON API), NOT `www.nba.com/players` (HTML page)

### Example 4: Server-Side Limiting (Fetch Only 3 Posts From Source)

```bash
curl -X POST http://localhost:5000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "https://jsonplaceholder.typicode.com/posts", "itemCount": 3}'
```

**Result:** API automatically adds `?_limit=3` to URL, so only 3 items are fetched from source (not 100)

### Example 5: Custom Query Parameters (GitHub API)

```bash
curl -X POST http://localhost:5000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://api.github.com/users/github/repos",
    "params": {
      "per_page": 5,
      "sort": "updated"
    }
  }'
```

**Result:** Fetches 5 most recently updated repositories from GitHub

### Example 6: NBA Players with Server-Side Limiting

```bash
curl -X POST http://localhost:5000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://stats.nba.com/stats/commonallplayers?LeagueID=00&Season=2023-24&IsOnlyCurrentSeason=1",
    "itemCount": 10
  }'
```

**Result:** Returns only first 10 NBA players (limited at source if API supports it)

**Response will include:**

```json
{
  "success": true,
  "data": {
    /* Only first 10 players */
  },
  "metadata": {
    "totalItems": 500,
    "returnedItems": 10,
    "limited": true
  }
}
```

### Example 5: NBA Player Index With Limit

```bash
curl -X POST http://localhost:5000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "https://stats.nba.com/stats/playerindex?LeagueID=00&Season=2023-24&TeamID=0", "itemCount": 25}'
```

### Example 6: Using JavaScript/Axios

```javascript
const axios = require("axios");

async function scrapeData() {
  try {
    const response = await axios.post("http://localhost:5000/api/scrape", {
      url: "https://stats.nba.com/stats/commonallplayers?LeagueID=00&Season=2023-24&IsOnlyCurrentSeason=1",
      itemCount: 50, // Get only first 50 players
    });

    console.log("Success:", response.data.success);
    console.log("Total items available:", response.data.metadata.totalItems);
    console.log("Items returned:", response.data.metadata.returnedItems);
    console.log("Limited:", response.data.metadata.limited);
    console.log(
      "First player:",
      response.data.data.resultSets?.[0]?.rowSet?.[0],
    );
  } catch (error) {
    console.error("Error:", error.response.data);
  }
}

scrapeData();
scrapeData();
```

### Example 7: Using Fetch API with Item Limit

```javascript
fetch("http://localhost:5000/api/scrape", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    url: "https://jsonplaceholder.typicode.com/posts",
    itemCount: 5, // Get only first 5 posts
  }),
})
  .then((res) => res.json())
  .then((data) => {
    console.log("Total:", data.metadata.totalItems);
    console.log("Returned:", data.metadata.returnedItems);
    console.log("Data:", data.data);
  })
  .catch((err) => console.error(err));
```

## 🎯 Common Pitfall: HTML vs JSON

### ❌ Wrong - HTML Page URL

```bash
# This will FAIL - it's an HTML page
curl -X POST http://localhost:5000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.nba.com/players"}'

# Error: "No public JSON data found at this URL"
```

### ✅ Correct - JSON API Endpoint

```bash
# This will SUCCEED - it's a JSON API
curl -X POST http://localhost:5000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "https://stats.nba.com/stats/commonallplayers?LeagueID=00&Season=2023-24&IsOnlyCurrentSeason=1"}'

# Success: Returns player data
```

### 🔍 How to Find the Right URL

When you see data on a webpage but get "No JSON data found":

1. **Open Browser DevTools** (F12)
2. **Go to Network Tab**
3. **Filter by "XHR" or "Fetch"**
4. **Reload the page**
5. **Look for JSON responses**
6. **Copy the Request URL**

📚 See [FINDING_API_ENDPOINTS.md](./FINDING_API_ENDPOINTS.md) for detailed guide.

## ⚠️ Error Handling

The scraper handles various error scenarios:

### Invalid URL Format

```json
{
  "success": false,
  "message": "Invalid URL provided",
  "error": "Invalid URL format"
}
```

### Non-JSON Response

```json
{
  "success": false,
  "message": "No public JSON data found at this URL",
  "error": "The URL did not return JSON data"
}
```

### Network Errors

```json
{
  "success": false,
  "message": "Unable to reach the URL",
  "error": "URL not found or unreachable"
}
```

### Timeout

```json
{
  "success": false,
  "message": "Unable to reach the URL",
  "error": "Request timeout - URL took too long to respond"
}
```

**Note**: Timeouts are automatically handled with retries. The scraper will retry up to 2 times before giving up.

## 🔧 Features

- ✅ **Simple POST endpoint** - Easy to use
- ✅ **JSON-only responses** - Only returns JSON data, no HTML parsing
- ✅ **URL validation** - Validates URL format before making requests
- ✅ **Error handling** - Comprehensive error handling for all scenarios
- ✅ **Smart timeouts** - 30s default, 60s for NBA Stats API (slow endpoints get more time)
- ✅ **Auto-retry** - Automatically retries failed requests up to 2 times on timeout
- ✅ **Smart headers** - Automatically adds required headers for NBA Stats API and other services
- ✅ **Server-side limiting** - Fetch only needed data from source with `itemCount` (auto-adds `?limit=N` to URL)
- ✅ **Custom query params** - Full control with `params` object for advanced filtering
- ✅ **Dynamic item limiting** - Limit results with `itemCount` parameter (e.g., get first 10 items only)
- ✅ **Item counting** - Automatically counts total and returned items
- ✅ **Colored logging** - Beautiful colored logs for debugging
- ✅ **NBA API support** - Special handling for stats.nba.com and data.nba.com

## 📊 Server-Side vs Client-Side Limiting

### 🚀 Server-Side Limiting (RECOMMENDED)

Fetches ONLY the data you need from the source - saves bandwidth and improves performance.

**Using itemCount (automatic):**

```javascript
{
  "url": "https://jsonplaceholder.typicode.com/posts",
  "itemCount": 5  // API automatically adds ?_limit=5
}
```

Result: Only 5 posts are fetched from the API

**Using custom params (full control):**

```javascript
{
  "url": "https://api.github.com/users/github/repos",
  "params": {
    "per_page": 10,  // GitHub's limit parameter
    "sort": "updated"
  }
}
```

Result: Fetches 10 most recently updated repos

### 📦 Client-Side Limiting (Fallback)

When the external API doesn't support limiting, the tool fetches all data and limits it for you.

### Supported Auto-Detection

When using `itemCount`, the tool automatically detects the API and adds the right parameter:

- **JSONPlaceholder**: `?_limit=N`
- **GitHub API**: `?per_page=N`
- **Other APIs**: `?limit=N` (most common)
  }

````

### How It Works

The limiter and counter intelligently handle different data structures:

**Arrays**: Limits and counts array length
```javascript
// Original: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
// With itemCount: 3
// Returns: [1, 2, 3]
// Metadata: { totalItems: 10, returnedItems: 3, limited: true }
````

**NBA API Format**: Limits items in `resultSets[].rowSet`

```javascript
// Original: { resultSets: [{ rowSet: [...500 players] }] }
// With itemCount: 50
// Returns: { resultSets: [{ rowSet: [...first 50 players] }] }
// Metadata: { totalItems: 500, returnedItems: 50, limited: true }
```

**Common API Formats**: Limits `data`, `results`, or `items` fields

```javascript
// Original: { data: [...100 items] }
// With itemCount: 10
// Returns: { data: [...first 10 items] }
// Metadata: { totalItems: 100, returnedItems: 10, limited: true }
```

### Use Cases

**Testing APIs**: Get a small sample before fetching all data

```json
{ "url": "...", "itemCount": 5 } // Quick preview
```

**Large Datasets**: Avoid overwhelming responses

```json
{ "url": "...", "itemCount": 100 } // Manageable size
```

**Pagination Simulation**: Get first X items

```json
{ "url": "...", "itemCount": 25 } // First page
```

### Example: NBA API with Item Limit

**Request:**

```json
{
  "url": "https://stats.nba.com/stats/commonallplayers?LeagueID=00&Season=2023-24&IsOnlyCurrentSeason=1",
  "itemCount": 10
}
```

**Response:**

```json
{
  "success": true,
  "message": "Data fetched successfully",
  "data": {
    "resultSets": [
      {
        "name": "CommonAllPlayers",
        "headers": ["PERSON_ID", "DISPLAY_FIRST_LAST", ...],
        "rowSet": [
          [2544, "LeBron James", ...],
          [201939, "Stephen Curry", ...],
          // ... only 8 more players (10 total)
        ]
      }
    ]
  },
  "metadata": {
    "url": "https://stats.nba.com/stats/commonallplayers?...",
    "totalItems": 500,
    "returnedItems": 10,
    "limited": true,
    "timestamp": "2026-03-16T05:45:00.000Z"
  }
}
```

**Without itemCount limit**, the metadata would show:

```json
{
  "metadata": {
    "totalItems": 500,
    "returnedItems": 500,
    "limited": false
  }
}
```

## 🏗️ Project Structure

```
api/src/
├── routes/
│   └── scrape.routes.js       # Route definitions
├── controllers/
│   └── scrape.controller.js   # Request/response handling
├── services/
│   └── scrape.service.js      # Business logic & HTTP requests
└── test/
    └── test-scraper.js        # Test examples
```

## 🧪 Testing

Run the test script:

```bash
npm run test:scraper
```

Or manually test using curl:

```bash
# Test with valid JSON API
curl -X POST http://localhost:5000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "https://jsonplaceholder.typicode.com/posts/1"}'

# Test with invalid URL
curl -X POST http://localhost:5000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "not-a-valid-url"}'

# Test with HTML page (should fail)
curl -X POST http://localhost:5000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

## 🔒 Limitations

- Only fetches data from public URLs (no authentication)
- Only returns JSON data (HTML/XML not supported)
- Smart timeouts: 30s default, 60s for NBA Stats API
- Auto-retries up to 2 times on timeout
- Does not parse or scrape HTML elements
- Does not follow redirects beyond Axios defaults

## 💡 Use Cases

- Fetching public API data
- Aggregating data from multiple JSON endpoints
- Testing API endpoints
- Data validation and verification
- Quick data retrieval without writing custom scrapers

## 📚 Related Endpoints

- `GET /api/health` - Check API health status
- `GET /api/players` - Get NBA players data
- `GET /api/players/scrape` - Scrape NBA players

## 🤝 Contributing

To extend the scraper functionality:

1. Modify `scrape.service.js` for core logic changes
2. Update `scrape.controller.js` for request/response handling
3. Add new routes in `scrape.routes.js` if needed

## 📄 License

ISC
