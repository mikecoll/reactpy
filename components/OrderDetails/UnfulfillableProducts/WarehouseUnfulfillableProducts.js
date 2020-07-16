import React from 'react';
import PropTypes from 'prop-types';

import DetailsPanel from '~/components/OrderDetails/DetailsPanel';
import AggregateLineItems from '~/components/OrderDetails/AggregateLineItems';

import LineDetailProduct from '../LineDetail/LineDetailProduct';

const WarehouseUnfulfillableProducts = React.memo(({
  unfullableProducts,
}) => {
  if (unfullableProducts === null) {
    return;
  }

  const { warehouse } = unfullableProducts[0];
  const sortedLineItems = unfullableProducts
    .sort((a, b) => a.stock_shortfall - b.stock_shortfall);

  return (
    <DetailsPanel
      key={warehouse.name}
      label={warehouse.name}
    >
      <AggregateLineItems
        lineItems={sortedLineItems}
        color="orange-lighter"
        DetailComponent={LineDetailProduct}
      />
    </DetailsPanel>
  );
});

WarehouseUnfulfillableProducts.defaultProps = {
  unfullableProducts: null,
};

WarehouseUnfulfillableProducts.propTypes = {
  unfullableProducts: PropTypes.arrayOf(
    PropTypes.object,
  ),
};

export default WarehouseUnfulfillableProducts;
