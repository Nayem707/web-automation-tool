/**
 * Scraper Selectors
 * Select data from the scraper slice
 */

export const selectScraperData = (state) => state.scraper.data;
export const selectScraperMetadata = (state) => state.scraper.metadata;
export const selectScraperStatus = (state) => state.scraper.status;
export const selectScraperError = (state) => state.scraper.error;
export const selectScraperLastUpdated = (state) => state.scraper.lastUpdated;

export const selectIsLoading = (state) => state.scraper.status === 'loading';
export const selectHasData = (state) => state.scraper.data !== null;
export const selectHasError = (state) => state.scraper.error !== null;
