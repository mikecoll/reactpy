import { useState } from 'react';
import { useUpdateEffect } from 'react-use';
import useFetch from '../useFetch';
import { applyOrderRuleRunner } from '~/utilities/api';
import { useLayoutDispatch } from '~/contexts/LayoutState';
import pluralizeOrder from '~/utilities/pluralizeOrder';

const useApplyOrderRules = () => {
  const { notify } = useLayoutDispatch();

  const applyOrderRules = async (orderIds) => {
    let loadingNotifyId;

    notify.info(
      `Applying Automatic Order Rules to ${pluralizeOrder(orderIds)}...`,
      null,
      (id) => { loadingNotifyId = id; },
    );

    try {
      const data = await applyOrderRuleRunner(orderIds);
      notify.removeToast(loadingNotifyId);
    } catch (err) {
      notify.error(
        `Error Applying Automatic Order Rules: ${err}`,
      );

      return false;
    } finally {
      loadingNotifyId && notify.removeToast(loadingNotifyId);
    }

    notify.success(
      `Successfully Applied Automatic Order Rules to ${pluralizeOrder(orderIds)}`,
    );

    return true;
  };

  return [applyOrderRules];
};

export default useApplyOrderRules;
