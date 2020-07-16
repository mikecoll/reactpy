import React from 'react';
import {
  TextInput,
  SelectInput,
} from '~/components/common/inputs';


import { useFiltersState, useFiltersDispatch } from '~/contexts/FiltersState';

export const meatGroupOptions = [
  { label: 'Other', value: 'other' },
  { label: 'Beef', value: 'beef' },
  { label: 'Chicken', value: 'chicken' },
  { label: 'Dry', value: 'dry' },
  { label: 'Fish', value: 'fish' },
  { label: 'Pork', value: 'pork' },
  { label: 'Prepared', value: 'prepared' },
  { label: 'Turkey', value: 'turkey' },
];

const FilterDynamicProteinQty = () => {
  const { eventFilterChange } = useFiltersDispatch();
  const { filters: { dynamicProteinQty } } = useFiltersState();

  const {
    meat_group: meatGroup,
    qty,
  } = dynamicProteinQty;

  return (
    <div className="flex flex-row items-stretch">
      <SelectInput
        className="flex-1 p-1 m-w-full"
        handleChange={eventFilterChange}
        label="Protein"
        placeholder="Protein"
        name="dynamicProteinQty.meat_group"
        options={meatGroupOptions}
        value={meatGroup || ''}
        showEmptyOption
      />
      <TextInput
        className="flex-1 p-1 m-w-full"
        handleChange={eventFilterChange}
        label="Qty"
        name="dynamicProteinQty.qty"
        value={qty || ''}
        type="number"
        min="0"
      />
    </div>
  );
};

export default FilterDynamicProteinQty;
