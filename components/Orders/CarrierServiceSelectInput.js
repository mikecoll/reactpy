import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

import SelectInput from '../common/inputs/SelectInput';
import { ErrorPropType } from '~/components/common/inputs';
import useCarrierServiceOptions from '~/hooks/useCarrierServiceOptions';

import FilterLoader from './OrderFilters/Filters/FilterLoader';

const CarrierServiceSelectInput = React.forwardRef(({
  carrierCode,
  serviceCode,
  onChange,
  allowCarrierOnlySelection,
  disabled,
  error,
}, ref) => {
  const [
    { options, value, isLoading },
    getCarrierService,
  ] = useCarrierServiceOptions({
    carrierCode,
    serviceCode,
    allowCarrierOnlySelection,
  });

  const handleChange = useCallback((event) => {
    const eventValue = event.target.value;
    const carrierServiceValue = getCarrierService(eventValue);

    return onChange(carrierServiceValue);
  });

  return useMemo(() => (
    (isLoading)
      ? FilterLoader
      : (
        <SelectInput
          handleChange={handleChange}
          label="Carrier Service"
          name="shippingCarrierService"
          options={options}
          showEmptyOption={false}
          value={value}
          disabled={disabled}
          ref={ref}
          error={error}
        />
      )
  ), [isLoading, options, value, error]);
});

CarrierServiceSelectInput.defaultProps = {
  carrierCode: '',
  serviceCode: '',
  allowCarrierOnlySelection: false,
  disabled: false,
  error: null,
};

CarrierServiceSelectInput.propTypes = {
  error: ErrorPropType,
  carrierCode: PropTypes.string,
  serviceCode: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  allowCarrierOnlySelection: PropTypes.bool,
};

export default CarrierServiceSelectInput;
