import React from 'react';
import PropTypes from 'prop-types';

import { orderProductType } from '~/types';

import * as Icons from '~/components/common/Icons';

import LineDetailBasic from '../LineDetailBasic';

import useAddSkuToFilters from '~/hooks/products/useAddSkuToFilters';
import useProductIcon from '~/hooks/products/useProductIcon';

const OrderProductLineDetail = ({
  onExpand,
  expanded,
  orderProduct,
  hasSubstitutions,
  color,
}) => {
  const {
    sku,
    name,
    product_type: productType,
    quantity,
  } = orderProduct;

  const Icon = useProductIcon(name);
  const value = parseInt(quantity, 10);

  const addSkuToFilters = useAddSkuToFilters(orderProduct);

  const Label = (
    <>
      <span onClick={addSkuToFilters} className="cursor-pointer">
        <Icon className="text-grey-darkest w-6" />
        {sku}
      </span>
      {` - ${name}`}
      {productType && ` (${productType})`}
      {hasSubstitutions && <Icons.Substitution className="px-1 text-grey-darkest" />}
    </>
  );

  return (
    <LineDetailBasic
      label={Label}
      value={value}
      normalizedPercent={100}
      color={color}
      shouldColorize
      onClick={() => onExpand(!expanded)}
    />
  );
};

OrderProductLineDetail.defaultProps = {
  color: 'blue',
};

OrderProductLineDetail.propTypes = {
  onExpand: PropTypes.func.isRequired,
  expanded: PropTypes.bool.isRequired,
  orderProduct: orderProductType.isRequired,
  hasSubstitutions: PropTypes.bool.isRequired,
  color: PropTypes.string,
};

export default OrderProductLineDetail;
