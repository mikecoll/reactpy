import React, { useContext } from 'react';

const WarehouseContext = React.createContext({
  warehouses: window.warehouses,
});

export const useWarehouseState = () => {
  const context = useContext(WarehouseContext);
  if (context === undefined) {
    throw new Error('WarehouseContext must be within a WarehouseProvider');
  }
  return context;
};

export default WarehouseContext;
