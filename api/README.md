# NBA Players Scraper API

A production-ready Node.js + Express application that scrapes NBA players from the official NBA Stats API with enhanced architecture for handling 5,000+ players reliably.

## 📖 Documentation

- **[Developer Quick Start Guide](DEVELOPER_GUIDE.md)** - Get up and running in 5 minutes
- **[Complete Documentation](COMPLETE_DOCUMENTATION.md)** - Comprehensive API reference and development guide
- **[Project Summary](PROJECT_SUMMARY.md)** - Executive overview and technical architecture
- **[Enhanced Scraping Guide](ENHANCED_SCRAPING_GUIDE.md)** - Production deployment and optimization

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Test the API
curl http://localhost:3001/api/health

# Start enhanced scraping
curl http://localhost:3001/api/enhanced/scrape
```

## 🏀 Features

- **Scrape NBA Players**: Fetch current NBA players from official NBA Stats API
- **Local JSON Storage**: Store and manage player data in local JSON files
- **RESTful API**: Clean API endpoints for data access and management
- **Clean Architecture**: Organized codebase following backend best practices
- **Error Handling**: Comprehensive error handling and logging
- **Data Validation**: Robust data validation and transformation
- **Rate Limiting**: Respectful API scraping with built-in delays
- **Backup System**: Automatic backups before data operations

## 🎯 How to Find NBA API Endpoints

Since NBA.com is React-based, follow these steps to find internal API endpoints:

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
     - `https://stats.nba.com/stats/commonplayerinfo`

4. **Analyze Response Structure**:
   - Click on API requests to see response format
   - Note required headers and parameters

Our scraper uses the `commonallplayers` endpoint which provides current player data in a structured format.

## 📁 Project Structure

```
nba-players-scraper/
├── package.json           # Project configuration and dependencies
├── .env                   # Environment variables (create from .env.example)
├── .env.example          # Environment variables template
├── README.md             # Project documentation
└── src/
    ├── server.js         # Express server setup and middleware
    ├── app.js           # Application entry point
    ├── config/
    │   └── index.js     # Configuration management
    ├── routes/
    │   ├── index.js     # Main routes
    │   └── players.js   # Player-specific routes
    ├── controllers/
    │   └── playersController.js  # Request handlers
    ├── services/
    │   ├── nbaScraperService.js  # NBA API scraping logic
    │   └── playersService.js     # Local data management
    ├── utils/
    │   ├── fileUtils.js     # File operation utilities
    │   ├── logger.js       # Logging utility
    │   └── validationUtils.js  # Data validation helpers
    └── data/
        └── players.json    # Local player data storage (auto-created)
```

## 🚀 Installation

### Prerequisites

- Node.js (v16.0 or higher)
- npm or yarn package manager

### Setup Steps

