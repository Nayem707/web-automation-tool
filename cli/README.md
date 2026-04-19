# NBA Web Automation Tool - Frontend 🏀

A modern, production-ready React + Redux + Tailwind CSS frontend for the NBA Web Automation Tool. Provides an intuitive interface for web scraping, NBA player management, and data visualization.

## ✨ Features

- **React 19** - Latest React with hooks support
- **Redux Toolkit** - State management for scraper controls and player data
- **Tailwind CSS 4** - Modern, responsive UI design
- **Vite** - Lightning-fast development and build tooling
- **React Router v7** - Client-side routing for seamless navigation
- **Axios** - API communication with backend scraper service
- **React Toastify** - User-friendly notifications
- **Dark Mode Support** - Built-in dark mode toggle
- **Responsive Design** - Mobile-first responsive interface

## 🚀 Application Features

### Web Scraper Interface

- Initiate NBA player scraping from the UI
- Configure scraping parameters
- Monitor scraping progress in real-time
- View scraping statistics and status

### Player Management Dashboard

- Browse scraped NBA player data
- Search and filter players
- View detailed player information
- Manage player database

### Admin Features

- User management interface
- Application settings
- Data management tools
- System status monitoring

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn
- Backend API running on `http://localhost:3001` (see `../api/README.md`)

### Installation

1. Navigate to the CLI directory:

```bash
cd web-automation-tool/cli
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment (create `.env` file):

```bash
VITE_API_BASE_URL=http://localhost:3001
```

4. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 📦 Available Scripts

- `npm run dev` - Start development server with Vite
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality
- `npm run format` - Format code with Prettier

## 📁 Project Structure

```
cli/
├── public/                      # Static assets
├── src/
│   ├── main.jsx                # Application entry point
│   ├── App.jsx                 # Root component
│   ├── index.css              # Global styles
│   ├── components/
│   │   ├── layout/
│   │   │   ├── admin/         # Admin layout components
│   │   │   ├── auth/          # Auth layout components
│   │   │   └── public/        # Public layout components
│   │   └── ui/                # Reusable UI components
│   │       ├── Badge.jsx
│   │       ├── Button.jsx
│   │       ├── Card.jsx
│   │       └── ...
│   ├── config/
│   │   ├── constants.js       # Application constants
│   │   └── env.js            # Environment configuration
│   ├── features/              # Feature-based modules
│   │   ├── store.js          # Redux store configuration
│   │   ├── dashboard/        # Dashboard feature
│   │   ├── players/          # Player management feature
│   │   ├── products/         # Products feature
│   │   └── scraper/          # Web scraper feature
│   ├── pages/                # Page components
│   │   ├── auth/            # Authentication pages
│   │   ├── error/           # Error pages (404, etc.)
│   │   ├── private/         # Private/protected pages
│   │   │   ├── private_home/
│   │   │   ├── private_settings/
│   │   │   ├── scraper/     # Scraper interface
│   │   │   └── users/       # User management
│   │   └── public/          # Public pages
│   ├── router/
│   │   └── router.jsx       # Route configuration
│   ├── services/
│   │   ├── axiosInstance.js # Axios HTTP client setup
│   │   ├── httpEndpoint.js  # API endpoint definitions
│   │   └── httpMethods.js   # HTTP request methods
│   └── utils/               # Utility functions
│       ├── errorHandler.js
│       ├── Helper.js
│       ├── storage.js
│       └── validators.js
├── eslint.config.js         # ESLint configuration
├── vite.config.js          # Vite configuration
├── package.json            # Dependencies and scripts
└── README.md
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the CLI root directory:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:3001

# Application Settings
VITE_APP_NAME=NBA Web Automation Tool
VITE_APP_VERSION=1.0.0
```

### Axios Configuration

API communication is configured in `src/services/axiosInstance.js`:

```javascript
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
```

### Tailwind CSS

The Tailwind CSS configuration is in `tailwind.config.js`:

```javascript
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        /* Custom color palette */
      },
      spacing: {
        /* Custom spacing */
      },
    },
  },
  darkMode: 'class',
};
```

### Redux Store

Redux slices are organized by feature in `src/features/`. The main store is configured in `src/features/store.js`:

```javascript
import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from './dashboard/dashboardSlice';
import playersReducer from './players/playersSlice';
import scraperReducer from './scraper/scraperSlice';

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    players: playersReducer,
    scraper: scraperReducer,
  },
});
```

Each feature module manages its own state:

- **Dashboard**: Application overview and statistics
- **Players**: NBA player data and management
- **Scraper**: Web scraping controls and status
- **Products**: Product management (if applicable)

## 📝 Usage Examples

### Connecting to the Backend API

```javascript
import axiosInstance from '../services/axiosInstance';

