import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { useFiltersState, useFiltersDispatch } from '~/contexts/FiltersState';

import CarrierServiceSelectInput from '../../../CarrierServiceSelectInput';

const FilterCarrierService = ({ name }) => {
  const { changeFilter } = useFiltersDispatch();
  const { filters: { carrierCode, serviceCode } } = useFiltersState();

  const handleChange = useCallback(value => changeFilter(name, value));

  return (
    <CarrierServiceSelectInput
      carrierCode={carrierCode}
      serviceCode={serviceCode}
      onChange={handleChange}
      allowCarrierOnlySelection
    />
  );
};

FilterCarrierService.propTypes = {
  name: PropTypes.string.isRequired,
};

export default FilterCarrierService;
