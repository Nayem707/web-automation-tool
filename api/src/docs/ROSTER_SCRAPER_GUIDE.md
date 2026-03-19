# NBA Roster Scraper - Usage Guide

This service scrapes current NBA team rosters directly from the official NBA.com website.

## Features

- ✅ Scrapes all 30 NBA teams
- ✅ Extracts player data from roster pages
- ✅ Converts measurements to metric (cm/kg)
- ✅ Generates proper JSON schema with UUIDs
- ✅ Handles errors gracefully with retry logic
- ✅ Rate limiting to prevent being blocked
- ✅ Detailed logging and statistics

## API Endpoints

### 1. Scrape All Team Rosters

**Endpoint:** `GET /api/roster-scraper/scrape-all`

**Description:** Scrapes all 30 NBA team rosters and saves to players.json

**Response:**

```json
{
  "success": true,
  "message": "NBA roster scraping completed successfully",
  "data": {
    "stats": {
      "totalPlayers": 450,
      "teamsProcessed": 30,
      "totalTeams": 30,
      "failedTeams": [],
      "duration": "65.23 seconds",
      "savedToFile": true,
      "filePath": "./src/data/players.json"
    },
    "samplePlayers": [...]
  }
}
```

**Example:**

```bash
curl http://localhost:3000/api/roster-scraper/scrape-all
```

---

### 2. Scrape Specific Team

**Endpoint:** `POST /api/roster-scraper/scrape-team`

**Description:** Scrapes a single team's roster

**Body:**

```json
{
  "teamSlug": "lakers"
}
```

OR

```json
{
  "teamName": "Los Angeles Lakers"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Successfully scraped Los Angeles Lakers roster",
  "data": {
    "team": "Los Angeles Lakers",
    "totalPlayers": 15,
    "players": [...]
  }
}
```

**Example:**

```bash
curl -X POST http://localhost:3000/api/roster-scraper/scrape-team \
  -H "Content-Type: application/json" \
  -d '{"teamSlug": "lakers"}'
```

---

### 3. Get All Teams

**Endpoint:** `GET /api/roster-scraper/teams`

**Description:** Returns list of all 30 NBA teams with their slugs

**Response:**

```json
{
  "success": true,
  "data": {
    "totalTeams": 30,
    "teams": [
      {
        "name": "Atlanta Hawks",
        "slug": "hawks",
        "city": "Atlanta",
        "rosterUrl": "https://www.nba.com/hawks/roster"
      },
      ...
    ]
  }
}
```

**Example:**

```bash
curl http://localhost:3000/api/roster-scraper/teams
```

---

### 4. Preview Roster Data

**Endpoint:** `GET /api/roster-scraper/preview?limit=3`

**Description:** Preview roster data for a few teams without saving

**Query Parameters:**

- `limit` (optional, default: 3) - Number of teams to preview

**Response:**

```json
{
  "success": true,
  "data": {
    "teamsPreviewd": 3,
    "preview": [
      {
        "team": "Atlanta Hawks",
        "slug": "hawks",
        "playersCount": 15,
        "samplePlayers": [...]
      }
    ]
  }
}
```

**Example:**

```bash
curl http://localhost:3000/api/roster-scraper/preview?limit=5
```

---

### 5. Get Scraping Status

**Endpoint:** `GET /api/roster-scraper/status`

**Description:** Check if scraping is currently in progress

**Response:**

```json
{
  "success": true,
  "data": {
    "isScrapingInProgress": false,
    "currentStats": {...},
    "lastUpdate": "2026-03-15T10:30:00.000Z"
  }
}
```

---

## Player Data Schema

Each player object follows this structure:

```json
{
  "id": "uuid-v4",
  "firstName": "LeBron",
  "lastName": "James",
  "team": "Los Angeles Lakers",
  "era": "2020s",
  "position": "F",
  "image": "https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png",
  "height": "206cm",
  "weight": "113kg",
  "birthDate": "1984-12-30T00:00:00.000Z",
  "nationality": "USA",
  "yearsActive": "2003",
  "championships": 0,
  "biography": null,
  "gamesPlayed": 56,
  "avgPoints": 25.7,
  "avgRebounds": 7.3,
  "avgAssists": 8.3,
  "difficulty": 1,
  "isActive": true,
  "addedBy": null,
  "createdAt": "2026-03-15T10:25:56.572Z",
  "updatedAt": "2026-03-15T10:25:56.572Z"
}
```

### Statistics Fields

The scraper now attempts to fetch player statistics:

| Field         | Description                                     | Source        |
| ------------- | ----------------------------------------------- | ------------- |
| `gamesPlayed` | Games played (GP) in current/most recent season | NBA Stats API |
| `avgPoints`   | Average points per game (PPG)                   | NBA Stats API |
| `avgRebounds` | Average rebounds per game (RPG)                 | NBA Stats API |
| `avgAssists`  | Average assists per game (APG)                  | NBA Stats API |

