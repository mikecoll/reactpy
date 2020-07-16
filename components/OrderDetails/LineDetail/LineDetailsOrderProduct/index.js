import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { orderProductType, substitutionType } from '~/types';

import OrderProductLineDetail from './OrderProductLineDetail';
import OrderProductExpandedLineDetails from './OrderProductExpandedLineDetails';

// @TODO: move this to the Unfulfillable Product
export const unfulfillableProductColor = 'orange-lighter';

const LineDetailsOrderProduct = (props) => {
  const {
    orderProduct,
    substitutions,
    ...restProps
  } = props;

  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <OrderProductLineDetail
        onExpand={setExpanded}
        expanded={expanded}
        orderProduct={orderProduct}
        hasSubstitutions={!!substitutions}
        {...restProps}
      />
      {expanded && (
        <OrderProductExpandedLineDetails
          orderProduct={orderProduct}
          substitutions={substitutions}
        />
      )}
    </>
  );
};

LineDetailsOrderProduct.defaultProps = {
  substitutions: null,
  percent: 0.0,
  total: 0,
  onClick: null,
};

LineDetailsOrderProduct.propTypes = {
  orderProduct: orderProductType.isRequired,
  substitutions: PropTypes.arrayOf(substitutionType),
  percent: PropTypes.number,
  total: PropTypes.number,
  onClick: PropTypes.func,
};

export default LineDetailsOrderProduct;
