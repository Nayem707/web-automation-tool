import { createAsyncThunk } from '@reduxjs/toolkit';
import { POST } from '../../services/httpMethods';

// Scrape all data from a URL — no item limit applied
export const scrapeWithAutoLimit = createAsyncThunk(
  'scraper/scrapeWithAutoLimit',
  async (body, { rejectWithValue }) => {
    try {
      return await POST('/scrape', body);
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Scrape with a client-specified item count and optional query params
export const scrapeWithCustomParams = createAsyncThunk(
  'scraper/scrapeWithCustomParams',
  async (body, { rejectWithValue }) => {
    try {
      return await POST('/scrape', body);
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);
