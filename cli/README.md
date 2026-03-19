# React Redux Tailwind CSS Boilerplate 🚀

A modern, production-ready React + Redux + Tailwind CSS boilerplate with best practices, feature-rich setup, and comprehensive tooling.

## ✨ Features

- **React 19** - Latest React with hooks support
- **Redux Toolkit** - Simplified Redux state management with Redux Toolkit
- **Tailwind CSS 4** - Utility-first CSS framework for rapid UI development
- **Vite** - Lightning-fast build tool and development server
- **React Router v7** - Client-side routing with latest React Router
- **ESLint & Prettier** - Code quality and formatting tools
- **Axios** - Promise-based HTTP client
- **React Toastify** - Toast notifications
- **Dark Mode Support** - Built-in dark mode with Tailwind CSS
- **Responsive Design** - Mobile-first responsive components
- **TypeScript Ready** - Pre-configured for TypeScript projects

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd react-boilerplate
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
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
src/
├── api/
│   ├── apiClient.js
│   └── endpoints/
│       └── exampleApi.js
├── app/
│   ├── store.js
│   └── rootReducer.js
├── components/
│   ├── common/
│   │   ├── Button/
│   │   │   ├── Button.jsx
│   │   │   └── index.js
│   │   ├── Input/
│   │   │   ├── Input.jsx
│   │   │   └── index.js
│   │   └── LoadingSpinner/
│   │       ├── LoadingSpinner.jsx
│   │       └── index.js
│   └── layout/
│       ├── Header/
│       │   ├── Header.jsx
│       │   └── index.js
│       └── Footer/
│           ├── Footer.jsx
│           └── index.js
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── authSlice.js
│   │   └── authApi.js
│   ├── todos/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── todosSlice.js
│   │   └── todosApi.js
│   └── counter/
│       ├── components/
│       ├── hooks/
│       ├── counterSlice.js
│       └── counterApi.js
├── hooks/
│   ├── useDebounce.js
│   ├── useLocalStorage.js
│   └── useMediaQuery.js
├── utils/
│   ├── constants.js
│   ├── helpers.js
│   └── validators.js
├── styles/
│   └── globals.css
├── routes/
│   ├── PrivateRoute.jsx
│   └── AppRoutes.jsx
└── App.jsx
```

## 🔧 Configuration

### Tailwind CSS

The Tailwind CSS configuration is located in `tailwind.config.js`. Customize your design tokens here:

```javascript
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: { /* ... */ },
      spacing: { /* ... */ },
    },
  },
  darkMode: 'class',
};
```

### Redux Store

Redux slices are located in `src/store/slices/`. Create new slices for different features:

```javascript
import { createSlice } from '@reduxjs/toolkit';

const initialState = { /* ... */ };

export const featureSlice = createSlice({
  name: 'feature',
  initialState,
  reducers: {
    // Add your reducers here
  },
});

export const { /* actions */ } = featureSlice.actions;
export default featureSlice.reducer;
```

Then register the slice in `src/store/store.js`:

```javascript
import featureReducer from './slices/featureSlice';

export const store = configureStore({
  reducer: {
    // ... other reducers
    feature: featureReducer,
  },
});
```

## 📝 Usage Examples

### Using Redux State

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../store/slices/appSlice';

export default function Component() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.app.theme);

  return (
    <button onClick={() => dispatch(toggleTheme())}>
      Current theme: {theme}
    </button>
  );
}
```

### Using UI Components

```javascript
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function Example() {
  return (
    <Card>
      <h2 className="text-xl font-bold">Welcome</h2>
      <p className="mt-2 text-gray-600">Hello, World!</p>
      <Button variant="primary" size="md" className="mt-4">
        Click Me
      </Button>
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

Container component for grouping content.

```javascript
<Card className="max-w-md">
  <h3 className="font-bold">Card Title</h3>
  <p>Card content goes here</p>
</Card>
```

**Props:**
- `children`: Card content
- `className`: Additional CSS classes

### ThemeToggle

Component to switch between light and dark modes.

```javascript
<ThemeToggle />
```

## 🌙 Dark Mode

Dark mode is built-in using Tailwind's class-based dark mode. To enable dark mode:

```javascript
// In your component
<div className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
  Content
</div>
```

The `ThemeToggle` component is already integrated and manages the theme state via Redux.

## 📚 Dependencies

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

1. **Component Organization** - Keep components modular and focused on single responsibility
2. **Redux Slices** - Use Redux Toolkit slices for cleaner state management
3. **Styling** - Prefer Tailwind CSS utility classes over custom CSS
4. **Type Safety** - Consider using TypeScript for larger projects
5. **Performance** - Use React.memo and useMemo for performance optimization
6. **Testing** - Add tests using Jest and React Testing Library
7. **Code Quality** - Run ESLint and Prettier regularly
8. **Environment Variables** - Use `.env` files for sensitive data

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

### Deploy to Vercel (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Deploy to Netlify

1. Push code to GitHub
2. Connect repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`

## 📖 Resources

- [React Documentation](https://react.dev)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Vite Documentation](https://vitejs.dev)
- [React Router Documentation](https://reactrouter.com)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 💡 Tips

- Use the Redux DevTools browser extension for better state debugging
- Leverage Tailwind's responsive prefixes (sm:, md:, lg:) for responsive design
- Create custom Tailwind components using `@apply` in your CSS
- Keep your Redux slices small and focused
- Consider using Redux Thunk or Redux Saga for async operations

## 🐛 Troubleshooting

### Port Already in Use

If port 5173 is already in use, Vite will automatically use the next available port.

### Tailwind Classes Not Working

1. Ensure content paths in `tailwind.config.js` are correct
2. Clear Tailwind cache: `rm -rf node_modules/.vite`
3. Restart the dev server

### Redux Not Connecting

Ensure `Provider` wraps your app in `main.jsx` and the store is properly configured.

---

Built with ❤️ using React, Redux, and Tailwind CSS
# React-boilerplate
