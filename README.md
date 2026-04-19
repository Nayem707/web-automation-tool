# NBA Web Automation Tool

A modular web scraping and data extraction system originally developed for personal experimentation with NBA player data. The tool is designed with flexibility and extensibility in mind, making it suitable for integration into larger applications or as a standalone data collection service.

## Overview

This project provides a RESTful API for controlled web scraping operations, with specialized functionality for extracting NBA player information from public sources. While built initially for personal use and learning purposes, the architecture follows production-grade patterns and can be adapted for various data extraction scenarios.

## Purpose

The tool serves two primary functions:

1. **General Web Scraping**: Extract JSON data from any publicly accessible URL endpoint
2. **NBA Data Collection**: Specialized scraping of NBA player statistics, rosters, and biographical information from official NBA sources

The system is designed for **controlled, respectful data extraction** rather than large-scale scraping operations. It includes built-in rate limiting, error handling, and data validation to ensure responsible API usage.

## Architecture

The project is organized into two main components:

### Backend API (`/api`)

- **Technology**: Node.js + Express
- **Purpose**: Handles web scraping logic, data processing, and storage
- **Features**: RESTful endpoints, local JSON storage, automatic backups, comprehensive logging
- **Documentation**: [API Documentation](./api/README.md)

### Frontend Interface (`/cli`)

- **Technology**: React 19 + Redux Toolkit + Tailwind CSS
- **Purpose**: Provides a user-friendly interface for managing scraping operations and viewing collected data
- **Features**: Real-time status monitoring, player data visualization, scraping controls
- **Documentation**: [Frontend Documentation](./cli/README.md)

## Key Features

- **Modular Design**: Clean separation of concerns with distinct layers for routing, business logic, and data management
- **Dual Scraping Modes**: General-purpose JSON scraping and NBA-specific HTML parsing with Cheerio
- **Data Persistence**: Local JSON storage with automatic backup system
- **Error Handling**: Comprehensive error recovery and logging mechanisms
- **Rate Limiting**: Built-in delays and respectful scraping practices
- **CORS Enabled**: Ready for cross-origin frontend integration
- **Extensible**: Easy to add new scraping endpoints or data sources

## Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd web-automation-tool
   ```

2. **Install and start the backend**:

   ```bash
   cd api
   npm install
   npm run dev
   # API runs on http://localhost:3001
   ```

3. **Install and start the frontend** (in a new terminal):

   ```bash
   cd cli
   npm install
   npm run dev
   # Frontend runs on http://localhost:5173
   ```

4. **Access the application**:
   Open your browser to `http://localhost:5173`

## Use Cases

This tool is well-suited for:

- **Learning and Experimentation**: Understanding web scraping concepts and API design patterns
- **Personal Projects**: Collecting data for hobby projects or small-scale applications
- **Prototyping**: Quickly testing data extraction strategies before implementing production systems
- **Integration**: As a microservice within a larger application architecture
- **Controlled Data Collection**: Scheduled, limited-scope data gathering with proper rate limiting

## Integration Potential

The modular architecture allows for flexible integration:

- **Standalone Service**: Run as an independent API accessible via HTTP
- **Microservice**: Deploy as part of a microservices architecture
- **Library**: Import and use the scraping services directly in Node.js applications
- **Scheduled Jobs**: Integrate with cron jobs or task schedulers for periodic data collection

## Project Structure

```
web-automation-tool/
├── api/                    # Backend API server
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── services/      # Business logic
│   │   ├── routes/        # API routes
│   │   └── utils/         # Utilities
│   └── docs/              # API documentation
├── cli/                    # Frontend interface
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── features/      # Redux state management
│   │   ├── pages/         # Application pages
│   │   └── services/      # API client
└── README.md              # This file
```

## Responsible Usage

This tool is designed for **ethical and responsible data collection**:

- Respects rate limits and implements delays between requests
- Targets only publicly accessible data
- Includes error handling to avoid overwhelming target servers
- Stores data locally for controlled, limited-scope use
- Not intended for commercial scraping or large-scale data harvesting

## Documentation

- **[API Documentation](./api/README.md)** - Complete backend API reference
- **[Frontend Documentation](./cli/README.md)** - Frontend setup and usage guide
- **[API Guides](./api/docs/)** - Detailed scraping guides and implementation docs

## Contributing

Contributions are welcome! This project serves as both a learning tool and a functional application. Feel free to:

- Report bugs or suggest improvements
- Add new scraping capabilities
- Improve documentation
- Enhance the frontend interface

## License

This project is licensed under the ISC License.

---

**Note**: This tool was created for personal experimentation and learning. Always ensure compliance with the terms of service of any website you scrape and respect robots.txt directives.
