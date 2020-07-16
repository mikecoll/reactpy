import React, { useContext, useState, useEffect } from 'react';
import { isString } from 'lodash';

import { childrenType } from '../types';

import { getShippingCarrierServices } from '../utilities/api';

export const initialShippingCarrierServicesState = {
  shippingCarrierServices: [],
  isLoading: true,
};

export const carrierCodeLocalize = {
  fedex: 'FedEx',
  laserShip: 'LaserShip',
  uds: 'UDS',
  lso: 'LSO',
};

export const serviceCodeLocalize = {
  ground_home_delivery: 'GROUND_HOME_DELIVERY',
  ontracground: 'OnTracGround',
  ground: 'Ground',
  groundbasic: 'GroundBasic',
};

const deNormalize = (code, localizeMap) => {
  if (!isString(code)) {
    return null;
  }

  return (code in localizeMap)
    ? localizeMap[code]
    : code.toUpperCase();
};

export const deNormalizeCarrierCode = code => deNormalize(code, carrierCodeLocalize);
export const deNormalizeServiceCode = code => deNormalize(code, serviceCodeLocalize);

export const EMPTY_VALUE = '';

export const generateLabel = (
  scs = { id: EMPTY_VALUE, carrierCode: '', serviceCode: '' },
  isOnlyOption = false,
  allowCarrierOnlySelection = true,
) => {
  const { id, carrierCode, serviceCode } = scs;

  if (!id) {
    return {
      label: 'Select Carrier Service',
      value: id,
    };
  }

  const carrierCodeStr = (!isOnlyOption && serviceCode !== '')
    ? `${allowCarrierOnlySelection ? '– ' : ''} ${deNormalizeCarrierCode(carrierCode)}`
    : carrierCode.toUpperCase();
  const serviceCodeStr = deNormalizeServiceCode(serviceCode);

  return (!serviceCode || serviceCode.length === 0)
    ? {
      label: carrierCodeStr,
      value: carrierCode,
    }
    : {
      label: `${carrierCodeStr} – ${serviceCodeStr}`,
      value: id,
    };
};

const ShippingCarrierServicesStateContext = React.createContext();

const ShippingCarrierServicesProvider = ({ children }) => {
  const [state, setState] = useState(initialShippingCarrierServicesState);

  // run once upon init
  useEffect(() => {
    const fetchData = async () => {
      const result = await getShippingCarrierServices();

      const normalized = result.data.map(scs => ({
        id: scs.id,
        carrierCode: scs.carrier_code,
        serviceCode: scs.service_code,
      }));

      setState({
        shippingCarrierServices: normalized,
        isLoading: false,
      });
    };
    fetchData();
  }, []);

  return (
    <ShippingCarrierServicesStateContext.Provider value={state}>
      {children}
    </ShippingCarrierServicesStateContext.Provider>
  );
};

ShippingCarrierServicesProvider.propTypes = {
  children: childrenType.isRequired,
};

const ShippingCarrierServicesStateConsumer = ShippingCarrierServicesStateContext.Consumer;

const useShippingCarrierServicesState = () => {
  const context = useContext(ShippingCarrierServicesStateContext);
  if (context === undefined) {
    throw new Error('useShippingCarrierServicesState must be within a ShippingCarrierServicesProvider');
  }
  return context;
};

export {
  ShippingCarrierServicesProvider,

  ShippingCarrierServicesStateConsumer,

  useShippingCarrierServicesState,
};
