import { ENV } from './env'; // config/env.js

// Application Configuration
export const APP_CONFIG = {
  NAME: 'React Boilerplate',
  VERSION: '1.0.0',
  DEFAULT_LANGUAGE: 'en',
  DEFAULT_THEME: 'light',
  PAGINATION_LIMIT: 10,
};

// API Configuration
export const API_CONFIG = {
  BASE_URL: ENV.API_BASE_URL,
  TIMEOUT: ENV.IS_DEV ? 10000 : 5000,
  WITH_CREDENTIALS: false,
};

// Authentication Configuration
export const AUTH_CONFIG = {
  TOKEN_KEY: 'auth_token',
  USER_KEY: 'auth_user',
  LOGIN_REDIRECT: '/dashboard',
  LOGOUT_REDIRECT: '/login',
};

// Route Paths
export const ROUTES_CONFIG = {
  public: {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    PRODUCTS: '/api/products',
  },
  private: {
    DASHBOARD: '/dashboard',
    PROFILE: '/profile',
    SETTINGS: '/settings',
  },
};

// Storage keys
export const STORAGE_CONFIG = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
  THEME: 'app_theme',
};

// Theme Configuration
export const THEME_CONFIG = {
  STORAGE_KEY: 'app_theme',
  LIGHT: 'light',
  DARK: 'dark',
};
