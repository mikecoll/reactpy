import React, { useContext, useState } from 'react';

import { useToasts } from 'react-toast-notifications';

import { childrenType } from '../types';

export const initialLayoutState = {
  modalType: null,
};

const LayoutStateContext = React.createContext();
const LayoutDispatchContext = React.createContext();

const LayoutProvider = ({ children }) => {
  const [layoutState, setLayoutState] = useState(initialLayoutState);
  const toasts = useToasts();
  const { addToast } = toasts;

  const internalToast = appearance => (content, options = {}, cb = undefined) => addToast(
    content,
    {
      appearance,
      autoDismiss: true,
      ...options,
    },
    cb,
  );

  const dispatchState = {
    // setLayoutState,
    notify: {
      ...toasts,

      info: internalToast('info'),
      success: internalToast('success'),
      error: internalToast('error'),
      warning: internalToast('warning'),
    },
    openModal: modalType => setLayoutState(state => ({
      ...state,
      modalType,
    })),
    closeModal: () => setLayoutState(state => ({
      ...state,
      modalType: initialLayoutState.modalType,
    })),
  };

  return (
    <LayoutStateContext.Provider value={layoutState}>
      <LayoutDispatchContext.Provider value={dispatchState}>
        {children}
      </LayoutDispatchContext.Provider>
    </LayoutStateContext.Provider>
  );
};

LayoutProvider.propTypes = {
  children: childrenType.isRequired,
};

const LayoutStateConsumer = LayoutStateContext.Consumer;
const LayoutDispatchConsumer = LayoutDispatchContext.Consumer;

const useLayoutState = () => {
  const context = useContext(LayoutStateContext);
  if (context === undefined) {
    throw new Error('useLayoutState must be within a LayoutProvider');
  }
  return context;
};

const useLayoutDispatch = () => {
  const context = useContext(LayoutDispatchContext);
  if (context === undefined) {
    throw new Error('useLayoutState must be within a LayoutProvider');
  }
  return context;
};

export {
  LayoutProvider,

  LayoutStateConsumer,
  LayoutDispatchConsumer,

  useLayoutState,
  useLayoutDispatch,
};
