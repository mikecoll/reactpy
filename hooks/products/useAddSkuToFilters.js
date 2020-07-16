import { useCallback } from 'react';

import {
  useDebouncedFiltersState,
  useFiltersDispatch,
  SkuFilterHelper,
} from '~/contexts/FiltersState';

const useAddSkuToFilters = ({ sku }) => {
  const { filters: { skuFilters } } = useDebouncedFiltersState();
  const { replaceSkuFilter } = useFiltersDispatch();

  const addSkuToFilters = useCallback(() => {
    // find or generate the filter
    const found = skuFilters.find(sf => sf.sku === sku)
      || SkuFilterHelper.generate({ sku });

    replaceSkuFilter({
      sku,
      replace: {
        ...found,
        skuExclude: false,
      },
    });
  }, [sku]);

  return addSkuToFilters;
};

export default useAddSkuToFilters;
