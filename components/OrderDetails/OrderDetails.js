import React, { useMemo } from 'react';

import ErrorBoundary from '../common/ErrorBoundary';

import SingleOrderDetails from './SingleOrderDetails';
import AggregateOrderDetails from './AggregateOrderDetails';
import NoOrdersSelected from './NoOrdersSelected';

import OrderActions from './OrderActions';

import { useSelectedOrdersState } from '../../contexts/SelectedOrdersState';

const OrderDetails = () => {
  const { selectedOrders } = useSelectedOrdersState();

  return useMemo(() => (
    <ErrorBoundary>
      <div className="py-4 px-8">
        <OrderActions />

        <div className="border-b my-4 mb-6" />

        {selectedOrders.length === 0 && <NoOrdersSelected />}
        {selectedOrders.length === 1 && (
          <SingleOrderDetails />
        )}
        {selectedOrders.length > 1 && (
          <AggregateOrderDetails />
        )}
      </div>
    </ErrorBoundary>
  ), [selectedOrders.length]);
};

export default OrderDetails;
