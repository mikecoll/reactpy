import React, { useMemo, useCallback } from 'react';

import { useFiltersState, useFiltersDispatch } from '~/contexts/FiltersState';

import FlowButton from './FlowButton';

const flowOptions = [
  { label: 'UnProcessed', value: 'unprocessed' },
  { label: 'Staged', value: 'staged' },
  { label: 'Released', value: 'released' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Held', value: 'held' },
  { label: 'Canceled', value: 'canceled' },
  { label: 'Archived', value: 'archived' },
];

const FlowFilters = () => {
  const { filters: { flow } } = useFiltersState();
  const { changeFilter } = useFiltersDispatch();

  return useMemo(() => (
    flowOptions.map(({ label, value }) => (
      <FlowButton
        key={label}
        active={(flow || '') === value}
        count={0}
        handleClick={() => changeFilter('flow', value)}
        label={label}
      />
    ))
  ), [flow]);
};

export default FlowFilters;
