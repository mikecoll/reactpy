import React from 'react';
import PropTypes from 'prop-types';
import { startCase } from 'lodash';

import {
  useFiltersState,
  useFiltersDispatch,
} from '~/contexts/FiltersState';

import TextInput from '~/components/common/inputs/TextInput';

const FilterTextInput = (props) => {
  const { name, label, ...restProps } = props;

  const { eventFilterChange } = useFiltersDispatch();
  const { filters: { [name]: value } } = useFiltersState();

  return (
    <TextInput
      {...restProps}
      handleChange={eventFilterChange}
      label={label !== null ? label : startCase(name)}
      name={name}
      value={value}
    />
  );
};

FilterTextInput.defaultProps = {
  label: null,
};

FilterTextInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
};

export default FilterTextInput;
