import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData } from '../dashboardSlice';
import {
  selectDashboardActivity,
  selectDashboardError,
  selectDashboardLastUpdated,
  selectDashboardStats,
  selectDashboardStatus,
  selectDashboardUsers,
} from '../selectors';

export const useDashboardData = () => {
  const dispatch = useDispatch();

  const stats = useSelector(selectDashboardStats);
  const users = useSelector(selectDashboardUsers);
  const activity = useSelector(selectDashboardActivity);
  const status = useSelector(selectDashboardStatus);
  const error = useSelector(selectDashboardError);
  const lastUpdated = useSelector(selectDashboardLastUpdated);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchDashboardData());
    }
  }, [dispatch, status]);

  const refresh = () => {
    dispatch(fetchDashboardData());
  };

  return {
    stats,
    users,
    activity,
    status,
    error,
    lastUpdated,
    refresh,
  };
};
