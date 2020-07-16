import React from 'react';

import OrderFilters from './OrderFilters/OrderFilters';
import OrdersTable from './OrdersTable/OrdersTable';

import ErrorBoundary from '../common/ErrorBoundary';


const Orders = () => (
  <ErrorBoundary>
    <OrderFilters />
    <OrdersTable />
  </ErrorBoundary>
);

export default Orders;
