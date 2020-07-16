import { get } from 'lodash';
import { useState, useCallback } from 'react';
import { useUpdateEffect } from 'react-use';
import useFetch from '../useFetch';

import { useSelectedOrdersState } from '../../contexts/SelectedOrdersState';
import { getOrders } from '../../utilities/api';

const useFetchedOrders = () => {
  const { unselectedOrders } = useSelectedOrdersState();

  const [state, setState] = useState({
    orders: [],
    lastPage: 0,
    total: 0,
    totalSelected: 0,
  });

  const [{ data, isLoading, isError }, setUrl] = useFetch();

  const setOrdersParams = useCallback(params => setUrl(getOrders(params)));

  useUpdateEffect(() => {
    const orders = get(data, 'data.data', []);
    const lastPage = get(data, 'data.meta.last_page', 0);
    const total = get(data, 'data.meta.total', 0);
    const totalSelected = total - unselectedOrders.length;

    setState({
      orders,
      lastPage,
      total,
      totalSelected,
    });
  }, [data]);

  return [
    {
      ...state,

      isLoading,
      isError,
    },
    setOrdersParams,
  ];
};

export default useFetchedOrders;