**Note:** Statistics are fetched from NBA Stats API if available. If the API is unavailable or the player has no stats, these fields will be `null`.

## Team Slugs Reference

| Team Name              | Slug         | City          |
| ---------------------- | ------------ | ------------- |
| Atlanta Hawks          | hawks        | Atlanta       |
| Boston Celtics         | celtics      | Boston        |
| Brooklyn Nets          | nets         | Brooklyn      |
| Charlotte Hornets      | hornets      | Charlotte     |
| Chicago Bulls          | bulls        | Chicago       |
| Cleveland Cavaliers    | cavaliers    | Cleveland     |
| Dallas Mavericks       | mavericks    | Dallas        |
| Denver Nuggets         | nuggets      | Denver        |
| Detroit Pistons        | pistons      | Detroit       |
| Golden State Warriors  | warriors     | Golden State  |
| Houston Rockets        | rockets      | Houston       |
| Indiana Pacers         | pacers       | Indiana       |
| LA Clippers            | clippers     | LA            |
| Los Angeles Lakers     | lakers       | Los Angeles   |
| Memphis Grizzlies      | grizzlies    | Memphis       |
| Miami Heat             | heat         | Miami         |
| Milwaukee Bucks        | bucks        | Milwaukee     |
| Minnesota Timberwolves | timberwolves | Minnesota     |
| New Orleans Pelicans   | pelicans     | New Orleans   |
| New York Knicks        | knicks       | New York      |
| Oklahoma City Thunder  | thunder      | Oklahoma City |
| Orlando Magic          | magic        | Orlando       |
| Philadelphia 76ers     | sixers       | Philadelphia  |
| Phoenix Suns           | suns         | Phoenix       |
| Portland Trail Blazers | blazers      | Portland      |
| Sacramento Kings       | kings        | Sacramento    |
| San Antonio Spurs      | spurs        | San Antonio   |
| Toronto Raptors        | raptors      | Toronto       |
| Utah Jazz              | jazz         | Utah          |
| Washington Wizards     | wizards      | Washington    |

## Usage Examples

### Node.js / JavaScript

```javascript
// Scrape all teams
const response = await fetch(
  "http://localhost:3000/api/roster-scraper/scrape-all",
);
const data = await response.json();
console.log(`Scraped ${data.data.stats.totalPlayers} players`);

// Scrape specific team
const lakers = await fetch(
  "http://localhost:3000/api/roster-scraper/scrape-team",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ teamSlug: "lakers" }),
  },
);
const lakersData = await lakers.json();
```

### Python

```python
import requests

# Scrape all teams
response = requests.get('http://localhost:3000/api/roster-scraper/scrape-all')
data = response.json()
print(f"Scraped {data['data']['stats']['totalPlayers']} players")

# Scrape specific team
lakers = requests.post(
    'http://localhost:3000/api/roster-scraper/scrape-team',
    json={'teamSlug': 'lakers'}
)
lakers_data = lakers.json()
```

## Important Notes

1. **Rate Limiting:** The scraper includes a 2-second delay between team requests to avoid being blocked
2. **Data Source:** Data is scraped from official NBA.com roster pages, with stats from NBA Stats API
3. **Statistics Enrichment:** The scraper attempts to fetch player stats (GP, PPG, RPG, APG) from NBA Stats API automatically
4. **Data Accuracy:** If stats are unavailable from the API, fields will be `null`
5. **Active Players Only:** This scraper only gets current roster players (isActive: true)
6. **Backups:** Original data is automatically backed up before saving new data
7. **Performance:** Stats enrichment adds ~100ms per player (approximately 45-60 seconds for all teams)

## Getting Just the JSON Data

If you want to get the raw JSON output programmatically:

```bash
# Get all players and save to file
curl http://localhost:3000/api/roster-scraper/scrape-all | jq '.data.samplePlayers' > players.json

# Or get all players from the data endpoint
curl http://localhost:3000/api/players > all_players.json
```

## Troubleshooting

### Issue: No players found

- **Solution:** The NBA.com structure may have changed. Check the browser console when visiting a roster page to see the data structure.

### Issue: Scraping takes too long

- **Solution:** Use the preview endpoint first to test a few teams, or scrape specific teams individually.

### Issue: Some teams fail

- **Solution:** Check the `failedTeams` array in the response for error details. You can manually scrape those teams later using the `/scrape-team` endpoint.

## Technical Details

- **Service:** `nbaRosterScraperService.js`
- **Controller:** `rosterScraperController.js`
- **Routes:** `rosterScraper.js`
- **Data Storage:** `api/src/data/players.json`
- **Dependencies:** axios, cheerio, uuid

## Support

For issues or questions, check the application logs for detailed error messages.
