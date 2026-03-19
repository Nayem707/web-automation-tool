# 🏀 NBA API Quick Reference

Use these **JSON API endpoints** with the scraper tool, not the HTML page URLs.

## ⚡ Important: NBA API Performance

**The NBA Stats API can be slow (20-60 seconds response time).**

Don't worry! The scraper automatically:

- ✅ Uses 60-second timeout for NBA Stats API (instead of 30s default)
- ✅ Auto-retries up to 2 times if timeout occurs
- ✅ Adds required headers (Referer, Origin, x-nba-stats-token)

**Be patient** - the first request might take 30-60 seconds. This is normal for stats.nba.com.

## ✅ Correct Endpoints (JSON APIs)

### Get All Active Players

```
https://stats.nba.com/stats/commonallplayers?LeagueID=00&Season=2023-24&IsOnlyCurrentSeason=1
```

**Usage:**

```bash
curl -X POST http://localhost:5000/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "https://stats.nba.com/stats/commonallplayers?LeagueID=00&Season=2023-24&IsOnlyCurrentSeason=1"}'
```

### Get Player Index

```
https://stats.nba.com/stats/playerindex?LeagueID=00&Season=2023-24&TeamID=0
```

### Get League Roster Stats

```
https://stats.nba.com/stats/leaguedashplayerstats?LeagueID=00&Season=2023-24&SeasonType=Regular+Season
```

### Get Specific Player Info

```
https://stats.nba.com/stats/commonplayerinfo?PlayerID=2544
```

_Replace `2544` with the actual player ID_

### Get Team Roster

```
https://stats.nba.com/stats/commonteamroster?TeamID=1610612739&Season=2023-24
```

_Replace `1610612739` with the team ID_

### Get All Teams

```
https://stats.nba.com/stats/commonteamyears?LeagueID=00
```

## ❌ Wrong Endpoints (HTML Pages)

These will **NOT** work with the scraper:

```
❌ https://www.nba.com/players          (HTML page)
❌ https://www.nba.com/stats             (HTML page)
❌ https://www.nba.com/teams             (HTML page)
❌ https://www.nba.com/player/2544       (HTML page)
```

## 🎯 Quick Test

Try this working example:

```javascript
const axios = require("axios");

async function testNBAScraper() {
  try {
    const response = await axios.post("http://localhost:5000/api/scrape", {
      url: "https://stats.nba.com/stats/commonallplayers?LeagueID=00&Season=2023-24&IsOnlyCurrentSeason=1",
    });

    console.log("✅ Success!");
    console.log("Item count:", response.data.metadata.itemCount);
    console.log(
      "Players found:",
      response.data.data.resultSets[0].rowSet.length,
    );
    console.log("First player:", response.data.data.resultSets[0].rowSet[0]);
  } catch (error) {
    console.error("❌ Error:", error.response?.data?.message);
  }
}

testNBAScraper();
```

**Expected Response Structure:**

```json
{
  "success": true,
  "message": "Data fetched successfully",
  "data": {
    "resultSets": [
      {
        "name": "CommonAllPlayers",
        "headers": ["PERSON_ID", "DISPLAY_FIRST_LAST", "DISPLAY_LAST_COMMA_FIRST", ...],
        "rowSet": [
          [2544, "LeBron James", "James, LeBron", ...],
          [201939, "Stephen Curry", "Curry, Stephen", ...],
          // ... more players
        ]
      }
    ]
  },
  "metadata": {
    "url": "https://stats.nba.com/stats/commonallplayers?...",
    "itemCount": 500,
    "timestamp": "2026-03-16T05:45:00.000Z"
  }
}
```

## 📋 Common Query Parameters

### LeagueID

- `00` - NBA
- `10` - WNBA
- `20` - G League

### Season

- Format: `YYYY-YY` (e.g., `2023-24`, `2022-23`)

### SeasonType

- `Regular Season`
- `Playoffs`
- `Pre Season`
- `All Star`

### IsOnlyCurrentSeason

- `1` - Only current season players
- `0` - All players (historical)

## 🔑 Team IDs (Common Teams)

```
1610612738 - Boston Celtics
1610612739 - Cleveland Cavaliers
1610612740 - New Orleans Pelicans
1610612741 - Chicago Bulls
1610612742 - Dallas Mavericks
1610612743 - Denver Nuggets
1610612744 - Golden State Warriors
1610612745 - Houston Rockets
1610612746 - LA Clippers
1610612747 - LA Lakers
1610612748 - Miami Heat
1610612749 - Milwaukee Bucks
1610612750 - Minnesota Timberwolves
1610612751 - Brooklyn Nets
1610612752 - New York Knicks
1610612753 - Orlando Magic
1610612754 - Indiana Pacers
1610612755 - Philadelphia 76ers
1610612756 - Phoenix Suns
1610612757 - Portland Trail Blazers
1610612758 - Sacramento Kings
1610612759 - San Antonio Spurs
1610612760 - Oklahoma City Thunder
1610612761 - Toronto Raptors
1610612762 - Utah Jazz
1610612763 - Memphis Grizzlies
1610612764 - Washington Wizards
1610612765 - Detroit Pistons
1610612766 - Charlotte Hornets
1610612737 - Atlanta Hawks
```

## 💡 Tips

1. **Always use `stats.nba.com`**, not `www.nba.com`
2. **Check Browser DevTools** if an endpoint doesn't work
3. **Include query parameters** - many endpoints require them
4. **Use current season** - `2023-24` or `2024-25` depending on the date
5. **The scraper auto-adds required headers** for NBA Stats API
6. **Be patient** - NBA Stats API responses can take 30-60 seconds

## ⚠️ Troubleshooting

### Request Timeout Error

If you see: `"Request timeout - URL took too long to respond"`

**Don't panic!** This is common with NBA Stats API. The scraper will:

1. Automatically retry (up to 2 times)
2. Wait 2 seconds between retries
3. Use 60-second timeout for each attempt

**Total possible wait time**: Up to 3 minutes (3 attempts × 60s)

**Solutions**:

- ✅ **Wait longer** - Be patient, NBA API is slow
- ✅ **Try again later** - API might be under heavy load
- ✅ **Use smaller queries** - Request specific players/teams instead of all data
- ✅ **Check your internet** - Slow connection can compound the issue

### Still Timing Out?

Try these alternative, faster endpoints:

```bash
# Instead of all players (slow):
❌ https://stats.nba.com/stats/commonallplayers?LeagueID=00&Season=2023-24&IsOnlyCurrentSeason=1

# Try specific player (faster):
✅ https://stats.nba.com/stats/commonplayerinfo?PlayerID=2544

# Or team roster (faster):
✅ https://stats.nba.com/stats/commonteamroster?TeamID=1610612747&Season=2023-24
```

## 🔗 Related Docs

- [SCRAPER_GUIDE.md](./SCRAPER_GUIDE.md) - Full scraper documentation
- [FINDING_API_ENDPOINTS.md](./FINDING_API_ENDPOINTS.md) - How to find more endpoints

## 📚 Full API Documentation

For complete NBA Stats API documentation, check:

- [NBA API GitHub](https://github.com/swar/nba_api)
- Use Browser DevTools Network tab to discover new endpoints
