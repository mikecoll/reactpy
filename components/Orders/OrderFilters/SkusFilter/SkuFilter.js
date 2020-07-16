import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import ProductTypeSelect from './ProductTypeSelect';
import TypesExcludes from './TypesExcludes';
import SkuExcludeInput from './SkuExcludeInput';

import { SkuFilterPropType } from '~/contexts/FiltersState';
import useProductIcon from '~/hooks/products/useProductIcon';

const SkuFilter = ({
  skuFilter, product, productTypes, isLoading,
}) => {
  const Icon = useProductIcon(product.name);

  return (
    <div className="p-1 w-1/3">
      <div className={classnames(
        'flex flex-col border rounded p-2',
        skuFilter.skuExclude && 'border-orange-lighter',
      )}
      >
        <div className="flex inline-flex items-center">
          <div className={classnames(
            'w-1/3 flex flex-col block text-sm uppercase p-1 pb-1',
            skuFilter.skuExclude ? 'text-orange-darker' : 'text-grey-darkest',
          )}
          >
            <div className="font-bold">
              {product.sku}
              <Icon />
            </div>
            <div>{product.name}</div>
          </div>
          <div className="w-2/3 inline-flex">
            <div className="w-1/3 px-1">
              <SkuExcludeInput
                skuFilter={skuFilter}
              />
            </div>
            <div className="w-2/3 px-1">
              <ProductTypeSelect
                skuFilter={skuFilter}
                productTypes={productTypes}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
        <TypesExcludes
          skuFilter={skuFilter}
          productTypes={productTypes}
        />
      </div>
    </div>
  );
};

SkuFilter.propTypes = {
  productTypes: PropTypes.object.isRequired, /* eslint react/forbid-prop-types: 0 */
  product: PropTypes.shape({
    product_id: PropTypes.number,
    name: PropTypes.string,
    sku: PropTypes.string,
  }).isRequired,
  skuFilter: SkuFilterPropType.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default SkuFilter;
