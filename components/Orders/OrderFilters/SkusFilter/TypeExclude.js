/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useCallback } from 'react';
import classNames from 'classnames';

import {
  useFiltersDispatch,
  SkuFilterPropType,
  TypeExcludeProptype,
  ProductTypesPropType,
} from '~/contexts/FiltersState';

const TypeExclude = ({
  typeExclude, productTypes, skuFilter,
}) => {
  const { replaceSkuFilter } = useFiltersDispatch();

  const removeType = useCallback((type) => {
    const newTypeExclude = [...skuFilter.typeExclude];
    newTypeExclude.splice(
      skuFilter.typeExclude
        .map(et => et.type)
        .indexOf(type),
      1,
    );

    replaceSkuFilter({
      sku: skuFilter.sku,
      replace: {
        ...skuFilter,
        typeExclude: newTypeExclude,
      },
    });
  }, [skuFilter]);

  const setExclude = useCallback(({ type, exclude }) => {
    const newTypeExclude = [...skuFilter.typeExclude].map(
      te => (te.type === type ? { ...te, exclude } : { ...te }),
    );

    replaceSkuFilter({
      sku: skuFilter.sku,
      replace: {
        ...skuFilter,
        typeExclude: newTypeExclude,
      },
    });
  });

  return (
    <div
      className="flex flex-row uppercase text-grey-dark m-1 border rounded hover:border-grey-dark"
    >
      <div className="flex-1 flex flex-col items-center text-grey-darker font-bold text-xs p-2 pb-1 overflow-x-auto">
        {productTypes[typeExclude.type]}
      </div>
      <div className="p-1">
        <div
          onClick={() => setExclude({ ...typeExclude, exclude: !typeExclude.exclude })}
          className="flex flex-row items-center cursor-pointer hover:text-grey-darkest"
        >
          <div className="block p-1 text-xs">
            Exclude
          </div>
          <i
            className={classNames(
              'cursor-pointer p-1',
              (typeExclude.exclude) ? 'fas fa-check-square' : 'far fa-square',
            )}
          />
        </div>
      </div>
      <div className="flex items-center p-1 cursor-pointer">
        <i
          onClick={() => removeType(typeExclude.type)}
          className="fas fa-trash p-1 cursor-pointer hover:text-grey-darkest"
        />
      </div>

    </div>
  );
};

TypeExclude.propTypes = {
  typeExclude: TypeExcludeProptype.isRequired,
  skuFilter: SkuFilterPropType.isRequired,
  productTypes: ProductTypesPropType.isRequired,
};

export default TypeExclude;
