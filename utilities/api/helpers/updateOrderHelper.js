import { flatMap } from 'lodash';

import { updateOrders, updateOrder } from '../api';
import pluralizeOrder from '../../pluralizeOrder';

const updateOrderHelper = async ({ payload, toastManager, orderId = null }) => {
  let error = null;
  let response = null;

  try {
    response = (orderId)
      ? await updateOrder(orderId, payload)
      : await updateOrders(payload);

    const {
      data: {
        successfulUpdates,
        pendingUpdates,
      },
    } = response;

    const pendingCount = flatMap(pendingUpdates).length;

    if (successfulUpdates.length) {
      await toastManager.add(
        `Successfully updated ${pluralizeOrder(successfulUpdates)}`,
        { appearance: 'success', autoDismiss: true },
      );
    }

    if (pendingUpdates && pendingCount) {
      await toastManager.add(
        `${pluralizeOrder(pendingCount)} updates pending successful amend`,
        { appearance: 'info', autoDismiss: true },
      );
    }
  } catch (err) {
    await toastManager.add(
      'Error: Failed to Update Order(s)',
      { appearance: 'error', autoDismiss: true },
    );
    error = err;
  }

  return { response, error };
};

export default updateOrderHelper;
