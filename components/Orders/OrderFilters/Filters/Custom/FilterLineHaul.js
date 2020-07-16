import React, { useState, useEffect, useMemo } from 'react';
import { get, isObject } from 'lodash';
import { SelectInput } from '~/components/common/inputs';
import { Error as ErrorAlert } from '~/components/common/Alert';
import useFetch from '~/hooks/useFetch';
import { useFiltersState, useFiltersDispatch } from '~/contexts/FiltersState';
import FilterLoader from '../FilterLoader';

import { getLineHaulOptions } from '../../../../../utilities/api/index';

export const initialInternalState = {
  lineHauls: [],
};

const FilterLineHaul = () => {
  const { eventFilterChange } = useFiltersDispatch();
  const [internalState, setInternalState] = useState(initialInternalState);
  const { filters: { lineHaul: value } } = useFiltersState();

  const [{ data, isLoading, isError }] = useFetch(getLineHaulOptions);

  useEffect(() => {
    setInternalState((state) => {
      const newState = {
        ...state,
        isLoading,
        isError,

        lineHauls:
          get(
            data,
            'data.data',
            state.lineHauls,
          ).map(lineHaul => ({
            label: lineHaul,
            value: lineHaul,
          })),
      };

      return newState;
    });
  }, [data, isLoading, isError]);

  return useMemo(() => {
    if (isError) {
      return <ErrorAlert error={isError} />;
    }

    return isLoading ? <FilterLoader /> : (
      <SelectInput
        handleChange={eventFilterChange}
        label="Line Haul"
        name="lineHaul"
        options={internalState.lineHauls}
        value={value || ''}
        showEmptyOption
      />
    );
  }, [value, data, isLoading, isError]);
};

export default FilterLineHaul;
