# NBA Web Automation Tool - API

A production-ready Node.js + Express application for web scraping and NBA player data management. Features dual scraping modes: general URL scraping for JSON data and specialized NBA player scraping from official NBA sources.

## 📖 Documentation

- **[Complete Documentation](docs/COMPLETE_DOCUMENTATION.md)** - Comprehensive API reference and development guide
- **[Web Scraper Guide](docs/WEB_SCRAPER_GUIDE.md)** - General web scraping functionality
- **[NBA Manual Scraper Guide](docs/NBA_MANUAL_SCRAPER_GUIDE.md)** - NBA-specific scraping features
- **[Roster Scraper Guide](docs/ROSTER_SCRAPER_GUIDE.md)** - Complete league roster scraping (5000+ players)

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Test the API
curl http://localhost:3001/api/health

# Scrape JSON data from any URL
curl -X POST http://localhost:3001/api/scrape -H "Content-Type: application/json" -d "{\"url\":\"https://example.com/data.json\"}"

# Scrape NBA players
curl -X POST http://localhost:3001/api/manual/scrape-nba

# Get all players
curl http://localhost:3001/api/manual/players
```

## 🏀 Features

### Dual Scraping Modes

- **General Web Scraper**: Scrape JSON data from any public URL endpoint
- **NBA Manual Scraper**: Specialized scraping for NBA.com player data using Cheerio
- **League Roster Scraper**: Comprehensive scraping of 5000+ NBA players with full statistics

### Core Features

- **RESTful API**: Clean API endpoints for scraping and data management
- **Local JSON Storage**: Persistent storage in local JSON files with automatic backups
- **Data Validation**: Robust data validation and transformation
- **Error Handling**: Comprehensive error handling and logging
- **CORS Enabled**: Cross-origin resource sharing for frontend integration
- **Clean Architecture**: Organized codebase following backend best practices
- **Rate Limiting**: Respectful scraping with built-in delays
- **Backup System**: Automatic backups before data operations

## 🎯 How to Use the Web Scraper

### General JSON Scraping

The general scraper can fetch JSON data from any public URL endpoint:

```bash
curl -X POST http://localhost:3001/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "https://api.example.com/data.json"}'
```

### NBA-Specific Scraping

For NBA data, use the manual scraper which uses Cheerio to parse NBA.com pages:

1. **Open Browser DevTools**:
   - Go to https://www.nba.com/players
   - Press F12 or right-click → Inspect Element

2. **Monitor Network Requests**:
   - Click on "Network" tab
   - Filter by "XHR" or "Fetch"
   - Refresh the page or navigate

3. **Identify API Calls**:
   - Look for requests to `stats.nba.com`
   - Common endpoints include:
     - `https://stats.nba.com/stats/commonallplayers`
     - `https://stats.nba.com/stats/playerindex`
     - `https://stats.nba.com/stats/leaguedashplayerstats`

4. **Use the Manual Scraper**:
   - The manual scraper automatically handles NBA.com's structure
   - Scrapes player information, statistics, and rosters
   - Stores data in structured JSON format

## 📁 Project Structure

```
api/
├── package.json           # Project configuration and dependencies
├── nodemon.json          # Nodemon configuration for development
├── README.md             # Project documentation
├── docs/                 # Comprehensive documentation
│   ├── COMPLETE_DOCUMENTATION.md
│   ├── NBA_MANUAL_SCRAPER_GUIDE.md
│   ├── ROSTER_SCRAPER_GUIDE.md
│   └── WEB_SCRAPER_GUIDE.md
├── scripts/              # Utility scripts
│   └── scrape-rosters.js # Roster scraping script
└── src/
    ├── server.js         # Server entry point
    ├── app.js           # Express application setup
    ├── config/
    │   └── index.js     # Configuration management
    ├── routes/
    │   ├── index.js     # Main route aggregator
    │   ├── scrape.routes.js    # General scraping routes
    │   └── manual.route.js     # NBA manual scraping routes
    ├── controllers/
    │   ├── scrape.controller.js   # General scraping controller
    │   └── manual.controller.js   # NBA scraping controller
    ├── services/
    │   ├── scrape.service.js      # General scraping logic
    │   └── manual.service.js      # NBA scraping logic with Cheerio
    ├── utils/
    │   ├── fileUtils.js       # File operation utilities
    │   ├── logger.js         # Logging utility
    │   └── validationUtils.js # Data validation helpers
    ├── data/
    │   └── players.json      # Local player data storage (auto-created)
    ├── debug/                # Debugging scripts
    └── test/                 # Test files and examples
```

