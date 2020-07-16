import React, { useMemo } from 'react';
import { useUpdateEffect } from 'react-use';

import Button from '~/components/common/Button';
import { Refresh as RefreshIcon } from '~/components/common/Icons';
import { Error as ErrorAlert } from '~/components/common/Alert';
import useWarehouseGroupedProducts from '~/hooks/products/useWarehouseGroupedProducts';

import WarehouseUnfulfillableProducts from './WarehouseUnfulfillableProducts';

import {
  useProductInventoryState,
  useProductInventoryDispatch,
} from '~/contexts/ProductInventoryState';
import { useDebouncedFiltersState } from '~/contexts/FiltersState';
import { useAggregateOrdersDispatch } from '~/contexts/AggregateOrdersState';

const UnfulfillableProducts = () => {
  const { unfulfillableProducts, isLoading, isError } = useProductInventoryState();
  const { refresh } = useProductInventoryDispatch();

  const { filters: { warehouseId: filteredWarehouseId } } = useDebouncedFiltersState();

  const warehouseGroupedProducts = useWarehouseGroupedProducts({
    unfulfillableProducts,
    filteredWarehouseId,
  });

  if (isError) {
    return (
      <ErrorAlert error={isError} />
    );
  }

  return warehouseGroupedProducts && (
    <>
      <div className="border-b my-4 mb-6" />

      <Button border rounded onClick={refresh}>
        <RefreshIcon refreshing={isLoading} className="pr-2" />
        Refresh
      </Button>

      {warehouseGroupedProducts && warehouseGroupedProducts.map(
        (unfullableProducts, idx) => (
          <WarehouseUnfulfillableProducts
            key={`warehouseUnfulfillableProduct-${idx}`}
            unfullableProducts={unfullableProducts}
          />
        ),
      )}

    </>
  );
};

export default UnfulfillableProducts;
