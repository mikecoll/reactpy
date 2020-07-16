import React from 'react';
import { get } from 'lodash';

import { ToastProvider } from 'react-toast-notifications';

import { AuthProvider } from './AuthState';
import { LayoutProvider } from './LayoutState';
import { AggregateOrdersProvider } from './AggregateOrdersState';
import { FiltersProvider } from './FiltersState';
import { SelectedOrdersProvider } from './SelectedOrdersState';
import { PendingOrderUpdatesProvider } from './PendingOrderUpdatesState';
import { ShippingCarrierServicesProvider } from './ShippingCarrierServicesState';
import { ProductInventoryProvider } from './ProductInventoryState';


import { childrenType } from '../types';

const providers = [
  { Provider: ToastProvider, props: { placement: 'top-center', autoDismiss: true } },
  { Provider: AuthProvider },
  { Provider: LayoutProvider },
  { Provider: ShippingCarrierServicesProvider },
  { Provider: FiltersProvider },
  { Provider: PendingOrderUpdatesProvider },
  { Provider: ProductInventoryProvider },
  { Provider: SelectedOrdersProvider },
  { Provider: AggregateOrdersProvider },
];

/** Starting with the AppProvider's children, we're going to return
 *    the providers nested in order - by reducing in reverse (via reduceRight).
 */
const AppProvider = ({ children }) => providers.reduceRight(
  (acc, p) => <p.Provider {...get(p, 'props', {})}>{acc}</p.Provider>,
  children,
);

AppProvider.propTypes = {
  children: childrenType.isRequired,
};

export default AppProvider;
