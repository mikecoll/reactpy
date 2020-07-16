import React, { useState, useContext, useEffect } from 'react';
import { get } from 'lodash';

import { childrenType } from '../types';

const maxOrders = 5000;
const ordersAggregateBase = {
  canceled: 0,
  fulfillable: 0,
  held: 0,
  releasable: 0,
  released: 0,
  shippable: 0,
  shipped: 0,
  staged: 0,
  onLoad: 0,
  total: 0,
};

const initialAggregateOrdersState = {
  products: [],
  orders: { ...ordersAggregateBase },
};

const initalOrderFlags = {
  has_shipped: false,
  has_released: false,
  has_canceled: false,
  has_onLoad: false,
  is_loading: true,
  is_staged: false,
  is_onLoad: false,
};

const AggregateOrdersStateContext = React.createContext();
const AggregateOrdersDispatchContext = React.createContext();

const AggregateOrdersProvider = ({ children }) => {
  const [aggregateState, setAggregateState] = useState(initialAggregateOrdersState);
  const [orderFlags, setOrderFlags] = useState(initalOrderFlags);

  const dispatchState = {
    setAggregateData: ({ products, orders }) => setAggregateState({ products, orders }),
    setOrderFlags: of => setOrderFlags({ of }),
    updateOrderFlags: {
      single: (orderData) => {
        setOrderFlags({
          has_shipped: get(orderData, 'shipped_at', null) !== null,
          has_released: get(orderData, 'order_released_date', null) !== null,
          has_canceled: get(orderData, 'canceled_at', null) !== null,
          has_staged: get(orderData, 'staged_at', null) !== null,
          has_onLoad: get(orderData, 'onload_at', null) !== null,
          is_loading: false,
        });
      },
      aggregate: ({ orders }) => setOrderFlags({
        has_shipped: get(orders, 'shipped', 0) > 0,
        has_released: get(orders, 'released', 0) > 0,
        has_canceled: get(orders, 'canceled', 0) > 0,
        has_staged: get(orders, 'staged', 0) > 0,
        has_onLoad: get(orders, 'onLoad', 0) > 0,
        is_loading: false,
      }),
      reset: () => setOrderFlags(initalOrderFlags),
    },
  };

  const state = {
    ...aggregateState,
    orderFlags,
  };

  // @TODO finish this: addListener may not be the best way to do this

  // // refresh data when the selectedOrderState refreshes
  // useEffect(() => addListener(() => dispatchState.refresh()), []);

  // Upon upon flow change (initally loaded data will include flow)
  // useUpdateEffect(() => dispatchState.refresh(), [flow]);

  return (
    <AggregateOrdersStateContext.Provider value={state}>
      <AggregateOrdersDispatchContext.Provider value={dispatchState}>
        {children}
      </AggregateOrdersDispatchContext.Provider>
    </AggregateOrdersStateContext.Provider>
  );
};

AggregateOrdersProvider.propTypes = {
  children: childrenType.isRequired,
};

const useAggregateOrdersState = () => {
  const context = useContext(AggregateOrdersStateContext);
  if (context === undefined) {
    throw new Error('useAggregateOrdersState must be within a AggregateOrdersProvider');
  }
  return context;
};

const useAggregateOrdersDispatch = () => {
  const context = useContext(AggregateOrdersDispatchContext);
  if (context === undefined) {
    throw new Error('useAggregateOrdersState must be within a AggregateOrdersProvider');
  }
  return context;
};


export {
  initialAggregateOrdersState,
  ordersAggregateBase,
  maxOrders,

  AggregateOrdersProvider,
  useAggregateOrdersState,
  useAggregateOrdersDispatch,
};
