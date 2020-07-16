import React, { useState, useContext, useEffect } from 'react';
import {
  uniq, sortBy, omit, isEqual,
} from 'lodash';
import { usePrevious } from 'react-use';

import {
  useDebouncedFiltersState,
  clearSelectionFiltersOmit,
} from './FiltersState';

import {
  usePendingOrderUpdatesState,
} from './PendingOrderUpdatesState';

import { childrenType } from '../types';

import useListeners from '../hooks/useListeners';

export const initialSelectedOrdersState = {
  unselectedOrders: [],
  selectedOrders: [],
  selectAllChecked: false,
};

const SelectedOrdersStateContext = React.createContext();
const SelectedOrdersDispatchContext = React.createContext();

const SelectedOrdersActions = {
  reset: 'SelectedOrdersActions.reset',
  setSelection: 'SelectedOrdersActions.setSelection',
  selectSingle: 'SelectedOrdersActions.selectSingle',
  selectMany: 'SelectedOrdersActions.selectMany',
  selectToggle: 'SelectedOrdersActions.selectToggle',
  selectAllToggle: 'SelectedOrdersActions.selectAllToggle',
  removeAny: 'SelectedOrdersActions.removeAny',
};

const selectedOrdersStateChange = (state, action) => {
  if (!action || !action.type) return;

  switch (action.type) {
    case SelectedOrdersActions.reset: {
      return {
        ...initialSelectedOrdersState,
        unselectedOrders: state.unselectedOrders,
        selectedOrders: [],
        selectAllChecked: false,
      };
    }
    case SelectedOrdersActions.setSelection: {
      const orderIds = action.payload;

      return {
        // ...initialSelectedOrdersState,
        selectedOrders: orderIds,
        selectAllChecked: false,
        // @NOTE: we don't reset the unselectedOrders
        unselectedOrders: state.unselectedOrders,
      };
    }
    case SelectedOrdersActions.selectSingle: {
      const orderId = action.payload;

      return {
        ...state,
        selectedOrders: state.unselectedOrders.includes(orderId)
          ? state.SelectedOrdersState
          : [orderId],
      };
    }
    case SelectedOrdersActions.selectMany: {
      if (!('length' in action.payload)) {
        throw new Error('SelectedOrdersActions.selectMany requires an array payload.', action);
      }

      return {
        ...state,
        selectedOrders: sortBy(uniq(state.selectedOrders.concat(action.payload)))
          .filter(id => !state.unselectedOrders.includes(id)),
      };
    }
    case SelectedOrdersActions.selectToggle: {
      const orderId = action.payload;

      let newSelectedOrders = state.selectedOrders;
      const idx = newSelectedOrders.indexOf(orderId);

      const isUnselected = state.unselectedOrders.includes(orderId);

      if (isUnselected || idx !== -1) {
        newSelectedOrders.splice(idx, 1);
      } else {
        // @NOTE: selectedOrders should always be sorted to make for eaiser
        //        comparisons to previous/other selections.
        newSelectedOrders.push(orderId);
        newSelectedOrders = sortBy(newSelectedOrders);
      }

      return {
        ...state,
        selectedOrders: newSelectedOrders,
      };
    }
    case SelectedOrdersActions.selectAllToggle: {
      const newVal = action.payload || !state.selectAllChecked;


      return {
        ...state,
        selectAllChecked: newVal,
      };
    }
    case SelectedOrdersActions.unselect: {
      const unselected = action.payload;

      return {
        ...state,
        unselectedOrders: unselected,
        selectedOrders: state.selectedOrders.filter(id => !unselected.includes(id)),
      };
    }
    default:
      throw new Error(`Unknown action type: '${action.type}'`);
  }
};

const SelectedOrdersProvider = ({ children }) => {
  const { filters } = useDebouncedFiltersState();
  const { orderIds: pendingUpdateOrderIds } = usePendingOrderUpdatesState();

  const previousFilters = usePrevious(filters);
  const [, listenerActions] = useListeners();

  const [internalState, setInternalState] = useState(
    { ...initialSelectedOrdersState },
  );

  // @NOTE: this is a fake reducer that simply organizes the functionality
  const dispatch = action => setInternalState(
    state => selectedOrdersStateChange(state, action),
  );

  const dispatchState = {
    resetSelectedOrders: async () => dispatch({ type: SelectedOrdersActions.reset }),
    setSelection: orderIds => dispatch({
      type: SelectedOrdersActions.setSelection,
      payload: orderIds,
    }),
    toggleSelectAllChecked: isChecked => dispatch({
      type: SelectedOrdersActions.selectAllToggle,
      payload: isChecked,
    }),
    selectToggle: orderId => dispatch({
      type: SelectedOrdersActions.selectToggle,
      payload: orderId,
    }),
    selectSingle: orderId => dispatch({
      type: SelectedOrdersActions.selectSingle,
      payload: orderId,
    }),
    selectMany: orderIds => dispatch({
      type: SelectedOrdersActions.selectMany,
      payload: orderIds,
    }),
    includesOrderId: orderId => internalState.selectedOrders.includes(orderId),
    unselect: orderIds => dispatch({
      type: SelectedOrdersActions.unselect,
      payload: orderIds,
    }),
    ...listenerActions,
  };

  // Effect: when filters change, we need to reset the selected orders.
  useEffect(() => {
    if (!isEqual(
      omit(previousFilters, clearSelectionFiltersOmit),
      omit(filters, clearSelectionFiltersOmit),
    )) {
      dispatchState.resetSelectedOrders();
    }
  }, [filters]);

  // whenever there are pending order updates OR the selected orders changes,
  //    we need to make sure none are selected.
  useEffect(() => {
    pendingUpdateOrderIds
      && pendingUpdateOrderIds.length
      && dispatchState.unselect(pendingUpdateOrderIds);
  }, [pendingUpdateOrderIds]);

  return (
    <SelectedOrdersStateContext.Provider value={internalState}>
      <SelectedOrdersDispatchContext.Provider value={dispatchState}>
        {children}
      </SelectedOrdersDispatchContext.Provider>
    </SelectedOrdersStateContext.Provider>
  );
};

// <>
//   <pre>
//     SelectedOrdersState:
//     {' '}
//     {JSON.stringify(state, null, 2)}
//   </pre>
//   {children}
// </>

SelectedOrdersProvider.propTypes = {
  children: childrenType.isRequired,
};

const SelectedOrdersStateConsumer = SelectedOrdersStateContext.Consumer;
const SelectedOrdersDispatchConsumer = SelectedOrdersDispatchContext.Consumer;

const useSelectedOrdersState = () => {
  const context = useContext(SelectedOrdersStateContext);
  if (context === undefined) {
    throw new Error('useSelectedOrdersState must be within a SelectedOrdersProvider');
  }
  return context;
};

const useSelectedOrdersDispatch = () => {
  const context = useContext(SelectedOrdersDispatchContext);
  if (context === undefined) {
    throw new Error('useSelectedOrdersState must be within a SelectedOrdersProvider');
  }
  return context;
};

export {
  SelectedOrdersProvider,
  SelectedOrdersActions,

  SelectedOrdersStateConsumer,
  SelectedOrdersDispatchConsumer,

  useSelectedOrdersState,
  useSelectedOrdersDispatch,
};
