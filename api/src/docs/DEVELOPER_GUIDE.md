# Developer Quick Setup Guide

## 🚀 Get Started in 5 Minutes

### 1. Prerequisites Check
```bash
node --version   # Requires v16+
npm --version    # Requires v7+
```

### 2. Installation
```bash
# Clone/download project
git clone <repository-url>
cd nba-players-scraper

# Install dependencies
npm install

# Setup environment
cp .env.example .env
```

### 3. Start Development Server
```bash
npm run dev    # Auto-reload development mode
# OR
npm start      # Production mode
```

### 4. Verify Setup
```bash
# Test API health
curl http://localhost:3001/api/health

# Run diagnostic tests
node test-enhanced-scraping.js
```

## 📚 Key Files to Understand

### Essential Files (Start Here)
1. **`src/server.js`** - Express server entry point
2. **`src/routes/index.js`** - API routing structure  
3. **`src/controllers/enhancedPlayersController.js`** - Main business logic
4. **`src/services/enhancedNbaScraperService.js`** - Production scraper
5. **`.env.example`** - Configuration options

### Architecture Overview
```
src/
├── server.js                   # Express app entry point
├── config/index.js            # Environment configuration
├── routes/
│   ├── index.js               # Main router (START HERE)
│   ├── players.js             # Legacy endpoints
│   └── enhancedPlayers.js     # Enhanced endpoints
├── controllers/
│   ├── playersController.js   # Legacy controller
│   └── enhancedPlayersController.js # Main controller (KEY FILE)
├── services/
│   ├── enhancedNbaScraperService.js # Production scraper (KEY FILE)
│   ├── httpClient.js          # HTTP connection pooling
│   ├── scrapingQueue.js       # Queue management
│   ├── monitoringService.js   # Metrics & monitoring
│   └── playersService.js      # Data storage operations
├── utils/
│   ├── logger.js              # Logging utility
│   ├── fileUtils.js           # File operations + backup
│   └── validationUtils.js     # Data validation
└── data/
    ├── players.json           # Main data storage
    └── *.backup.*             # Automatic backups
```

## 🧪 Testing & Development

### Run All Tests
```bash
node test-enhanced-scraping.js
```

### Test Specific Components
```bash
node test-enhanced-scraping.js http        # HTTP client
node test-enhanced-scraping.js backup      # Backup system
node test-enhanced-scraping.js monitoring  # Monitoring service
node test-enhanced-scraping.js validation  # Data validation
```

### Check Data
```bash
node src/test/check    # Shows current player count
```

## 🔧 Common Development Tasks

### 1. Add a New API Endpoint
```javascript
// 1. Add to src/routes/enhancedPlayers.js
router.get("/new-endpoint", async (req, res, next) => {
  try {
    await enhancedPlayersController.handleNewEndpoint(req, res);
  } catch (error) {
    next(error);
  }
});

// 2. Add to src/controllers/enhancedPlayersController.js
async handleNewEndpoint(req, res) {
  try {
    const result = await this.someService.performAction();
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    Logger.error("Error in new endpoint:", error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
```

### 2. Modify Scraping Logic
Main scraper: `src/services/enhancedNbaScraperService.js`
- `scrapePlayersFromApi()` - Main entry point
- `processPlayerWithEnhancements()` - Individual player processing
- `transformPlayer()` - Data transformation logic

### 3. Change Configuration
Edit `.env` file:
```env
SCRAPING_CONCURRENCY=3      # Concurrent requests
REQUEST_DELAY=1000          # Delay between requests
MAX_RETRIES=3               # Retry attempts
```

### 4. Add New Data Fields
1. Update `transformPlayer()` in `enhancedNbaScraperService.js`
2. Update validation in `src/utils/validationUtils.js`
3. Update documentation

## 📖 API Usage Examples

