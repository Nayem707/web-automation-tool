import axiosInstance from './axiosInstance';

export const GET = async (url, params) => {
  const { data: responseData } = await axiosInstance.get(url, { params });
  return responseData;
};

// Optional: Add other HTTP methods for consistency
export const POST = async (url, data) => {
  const response = await axiosInstance.post(url, data);
  return response.data;
};

export const PUT = async (url, data) => {
  const response = await axiosInstance.put(url, data);
  return response.data;
};

export const PATCH = async (url, data) => {
  const response = await axiosInstance.patch(url, data);
  return response.data;
};

export const DELETE = async (url) => {
  const response = await axiosInstance.delete(url);
  return response.data;
};
