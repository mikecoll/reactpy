import { useMemo, useCallback } from 'react';
import { get, size } from 'lodash';

import {
  useShippingCarrierServicesState,
  generateLabel,
  deNormalizeCarrierCode,
  deNormalizeServiceCode,
  EMPTY_VALUE,
} from '../contexts/ShippingCarrierServicesState';

const generateOptions = (shippingCarrierServices, allowCarrierOnlySelection) => {
  /**
  Note: we are reducing through the shippingCarrierServices and adding an
        entry when we notice a new carrier (or on the first scs)
        and then, we always add the current scs/label.
  */
  const { options } = shippingCarrierServices.reduce(
    ({ options, prevCarrier, carrierCount }, scs, idx) => { /* eslint no-shadow: 0 */
      const next = shippingCarrierServices[idx + 1] || null;
      const nextCarrier = next && next.carrierCode;
      const isOnlyOption = (
        prevCarrier !== scs.carrierCode
        && nextCarrier !== scs.carrierCode
      );

      if (allowCarrierOnlySelection && !isOnlyOption && prevCarrier !== scs.carrierCode) {
        options.push(generateLabel({
          ...scs,
          serviceCode: '',
        }));
        carrierCount = 0; /* eslint no-param-reassign: 0 */
      }

      options.push(
        generateLabel(
          scs,
          isOnlyOption,
          allowCarrierOnlySelection,
        ),
      );

      const ret = {
        options,
        prevCarrier: scs.carrierCode,
        carrierCount: (carrierCount + 1),
      };

      return ret;
    },
    { options: [], prevCarrier: null, carrierCount: 0 },
  );

  return [
    generateLabel(),
    ...options,
  ];
};

const useCarrierServiceOptions = ({
  allowCarrierOnlySelection = false,
  carrierCode,
  serviceCode,
}) => {
  const { shippingCarrierServices, isLoading } = useShippingCarrierServicesState();

  // @NOTE: generated options.value is either the ID of the option, or the
  //        carrierCode it represents.
  const options = useMemo(() => {
    if (isLoading || !shippingCarrierServices.length) {
      return [];
    }

    return generateOptions(shippingCarrierServices, allowCarrierOnlySelection);
  }, [shippingCarrierServices, isLoading, allowCarrierOnlySelection]);

  const value = useMemo(() => {
    if (!size(shippingCarrierServices) || !size(carrierCode)) {
      return EMPTY_VALUE;
    }

    if (allowCarrierOnlySelection && carrierCode.length && !serviceCode.length) {
      return carrierCode.toLowerCase();
    }

    const found = shippingCarrierServices.find((o) => {
      const carrierCodeMatch = o.carrierCode.toLowerCase() === carrierCode.toLowerCase();
      const serviceCodeMatch = o.serviceCode.toLowerCase() === serviceCode.toLowerCase();

      return carrierCodeMatch && serviceCodeMatch;
    });

    // if a sdcm was found, use the ID, otherwise set the value to null
    return get(found, 'id', EMPTY_VALUE);
  }, [carrierCode, serviceCode]);

  const getCarrierService = useCallback((eventValue) => {
    const isInteger = parseInt(eventValue, 10) == eventValue; // eslint-disable-line

    if (!isInteger && eventValue.length > 0) {
      const newCarrierCode = deNormalizeServiceCode(eventValue);

      return {
        carrierCode: newCarrierCode,
        serviceCode: '',
      };
    }

    const selectedId = parseInt(eventValue, 10);
    const selected = shippingCarrierServices.find(scs => scs.id === selectedId);

    const changes = {
      carrierCode: selected ? deNormalizeCarrierCode(selected.carrierCode) : '',
      serviceCode: selected ? deNormalizeServiceCode(selected.serviceCode) : '',
    };

    return changes;
  }, [shippingCarrierServices]);

  return [
    { options, value, isLoading },
    getCarrierService,
  ];
};

export default useCarrierServiceOptions;
