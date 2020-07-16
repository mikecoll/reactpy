import { useCallback } from 'react';
import { createStagedOrders } from '~/utilities/api';
import { useSelectedOrdersState } from '../../contexts/SelectedOrdersState';
import { useLayoutDispatch } from '~/contexts/LayoutState';
import pluralizeOrder from '~/utilities/pluralizeOrder';

const useAsyncStageOrders = () => {
  const { selectedOrders } = useSelectedOrdersState();
  const { notify } = useLayoutDispatch();
  const asyncStageOrders = async () => {
    const response = await createStagedOrders(selectedOrders);
    if (response.status < 400) {
      notify.success(`Successfully Staged ${pluralizeOrder(selectedOrders)}`);
    } else {
      notify.error(`Failed To Stage ${pluralizeOrder(selectedOrders)}`);
    }
  };

  return asyncStageOrders;
};

export default useAsyncStageOrders;
