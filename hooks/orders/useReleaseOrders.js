import { useState, useEffect } from 'react';
import { get, size } from 'lodash';
import PropTypes from 'prop-types';

import {
  LaserShipPreflightType,
  ProcessZeroPreflightType,
} from '~/components/Modals/releaseOrders/PreflightTypes';

import { useSelectedOrdersState } from '~/contexts/SelectedOrdersState';
import { useLayoutDispatch } from '~/contexts/LayoutState';
import pluralizeOrder from '~/utilities/pluralizeOrder';
import { releasedOrdersApi } from '~/utilities/api';

/*
@NOTE: arry to perserve order.
@NOTE: resolveModel corrosponds to:
  resources/js/components/Modals/ModalTypeMapping.js
*/
export const PreflightRequests = [
  {
    preflightType: ProcessZeroPreflightType,
    request: releasedOrdersApi.preflight.processZero,
    resolveModal: 'preflightProcessZeroFix', // ModalTypeMapping
  },
  // @NOTE: Disabled LaserShip rule per-ops' request on 4.8.20
  // {
  //   preflightType: LaserShipPreflightType,
  //   request: releasedOrdersApi.preflight.laserShip,
  //   resolveModal: 'preflightLaserShipFix', // ModalTypeMapping
  // },
];

export const unprocessableDefault = {
  PreflightRequest: null,
  orders: null,
  meta: {},
};

export const UnprocessablePropType = PropTypes.shape({
  status: PropTypes.bool,
  PreflightRequest: PropTypes.shape({
    preflightType: PropTypes.string,
    resolveModal: PropTypes.string.isRequired,
  }),
  orders: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    order_number: PropTypes.string,
  })),
  meta: PropTypes.shape({
    lasership: PropTypes.shape({
      maxWeight: PropTypes.number,
    }),
  }),
});

/**
 * runPreflight
 * @param {props} props
 * @returns resolves the promise or rejects with a new Error(unprocessable)
 */
const runPreflight = async ({ PreflightRequest, payload, args }) => {
  const { override } = get(
    args,
    `preflight.${PreflightRequest.preflightType}`,
    { override: false },
  );

  if (override) {
    return {
      status: true,
      PreflightRequest,
      response: null,
      orders: [],
      meta: {},
    };
  }

  const response = await PreflightRequest.request(payload);
  const {
    data: {
      data: { // PreflightResponseResource
        orders,
        meta,
      },
    },
  } = response;

  return {
    status: !(size(orders)),
    PreflightRequest,
    response,
    orders,
    meta,
  };
};

/**
  * function releaseOrders
  * @returns Boolean Indicates the status of the release
  */
const useReleaseOrders = () => {
  const [unprocessable, setUnprocessable] = useState(unprocessableDefault);

  const { notify, openModal } = useLayoutDispatch();
  const { selectedOrders } = useSelectedOrdersState();

  const releaseOrders = async (args) => {
    const promisesResults = await Promise.all(
      PreflightRequests.map(
        PreflightRequest => runPreflight({
          PreflightRequest,
          payload: selectedOrders,
          args,
        }).catch((newUnprocessable) => {
          setUnprocessable(newUnprocessable);
        }),
      ),
    );

    const successCount = promisesResults.filter(pr => pr.status).length;
    if (successCount !== PreflightRequests.length) {
      const newUnprocessable = promisesResults.filter(pr => !pr.status)[0];

      setUnprocessable(newUnprocessable);

      return false;
    }

    await releasedOrdersApi.create(selectedOrders);
    notify.success(`Successfully Released ${pluralizeOrder(selectedOrders)}`);

    return true;
  };

  useEffect(
    () => {
      if (
        unprocessable
        && unprocessable.PreflightRequest
        && unprocessable.PreflightRequest.resolveModal
      ) {
        const { PreflightRequest: { resolveModal } } = unprocessable;
        openModal(resolveModal);
      }
    },
    [unprocessable],
  );


  return [
    { selectedOrders, unprocessable },
    { releaseOrders },
  ];
};

export default useReleaseOrders;
