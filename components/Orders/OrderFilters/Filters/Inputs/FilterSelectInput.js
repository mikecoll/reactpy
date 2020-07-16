import React from 'react';
import PropTypes from 'prop-types';
import { startCase } from 'lodash';

import { useFiltersState, useFiltersDispatch } from '~/contexts/FiltersState';

import SelectInput from '~/components/common/inputs/SelectInput';

const FilterSelectInput = (props) => {
  const {
    name, options, showEmptyOption, handleChange, label,
    ...restProps
  } = props;

  const { eventFilterChange } = useFiltersDispatch();
  const { filters: { [name]: value } } = useFiltersState();

  return (
    <SelectInput
      {...restProps}
      handleChange={handleChange || eventFilterChange}
      label={label !== null ? label : startCase(name)}
      name={name}
      options={options}
      value={value}
      showEmptyOption={showEmptyOption}
    />
  );
};

FilterSelectInput.defaultProps = {
  showEmptyOption: true,
  handleChange: null,
  label: null,
};

FilterSelectInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
    }),
  ).isRequired,
  showEmptyOption: PropTypes.bool,
  handleChange: PropTypes.func,
};

export default FilterSelectInput;
