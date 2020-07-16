import React, { useState, useContext } from 'react';

import { childrenType } from '../types';

// import useReducerDebugger from '../hooks/useReducerDebugger';

export const initialPendingOrderUpdatesState = {
  pendingOrderUpdates: [],
  orderIds: [],
};

const testIds = [297518, 297519, 297520, 297521];

const PendingOrderUpdatesStateContext = React.createContext();
const PendingOrderUpdatesDispatchContext = React.createContext();

const PendingOrderUpdatesProvider = ({ children }) => {
  const [pendingState, setPendingState] = useState(initialPendingOrderUpdatesState);

  const dispatchState = {
    setPendingState,
    includesOrderId: id => pendingState.orderIds.includes(id),
    test: () => setPendingState(state => ({
      ...state,
      orderIds: [
        ...state.orderIds,
        testIds.pop(),
      ],
    })),
  };

  return (
    <PendingOrderUpdatesStateContext.Provider value={pendingState}>
      <PendingOrderUpdatesDispatchContext.Provider value={dispatchState}>
        {children}
      </PendingOrderUpdatesDispatchContext.Provider>
    </PendingOrderUpdatesStateContext.Provider>
  );
};

// <>
//   <button className="p-2 border rounded" onClick={() => dispatchState.test()}>
//     Add ID
//   </button>
//   <pre>
//     pendingState:
//     {' '}
//     {JSON.stringify(pendingState, null, 2)}
//   </pre>
//   {children}
// </>

PendingOrderUpdatesProvider.propTypes = {
  children: childrenType.isRequired,
};

const PendingOrderUpdatesStateConsumer = PendingOrderUpdatesStateContext.Consumer;
const PendingOrderUpdatesDispatchConsumer = PendingOrderUpdatesDispatchContext.Consumer;

const usePendingOrderUpdatesState = () => {
  const context = useContext(PendingOrderUpdatesStateContext);
  if (context === undefined) {
    throw new Error('usePendingOrderUpdatesState must be within a PendingOrderUpdatesProvider');
  }
  return context;
};

const usePendingOrderUpdatesDispatch = () => {
  const context = useContext(PendingOrderUpdatesDispatchContext);
  if (context === undefined) {
    throw new Error('usePendingOrderUpdatesState must be within a PendingOrderUpdatesProvider');
  }
  return context;
};

export {
  PendingOrderUpdatesProvider,

  PendingOrderUpdatesStateConsumer,
  PendingOrderUpdatesDispatchConsumer,

  usePendingOrderUpdatesState,
  usePendingOrderUpdatesDispatch,
};
