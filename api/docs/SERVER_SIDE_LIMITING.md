# Server-Side Data Limiting - Quick Guide

## 🎯 Problem Solved

**Before:** API fetched ALL data (e.g., 1000 items), then limited client-side
**Now:** API fetches ONLY what you need from source (e.g., 10 items)

## ✅ Benefits

- **Saves bandwidth** - Don't download unnecessary data
- **Faster responses** - Less data to transfer
- **Reduced load** - Less processing on both ends
- **Better performance** - Especially for large datasets

## 📝 Usage Methods

### Method 1: Auto-Detection (Easiest)

Use `itemCount` - the API automatically adds the right limit parameter:

```json
POST /api/scrape
{
  "url": "https://jsonplaceholder.typicode.com/posts",
  "itemCount": 5
}
```

**What happens:**

- API detects JSONPlaceholder
- Automatically adds `?_limit=5` to URL
- Fetches only 5 posts from source

**Supported APIs:**

- JSONPlaceholder → `?_limit=N`
- GitHub API → `?per_page=N`
- Others → `?limit=N` (most common)

### Method 2: Custom Parameters (Full Control)

Use `params` object for any query parameters:

```json
POST /api/scrape
{
  "url": "https://api.github.com/users/github/repos",
  "params": {
    "per_page": 10,
    "sort": "updated",
    "direction": "desc"
  }
}
```

**What happens:**

- Final URL: `https://api.github.com/users/github/repos?per_page=10&sort=updated&direction=desc`
- API fetches exactly what you specified

## 🔍 Response Metadata

Check if server-side limiting was applied:

```json
{
  "success": true,
  "data": [...],
  "metadata": {
    "url": "https://jsonplaceholder.typicode.com/posts?_limit=5",
    "originalUrl": "https://jsonplaceholder.typicode.com/posts",
    "totalItems": 5,
    "returnedItems": 5,
    "limited": false,
    "serverSideLimited": true,  // ← Server-side limiting applied!
    "timestamp": "2026-03-16T..."
  }
}
```

**Key Fields:**

- `serverSideLimited: true` → Data was limited at the source
- `serverSideLimited: false` → All data was fetched
- `url` vs `originalUrl` → Shows exactly what was requested

## 📊 Real Examples

### Example 1: Get 3 Posts Only

```bash
curl -X POST http://localhost:3002/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "https://jsonplaceholder.typicode.com/posts", "itemCount": 3}'
```

**Before Enhancement:** Downloaded all 100 posts → limited to 3
**After Enhancement:** Downloads only 3 posts from source

### Example 2: GitHub Repos with Filters

```bash
curl -X POST http://localhost:3002/api/scrape \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://api.github.com/users/github/repos",
    "params": {
      "per_page": 5,
      "sort": "updated"
    }
  }'
```

**Result:** Fetches 5 most recently updated repos only

### Example 3: NBA API with Limiting

```bash
curl -X POST http://localhost:3002/api/scrape \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://stats.nba.com/stats/commonallplayers?LeagueID=00&Season=2023-24",
    "itemCount": 10
  }'
```

**Result:** Fetches 10 players (if NBA API supports limiting)

## 🚀 Best Practices

1. **Use itemCount for simplicity** - Let the API auto-detect the parameter
2. **Use params for full control** - When you know the API's specific parameters
3. **Check serverSideLimited** - Verify if limiting worked at source
4. **API-specific parameters** - Some APIs use different names:
   - `limit`, `count`, `per_page`, `pageSize`, `page_size`, `_limit`

## 🧪 Test It

Run the test file:

```bash
cd api
node test-server-side-limit.js
```

You'll see:

- ✅ Test 1: Auto-detection with itemCount
- ✅ Test 2: Custom params with GitHub API
- ✅ Test 3: No limiting (fetches all)

## 💡 Tips

- **Large datasets?** Always use server-side limiting
- **Unknown API?** Try `itemCount` first - it auto-detects
- **Need filters?** Use `params` object for full control
- **Debug?** Check `metadata.url` to see final request
