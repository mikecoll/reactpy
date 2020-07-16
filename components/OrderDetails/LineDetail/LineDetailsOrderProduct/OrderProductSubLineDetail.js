import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { Substitution as SubstitutionIcon } from '~/components/common/Icons';

import EstDate, { dateTimeFormats, isValidMomentDate } from '~/components/common/EstDate';

import { useProductsState } from '~/contexts/ProductsContext';
import useProductIcon from '~/hooks/products/useProductIcon';
import useAddSkuToFilters from '~/hooks/products/useAddSkuToFilters';

const OrderProductSubLineDetail = (props) => {
  const {
    original_product_id: originalProductId,
    quantity,
    product_type: productType,
    created_at: createdAt,
    isCurrent,
  } = props;

  const { products: allProducts } = useProductsState();
  const product = useMemo(
    () => allProducts.find(p => p.id === originalProductId),
    [originalProductId],
  );

  const addSkuToFilters = useAddSkuToFilters(product);

  const isValidDate = !isCurrent && isValidMomentDate(createdAt);
  const ProductIcon = useProductIcon(product.name);
  const DisplayIcon = isValidDate ? SubstitutionIcon : ProductIcon;

  return product && (
    <div className="w-full ml-auto px-1 py-2 text-sm text-grey-darkest">
      <div>
        <span onClick={addSkuToFilters} className="cursor-pointer">
          <DisplayIcon className="text-grey-dark w-6" />
          {`${product.sku} - ${product.name}`}
          {productType && ` (${productType})`}
        </span>
        <span className="float-right">
          {quantity}
        </span>
      </div>
      <div className="text-xs text-grey flex pl-6">
        {isValidDate
          ? (
            <>
              <b className="pr-1">Created:</b>
              <EstDate value={createdAt} format={dateTimeFormats.iso8601} />
            </>
          )
          : <b>Current Order Product</b>
        }
      </div>
    </div>
  );
};

OrderProductSubLineDetail.defaultProps = {
  product_type: null,
  created_at: null,
  isCurrent: false,
};

OrderProductSubLineDetail.propTypes = {
  original_product_id: PropTypes.number.isRequired,
  quantity: PropTypes.number.isRequired,
  product_type: PropTypes.string,
  created_at: PropTypes.string,
  isCurrent: PropTypes.bool,
};

export default OrderProductSubLineDetail;
