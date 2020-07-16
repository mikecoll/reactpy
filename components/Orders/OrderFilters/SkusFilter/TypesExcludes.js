/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useMemo } from 'react';

import { useProductInventoryState } from '../../../../contexts/ProductInventoryState';

import TypeExclude from './TypeExclude';

import {
  SkuFilterPropType,
  ProductTypesPropType,
} from '../../../../contexts/FiltersState';


const TypesExcludes = ({ skuFilter, productTypes }) => {
  const { typeExclude, skuExclude } = skuFilter;
  const [shouldHide, setShouldHide] = useState(false);

  return useMemo(() => {
    if (skuExclude) {
      return (
        <div className="flex flex-col items-center text-grey-dark border-grey text-xs p-2 pb-1 overflow-x-auto border rounded mt-2">
          All product types excluded
        </div>
      );
    } if (!typeExclude.length) {
      return <></>;
    }

    return (
      <div className="flex flex-col min-h-0">

        <div className="flex flex-row-reverse p-2 pb-0 text-xs uppercase cursor-pointer text-orange-light">
          <div onClick={() => setShouldHide(current => !current)}>
            {shouldHide ? 'Show ' : 'Hide '}
            Product Type
            {typeExclude.length > 1 && `s (${typeExclude.length})`}
            {' '}
            <i className={shouldHide ? 'far fa-eye' : 'far fa-eye-slash'} />
          </div>
        </div>

        {!shouldHide && typeExclude.map(
          te => (
            <TypeExclude
              typeExclude={te}
              key={te.type}
              skuFilter={skuFilter}
              productTypes={productTypes}
            />
          ),
        )}

      </div>
    );
  }, [typeExclude, skuExclude, shouldHide]);
};

TypesExcludes.propTypes = {
	productTypes: ProductTypesPropType.isRequired,
  skuFilter: SkuFilterPropType.isRequired,
};

export default TypesExcludes;
