import { useCallback } from 'react';
import { useUpdateEffect } from 'react-use';
import { useCtrlCPressedEvent } from '../hotKeys';
import { postOrderNumbers } from '~/utilities/api';
import { useLayoutDispatch } from '~/contexts/LayoutState';
import useCopyNotify from './useCopyNotify';

const useCopySelectedOrders = ({ selectedOrders, orders }) => {
  const { notify } = useLayoutDispatch();

  const copyNotify = useCopyNotify();

  const copyOrdersToClipboard = useCallback((copyOrders) => {
    const numbers = copyOrders
      .filter(o => selectedOrders.includes(o.id))
      .map(o => o.order_number);

    copyNotify({ numbers });
  }, [selectedOrders]);

  useUpdateEffect(() => {
    if (selectedOrders.length) {
      const asyncFetchCopy = async () => {
        let loadingNotifyId = null;
        notify.info(
          `Looking up ${selectedOrders.length} Order Numbers ...`, 
          null,
          id => { loadingNotifyId = id; },
        );
        const { data: orderNumbers } = await postOrderNumbers(selectedOrders);
        notify.removeToast(loadingNotifyId);
        copyOrdersToClipboard(orderNumbers);
      };

      if (selectedOrders.length > orders.length) {
        asyncFetchCopy();
      } else {
        copyOrdersToClipboard(orders);
      }
    }
  }, [useCtrlCPressedEvent()]);
};

export default useCopySelectedOrders;