## 🚀 Installation

### Prerequisites

- Node.js (v16.0 or higher)
- npm or yarn package manager

### Setup Steps

1. **Clone and Navigate**:

   ```bash
   cd web-automation-tool/api
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Configure Environment** (Optional):

   ```bash
   # Create .env file if needed
   PORT=3001
   NODE_ENV=development
   ```

4. **Start Development Server**:

   ```bash
   npm run dev
   ```

5. **Or Start Production Server**:
   ```bash
   npm start
   ```

## 🎮 Usage

### Starting the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start

# Run roster scraping script
npm run scrape:rosters
```

The server will start on `http://localhost:3001` (default port).

### API Endpoints

#### 1. Health Check

```http
GET /api/health
```

**Response:**

```json
{
  "success": true,
  "message": "NBA Players Scraper API is healthy",
  "timestamp": "2024-03-03T10:30:00.000Z",
  "version": "2.0.0-enhanced"
}
```

#### 2. General URL Scraping

```http
POST /api/scrape
Content-Type: application/json

{
  "url": "https://example.com/api/data.json"
}
```

Scrapes JSON data from any public URL endpoint.

**Response:**

```json
{
  "success": true,
  "message": "Data scraped successfully",
  "data": {
    "url": "https://example.com/api/data.json",
    "scrapedData": {
      /* ... scraped JSON data ... */
    },
    "timestamp": "2024-03-03T10:30:00.000Z"
  }
}
```

#### 3. Scrape NBA Players (Manual)

```http
POST /api/manual/scrape-nba
```

Scrapes NBA players using Cheerio from NBA.com pages.

**Response:**

```json
{
  "success": true,
  "message": "NBA players scraped successfully",
  "data": {
    "totalPlayers": 450,
    "newPlayers": 25,
    "timestamp": "2024-03-03T10:30:00.000Z"
  }
}
```

#### 4. Scrape League Roster (5000+ Players)

```http
POST /api/manual/scrape-league-roster
```

Comprehensive scraping of the complete NBA League Roster with full player data.

**Response:**

```json
{
  "success": true,
  "message": "League roster scraped successfully",
  "data": {
    "totalPlayers": 5122,
    "timestamp": "2024-03-03T10:30:00.000Z"
  }
}
```

#### 5. Get All Players

```http
GET /api/manual/players
```

**Response:**

```json
{
  "success": true,
  "data": {
    "players": [
      {
        "id": "uuid",
        "firstName": "LeBron",
        "lastName": "James",
        "team": "Los Angeles Lakers",
        "position": "SF",
        "height": "206cm",
        "weight": "113kg",
        "isActive": true
        /* ... more player data ... */
      }
    ],
    "total": 450
  }
}
```

#### 6. Get Players by Team

```http
GET /api/manual/players/team/:teamName
```

**Example:**

```http
GET /api/manual/players/team/Lakers
```

#### 7. Search Players

```http
GET /api/manual/players/search?firstName=LeBron&lastName=James
```

**Query Parameters:**

- `firstName`: Search by first name
- `lastName`: Search by last name
- `team`: Search by team name

#### 8. Get Scraping Status

```http
GET /api/manual/status
```

Returns current scraping statistics and status information.

#### 9. Get Statistics Summary

```http
GET /api/manual/stats/summary
```

Returns comprehensive statistics about stored player data.

## 🏗️ Architecture

### Clean Architecture Layers

1. **Routes Layer** (`/routes`): HTTP route definitions and request routing
2. **Controllers Layer** (`/controllers`): Request handling, response formatting
3. **Services Layer** (`/services`): Business logic, external API interactions
4. **Utils Layer** (`/utils`): Reusable utility functions and helpers
5. **Config Layer** (`/config`): Application configuration management
6. **Data Layer** (`/data`): Local JSON file storage

### Data Flow

1. **Request** → Routes → Controllers
2. **Controllers** → Services (business logic)
3. **Services** → Utils (file operations, validation)
4. **Response** ← Controllers ← Services

## 🛡️ Error Handling

The application includes comprehensive error handling:

- **Validation Errors**: Invalid data structure or missing required fields
- **File System Errors**: Issues with reading/writing JSON files
- **Network Errors**: Problems accessing NBA APIs
- **Rate Limiting**: Automatic delays between API requests
- **Graceful Failures**: Continues processing even if individual players fail

