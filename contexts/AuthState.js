import React, { useEffect, useState, useContext } from 'react';
import { get } from 'lodash';

import { childrenType } from '../types';
import { getUser } from '../utilities/api';

import useFetch from '../hooks/useFetch';

export const initialAuthState = {
  isLoading: true,
  user: false,
  roles: [],
  permissions: [],
};

const AuthStateContext = React.createContext();
const AuthDispatchContext = React.createContext();

/* @NOTE: These objects are simply organizational structures */
export const AuthRoles = {
  admin: 'admin',
};

export const AuthPermissions = {
  globalWrite: 'global-write',
  order: {
    orderWrite: 'order-order-write',
    shippingWrite: 'order-shipping-write',
    productsWrite: 'order-products-write',
    trackingWrite: 'order-tracking-numbers-edit',
  },
  orderActions: {
    canHold: 'order-can-hold',
    canCancel: 'order-can-cancel',
  },
  zipTables: {
    import: 'ziptables-can-import',
  },
  tracking: {
    import: 'tracking-numbers-bulk-import',
  },
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(initialAuthState);
  const [{ data, isLoading, isError }] = useFetch(getUser);

  useEffect(() => {
    setAuth({
      ...auth,
      ...get(data, 'data'),
      isLoading,
    });
  }, [data, isLoading]);

  if (isError) {
    return (
      <pre>
        Auth Error:
        {' '}
        {JSON.stringify(isError, null, 2)}
      </pre>
    );
  }

  /* @NOTE: All functionality attached to DispatchStates should be
   *        functions by convention & evaluated by the calling component
   *        to avoid calculating unused values upon every refresh.
   */
  const isAdmin = () => auth.roles.includes(AuthRoles.admin) || auth.permissions.includes(AuthPermissions.globalWrite);
  const hasPermission = str => !isLoading && (isAdmin() || auth.permissions.includes(str));
  const hasSomePermissions = pAry => isAdmin()
    || pAry.some(p => hasPermission(p));

  const authDispatchState = {
    setAuth,
    isAdmin,
    hasPermission,
    hasSomePermissions,
  };

  return (
    <AuthStateContext.Provider value={auth}>
      <AuthDispatchContext.Provider value={authDispatchState}>
        {children}
      </AuthDispatchContext.Provider>
    </AuthStateContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: childrenType.isRequired,
};

export const useAuthState = () => {
  const context = useContext(AuthStateContext);
  if (context === undefined) {
    throw new Error('useAuthState must be within a AuthProvider');
  }
  return context;
};

export const useAuthDispatch = () => {
  const context = useContext(AuthDispatchContext);
  if (context === undefined) {
    throw new Error('useAuthState must be within a AuthProvider');
  }
  return context;
};
