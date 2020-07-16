import { useMemo } from 'react';
import { get, groupBy } from 'lodash';

const sortByActiveWarehouse = (whProducts, filteredWarehouseId) => {
  if (parseInt(filteredWarehouseId, 10)) {
    for (const idx in whProducts) { /* eslint-disable-line no-restricted-syntax */
      if (whProducts.hasOwnProperty(idx) && whProducts[idx].length) { /* eslint-disable-line no-prototype-builtins */
        const wpProduct = whProducts[idx][0];

        if (parseInt(wpProduct.warehouse_id, 10) === parseInt(filteredWarehouseId, 10)) {
          const topWhProducts = whProducts.splice(idx, 1);

          return [
            ...topWhProducts,
            ...whProducts,
          ];
        }
      }
    }
  }

  return whProducts;
};

const useWarehouseGroupedProducts = ({
  unfulfillableProducts, filteredWarehouseId,
}) => useMemo(
  () => {
    if (!unfulfillableProducts.length) {
      return [];
    }

    const whProducts = Object.values( // remove the keys
      groupBy( // group the labels by warehouse
        unfulfillableProducts.map((p) => {
          const { id, product, stock_shortfall, warehouse_id } = p; /* eslint-disable-line */

          const sku = get(product, 'sku', 'UNKON');

          const label = product && product.sku
            ? `${product.sku} - ${product.name}`
            : 'Unknown Product';

          return {
            ...p,
            key: String(id),
            label,
            value: (-1) * (Math.abs(stock_shortfall)),
            product,

            // sku,
            // warehouseId: warehouse_id,
          };
        }),
        'warehouse_id',
      ),
    ); // then sort the warehouses by the one that is currently selected for convience

    return sortByActiveWarehouse(whProducts, parseInt(filteredWarehouseId, 10));
  },
  [unfulfillableProducts, filteredWarehouseId],
);

export default useWarehouseGroupedProducts;
