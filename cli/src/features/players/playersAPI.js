import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllPlayersAPI,
  getPlayerByIdAPI,
  searchPlayersAPI,
  getStorageStatsAPI,
  scrapePlayersAPI,
  clearAllPlayersAPI,
} from './api/playersApi';

export const getAllPlayers = createAsyncThunk(
  'players/getAllPlayers',
  async (filters = {}, { rejectWithValue }) => {
    try {
      return await getAllPlayersAPI(filters);
    } catch (error) {
      return rejectWithValue(error?.response?.data?.error || error.message);
    }
  }
);

export const getPlayerById = createAsyncThunk(
  'players/getPlayerById',
  async (id, { rejectWithValue }) => {
    try {
      return await getPlayerByIdAPI(id);
    } catch (error) {
      return rejectWithValue(error?.response?.data?.error || error.message);
    }
  }
);

export const searchPlayers = createAsyncThunk(
  'players/searchPlayers',
  async (criteria = {}, { rejectWithValue }) => {
    try {
      return await searchPlayersAPI(criteria);
    } catch (error) {
      return rejectWithValue(error?.response?.data?.error || error.message);
    }
  }
);

export const getStorageStats = createAsyncThunk(
  'players/getStorageStats',
  async (_, { rejectWithValue }) => {
    try {
      return await getStorageStatsAPI();
    } catch (error) {
      return rejectWithValue(error?.response?.data?.error || error.message);
    }
  }
);

export const scrapePlayers = createAsyncThunk(
  'players/scrapePlayers',
  async (_, { rejectWithValue }) => {
    try {
      return await scrapePlayersAPI();
    } catch (error) {
      return rejectWithValue(error?.response?.data?.error || error.message);
    }
  }
);

export const clearAllPlayers = createAsyncThunk(
  'players/clearAllPlayers',
  async (_, { rejectWithValue }) => {
    try {
      return await clearAllPlayersAPI();
    } catch (error) {
      return rejectWithValue(error?.response?.data?.error || error.message);
    }
  }
);
