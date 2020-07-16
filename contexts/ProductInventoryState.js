import React, { useEffect, useState, useContext } from 'react';
import { uniq, get, find } from 'lodash';
import { useInterval, usePreviousDistinct } from 'react-use';

import { childrenType } from '../types';
import { getProductQuantities, getOrderProductsProductTypes } from '../utilities/api';

import { useWarehouseState } from './WarehouseContext';
import { useProductsState } from './ProductsContext';
import { useFiltersState } from './FiltersState';

import useFetch from '../hooks/useFetch';

export const initialInternalState = {
  productQuantities: [],
  unfulfillableProducts: [],
  productTypes: [],
};

export const updateIntervalMs = 60000 * 30; // 30 minutes to ms

const ProductInventoryStateContext = React.createContext();
const ProductInventoryDispatchContext = React.createContext();

const ProductInventoryProvider = ({ children }) => {
  const { warehouses } = useWarehouseState();
  const { products } = useProductsState();
  const { filters: { flow } } = useFiltersState();
  const previousFlow = usePreviousDistinct(flow);

  const [internalState, setInternalState] = useState(initialInternalState);
  const [
    { data: productQuantitiesData, isLoading, isError },
    setProductQuantitiesUrl,
  ] = useFetch();
  const [{ data: productTypeResponse }] = useFetch(getOrderProductsProductTypes);

  useEffect(() => {
    setInternalState((state) => {
      const newState = {
        ...state,
        isLoading,
        isError,

        /* Filter Product Quantities upon ingestion */
        productQuantities: uniq( // array
          get(
            productQuantitiesData,
            'data',
            state.productQuantities,
          ),
        ).map(p => ({
          ...p,
          warehouse: find(warehouses, { id: p.warehouse_id }),
          product: find(products, { id: p.product_id }),
        })),
      };

      // compute unfulfillableProducts with warehouse and product
      newState.unfulfillableProducts = newState.productQuantities.filter(
        productQuantity => get(productQuantity, 'has_shortage', false),
      );

      return newState;
    });
  }, [productQuantitiesData, isLoading, isError]);

  useEffect(() => {
    if (productTypeResponse && productTypeResponse.data) {
      setInternalState(state => ({
        ...state,
        productTypes: productTypeResponse.data,
      }));
    }
  }, [productTypeResponse]);

  useEffect(() => {
    setProductQuantitiesUrl(getProductQuantities({ flow }));
  }, [previousFlow]);

  const dispatchState = {
    reset: () => setInternalState(initialInternalState),
    refresh: () => {
      setInternalState(initialInternalState);
      setProductQuantitiesUrl(getProductQuantities({ flow }));
    },
  };

  useInterval(() => {
    dispatchState.refresh();
  }, updateIntervalMs);

  return (
    <ProductInventoryStateContext.Provider value={internalState}>
      <ProductInventoryDispatchContext.Provider value={dispatchState}>
        {children}
      </ProductInventoryDispatchContext.Provider>
    </ProductInventoryStateContext.Provider>
  );
};

ProductInventoryProvider.propTypes = {
  children: childrenType.isRequired,
};

const useProductInventoryState = () => {
  const context = useContext(ProductInventoryStateContext);
  if (context === undefined) {
    throw new Error('useProductInventoryState must be within a ProductInventoryProvider');
  }
  return context;
};

const useProductInventoryDispatch = () => {
  const context = useContext(ProductInventoryDispatchContext);
  if (context === undefined) {
    throw new Error('useProductInventoryState must be within a ProductInventoryProvider');
  }
  return context;
};

export {
  ProductInventoryProvider,
  useProductInventoryState,
  useProductInventoryDispatch,
};
