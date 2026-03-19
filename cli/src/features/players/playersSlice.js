import { createSlice } from '@reduxjs/toolkit';
import {
  getAllPlayers,
  getPlayerById,
  searchPlayers,
  getStorageStats,
  scrapePlayers,
  clearAllPlayers,
} from './playersAPI';

const initialState = {
  // Data
  players: [],
  currentPlayer: null,
  stats: null,

  // Pagination & Filters
  filters: {
    team: null,
    position: null,
    isActive: null,
  },

  // UI state
  status: 'idle', // idle | loading | success | error
  error: null,
  lastUpdated: null,
};

const playersSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = { team: null, position: null, isActive: null };
    },
    clearCurrentPlayer: (state) => {
      state.currentPlayer = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Get All Players
      .addCase(getAllPlayers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getAllPlayers.fulfilled, (state, action) => {
        state.status = 'success';
        state.players =
          action.payload.data?.players ||
          action.payload.players ||
          action.payload.data ||
          action.payload ||
          [];
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(getAllPlayers.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload;
      })

      // Get Player By ID
      .addCase(getPlayerById.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(getPlayerById.fulfilled, (state, action) => {
        state.status = 'success';
        state.currentPlayer =
          action.payload.data?.player ||
          action.payload.player ||
          action.payload.data ||
          action.payload;
      })
      .addCase(getPlayerById.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload;
      })

      // Search Players
      .addCase(searchPlayers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(searchPlayers.fulfilled, (state, action) => {
        state.status = 'success';
        state.players =
          action.payload.data?.players ||
          action.payload.players ||
          action.payload.data ||
          action.payload ||
          [];
      })
      .addCase(searchPlayers.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload;
      })

      // Get Storage Stats
      .addCase(getStorageStats.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getStorageStats.fulfilled, (state, action) => {
        state.status = 'success';
        state.stats = action.payload.data || action.payload;
      })
      .addCase(getStorageStats.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload;
      })

      // Scrape Players
      .addCase(scrapePlayers.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(scrapePlayers.fulfilled, (state) => {
        state.status = 'success';
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(scrapePlayers.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload;
      })

      // Clear All Players
      .addCase(clearAllPlayers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(clearAllPlayers.fulfilled, (state) => {
        state.status = 'success';
        state.players = [];
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(clearAllPlayers.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload;
      });
  },
});

export const { clearError, setFilters, clearFilters, clearCurrentPlayer } = playersSlice.actions;
export default playersSlice.reducer;
