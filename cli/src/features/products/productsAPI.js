import { createAsyncThunk } from '@reduxjs/toolkit';
import { GET } from '../../services/httpMethods';
import { ROUTES_CONFIG } from '../../services/httpEndpoint';
import { handleApiError } from '../../utils/errorHandler';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await GET(ROUTES_CONFIG.public.PRODUCTS);
      return response;
    } catch (err) {
      return rejectWithValue(handleApiError(err));
    }
  }
);
