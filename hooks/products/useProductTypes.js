import { useState, useEffect } from 'react';
import useFetch from '../useFetch';
import { getOrderProductsProductTypes } from '../../utilities/api';

const useProductTypes = () => {
  const [productTypes, setProductTypes] = useState({});
  const [{ data, isLoading }] = useFetch(getOrderProductsProductTypes);

  useEffect(() => {
    if (data) {
      setProductTypes({ ...data.data });
    }
  }, [data]);

  return [{ productTypes, isLoading }];
};

export default useProductTypes;
