import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchProducts } from '../../../features/products/productsAPI';

const ProductsView = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch products data from API or perform any necessary setup here
    dispatch(fetchProducts());
  }, []);
  return <div>ProductsView</div>;
};

export default ProductsView;
