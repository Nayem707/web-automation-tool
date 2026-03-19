import { createSlice } from '@reduxjs/toolkit';
import { scrapeWithAutoLimit, scrapeWithCustomParams } from './scraperAPI';

const initialState = {
  // Results
  data: null,
  metadata: null,

  // UI state
  status: 'idle', // idle | loading | success | error
  error: null,
  lastUpdated: null,
};

const scraperSlice = createSlice({
  name: 'scraper',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetResults: (state) => {
      state.data = null;
      state.metadata = null;
      state.error = null;
      state.status = 'idle';
    },
  },

  extraReducers: (builder) => {
    builder
      // Scrape with Auto Limit
      .addCase(scrapeWithAutoLimit.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(scrapeWithAutoLimit.fulfilled, (state, action) => {
        state.status = 'success';
        state.data = action.payload.data;
        state.metadata = action.payload.metadata;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(scrapeWithAutoLimit.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload?.error || action.payload?.message || 'Failed to scrape data';
      })

      // Scrape with Custom Params
      .addCase(scrapeWithCustomParams.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(scrapeWithCustomParams.fulfilled, (state, action) => {
        state.status = 'success';
        state.data = action.payload.data;
        state.metadata = action.payload.metadata;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(scrapeWithCustomParams.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload?.error || action.payload?.message || 'Failed to scrape data';
      });
  },
});

export const { clearError, resetResults } = scraperSlice.actions;
export default scraperSlice.reducer;
