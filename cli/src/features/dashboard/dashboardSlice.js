import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchDashboardPayload } from './api/dashboardApi';
import { transformDashboardData } from './utils/dashboardTransformers';

const initialState = {
  stats: [],
  activity: [],
  users: [],
  status: 'idle',
  error: null,
  lastUpdated: null,
};

export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchDashboardData',
  async (_, { rejectWithValue }) => {
    try {
      const payload = await fetchDashboardPayload();
      return transformDashboardData(payload);
    } catch (error) {
      return rejectWithValue(error?.message || 'Failed to load dashboard data');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.stats = action.payload.stats;
        state.activity = action.payload.activity;
        state.users = action.payload.users;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to load dashboard data';
      });
  },
});

export default dashboardSlice.reducer;
