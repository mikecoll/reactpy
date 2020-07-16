import { useMemo } from 'react';

import { AuthPermissions, useAuthDispatch } from '~/contexts/AuthState';
import { useSelectedOrdersState, useSelectedOrdersDispatch } from '~/contexts/SelectedOrdersState';
import { useAggregateOrdersState } from '~/contexts/AggregateOrdersState';
import { useLayoutDispatch } from '~/contexts/LayoutState';
import { useFiltersState } from '~/contexts/FiltersState';


import useExportOrders from './useExportOrders';
import useApplyOrderRules from './useApplyOrderRules';

export default function useOrderActions() {
  const { hasPermission, hasSomePermissions } = useAuthDispatch();
  const { openModal } = useLayoutDispatch();
  const { filters: { flow } } = useFiltersState();
  const { selectedOrders } = useSelectedOrdersState();
  const { orderFlags } = useAggregateOrdersState();

  const [exportOrders] = useExportOrders();
  const [applyOrderRules] = useApplyOrderRules();

  const { triggerListeners } = useSelectedOrdersDispatch();

  const permissions = {
    write: hasPermission(AuthPermissions.globalWrite),
    editOrder: hasSomePermissions(Object.values(AuthPermissions.order)),
    hold: hasPermission(AuthPermissions.orderActions.canHold),
    cancel: hasPermission(AuthPermissions.orderActions.canCancel),
  };

  return useMemo(() => {
    let newActions = [
      {
        label: 'Edit',
        // icon: (<i className="fa fa-edit" />), // @NOTE: possible, but breaks styling
        onClick: () => openModal(selectedOrders.length === 1 ? 'editOrder' : 'editOrders'),
        disabled: [
          !selectedOrders.length,
          !permissions.write && !permissions.editOrder,
          orderFlags.has_canceled,
          // orderFlags.has_onLoad,
        ],
      },
      {
        label: (flow != 'staged') ? 'Stage' : 'Unstage',
        onClick: () => openModal(flow != 'staged' ? 'stageOrders' : 'unstageOrders'),
        disabled: [
          !selectedOrders.length,
          !permissions.write,
          orderFlags.has_shipped,
          orderFlags.has_released,
          orderFlags.has_canceled,
        ],
      },
      {
        label: 'Release',
        onClick: () => openModal('releaseOrders'),
        disabled: [
          !selectedOrders.length,
          !permissions.write,
          orderFlags.has_shipped,
          orderFlags.has_released,
          orderFlags.has_canceled,
        ],
      },
      {
        label: 'SubType',
        onClick: () => openModal('substituteProductTypes'),
        disabled: [
          !selectedOrders.length,
          !permissions.write,
          // orderFlags.has_onLoad, TODO: fix this
        ],
      },
      {
        label: 'Sub',
        onClick: () => openModal('substituteProducts'),
        disabled: [
          !selectedOrders.length,
          !permissions.write,
          // orderFlags.has_onLoad, TODO: fix this
        ],
      },
      {
        label: 'Apply Rules',
        onClick: async () => {
          await applyOrderRules(selectedOrders);
          await triggerListeners();
        },
        disabled: [
          !selectedOrders.length,
          !permissions.write,
          orderFlags.has_shipped,
          orderFlags.has_released,
        ],
      },
      {
        label: 'Hold',
        onClick: () => openModal('holdOrders'),
        disabled: [
          !selectedOrders.length,
          !permissions.write && !permissions.hold,
          orderFlags.has_shipped,
          orderFlags.has_released,
          orderFlags.has_canceled,
          // orderFlags.has_onLoad,
        ],
      },
      {
        label: 'Export Orders',
        onClick: () => exportOrders(),
        disabled: selectedOrders.length > 5000,
      },
      {
        label: 'Export Line–Item',
        onClick: () => exportOrders('EXPORT_LINE_ITEMS'),
        disabled: selectedOrders.length > 5000,
      },
      {
        label: 'Export Subs',
        onClick: () => exportOrders('EXPORT_SUBS'),
        disabled: selectedOrders.length > 5000,
      },
      {
        label: 'Cancel',
        onClick: () => openModal('cancelOrders'),
        disabled: [
          !selectedOrders.length,
          !(permissions.cancel || permissions.write),
          // orderFlags.has_onLoad,
          orderFlags.has_canceled,
        ],
      },
    ];

    if (orderFlags.is_loading) {
      newActions = newActions.map(na => ({
        ...na,
        disabled: true,
      }));
    }

    return newActions;
  }, [orderFlags, selectedOrders, permissions, flow]);
}
