import React, { useMemo } from 'react';
import { sortBy, find } from 'lodash';

import { orderType } from '~/types';

import AggregateLineItems from '../AggregateLineItems';
import { useProductInventoryState } from '~/contexts/ProductInventoryState';
import LineDetailsOrderProduct from '../LineDetail/LineDetailsOrderProduct';


const recursiveGetSubstitutions = (substitutions, productId, productType) => {
  if (substitutions.length === 0) {
    return [];
  }

  const substitution = substitutions.find(
    sub => productType === sub.product_type
          && productId === sub.replacement_product_id,
  );

  if (substitution) {
    const nextSubs = substitutions.filter(_sub => _sub != substitution);

    return [
      substitution,
      ...recursiveGetSubstitutions(
        nextSubs,
        substitution.original_product_id,
        productType,
      ),
    ].sort((a, b) => a.created_at >= b.created_at);
  }

  return [];
};

const SingleOrderDetailsProducts = ({ order }) => {
  const { unfulfillableProducts } = useProductInventoryState();

  const productsLineItems = useMemo(
    () => sortBy(order.products, 'sku')
      .sort((a, b) => (a.product_id > b.product_id ? 1 : -1))
      .map((op) => {
        const unfulfillableProduct = find(
          unfulfillableProducts,
          { product: { sku: op.sku } },
        );

        const substitutions = recursiveGetSubstitutions(
          order.substitutions,
          op.product_id,
          op.product_type,
        );

        return {
          key: `${op.sku}-${op.product_type}`,

          // AggregateLineItems props
          orderProduct: op,
          substitutions: substitutions.length
            ? substitutions
            : null,
          warehouseId: order.warehouse_id,
          //
          color: unfulfillableProduct ? 'orange-lighter' : null,
        };
      }),
    [order.products],
  );

  return (
    <AggregateLineItems
      lineItems={productsLineItems}
      DetailComponent={LineDetailsOrderProduct}
    />
  );
};

SingleOrderDetailsProducts.propTypes = {
  order: orderType.isRequired,
};

export default SingleOrderDetailsProducts;
