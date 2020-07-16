import React, {
  useState, useEffect, useMemo, useCallback,
} from 'react';
import { sortBy } from 'lodash';
import classNames from 'classnames';

import SkuFilter from './SkuFilter';

import { useProductsState } from '~/contexts/ProductsContext';
import { useFiltersState, useFiltersDispatch, SkuFilterHelper } from '~/contexts/FiltersState';
import SelectMulti from '~/components/common/inputs/SelectMulti';
import useProductTypes from '~/hooks/products/useProductTypes';

const SkusFilter = () => {
  const { products } = useProductsState();
  const { filters: { skuFilters } } = useFiltersState();
  const { changeFilter } = useFiltersDispatch();

  const [options, setOptions] = useState([]);
  const [selectValue, setSelectValue] = useState();
  const [{ productTypes, isLoading }] = useProductTypes();

  const onSelectSkuChange = useCallback((selectedOptions) => {
    const newSkus = selectedOptions
      ? selectedOptions.map(({ value: sku }) => {
        // iterate over the selected options where value is the SKU...
        const found = skuFilters.find(sf => sf.sku === sku);
        // if we find the sku in the skuFilters, use that object, else return a default
        return found || SkuFilterHelper.generate({ sku });
      })
      : [];
    changeFilter('skuFilters', newSkus);
  }, [skuFilters, changeFilter]);

  useEffect(() => {
    setOptions(
      sortBy(products, '-sku').map(product => (
        { label: `${product.sku} - ${product.name}`, value: product.sku }
      )),
    );
  }, [products]);

  // keeps the select in-sync with the skuFilter state
  //    (eg if filters get cleared this input should clear)
  useEffect(() => {
    if (options && options.length) {
      // filter options (option.value) out that are not part of the state (skuFilters)
      const newSelectValue = options.filter(
        option => skuFilters
          .map(skuFilter => skuFilter.sku)
          .indexOf(option.value) !== -1,
      );

      setSelectValue(newSelectValue);
    }
  }, [skuFilters, options]);

  const SkuFilters = useMemo(() => (
    skuFilters.map(skuFilter => (
      <SkuFilter
        key={skuFilter.sku}
        skuFilter={skuFilter}
        product={products.find(p => p.sku === skuFilter.sku)}
        productTypes={productTypes}
        isLoading={isLoading}
      />
    ))
  ), [skuFilters, productTypes, isLoading]);

  return (
    <>
      <label
        className="block text-grey-darker text-xs uppercase mb-1"
        htmlFor="attributeFiltersSelect"
      >
        Sku Filters
      </label>

      <SelectMulti
        className={classNames(
          'rounded',
          skuFilters ? 'mb-2' : 'mb-4',
        )}
        isMulti
        hideSelectedOptions
        onChange={onSelectSkuChange}
        options={options}
        placeholder="Select SKUs..."
        defaultValue={selectValue}
        value={selectValue}
      />
      {skuFilters.length > 0 && (
        <div className="flex flex-wrap content-between mb-4 justify-start">
          {SkuFilters}
        </div>
      )}
    </>
  );
};

export default SkusFilter;
