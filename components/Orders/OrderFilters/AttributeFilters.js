import React from 'react';
import { startCase } from 'lodash';
import classNames from 'classnames';

import { FilterWrapper, FilterConfig } from './Filters';
import useSelectedFilters from '~/hooks/orders/useSelectedFilters';
import SelectMulti from '~/components/common/inputs/SelectMulti';

import Button from '~/components/common/Button';
import { Clear as ClearIcon } from '~/components/common/Icons';

const generateOption = key => ({
  label: startCase(key),
  value: key,
});

const AttributeFilters = () => {
  const [
    selections,
    {
      onChange,
      resetFilters,
    },
  ] = useSelectedFilters();

  const enabledFilters = Object.keys(FilterConfig)
    .filter(key => selections[key] && selections[key].visible);

  const enabledFiltersOptions = enabledFilters.map(generateOption);

  const allFilterInputs = enabledFilters.length && enabledFilters.map((name) => {
    const { FilterComponent, ...restConfig } = FilterConfig[name];

    return (
      <FilterWrapper key={name}>
        <FilterComponent {...restConfig} />
      </FilterWrapper>
    );
  });

  const filterOptions = Object.keys(FilterConfig)
    .filter(key => !enabledFilters.includes(key))
    .map(generateOption);

  return (
    <>
      <div className={classNames(
        'w-full rounded',
        allFilterInputs ? 'mb-2' : 'mb-4',
      )}
      >
        <label
          className="block text-grey-darker text-xs uppercase mb-1"
          htmlFor="attributeFiltersSelect"
        >
          Order Filters
        </label>

        <div className="flex flex-row">
          <Button onClick={resetFilters} className="mr-2 rounded" border>
            <ClearIcon />
          </Button>

          <SelectMulti
            components={{ ClearIndicator: null }}
            className="flex-grow"
            id="attributeFiltersSelect"
            name="attributeFiltersSelect"
            isMulti
            isSearchable
            onChange={onChange}
            options={filterOptions}
            value={enabledFiltersOptions}
            placeholder="Select a Order Filter..."
          />
        </div>
      </div>

      {enabledFiltersOptions.length > 0 && (
        <div className="flex flex-wrap mb-4 rounded full-w-input">
          {allFilterInputs}
        </div>
      )}
    </>
  );
};

export default AttributeFilters;