// Trigger NBA player scraping
const startScraping = async () => {
  try {
    const response = await axiosInstance.post('/api/manual/scrape-nba');
    console.log('Scraping started:', response.data);
  } catch (error) {
    console.error('Scraping failed:', error);
  }
};

// Get all players
const fetchPlayers = async () => {
  try {
    const response = await axiosInstance.get('/api/manual/players');
    return response.data.players;
  } catch (error) {
    console.error('Failed to fetch players:', error);
  }
};

// Search players
const searchPlayers = async (query) => {
  try {
    const response = await axiosInstance.get(`/api/manual/players/search?firstName=${query}`);
    return response.data.players;
  } catch (error) {
    console.error('Search failed:', error);
  }
};
```

### Using Redux State

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { setScrapingStatus } from '../features/scraper/scraperSlice';

export default function ScraperControl() {
  const dispatch = useDispatch();
  const { isScraperActive, playersCount } = useSelector((state) => state.scraper);

  const handleStartScraping = () => {
    dispatch(setScrapingStatus(true));
    // Trigger scraping API call
  };

  return (
    <div>
      <p>Players scraped: {playersCount}</p>
      <button onClick={handleStartScraping}>
        {isScraperActive ? 'Scraping...' : 'Start Scraping'}
      </button>
    </div>
  );
}
```

### Using UI Components

```javascript
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

export default function PlayerCard({ player }) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">
          {player.firstName} {player.lastName}
        </h2>
        <Badge variant={player.isActive ? 'success' : 'default'}>
          {player.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </div>
      <p className="mt-2 text-gray-600">
        {player.team} • {player.position}
      </p>
      <div className="mt-4 flex gap-2">
        <Button variant="primary" size="sm">
          View Details
        </Button>
        <Button variant="secondary" size="sm">
          Edit
        </Button>
      </div>
    </Card>
  );
}
```

### Styling with Tailwind CSS

```javascript
export default function Component() {
  return (
    <div className="flex items-center justify-center rounded-lg bg-blue-500 px-6 py-4 text-white shadow-lg hover:bg-blue-600 dark:bg-blue-900">
      Tailwind styled component
    </div>
  );
}
```

## 🎨 Main Application Pages

### Dashboard (`/`)

- Overview of scraping activity
- Player statistics and counts
- System status monitoring
- Quick actions panel

### Scraper Interface (`/scraper`)

- Initiate web scraping operations
- Configure scraping parameters
- Monitor scraping progress
- View scraping logs and status

### User Management (`/users`)

- Manage application users
- User roles and permissions
- Activity monitoring

### Settings (`/settings`)

- Application configuration
- User preferences
- System settings

## 🎨 Component Library

### Button

Versatile button component with multiple variants and sizes.

```javascript
<Button variant="primary" size="md">
  Primary Button
</Button>
<Button variant="secondary" size="sm">
  Secondary Button
</Button>
<Button variant="danger" size="lg">
  Danger Button
</Button>
```

**Props:**

- `variant`: `'primary'` | `'secondary'` | `'danger'` (default: `'primary'`)
- `size`: `'sm'` | `'md'` | `'lg'` (default: `'md'`)
- `className`: Additional CSS classes
- All standard HTML button attributes

### Card

Container component for grouping content. Perfect for player cards, stat displays, and info panels.

```javascript
<Card className="max-w-md">
  <h3 className="font-bold">Player Statistics</h3>
  <p>Points: 25.4 PPG</p>
  <p>Rebounds: 7.8 RPG</p>
</Card>
```

**Props:**

- `children`: Card content
- `className`: Additional CSS classes

### Badge

Status indicator component for player status, scraping state, etc.

```javascript
<Badge variant="success">Active</Badge>
<Badge variant="warning">Scraping</Badge>
<Badge variant="danger">Error</Badge>
```

**Props:**

- `variant`: `'default'` | `'success'` | `'warning'` | `'danger'`
- `children`: Badge text
- `className`: Additional CSS classes

## 🌙 Dark Mode

Dark mode is built-in using Tailwind's class-based dark mode. Toggle dark mode through the application settings or header.

```javascript
// In your components
<div className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
  Content adapts to theme automatically
</div>
```

The theme state is managed via Redux and persists across sessions.

## 📚 Key Dependencies

### Core Dependencies

- **react** - UI library
- **react-dom** - DOM rendering
- **react-redux** - Redux bindings for React
- **@reduxjs/toolkit** - Redux state management

