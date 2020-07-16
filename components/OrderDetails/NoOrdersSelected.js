import React from 'react';
import UnfulfillableProducts from './UnfulfillableProducts';

const NoOrdersSelected = () => (
  <>
    <div className="pb-2">
      <h2 className="font-normal mb-4">No Orders Selected</h2>
      <p>Select one or more orders in the list to make changes.</p>
    </div>

    <div className="pb-2 flex flex-col">
      <UnfulfillableProducts />
    </div>
  </>
);

export default NoOrdersSelected;
