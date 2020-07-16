import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import LineDetailBasic from './LineDetailBasic';

import useAddSkuToFilters from '~/hooks/products/useAddSkuToFilters';
import useProductIcon from '~/hooks/products/useProductIcon';

export const unfulfillableProductColor = 'orange-lighter';

export const productIconClasses = 'text-grey-darkest w-6';

const LineDetailProduct = (props) => {
  const {
    product: { sku, name },
    label,
  } = props;

  const addSkuToFilters = useAddSkuToFilters({ sku });
  const Icon = useProductIcon(name);

  const Label = useMemo(() => (
    <span onClick={addSkuToFilters} className="cursor-pointer">
      <Icon className={productIconClasses} />
      {label}
    </span>
  ), [label, addSkuToFilters]);

  return (
    <LineDetailBasic
      {...props}
      label={Label}
    />
  );
};

LineDetailProduct.defaultProps = {
  ...LineDetailBasic.defaultProps,
};

LineDetailProduct.propTypes = {
  ...LineDetailBasic.propTypes,
};

export default LineDetailProduct;
