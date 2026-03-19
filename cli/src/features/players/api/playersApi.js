import axiosInstance from '../../../services/axiosInstance';

const BASE_URL = '/api/players';

export const getAllPlayersAPI = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.team) params.append('team', filters.team);
  if (filters.position) params.append('position', filters.position);
  if (filters.isActive !== undefined) params.append('isActive', filters.isActive);
  if (filters.limit) params.append('limit', filters.limit);
  if (filters.offset) params.append('offset', filters.offset);

  const queryString = params.toString();
  const url = queryString ? `${BASE_URL}?${queryString}` : BASE_URL;
  const response = await axiosInstance.get(url);
  return response.data;
};

export const getPlayerByIdAPI = async (id) => {
  const response = await axiosInstance.get(`${BASE_URL}/${id}`);
  return response.data;
};

export const searchPlayersAPI = async (criteria = {}) => {
  const params = new URLSearchParams();
  if (criteria.firstName) params.append('firstName', criteria.firstName);
  if (criteria.lastName) params.append('lastName', criteria.lastName);
  if (criteria.team) params.append('team', criteria.team);
  if (criteria.position) params.append('position', criteria.position);
  if (criteria.isActive !== undefined) params.append('isActive', criteria.isActive);

  const response = await axiosInstance.get(`${BASE_URL}/search?${params.toString()}`);
  return response.data;
};

export const getStorageStatsAPI = async () => {
  const response = await axiosInstance.get(`${BASE_URL}/stats`);
  return response.data;
};

export const scrapePlayersAPI = async () => {
  const response = await axiosInstance.get(`${BASE_URL}/scrape`);
  return response.data;
};

export const clearAllPlayersAPI = async () => {
  const response = await axiosInstance.delete(BASE_URL);
  return response.data;
};
