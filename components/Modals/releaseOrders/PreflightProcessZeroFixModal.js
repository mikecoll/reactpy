import PropTypes from 'prop-types';
import React, { useMemo, useCallback, useState } from 'react';
import { useKeyPressEvent } from 'react-use';

import Button from '~/components/common/Button';
import ButtonGroup from '~/components/common/ButtonGroup';
import { Copy as CopyIcon } from '~/components/common/Icons';
import Loading from '~/components/common/Loading';

import { unprocessableDefault } from '~/hooks/orders/useReleaseOrders';

import { useSelectedOrdersDispatch } from '~/contexts/SelectedOrdersState';
import { useLayoutDispatch } from '~/contexts/LayoutState';

import updateOrderHelper from '~/utilities/api/helpers/updateOrderHelper';
import pluralizeOrder from '~/utilities/pluralizeOrder';
import useCopyNotify from '~/hooks/orders/useCopyNotify';

import PreflightFixModal from './PreflightFixModal';

/** PreflightType is effectivly the key for this Preflight Fix/Modal
 * and is used to identify this preflight throughout the release process.
 * @see: ./PreflightTypes
 */
export const PreflightType = 'processZero';

const PreflightProcessZeroFixModal = (props) => {
  const {
    handleModalClose,
    onUpdate,
    selectedOrders,
    unprocessable,
    toastManager,
  } = props;

  const {
    orders,
  } = unprocessable;

  const [isUpdating, setIsUpdating] = useState(false);
  const { setSelection } = useSelectedOrdersDispatch();
  const copyNotify = useCopyNotify();
  const { notify } = useLayoutDispatch();

  const areAllselectedUnprocessable = useMemo(
    () => orders.length === selectedOrders.length,
    [orders.length, selectedOrders.length],
  );

  const releaseOnlyUnprocessable = useCallback(() => {
    const unprocessableOrderIds = orders.map(u => u.id);
    const newSelection = selectedOrders.filter(o => !unprocessableOrderIds.includes(o));

    // @NOTE: setting this variable will trigger the useEffect below
    setSelection(newSelection);
  }, [orders]);

  const copyUnprocessable = useCallback(
    () => copyNotify({ numbers: orders.map(o => o.order_number) }),
    [orders],
  );

  const updateAndReleaseAll = useCallback(async () => {
    setIsUpdating(true);
    await updateOrderHelper({
      payload: {
        ids: selectedOrders,
        process: '1',
      },
      toastManager,
    });
    notify.success(`Successfully Updated ${pluralizeOrder(selectedOrders)}`);
    setIsUpdating(false);
    onUpdate({ shouldRelease: true });
  }, [selectedOrders]);

  useKeyPressEvent(
    'Enter',
    () => !areAllselectedUnprocessable && releaseOnlyUnprocessable(),
  );

  const ModalHeader = useMemo(() => (
    <>
      Attempting to release
      {' '}
      {!areAllselectedUnprocessable && `${orders.length}/${selectedOrders.length} `}
      {areAllselectedUnprocessable && `${selectedOrders.length} `}
      {selectedOrders.length > 1 ? 'Orders' : 'an Order'}
      <code> process=0</code>
    </>
  ), [areAllselectedUnprocessable, orders.length, selectedOrders.length]);

  const ModalBody = useMemo(
    () => (
      <>
        <div className="text-grey-darker pb-4">
          <p>
            To avoid polluting DOM orders, the DOM restricts releasing orders that are
            set to
            {' '}
            <code>process=0</code>
            .
            This is done because SPW (Maves) does not ingest
            orders with this flag which results in:
          </p>

          <ul className="pt-2 pb-8">
            <li>Orders that will not be pulled, and</li>
            <li>Orders that cannot be Amended.</li>
          </ul>

          <div className="pb-4">
            <h4>
              Orders with
              {' '}
              <code>process=0</code>
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
          <Button variant="blue" onClick={updateAndReleaseAll}>
            {selectedOrders.length > 1 && `Update all ${pluralizeOrder(selectedOrders)} to `}
            {selectedOrders.length === 1 && 'Update order to '}
            <code>process=1</code>
            {' '}
            <br />
            <b>and</b>
            {selectedOrders.length > 1 && ` release all ${pluralizeOrder(selectedOrders)}`}
            {selectedOrders.length === 1 && ' release order'}
          </Button>
          {areAllselectedUnprocessable && (
            <Button onClick={handleModalClose}>
              Cancel
            </Button>
          )}
          {!areAllselectedUnprocessable && (
            <Button variant="primary" onClick={releaseOnlyUnprocessable}>
              Release only
              {' '}
              <code>process=1</code>
              {' '}
              orders
              {' '}
              {` (${selectedOrders.length - orders.length})`}
            </Button>
          )}
        </ButtonGroup>
      </>
    ),
    [
      orders.length,
      orders,
      updateAndReleaseAll,
      selectedOrders.length,
      selectedOrders,
    ],
  );

  return isUpdating
    ? <Loading message={`Updating ${pluralizeOrder(selectedOrders.length)}`} />
    : (
      <PreflightFixModal
        {...props}
        ModalHeader={ModalHeader}
        ModalBody={ModalBody}
      />
    );
};

PreflightProcessZeroFixModal.defaultProps = {
  unprocessable: unprocessableDefault,
};

PreflightProcessZeroFixModal.propTypes = {
  handleModalClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  selectedOrders: PropTypes.arrayOf(PropTypes.number).isRequired,
  // @NOTE: unprocessable propType failed to import from useReleaseOrders
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
  }),
  toastManager: PropTypes.shape({
    add: PropTypes.func,
  }).isRequired,
  innerRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }).isRequired,
};

export default PreflightProcessZeroFixModal;
