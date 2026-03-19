import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  selectPlayers,
  selectCurrentPlayer,
  selectPlayersStats,
  selectPlayersFilters,
  selectPlayersStatus,
  selectPlayersError,
  selectLastUpdated,
} from '../selectors';

import {
  getAllPlayers,
  getPlayerById,
  searchPlayers,
  getStorageStats,
  scrapePlayers,
  clearAllPlayers,
} from '../playersAPI';

import { clearError, setFilters, clearFilters, clearCurrentPlayer } from '../playersSlice';

export const usePlayers = (autoFetch = true) => {
  const dispatch = useDispatch();

  const players = useSelector(selectPlayers);
  const currentPlayer = useSelector(selectCurrentPlayer);
  const stats = useSelector(selectPlayersStats);
  const filters = useSelector(selectPlayersFilters);
  const status = useSelector(selectPlayersStatus);
  const error = useSelector(selectPlayersError);
  const lastUpdated = useSelector(selectLastUpdated);

  // Auto-fetch players on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      dispatch(getAllPlayers());
    }
  }, [autoFetch, dispatch]);

  const fetchAllPlayers = (filterOptions = {}) => {
    dispatch(getAllPlayers(filterOptions));
  };

  const fetchPlayerById = (id) => {
    dispatch(getPlayerById(id));
  };

  const search = (criteria) => {
    dispatch(searchPlayers(criteria));
  };

  const fetchStats = () => {
    dispatch(getStorageStats());
  };

  const scrape = () => {
    dispatch(scrapePlayers());
  };

  const clearAll = () => {
    dispatch(clearAllPlayers());
  };

  const updateFilters = (newFilters) => {
    dispatch(setFilters(newFilters));
  };

  const resetFilters = () => {
    dispatch(clearFilters());
  };

  const dismissError = () => {
    dispatch(clearError());
  };

  const clearPlayer = () => {
    dispatch(clearCurrentPlayer());
  };

  return {
    players,
    currentPlayer,
    stats,
    filters,
    status,
    error,
    lastUpdated,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
    fetchAllPlayers,
    fetchPlayerById,
    search,
    fetchStats,
    scrape,
    clearAll,
    updateFilters,
    resetFilters,
    dismissError,
    clearPlayer,
  };
};
