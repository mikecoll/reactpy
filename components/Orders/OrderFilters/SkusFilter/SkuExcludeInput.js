/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import classNames from 'classnames';

import {
  useFiltersDispatch,
  SkuFilterPropType,
} from '~/contexts/FiltersState';

const SkuExcludeImport = ({ skuFilter }) => {
  const { sku, skuExclude } = skuFilter;
  const { replaceSkuFilter } = useFiltersDispatch();

  const toggleSkuExclude = () => replaceSkuFilter({
    sku,
    replace: {
      ...skuFilter,
      skuExclude: !skuExclude,
    },
  });

  return (
    <div className="flex flex-col text-grey-darker items-center">
      <div className={classNames(
        'flex-grow py-1 text-xs uppercase',
        skuExclude ? 'text-orange-darker font-medium' : 'text-grey-darkest',
      )}
      >
        {skuExclude ? 'Excluded' : 'Exclude'}
      </div>
      <i
        onClick={() => toggleSkuExclude()}
        className={classNames(
          'cursor-pointer p-1 text-lg',
          (skuExclude) ? 'fas fa-check-square' : 'far fa-square',
        )}
      />
    </div>
  );
};

SkuExcludeImport.propTypes = {
  skuFilter: SkuFilterPropType.isRequired,
};

export default SkuExcludeImport;
