# Enhanced NBA Players Scraper - Production Architecture

## 🚀 Overview

This is a **production-ready** NBA players scraping system that addresses all the common issues with large-scale web scraping:

- ✅ **ECONNRESET Prevention** - HTTP keep-alive agents with connection pooling
- ✅ **Retry Logic** - Exponential backoff with intelligent error categorization  
- ✅ **Concurrency Control** - Queue-based processing with configurable limits
- ✅ **Request Throttling** - Smart rate limiting and delay strategies
- ✅ **Checkpoint Recovery** - Resume from failures automatically
- ✅ **Backup Management** - Versioned backups with automatic rotation
- ✅ **Duplicate Prevention** - Advanced deduplication with merge strategies
- ✅ **Monitoring & Metrics** - Real-time progress tracking and health monitoring

## 📋 Problem Solutions

### Original Issues Fixed:

| Issue | Solution Implemented |
|-------|---------------------|
| ECONNRESET errors | HTTP agents with keep-alive, connection pooling |
| No retry logic | Exponential backoff with 3 configurable retries |
| Poor concurrency | Queue-based system with configurable workers (default: 3) |
| No throttling | Smart delays (1000ms default) with rate limiting |
| No recovery | Checkpoint system saves progress every 100 items |
| Data loss risk | Versioned backups with automatic rotation |
| Duplicates | Advanced deduplication with merge strategies |
| No monitoring | Comprehensive metrics and health checks |

## 🔧 Quick Start

### 1. Configuration

Copy and configure environment settings:
```bash
cp .env.example .env
```

Key settings for production:
```env
# Recommended production settings
SCRAPING_CONCURRENCY=3        # Max concurrent requests
REQUEST_DELAY=1000            # Delay between requests (1 second)
MAX_RETRIES=3                 # Retry failed requests
HTTP_TIMEOUT=30000            # 30 second timeout
MAX_BACKUPS=10               # Keep 10 backup versions
```

### 2. Start the Enhanced API

```bash
npm start
```

The enhanced API runs alongside the legacy API:
- **Enhanced endpoints**: `/api/enhanced/*` (recommended)
- **Legacy endpoints**: `/api/players/*` (backward compatibility)

### 3. Start Production Scraping

```bash
# Start enhanced scraping with monitoring
curl "http://localhost:3001/api/enhanced/scrape"

# Check real-time status
curl "http://localhost:3001/api/enhanced/scrape/status"

# Get comprehensive metrics
curl "http://localhost:3001/api/enhanced/metrics"
```

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Enhanced NBA Scraper                     │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐ ┌──────────────┐ ┌─────────────────┐   │
│  │ HTTP Client     │ │ Scraping     │ │ Monitoring      │   │
│  │ - Keep-alive    │ │ Queue        │ │ Service         │   │
│  │ - Retry logic   │ │ - Concurrency│ │ - Metrics       │   │
│  │ - Pooling       │ │ - Checkpoints│ │ - Health checks │   │
│  └─────────────────┘ └──────────────┘ └─────────────────┘   │
│                                                             │
│  ┌─────────────────┐ ┌──────────────┐ ┌─────────────────┐   │
│  │ Backup System   │ │ Data Storage │ │ Validation      │   │
│  │ - Versioning    │ │ - Atomic      │ │ - Integrity     │   │
│  │ - Auto-restore  │ │ - Corruption  │ │ - Duplicates    │   │
│  │ - Rotation      │ │   recovery    │ │ - Merge logic   │   │
│  └─────────────────┘ └──────────────┘ └─────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Enhanced API Endpoints

### Scraping Operations

```bash
# Start production scraping with options
GET /api/enhanced/scrape?strategy=update&updateExisting=true

# Real-time status monitoring
GET /api/enhanced/scrape/status

# Control running scraping (pause/resume/stop)
POST /api/enhanced/scrape/control
{
  "action": "pause"  # or "resume", "stop"
}
```

### Backup Management

```bash
# List all available backups
GET /api/enhanced/backups

# Restore from specific backup
POST /api/enhanced/restore
{
  "backupPath": "./src/data/players.json.backup.2026-03-04T03-22-08-962Z"
}

# Auto-restore from latest backup
POST /api/enhanced/restore
{
  "autoRestore": true
}
```

### Data Validation & Monitoring

```bash
# Validate data integrity  
GET /api/enhanced/validate

# Get comprehensive metrics
GET /api/enhanced/metrics

# Enhanced player retrieval with filtering
GET /api/enhanced?search=lebron&team=lakers&sortBy=lastName&limit=50
```

## ⚙️ Configuration Guide

### HTTP Client Settings

```env
# Connection pooling prevents ECONNRESET
MAX_SOCKETS=10              # Max connections per host
MAX_FREE_SOCKETS=5          # Max idle connections
KEEP_ALIVE=true             # Enable keep-alive
KEEP_ALIVE_MSECS=30000      # Keep connections alive for 30s
```

### Scraping Queue Settings