### Styling

- **tailwindcss** - Utility-first CSS framework
- **@tailwindcss/vite** - Vite plugin for Tailwind CSS
- **clsx** - Utility for constructing className strings

### Routing & HTTP

- **react-router-dom** - Client-side routing
- **axios** - HTTP client

### UI & Notifications

- **react-toastify** - Toast notifications

### Development Tools

- **vite** - Build tool
- **eslint** - Code quality
- **prettier** - Code formatter
- **prettier-plugin-tailwindcss** - Tailwind CSS class sorting

## 🛠️ Best Practices

1. **Component Organization** - Keep components modular and feature-focused
2. **Redux Slices** - Organize state by feature (dashboard, scraper, players)
3. **API Communication** - Use the configured Axios instance for all API calls
4. **Error Handling** - Implement proper error boundaries and user feedback
5. **Styling** - Prefer Tailwind CSS utility classes for consistency
6. **Type Safety** - Consider migrating to TypeScript for larger features
7. **Performance** - Use React.memo and useMemo for expensive operations
8. **Code Quality** - Run ESLint and Prettier before committing
9. **Environment Variables** - Use `.env` for configuration, never commit secrets
10. **Backend Integration** - Ensure backend API is running before starting frontend

## 🔗 Backend Integration

This frontend requires the backend API to be running. See the API documentation:

```bash
# Start the backend (in another terminal)
cd ../api
npm install
npm run dev

# Backend will run on http://localhost:3001
# Frontend expects backend at VITE_API_BASE_URL
```

Key API endpoints used by the frontend:

- `POST /api/manual/scrape-nba` - Initiate NBA player scraping
- `GET /api/manual/players` - Fetch all players
- `GET /api/manual/status` - Get scraping status
- `GET /api/manual/players/search` - Search players

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

This generates an optimized build in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

### Environment Configuration for Production

Update `.env.production`:

```bash
VITE_API_BASE_URL=https://your-api-domain.com
VITE_APP_NAME=NBA Web Automation Tool
```

### Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Set environment variables in Vercel dashboard
4. Deploy: `vercel --prod`

### Deploy to Netlify

1. Push code to GitHub
2. Connect repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variables in Netlify dashboard

**Important**: Ensure your backend API is accessible from your deployed frontend.

## 📖 Resources

- [React Documentation](https://react.dev)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Vite Documentation](https://vitejs.dev)
- [React Router Documentation](https://reactrouter.com)
- [Axios Documentation](https://axios-http.com)
- [Backend API Documentation](../api/README.md)

## 🎯 Development Workflow

1. **Start Backend**: `cd ../api && npm run dev` (runs on port 3001)
2. **Start Frontend**: `cd ../cli && npm run dev` (runs on port 5173)
3. **Access Application**: Open `http://localhost:5173` in browser
4. **Make Changes**: Edit files, Vite will hot-reload automatically
5. **Test Features**: Use the scraper interface to test backend integration
6. **Build**: Run `npm run build` when ready to deploy

## 💡 Tips

- Use Redux DevTools browser extension for state debugging
- Leverage Tailwind's responsive prefixes (sm:, md:, lg:) for responsive design
- Keep API calls in service files, not components
- Use React.memo for expensive component renders
- Check the backend logs when debugging scraping issues
- Monitor network tab in DevTools for API debugging

## 🐛 Troubleshooting

### Backend Connection Issues

**Problem**: Cannot connect to backend API

**Solutions**:

1. Ensure backend is running: `cd ../api && npm run dev`
2. Check `VITE_API_BASE_URL` in `.env` matches backend port (default: 3001)
3. Verify CORS is enabled in backend
4. Check browser console for network errors

### Port Already in Use

If port 5173 is already in use, Vite will automatically use the next available port.

### Tailwind Classes Not Working

1. Ensure content paths in `tailwind.config.js` are correct
2. Clear Vite cache: `rm -rf node_modules/.vite`
3. Restart the dev server

### Redux Not Connecting

1. Ensure `Provider` wraps your app in `main.jsx`
2. Check that the store is properly configured in `src/features/store.js`
3. Verify slice imports in store configuration

### API Request Failing

1. Check backend is running and accessible
2. Verify API endpoint URLs in `src/services/httpEndpoint.js`
3. Check network tab in browser DevTools
4. Ensure proper error handling in components

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**Part of the NBA Web Automation Tool**  
Built with ❤️ using React, Redux, and Tailwind CSS

**Related Documentation**:

- [Backend API Documentation](../api/README.md)
- [API Documentation](../api/docs/COMPLETE_DOCUMENTATION.md)
