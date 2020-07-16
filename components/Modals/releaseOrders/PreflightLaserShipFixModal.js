import PropTypes from 'prop-types';
import React, { useMemo, useCallback } from 'react';
import { get } from 'lodash';

import { useKeyPressEvent } from 'react-use';
import Button from '~/components/common/Button';
import ButtonGroup from '~/components/common/ButtonGroup';
import { Copy as CopyIcon } from '~/components/common/Icons';

import PreflightFixModal from './PreflightFixModal';

import {
  unprocessableDefault,
  // UnprocessablePropType,
} from '~/hooks/orders/useReleaseOrders';

import { useSelectedOrdersDispatch } from '~/contexts/SelectedOrdersState';
import useCopyNotify from '~/hooks/orders/useCopyNotify';

/** PreflightType is effectivly the key for this Preflight Fix/Modal
 * and is used to identify this preflight throughout the release process
 * @see: ./PreflightTypes
 */
export const PreflightType = 'laserShipWeight';

const PreflightLaserShipFixModal = (props) => {
  const {
    // data
    selectedOrders,
    unprocessable,
    // functions/callbacks
    handleModalClose,
    onUpdate,
  } = props;
  const {
    orders,
    meta,
  } = unprocessable;

  const { setSelection } = useSelectedOrdersDispatch();
  const copyNotify = useCopyNotify();

  const areAllselectedUnprocessable = useMemo(
    () => orders.length === selectedOrders.length,
    [orders.length, selectedOrders.length],
  );

  const maxWeightStr = `${get(meta, 'lasership.maxWeight', 'NaN')} lbs`;

  const releaseOnlyProcessable = useCallback(() => {
    const unprocessableOrderIds = orders.map(o => o.id);
    const newSelection = selectedOrders.filter(
      o => !unprocessableOrderIds.includes(o),
    );

    // @NOTE: setting this variable will trigger the useEffect below
    setSelection(newSelection);

    // onUpdate is triggered by the parent component PreflightFixModal
    // onUpdate({ shouldRelease: true });
  }, [orders]);

  const overideRelease = useCallback(async () => {
    onUpdate({
      shouldRelease: true,
      preflight: {
        // @NOTE: used by useReleaseOrders@runPreflight
        [PreflightType]: {
          override: true,
        },
      },
    });
  }, [selectedOrders]);

  const copyUnprocessable = useCallback(
    () => copyNotify({ numbers: orders.map(o => o.order_number) }),
    [orders],
  );

  useKeyPressEvent(
    'Enter',
    () => !areAllselectedUnprocessable && releaseOnlyProcessable(),
  );

  const ModalHeader = useMemo(() => (
    <>
      LaserShip Weight Warning
      {' '}
      <code className="text-grey-dark text-lg pl-2">
        {!areAllselectedUnprocessable && `${orders.length}/${selectedOrders.length} `}
        {areAllselectedUnprocessable && `${selectedOrders.length} `}
        {'Orders '}
        {`weight > ${maxWeightStr}`}
      </code>
    </>
  ), [orders.length, selectedOrders.length, maxWeightStr]);

  const ModalBody = useMemo(
    () => (
      <>
        <div className="text-grey-darker pb-4">
          <p className="mb-3">
            One or more of the selected orders (listed below) is configured
            to ship via LaserShip with a weight greater than
            {` ${maxWeightStr}.`}
          </p>

          <p className="mb-6">
            {
              (orders.length === 1)
                ? 'Shipping this overweight order '
                : 'Shipping these overweight orders '
            }
            with LaserShip will cost Butcherbox an additional
            {' '}
            <b>{`+$${orders.length * 100}.00.`}</b>
          </p>

          <div className="pb-4">
            <h4>
              {selectedOrders.length > 1 ? 'Orders' : 'an Order'}
              {' '}
              <code>{`weight > ${maxWeightStr}`}</code>
              {` (${orders.length}):`}
            </h4>
            <br />
            <Button onClick={copyUnprocessable} className="text-left">
              {orders.map(o => o.order_number).join(', ')}
              <CopyIcon className="pl-2" />
            </Button>
          </div>
        </div>

        <ButtonGroup className="w-full">
          <Button variant="warning" onClick={overideRelease}>
            <b>{`Release All (${orders.length}) Orders Anyway`}</b>
            <br />
            <span className="text-xs">
              Releasing these orders will cost
              <b>{` +$${orders.length * 100}.00`}</b>
            </span>
          </Button>

          {!areAllselectedUnprocessable && (
            <Button variant="primary" onClick={releaseOnlyProcessable}>
              Release only
              {' '}
              <code>{`weight <= ${maxWeightStr}`}</code>
              {' '}
              orders
              {` (${selectedOrders.length - orders.length})`}
            </Button>
          )}

          {areAllselectedUnprocessable && (
            <Button onClick={handleModalClose}>
              Cancel
            </Button>
          )}
        </ButtonGroup>
      </>
    ),
    [
      orders,
      overideRelease,
      selectedOrders,
      areAllselectedUnprocessable,
    ],
  );

  return (
    <PreflightFixModal
      {...props}
      ModalHeader={ModalHeader}
      ModalBody={ModalBody}
    />
  );
};

PreflightLaserShipFixModal.defaultProps = {
  unprocessable: unprocessableDefault,
};

PreflightLaserShipFixModal.propTypes = {
  handleModalClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  selectedOrders: PropTypes.arrayOf(PropTypes.number).isRequired,
  // @NOTE: Using the imported UnprocessablePropType produces a failed
  //        prop validation error... but including it here works?
  // unprocessable: UnprocessablePropType,
  unprocessable: PropTypes.shape({
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
  }),
  toastManager: PropTypes.shape({
    add: PropTypes.func,
  }).isRequired,
  innerRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }).isRequired,
};

export default PreflightLaserShipFixModal;
