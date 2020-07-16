import { useState, useEffect } from 'react';
import { useUpdateEffect, usePreviousDistinct } from 'react-use';

import useFetch from '../useFetch';
import { postDistinctProductIdsProductTypes } from '~/utilities/api';

const getValueAsArray = (src, key) => (
  typeof src[key] === 'object'
    ? Object.values(src[key])
    : src[key]
);

const useDistinctProductIdsProductTypes = (effect, selectedOrders) => {
  const [productIds, setProductIds] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [{ data, isLoading, isError }, setUrl] = useFetch();

  const prevSelectedOrders = usePreviousDistinct(selectedOrders);

  useUpdateEffect(() => {
    // @TODO: Use Null propegation operator when avaible (eg `data?.data?.product_ids`)
    if (data && data.data && data.data.product_ids && data.data.product_types) {
      const newProductTypes = getValueAsArray(data.data, 'product_types');
      const newProductIds = getValueAsArray(data.data, 'product_ids');

      // setProductIds() if the array is truthy and not empty
      newProductIds
        && newProductIds.length
        && setProductIds(newProductIds);

      // setProductTypes() if the array is truthy and not empty
      newProductTypes
        && newProductTypes.length
        && setProductTypes(newProductTypes);

      // run the provided effect if it exists & is a function
      !!effect
        && (typeof effect === 'function')
        && effect({
          productTypes: newProductTypes,
          productIds: newProductIds,
        });
    }
  }, [data]);

  useEffect(() => {
    setUrl(postDistinctProductIdsProductTypes(selectedOrders));
  }, [prevSelectedOrders]);

  return [
    {
      productIds,
      productTypes,
      isLoading,
      isError,
    },
    {
      setUrl,
    },
  ];
};

export default useDistinctProductIdsProductTypes;
