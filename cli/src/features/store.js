import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from './dashboard/dashboardSlice';
import scraperReducer from './scraper/scraperSlice';
import playersReducer from './players/playersSlice';

const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    scraper: scraperReducer,
    players: playersReducer,
  },
});

export default store;