```env
SCRAPING_CONCURRENCY=3      # Concurrent requests (recommended: 2-5)
REQUEST_DELAY=1000          # Delay between requests (ms)
BATCH_SIZE=50              # Process in batches
CHECKPOINT_INTERVAL=100     # Save progress every N items
```

### Backup Settings

```env
MAX_BACKUPS=10             # Keep 10 backup versions
BACKUP_PATH=./src/data/backups  # Backup directory
```

## 🔍 Monitoring & Metrics

### Real-time Monitoring

The system provides comprehensive monitoring:

```javascript
{
  "system": {
    "memory": "45.2% (2.1GB/4.6GB)",
    "cpu": "Load: [0.5, 0.3, 0.2]", 
    "disk": "12% used"
  },
  "scraping": {
    "progress": "67.3% (3,365/5,000)",
    "rate": "12.5 items/sec",
    "eta": "2m 15s"
  },
  "http": {
    "success_rate": "98.7%",
    "avg_response": "450ms",
    "retries": 45
  }
}
```

### Health Checks

```bash
curl http://localhost:3001/api/enhanced/metrics
```

Returns health status:
- ✅ **Healthy** - All systems normal
- ⚠️ **Warning** - High memory/error rate
- ❌ **Critical** - System issues detected

## 🛠️ Error Handling & Recovery

### Automatic Recovery

1. **Connection Errors** - Retry with exponential backoff
2. **Rate Limiting** - Intelligent delays and throttling  
3. **Data Corruption** - Auto-restore from backups
4. **Process Interruption** - Resume from checkpoints

### Error Categories

| Error Type | Handling Strategy |
|------------|------------------|
| `ECONNRESET` | Retry with new connection |
| `ETIMEDOUT` | Exponential backoff retry |
| `429 Rate Limit` | Extended delay + retry |
| `500 Server Error` | Immediate retry |
| `404 Not Found` | Skip and continue |

### Manual Recovery

```bash
# Check what backups are available
curl http://localhost:3001/api/enhanced/backups

# Restore from specific backup if needed
curl -X POST http://localhost:3001/api/enhanced/restore \
  -H "Content-Type: application/json" \
  -d '{"backupPath": "backup_file_path"}'

# Validate data integrity
curl http://localhost:3001/api/enhanced/validate
```

## 📈 Production Best Practices

### Recommended Settings

For scraping 5,000+ players reliably:

```env
# Conservative settings for stability
SCRAPING_CONCURRENCY=2
REQUEST_DELAY=1500
MAX_RETRIES=5
HTTP_TIMEOUT=45000

# For faster processing (higher risk)
SCRAPING_CONCURRENCY=5  
REQUEST_DELAY=500
MAX_RETRIES=3
HTTP_TIMEOUT=30000
```

### Deployment Considerations

1. **Memory**: ~500MB base + 100MB per 1000 players
2. **CPU**: Low usage, I/O bound operations
3. **Storage**: ~50MB per 10,000 players + backups
4. **Network**: Respect NBA.com rate limits

### Monitoring Production

```bash
# Set up monitoring endpoints
curl http://localhost:3001/api/enhanced/metrics
curl http://localhost:3001/api/enhanced/scrape/status

# Health check for load balancers
curl http://localhost:3001/api/enhanced/health
```

## 🔄 Migration from Legacy

The enhanced system is backward compatible:

```bash
# Legacy endpoint (still works)
curl http://localhost:3001/api/players/scrape

# Enhanced endpoint (recommended)  
curl http://localhost:3001/api/enhanced/scrape
```

Differences:
- Enhanced version includes monitoring, backups, and retry logic
- Legacy version is simpler but less reliable for large datasets
- Both save to the same JSON file format

## 🚨 Troubleshooting

### Common Issues

**Scraping Stalls**
```bash
# Check current status
curl http://localhost:3001/api/enhanced/scrape/status

# If needed, restart from checkpoint
# The system automatically resumes from last checkpoint
```

**High Error Rates**
```bash
# Check error breakdown
curl http://localhost:3001/api/enhanced/metrics

# Adjust rate limiting
# Edit .env: REQUEST_DELAY=2000
```

**Data Corruption**
```bash
# Auto-restore from backup
curl -X POST http://localhost:3001/api/enhanced/restore \
  -H "Content-Type: application/json" \
  -d '{"autoRestore": true}'
```

### Logs Location

Monitor logs for detailed information:
```bash
# Check console output for real-time monitoring
# Look for these indicators:
# ✅ "Enhanced scraping completed successfully"  
# ⚠️ "High error rate detected"
# 📊 "Progress: X% completed"
```

## 📝 Summary

This enhanced NBA scraper provides a **production-ready solution** that can handle 5,000+ players reliably with:

- **Zero data loss** - Comprehensive backup system
- **Automatic recovery** - Checkpoints and intelligent retries  
- **Real-time monitoring** - Progress tracking and health metrics
- **Production stability** - Connection pooling and error handling

The system is designed to **"set it and forget it"** - start the scraping and it will handle all edge cases, errors, and recovery automatically while providing comprehensive progress monitoring.