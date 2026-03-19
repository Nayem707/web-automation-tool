# 🔍 How to Find Real API Endpoints

When you see data on a website but get "No JSON data found", it means you're looking at an HTML page. Here's how to find the real API endpoint behind it.

## 📋 Example: NBA Players Page

**What you see**: https://www.nba.com/players (HTML page with player data)  
**What you need**: The actual JSON API endpoint that powers this page

## 🛠️ Step-by-Step Guide

### Method 1: Browser DevTools (Recommended)

1. **Open the page**: Go to https://www.nba.com/players

2. **Open DevTools**:
   - Chrome: Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
   - Firefox: Press `F12`

3. **Go to Network Tab**:
   - Click on "Network" tab
   - Check "XHR" or "Fetch/XHR" filter

4. **Reload the page**: Press `F5` to reload

5. **Look for API calls**:
   - You'll see requests to domains like:
     - `stats.nba.com`
     - `api.nba.com`
     - `data.nba.com`

6. **Click on a request**:
   - Look for requests with names like:
     - `playerindex`
     - `commonallplayers`
     - `leagueroster`
7. **Copy the URL**:
   - Right-click → Copy → Copy URL
   - Or check the "Headers" tab for the full Request URL

### Method 2: Common NBA API Endpoints

Here are verified NBA Stats API endpoints that return JSON:

#### Get All Active Players

```
https://stats.nba.com/stats/commonallplayers?LeagueID=00&Season=2023-24&IsOnlyCurrentSeason=1
```

#### Get Player Index

```
https://stats.nba.com/stats/playerindex?LeagueID=00&Season=2023-24&TeamID=0&College=&Country=&DraftYear=&DraftRound=&Height=&Historical=0&ActiveFlag=
```

#### Get League Roster

```
https://stats.nba.com/stats/leaguedashplayerstats?College=&Conference=&Country=&DateFrom=&DateTo=&Division=&DraftPick=&DraftYear=&GameScope=&GameSegment=&Height=&LastNGames=0&LeagueID=00&Location=&MeasureType=Base&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PaceAdjust=N&PerMode=PerGame&Period=0&PlayerExperience=&PlayerPosition=&PlusMinus=N&Rank=N&Season=2023-24&SeasonSegment=&SeasonType=Regular+Season&ShotClockRange=&StarterBench=&TeamID=0&TwoWay=0&VsConference=&VsDivision=&Weight=
```

#### Get Specific Player Info

```
https://stats.nba.com/stats/commonplayerinfo?PlayerID=2544
```

## 🚀 Using with Your Scraper

Once you find the API endpoint, use it with your scraper:

```bash
curl -X POST http://localhost:5000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://stats.nba.com/stats/commonallplayers?LeagueID=00&Season=2023-24&IsOnlyCurrentSeason=1"
  }'
```

Or with JavaScript:

```javascript
const axios = require("axios");

async function scrapeNBAPlayers() {
  try {
    const response = await axios.post("http://localhost:5000/api/scrape", {
      url: "https://stats.nba.com/stats/commonallplayers?LeagueID=00&Season=2023-24&IsOnlyCurrentSeason=1",
    });

    console.log("Players:", response.data.data.resultSets[0].rowSet);
  } catch (error) {
    console.error("Error:", error.response?.data);
  }
}
```

## 🎯 Tips for Finding API Endpoints

### Look for these patterns:

- URLs ending in `.json`
- Subdomains like `api.`, `stats.`, `data.`
- Paths containing `api`, `stats`, `data`
- Query parameters like `?format=json`

### Common API domains:

- **NBA**: `stats.nba.com`, `data.nba.com`
- **Twitter**: `api.twitter.com`
- **GitHub**: `api.github.com`
- **Reddit**: `www.reddit.com/r/subreddit/.json`
- **News sites**: Often have `/api/` in the path

### Check Response Type:

- In DevTools Network tab, look at the "Type" column
- Look for: `xhr`, `json`, `fetch`
- Avoid: `html`, `document`, `script`

## ⚠️ Important Notes

### NBA Stats API Requirements:

The NBA Stats API may require specific headers:

```javascript
{
  'User-Agent': 'Mozilla/5.0...',
  'Referer': 'https://www.nba.com/',
  'Origin': 'https://www.nba.com'
}
```

If you get blocked, you might need to enhance the scraper service to include these headers.

### Rate Limiting:

Some APIs have rate limits:

- NBA: ~20-30 requests per minute
- Solution: Add delays between requests or use their official API

### Authentication:

Some APIs require:

- API keys
- OAuth tokens
- Session cookies

The basic scraper doesn't handle authentication. For authenticated APIs, you'll need to extend the scraper.

## 🔧 Troubleshooting

### "No JSON data found"

- ✅ You're hitting an HTML page
- ✅ Solution: Find the real API endpoint using DevTools

### "URL not found or unreachable"

- ❌ API endpoint might be wrong
- ❌ API might be down
- ❌ Your IP might be blocked

### "Request timeout"

- ❌ API is too slow
- ❌ Network issues
- ✅ Try again or increase timeout in service

### Empty response or strange data

- ❌ Missing required query parameters
- ❌ API might require specific headers
- ✅ Check DevTools to see what parameters the browser sends

## 📚 Examples for Other Sites

### Reddit Posts (JSON available)

```
# HTML page: https://reddit.com/r/programming
# JSON endpoint: https://reddit.com/r/programming.json
```

### GitHub API

```
# HTML page: https://github.com/nodejs/node
# JSON endpoint: https://api.github.com/repos/nodejs/node
```

### JSONPlaceholder (Test API)

```
# Direct JSON endpoints:
https://jsonplaceholder.typicode.com/posts
https://jsonplaceholder.typicode.com/users
https://jsonplaceholder.typicode.com/comments
```

## 🎓 Practice

Try finding the API endpoints for these sites:

1. ESPN NBA stats page
2. Basketball Reference player page
3. Any news website's article list

Use the DevTools method and see if you can discover their JSON APIs!

---

**Remember**: The scraper is designed to fetch JSON data. If you see data on a webpage but the scraper fails, you need to find the underlying API endpoint that provides that data in JSON format.
