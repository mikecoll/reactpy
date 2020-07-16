import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { startCase } from 'lodash';

import { updateUserPreference } from '~/utilities/api';

import {
  useFiltersState,
  useFiltersDispatch,
} from '~/contexts/FiltersState';

import SelectInput from '~/components/common/inputs/SelectInput';
import { useAuthState } from '~/contexts/AuthState';

const pageSizeOptions = [
  { label: '20', value: '20' },
  { label: '50', value: '50' },
  { label: '100', value: '100' },
  { label: '250', value: '250' },
  { label: '500', value: '500' },
  { label: '1000', value: '1000' },
  { label: '2000', value: '2000' },
];

const FilterPageSize = ({ name, ...restProps }) => {
  const { changeFilter } = useFiltersDispatch();
  const { filters: { pageSize } } = useFiltersState();
  const { user: { id: userId } } = useAuthState();

  const handlePageSizeChange = useCallback((event) => {
    const { value } = event.target;

    updateUserPreference(userId, { pageSize: value })
      .then(/* we don't really care what happens */);

    changeFilter(name, value);
  });

  return (
    <SelectInput
      {...restProps}
      name={name}
      label={startCase(name)}
      options={pageSizeOptions}
      handleChange={handlePageSizeChange}
      value={pageSize}
      showEmptyOption={false}
    />
  );
};

FilterPageSize.propTypes = {
  name: PropTypes.string.isRequired,
};

export default FilterPageSize;
