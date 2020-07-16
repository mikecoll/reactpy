import React, { useContext } from 'react';

const ProductsContext = React.createContext({
  products: window.products,
});

export const useProductsState = () => {
  const context = useContext(ProductsContext);
  if (context === undefined) {
    throw new Error('useProductsState must be within a ProductsProvider');
  }
  return context;
};

// const useProductsDispatch = () => {
//   const context = useContext(ProductsDispatchContext);
//   if (context === undefined) {
//     throw new Error('useProductsState must be within a ProductsProvider');
//   }
//   return context;
// };

export default ProductsContext;
