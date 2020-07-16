import React, {
  useRef, useState, useEffect,
} from 'react';
import { useClickAway } from 'react-use';

import { withToastManager } from 'react-toast-notifications';

import Loading from '../common/Loading';

import pluralizeOrder from '~/utilities/pluralizeOrder';

import Modal from '../layouts/Modal';

import { useLayoutState, useLayoutDispatch } from '~/contexts/LayoutState';
import {
  useSelectedOrdersDispatch,
} from '~/contexts/SelectedOrdersState';

import useReleaseOrders from '~/hooks/orders/useReleaseOrders';
import ModalTypeMapping from './ModalTypeMapping';
import useAsyncStageOrders from '~/hooks/orders/useAsyncStageOrders';

const Modals = ({ toastManager }) => {
  const [ActiveModal, setActiveModal] = useState(null);
  const [isReleasing, setIsReleasing] = useState(false);
  const [isStaging, setIsStaging] = useState(false);
  const innerRef = useRef();
  const { modalType } = useLayoutState();
  const stageOrder = useAsyncStageOrders();

  const [
    {
      selectedOrders,
      unprocessable,
    },
    {
      releaseOrders,
    },
  ] = useReleaseOrders();

  const { closeModal } = useLayoutDispatch();
  const {
    resetSelectedOrders,
    triggerListeners,
  } = useSelectedOrdersDispatch();


  /**
   * Function onUpdate()
   *
   * @pram { args } `{
   *   shouldRelease: bool,
   *   preflight ?: {
   *      [preflightType] ?: {
   *        override: bool,
   *      }
   *    }
   * }`
   */
  const onUpdate = async (args = { shouldStage: false, shouldRelease: false, preflight: {} }) => {
    const { shouldRelease, shouldStage } = args;

    if (shouldStage) {
      setIsStaging(true);
      await stageOrder();
      setIsStaging(false);
    }

    if (!shouldRelease) {
      await closeModal();
      await triggerListeners();
      await resetSelectedOrders();
    } else {
      try {
        setIsReleasing(true);
        const releaseStatus = await releaseOrders(args);
        setIsReleasing(false);

        if (releaseStatus) {
          await closeModal();
          await triggerListeners();
          return resetSelectedOrders();
        }
      } catch (error) {
        console.log('[Modals.onUpdate.catch]', { error }); /* eslint-disable-line */
      } finally {
        setIsReleasing(false);
      }
    }
  };

  useEffect(() => {
    const newActiveModel = ModalTypeMapping[modalType] || null;
    setActiveModal(state => (state !== newActiveModel ? newActiveModel : state));
  }, [modalType]);

  useClickAway(innerRef, closeModal);

  return ActiveModal && (
    <Modal>
      {isReleasing && <Loading message={`Releasing ${pluralizeOrder(selectedOrders)}`} ref={innerRef} />}
      {isStaging && <Loading message={`Staging ${pluralizeOrder(selectedOrders)}`} ref={innerRef} />}
      {!isReleasing && !isStaging && (
        <ActiveModal
          innerRef={innerRef}
          handleModalClose={closeModal}
          onUpdate={onUpdate}
          selectedOrders={selectedOrders}
          unprocessable={unprocessable}
          toastManager={toastManager}
        />
      )}
    </Modal>
  );
};

export default withToastManager(Modals);
