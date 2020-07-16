import React from 'react';
import PropTypes from 'prop-types';

import {
  orderProductType,
  substitutionType,
} from '~/types';

import ExpandedLineDetail from './ExpandedLineDetail';
import OrderProductSubLineDetail from './OrderProductSubLineDetail';

const OrderProductExpandedLineDetails = ({
  orderProduct: {
    product_id: productId,
    product_type: productType,
    quantity,
    meat_group: meatGroup,
  },
  substitutions,
}) => (
  <div className="text-sm m-1">
    <div className="p-2 border rounded border-t-none">

      <ExpandedLineDetail>
        <b className="pr-1">Product ID</b>
        {productId}
      </ExpandedLineDetail>

      <ExpandedLineDetail>
        <b className="pr-1">Product Type </b>
        {productType || 'none'}
      </ExpandedLineDetail>

      <ExpandedLineDetail>
        <b className="pr-1">Quantity </b>
        {quantity}
      </ExpandedLineDetail>

      <ExpandedLineDetail>
        <b className="pr-1">Meat Group </b>
        {meatGroup}
      </ExpandedLineDetail>

      {substitutions && (
        <ExpandedLineDetail>
          <div className="font-bold">Substitutions:</div>

          {/* Make sure to have the current product at the top of the list */}
          <OrderProductSubLineDetail
            key="sub-current"
            original_product_id={productId}
            quantity={quantity}
            product_type={productType}
            isCurrent
          />

          {substitutions.map(sub => (
            <OrderProductSubLineDetail
              key={sub.id}
              {...sub}
            />
          ))}
        </ExpandedLineDetail>
      )}
    </div>
  </div>
);

OrderProductExpandedLineDetails.defaultProps = {
  substitutions: null,
};

OrderProductExpandedLineDetails.propTypes = {
  orderProduct: orderProductType.isRequired,
  substitutions: PropTypes.arrayOf(substitutionType),
};

export default OrderProductExpandedLineDetails;
