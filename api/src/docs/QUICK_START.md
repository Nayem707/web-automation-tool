# Quick Start - NBA Roster Scraper

## 🚀 Getting Started

### Option 1: Using the API Server

1. **Start the server:**

   ```bash
   cd api
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

2. **Scrape all NBA rosters:**

   ```bash
   curl http://localhost:3000/api/roster-scraper/scrape-all
   ```

   This will:
   - Scrape all 30 NBA teams
   - Extract all player roster data
   - Save to `api/src/data/players.json`
   - Return statistics and sample players

3. **Get the scraped data:**
   ```bash
   curl http://localhost:3000/api/players
   ```

### Option 2: Using the CLI Script

**Scrape all teams and output JSON:**

```bash
cd api
node scripts/scrape-rosters.js > roster-data.json
```

**Preview with 3 teams:**

```bash
npm run scrape:preview > preview.json
```

**Scrape specific team:**

```bash
npm run scrape:team lakers > lakers.json
# or
node scripts/scrape-rosters.js --team "Los Angeles Lakers" > lakers.json
```

### Option 3: Run Tests First

**Test the scraper before running:**

```bash
cd api
npm run test:roster
```

This will:

- ✅ Verify all 30 teams are defined
- ✅ Test scraping a single team (Lakers)
- ✅ Test scraping multiple teams
- ✅ Validate data schema
- ✅ Show sample output

---

## 📋 Available API Endpoints

Once the server is running:

| Endpoint                          | Method | Description           |
| --------------------------------- | ------ | --------------------- |
| `/api/roster-scraper/scrape-all`  | GET    | Scrape all 30 teams   |
| `/api/roster-scraper/scrape-team` | POST   | Scrape specific team  |
| `/api/roster-scraper/teams`       | GET    | List all teams        |
| `/api/roster-scraper/preview`     | GET    | Preview 3 teams       |
| `/api/roster-scraper/status`      | GET    | Check scraping status |
| `/api/players`                    | GET    | Get all saved players |

---

## 📊 Expected Output

The scraper generates player objects with this structure:

```json
{
  "id": "f8c9d2e1-4a3b-4c5d-8e7f-1a2b3c4d5e6f",
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

---

## 🎯 Key Features

✅ **All 30 NBA Teams** - Scrapes every team automatically
✅ **Proper Schema** - Matches your exact requirements
✅ **Metric Conversions** - Heights in cm, weights in kg
✅ **UUID Generation** - Unique IDs for each player
✅ **Error Handling** - Continues even if some teams fail
✅ **Rate Limiting** - 2-second delay between teams
✅ **Backup System** - Automatic backups before overwriting
✅ **Clean Output** - JSON only, no explanation text (CLI mode)

---

## 🔧 Troubleshooting

**Server won't start:**

```bash
cd api
npm install
npm start
```

**Missing dependencies:**

```bash
npm install axios cheerio uuid express cors dotenv
```

**Port already in use:**
Edit `api/src/config/index.js` and change the port, or set:

```bash
PORT=3001 npm start
```

**Getting empty data:**

- The NBA.com structure may have changed
- Try the preview mode first to test a few teams
- Check the logs for error messages

---

## 📝 Example Usage

### JavaScript/Node.js

```javascript
const response = await fetch(
  "http://localhost:3000/api/roster-scraper/scrape-all",
);
const result = await response.json();
console.log(
  `Scraped ${result.data.stats.totalPlayers} players from ${result.data.stats.teamsProcessed} teams`,
);
```

### Python

```python
import requests

response = requests.get('http://localhost:3000/api/roster-scraper/scrape-all')
data = response.json()
print(f"Scraped {data['data']['stats']['totalPlayers']} players")
```

### cURL

```bash
# Scrape all rosters
curl http://localhost:3000/api/roster-scraper/scrape-all | jq

# Scrape Lakers only
curl -X POST http://localhost:3000/api/roster-scraper/scrape-team \
  -H "Content-Type: application/json" \
  -d '{"teamSlug":"lakers"}' | jq

# Get all teams list
curl http://localhost:3000/api/roster-scraper/teams | jq '.data.teams'
```

---

## 📚 Documentation

Full documentation available in:

- [ROSTER_SCRAPER_GUIDE.md](./ROSTER_SCRAPER_GUIDE.md) - Complete API reference
- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Project overview

---

## ⏱️ Estimated Time

- **Single team:** ~3-5 seconds
- **All 30 teams:** ~60-90 seconds (with rate limiting)
- **Preview (3 teams):** ~10-15 seconds

---

## ✨ Next Steps

1. **Start the server:** `npm start`
2. **Test it:** `npm run test:roster`
3. **Scrape data:** Visit `http://localhost:3000/api/roster-scraper/scrape-all`
4. **Get the JSON:** Check `api/src/data/players.json`

Happy scraping! 🏀