1. **Clone and Navigate**:

   ```bash
   cd nba-players-scraper
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Configure Environment**:

   ```bash
   # Copy environment template
   cp .env.example .env

   # Edit .env file with your preferred settings
   # PORT=3000 (server port)
   # NODE_ENV=development
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
```

The server will start on `http://localhost:3000` (default port).

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
  "version": "1.0.0"
}
```

#### 2. Scrape NBA Players

```http
GET /api/players/scrape
```

Scrapes current NBA players from the official API and stores them locally.

**Response:**

```json
{
  "success": true,
  "message": "Players scraped and stored successfully",
  "data": {
    "scrapedCount": 450,
    "newPlayersAdded": 25,
    "duplicatesSkipped": 425,
    "totalPlayers": 450,
    "timestamp": "2024-03-03T10:30:00.000Z"
  }
}
```

#### 3. Get All Players

```http
GET /api/players
GET /api/players?team=Lakers&position=PG&limit=10&offset=0
```

**Query Parameters:**

- `team`: Filter by team name
- `position`: Filter by position (PG, SG, SF, PF, C)
- `isActive`: Filter by active status (true/false)
- `limit`: Number of results to return
- `offset`: Number of results to skip (for pagination)

**Response:**

```json
{
  "success": true,
  "message": "Players retrieved successfully",
  "data": {
    "players": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "firstName": "LeBron",
        "lastName": "James",
        "team": "Los Angeles Lakers",
        "era": "2020s",
        "position": "SF",
        "image": "https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png",
        "height": "206cm",
        "weight": "113kg",
        "birthDate": "1984-12-30",
        "nationality": "USA",
        "yearsActive": "2003-present",
        "championships": 4,
        "biography": null,
        "avgPoints": null,
        "avgRebounds": null,
        "avgAssists": null,
        "difficulty": 1,
        "isActive": true,
        "addedBy": null,
        "createdAt": "2024-03-03T10:30:00.000Z",
        "updatedAt": "2024-03-03T10:30:00.000Z"
      }
    ],
    "pagination": {
      "total": 450,
      "limit": 10,
      "offset": 0,
      "hasMore": true
    },
    "timestamp": "2024-03-03T10:30:00.000Z"
  }
}
```

#### 4. Get Player by ID

```http
GET /api/players/:id
```

**Response:**

```json
{
  "success": true,
  "message": "Player retrieved successfully",
  "data": {
    "player": { ... },
    "timestamp": "2024-03-03T10:30:00.000Z"
  }
}
```

#### 5. Search Players

```http
GET /api/players/search?firstName=LeBron&team=Lakers
```

**Query Parameters:**

- `firstName`: Search by first name
- `lastName`: Search by last name
- `team`: Search by team name
- `position`: Search by position
- `isActive`: Search by active status (true/false)

#### 6. Storage Statistics

```http
GET /api/players/stats
```

**Response:**

```json
{
  "success": true,
  "message": "Storage statistics retrieved successfully",
  "data": {
    "stats": {
      "totalPlayers": 450,
      "fileExists": true,
      "filePath": "./src/data/players.json",
      "activePlayers": 430,
      "inactivePlayers": 20,
      "teams": 30,
      "positions": 5
    },
    "timestamp": "2024-03-03T10:30:00.000Z"
  }
}
```

#### 7. Clear All Data

```http
DELETE /api/players
```

Clears all player data (creates backup first).

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

Environment variables in `.env`:

```bash
# Server Configuration
PORT=3000
NODE_ENV=development

# NBA API Configuration
NBA_API_BASE_URL=https://www.nba.com/stats/players/list
NBA_PLAYERS_ENDPOINT=https://stats.nba.com/stats/playerindex

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
curl http://localhost:3000/api/health

# Scrape players
curl http://localhost:3000/api/players/scrape

# Get all players
curl http://localhost:3000/api/players

# Search Lakers players
curl "http://localhost:3000/api/players/search?team=Lakers"

# Get storage stats
curl http://localhost:3000/api/players/stats
```

### Using JavaScript (fetch)

```javascript
// Scrape NBA players
const scrapeResponse = await fetch("http://localhost:3000/api/players/scrape");
const scrapeData = await scrapeResponse.json();
console.log("Scraped players:", scrapeData);

// Get all players
const playersResponse = await fetch("http://localhost:3000/api/players");
const playersData = await playersResponse.json();
console.log("All players:", playersData.data.players);

// Search for specific players
const searchResponse = await fetch(
  "http://localhost:3000/api/players/search?firstName=LeBron",
);
const searchData = await searchResponse.json();
console.log("Search results:", searchData.data.players);
```

## 🏆 Production Considerations

- **Rate Limiting**: Respects NBA API with built-in delays
- **Error Recovery**: Continues processing even if individual requests fail
- **Data Validation**: Ensures data quality and consistency
- **Backup System**: Automatic backups before destructive operations
- **Logging**: Comprehensive logging for debugging and monitoring
- **Graceful Shutdown**: Proper cleanup on application termination

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- NBA.com for providing the player data API
- Express.js and Node.js communities for excellent documentation
- All contributors who help improve this project

---

**Built with ❤️ for basketball fans and developers**