### Basic API Calls
```bash
# Health check
curl http://localhost:3001/api/health

# Get all players (first 10)
curl "http://localhost:3001/api/enhanced?limit=10"

# Search for players
curl "http://localhost:3001/api/enhanced?search=lebron"

# Start scraping
curl "http://localhost:3001/api/enhanced/scrape"

# Check scraping status
curl "http://localhost:3001/api/enhanced/scrape/status"
```

### JavaScript Integration
```javascript
// Example client code
const API_BASE = 'http://localhost:3001/api';

async function getPlayers(filters = {}) {
  const params = new URLSearchParams(filters);
  const response = await fetch(`${API_BASE}/enhanced?${params}`);
  return response.json();
}

async function startScraping() {
  const response = await fetch(`${API_BASE}/enhanced/scrape`);
  return response.json();
}

// Usage
const players = await getPlayers({ team: 'lakers', limit: 5 });
const scrapingResult = await startScraping();
```

## 🐛 Debugging

### Enable Debug Mode
```env
NODE_ENV=development
LOG_LEVEL=debug
```

### View Logs
```bash
# Monitor logs in real-time (if using PM2)
pm2 logs nba-scraper

# Check application output
npm run dev
```

### Common Issues

**Port already in use:**
```bash
# Change port
PORT=3002 npm start

# Kill existing process
lsof -ti:3001 | xargs kill
```

**Memory issues:**
```env
# Reduce resource usage
SCRAPING_CONCURRENCY=2
BATCH_SIZE=25
```

**Connection errors:**
```env
# More conservative settings
REQUEST_DELAY=2000
HTTP_TIMEOUT=45000
```

## 🔍 Code Patterns

### Error Handling Pattern
```javascript
try {
  const result = await someAsyncOperation();
  Logger.success("Operation completed");
  return result;
} catch (error) {
  Logger.error("Operation failed:", error.message);
  throw new Error("User-friendly error message");
}
```

### API Response Pattern
```javascript
// Success response
res.status(200).json({
  success: true,
  message: "Operation completed",
  data: result,
  timestamp: new Date().toISOString()
});

// Error response
res.status(500).json({
  success: false,
  message: "Operation failed",
  error: error.message,
  timestamp: new Date().toISOString()
});
```

### Service Class Pattern
```javascript
class NewService {
  constructor(options = {}) {
    this.options = options;
    this.config = config;
  }

  async performOperation() {
    try {
      // Implementation
      return result;
    } catch (error) {
      Logger.error("Service operation failed:", error.message);
      throw error;
    }
  }
}
```

## 📦 Dependencies Overview

### Production Dependencies
- **express**: Web framework
- **axios**: HTTP client with interceptors
- **uuid**: Unique ID generation
- **cors**: Cross-origin request support
- **dotenv**: Environment variable management

### Development Dependencies
- **nodemon**: Auto-reload development server

### Key NPM Scripts
```json
{
  "start": "node src/server.js",      // Production
  "dev": "nodemon src/server.js",     // Development
  "test": "node test-enhanced-scraping.js"
}
```

## 🎯 Next Steps

1. **Explore the code**: Start with `src/routes/index.js`
2. **Run tests**: `node test-enhanced-scraping.js`
3. **Try API calls**: Use the curl examples above
4. **Read full docs**: See `COMPLETE_DOCUMENTATION.md`
5. **Check enhanced guide**: See `ENHANCED_SCRAPING_GUIDE.md`

## 💡 Development Tips

1. **Use VS Code**: Great intellisense for this project
2. **Setup REST client**: For easy API testing
3. **Monitor logs**: Watch console output during development
4. **Test incrementally**: Use component tests for faster feedback
5. **Check health endpoint**: Quick way to verify API status

---

Happy coding! 🎉

For detailed documentation, see:
- **Complete Documentation**: `COMPLETE_DOCUMENTATION.md`
- **Production Guide**: `ENHANCED_SCRAPING_GUIDE.md`
- **Project Overview**: `PROJECT_SUMMARY.md`