## 🔧 Configuration

Configuration is managed in `src/config/index.js`:

```javascript
module.exports = {
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || "development",
  dataFilePath: "./src/data/players.json",
  nbaApiBaseUrl: "https://www.nba.com",
  requestDelay: 1000, // ms between requests
};
```

Environment variables (optional `.env` file):

```bash
# Server Configuration
PORT=3001
NODE_ENV=development

# NBA API Configuration
NBA_API_BASE_URL=https://www.nba.com
NBA_PLAYERS_PAGE=https://www.nba.com/players

# File Storage
DATA_FILE_PATH=./src/data/players.json

# Rate Limiting
REQUEST_DELAY=1000
```

## 📊 Data Schema

Each player object follows this exact schema:

```javascript
{
  "id": "uuid",                    // Unique identifier
  "firstName": "Magic",            // Player's first name
  "lastName": "Johnson",           // Player's last name
  "team": "Los Angeles Lakers",    // Current/last team
  "era": "1980s",                 // Playing era
  "position": "PG",               // Position (PG, SG, SF, PF, C)
  "image": "https://...",         // Player headshot URL
  "height": "206cm",              // Height in centimeters
  "weight": null,                 // Weight (if available)
  "birthDate": null,              // Birth date (if available)
  "nationality": null,            // Country of origin
  "yearsActive": null,            // Years played in NBA
  "championships": 0,             // Number of championships won
  "biography": null,              // Player biography
  "avgPoints": null,              // Average points per game
  "avgRebounds": null,            // Average rebounds per game
  "avgAssists": null,             // Average assists per game
  "difficulty": 1,                // Game difficulty level (1-5)
  "isActive": true,               // Currently active player
  "addedBy": null,                // Who added this player
  "createdAt": "ISO_DATE",        // Record creation timestamp
  "updatedAt": "ISO_DATE"         // Last update timestamp
}
```

## 🔍 Example API Calls

### Using curl

```bash
# Health check
curl http://localhost:3001/api/health

# General URL scraping
curl -X POST http://localhost:3001/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "https://jsonplaceholder.typicode.com/users"}'

# Scrape NBA players
curl -X POST http://localhost:3001/api/manual/scrape-nba

# Scrape complete league roster
curl -X POST http://localhost:3001/api/manual/scrape-league-roster

# Get all players
curl http://localhost:3001/api/manual/players

# Search Lakers players
curl "http://localhost:3001/api/manual/players/team/Lakers"

# Get scraping status
curl http://localhost:3001/api/manual/status
```

### Using JavaScript (fetch)

```javascript
// General URL scraping
const scrapeResponse = await fetch("http://localhost:3001/api/scrape", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ url: "https://api.example.com/data.json" }),
});
const scrapeData = await scrapeResponse.json();

// Scrape NBA players
const nbaResponse = await fetch("http://localhost:3001/api/manual/scrape-nba", {
  method: "POST",
});
const nbaData = await nbaResponse.json();

// Get all players
const playersResponse = await fetch("http://localhost:3001/api/manual/players");
const playersData = await playersResponse.json();

// Search for specific players
const searchResponse = await fetch(
  "http://localhost:3001/api/manual/players/search?firstName=LeBron",
);
const searchData = await searchResponse.json();
```

## 🏆 Production Considerations

- **Dual Scraping Modes**: General JSON scraping + NBA-specific scraping with Cheerio
- **Rate Limiting**: Respects target websites with built-in delays between requests
- **Error Recovery**: Continues processing even if individual requests fail
- **Data Validation**: Ensures data quality and consistency
- **Backup System**: Automatic backups before destructive operations
- **Logging**: Comprehensive logging for debugging and monitoring
- **CORS Enabled**: Ready for frontend integration
- **Graceful Shutdown**: Proper cleanup on application termination

## 🔄 Available Scripts

```bash
npm start              # Start production server
npm run dev           # Start development server with nodemon
npm run scrape:rosters # Run roster scraping script
npm run scrape:preview # Preview roster scraping (dry run)
npm run scrape:team   # Scrape specific team roster
npm run test:roster   # Test roster scraper
npm run test:scraper  # Test general scraper
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- NBA.com for providing player data
- Cheerio library for HTML parsing and web scraping
- Express.js and Node.js communities for excellent documentation
- All contributors who help improve this project

---

**Built with ❤️ for web automation and basketball enthusiasts**
