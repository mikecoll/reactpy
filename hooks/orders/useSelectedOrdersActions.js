import { useUpdateEffect } from 'react-use';

import { useSelectedOrdersState } from '~/contexts/SelectedOrdersState';

import useFetchedOrders from './useFetchedOrders';

import {
  useCtrlAllPressedEvent,
} from '../hotKeys';
import useHotKeySelectedOrdersDispatch from './useHotKeySelectedOrdersDispatch';
import useCopySelectedOrders from './useCopySelectedOrders';

/**
 * useSelectedOrderActions Hook
 *
 * Wraps the orderTable's fetching and selection functionality.
 *
 * Responsibilities:
 *  - when CTRL+A is pressed select all visible orders
 *  -
 */
const useSelectedOrdersActions = () => {
  const {
    selectAllChecked,
    selectedOrders,
  } = useSelectedOrdersState();

  const {
    toggleSelectAllChecked,
    addListener, // pass-through
    selectMany, // used for select all & toggle checked
    resetSelectedOrders,
  } = useHotKeySelectedOrdersDispatch();

  const [
    {
      orders,
      lastPage,
      total,
      totalSelected,
      isLoading,
      isError,
    },
    setOrdersParams,
  ] = useFetchedOrders();

  const onToggleAllChecked = async () => {
    toggleSelectAllChecked();

    return (!selectAllChecked)
      ? selectMany(orders.map(order => order.id))
      : resetSelectedOrders();
  };

  const selectAll = () => {
    if (!selectAllChecked) {
      onToggleAllChecked();
    }

    selectMany(orders.map(order => order.id));
  };

  /* ============== FUNCTIONALITY / EFFECTS ============== */

  // CTRL+A select all functionality
  useUpdateEffect(() => {
    selectAll();
  }, [useCtrlAllPressedEvent()]);

  // CTRL+C copy to clipboard functionality
  useCopySelectedOrders({ selectedOrders, orders });

  return [
    {
      selectAllChecked, // useSelectedOrdersState
      selectedCount: selectedOrders.length, // useSelectedOrdersState

      orders, // useFetchedOrders
      lastPage, // useFetchedOrders
      total, // useFetchedOrders
      totalSelected, // useFetchedOrders
      isLoading, // useFetchedOrders
      isError, // useFetchedOrders
    },
    {
      setOrdersParams, // useFetchedOrders
      addListener, // useSelectedOrdersDispatch
      onToggleAllChecked, // local
    },
  ];
};

export default useSelectedOrdersActions;
