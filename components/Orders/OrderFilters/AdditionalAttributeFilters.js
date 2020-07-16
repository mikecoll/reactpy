import React from 'react';

import { useFiltersState, useFiltersDispatch } from '~/contexts/FiltersState';

import SelectInput from '~/components/common/inputs/SelectInput';

import { FilterWrapper } from './Filters';
import { filterOptionsYesNo } from './Filters/FilterConfig';

const AdditionalAttributeFilters = () => {
  const { eventFilterChange } = useFiltersDispatch();
  const {
    filters: {
      hasTrackingNumber,
    },
  } = useFiltersState();

  return (
    <FilterWrapper>
      <SelectInput
        handleChange={eventFilterChange}
        label="Has Tracking Number"
        name="hasTrackingNumber"
        options={filterOptionsYesNo}
        showEmptyOption
        value={hasTrackingNumber}
      />
    </FilterWrapper>
  );
};

export default AdditionalAttributeFilters;
