import React, { useEffect, useMemo, useState } from 'react';
import { chunk, find } from 'lodash';
import { BulletList } from 'react-content-loader';

import { Error as AlertError } from '../common/Alert';

import DetailsPanel from './DetailsPanel';
import AggregateLineItems from './AggregateLineItems';
import LineDetailProduct from './LineDetail/LineDetailProduct';

import {
  useAggregateOrdersState,
  useAggregateOrdersDispatch,
  maxOrders,
} from '~/contexts/AggregateOrdersState';

import {
  useSelectedOrdersState,
  useSelectedOrdersDispatch,
} from '~/contexts/SelectedOrdersState';

import { useDebouncedFiltersState } from '~/contexts/FiltersState';
import { useProductInventoryState } from '~/contexts/ProductInventoryState';

import useFetch from '~/hooks/useFetch';
import { getAggregateOrder } from '~/utilities/api';

import aggregateAggregateResponses from '~/utilities/aggregateAggregateResponses';


const AggregateOrderDetails = () => {
  const [forceUpdate, setForceUpdate] = useState(false);

  const { filters: { warehouseId, flow } } = useDebouncedFiltersState();
  const { productQuantities } = useProductInventoryState();

  const { selectedOrders } = useSelectedOrdersState();
  const { addListener } = useSelectedOrdersDispatch();

  const {
    updateOrderFlags,
    setAggregateData,
  } = useAggregateOrdersDispatch();
  const {
    products: orderProductQuantities,
    orders,
  } = useAggregateOrdersState();

  const [{ data, isLoading, isError }, setUrl] = useFetch();
  const updateAggregateDetailsData = () => {
    if (
      // if there's just one order selected this Component should do nothing
      selectedOrders.length > 1
      // if the maximum number of orders is selected don't load new data.
      && selectedOrders.length <= maxOrders
    ) {
      setUrl(
        window.axios.all(
          chunk(selectedOrders, 225)
            .map(bucket => getAggregateOrder(bucket, flow)),
        ),
      );
    }
  };

  useEffect(() => addListener(() => setForceUpdate(true)), []);
  useEffect(() => {
    let mounted = true;

    mounted && forceUpdate && updateAggregateDetailsData();

    return () => { mounted = false; };
  }, [forceUpdate]);

  /* @NOTE: unlike SingleOrderDetails component, we need to use an Effect
   *        triggering `setUrl()` to ensure that anytime selectOrders changes,
   *        we fetch new Aggregatet order data.
   */
  useEffect(() => {
    updateAggregateDetailsData();
  }, [selectedOrders.length, selectedOrders]);

  useEffect(() => {
    let mounted = true;

    if (mounted && data && !isLoading) {
      updateOrderFlags.reset();

      const {
        products,
        orders,
      } = aggregateAggregateResponses(data);

      updateOrderFlags.aggregate({ orders });

      mounted && setAggregateData({
        orders,
        products: Object.values(products)
          .sort((a, b) => b.quantity - a.quantity),
      });

      return () => { mounted = false; };
    }
  }, [data, isLoading]);

  const orderProductQuantitiesLineItems = useMemo(() => orderProductQuantities.map((op) => {
    /*  @NOTE: an unfulfillableProduct can only be found if the
     * warehouseId filter is selected (otherwise, which inventory
     * do we use to calculate the has_shortage status?)
     */
    const unfulfillableProduct = find(
      productQuantities,
      {
        product: { sku: op.sku },
        warehouse_id: parseInt(warehouseId, 10),
      },
    );

    // false if unfulfillableProduct === undefined (no warehouse filtered)
    const selectedShortFall = unfulfillableProduct && (unfulfillableProduct.quantity - op.quantity);
    const hasShortage = selectedShortFall < 0;

    const inventoryLabel = unfulfillableProduct
      && ` (${op.quantity}/${unfulfillableProduct.quantity})`
      || '';

    const productLabel = `${op.sku} - ${op.name}`;

    // if there's a shortage highlight the lineItem
    let color = (hasShortage) ? 'orange-lighter' : null;

    // if there's not a shortage, and the selected lineItem's quantity is within 90% of the
    //    available inventory, highlight in green.
    if (!hasShortage && unfulfillableProduct) {
      color = (parseInt(op.quantity / unfulfillableProduct.quantity * 100, 10) >= 90)
        ? 'green-lighter'
        : null;
    }

    return {
      key: op.sku,
      label: `${productLabel}${inventoryLabel}`,
      value: op.quantity,

      product: { ...op },

      // sku: op.sku,
      // warehouseId: parseInt(warehouseId, 10), // @NOTE: warehouseId comes from the filter state ...
      color,
    };
  }), [orderProductQuantities, warehouseId, productQuantities]);

  const orderFlowLineItems = useMemo(
    () => Object.keys(orders)
      .filter(ok => orders[ok] > 0)
      .sort()
      .map(ok => ({
        key: ok,
        label: ok.charAt(0).toUpperCase() + ok.slice(1),
        value: orders[ok],
      })),
    [orders],
  );

  return useMemo(() => {
    if (isLoading) {
      return <BulletList width={250} height={250} />;
    }

    if (isError) {
      return (<AlertError error={isError} />);
    } if (selectedOrders.length > maxOrders) {
      return (
        <AlertError
          error={`Select Less Than ${maxOrders} Orders to see Aggregate details.`}
        />
      );
    }

    return (
      <>
        <h2 className="font-normal mb-4 text-grey-darkest">Aggregate Order Details</h2>
        <DetailsPanel label="Products">
          <AggregateLineItems
            lineItems={orderProductQuantitiesLineItems}
            DetailComponent={LineDetailProduct}
          />
        </DetailsPanel>
        <DetailsPanel label="Order Statuses">
          <AggregateLineItems lineItems={orderFlowLineItems} />
        </DetailsPanel>
      </>
    );
  }, [isLoading, isError, selectedOrders, orderProductQuantitiesLineItems, orderFlowLineItems]);
};

export default AggregateOrderDetails;
