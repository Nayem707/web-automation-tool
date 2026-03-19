import { useDispatch, useSelector } from 'react-redux';

import {
  selectScraperData,
  selectScraperMetadata,
  selectScraperStatus,
  selectScraperError,
  selectScraperLastUpdated,
  selectIsLoading,
  selectHasData,
  selectHasError,
} from '../selectors';

import { scrapeWithAutoLimit, scrapeWithCustomParams } from '../scraperAPI';

import { clearError, resetResults } from '../scraperSlice';

export const useScraper = () => {
  const dispatch = useDispatch();

  const data = useSelector(selectScraperData);
  const metadata = useSelector(selectScraperMetadata);
  const status = useSelector(selectScraperStatus);
  const error = useSelector(selectScraperError);
  const lastUpdated = useSelector(selectScraperLastUpdated);
  const isLoading = useSelector(selectIsLoading);
  const hasData = useSelector(selectHasData);
  const hasError = useSelector(selectHasError);

  const scrapeAuto = (body = {}) => {
    dispatch(scrapeWithAutoLimit(body));
  };

  const scrapeCustom = (body = {}) => {
    dispatch(scrapeWithCustomParams(body));
  };

  const dismissError = () => {
    dispatch(clearError());
  };

  const reset = () => {
    dispatch(resetResults());
  };

  return {
    data,
    metadata,
    status,
    error,
    lastUpdated,
    isLoading,
    hasData,
    hasError,
    scrapeAuto,
    scrapeCustom,
    dismissError,
    reset,
  };
};
