import React from 'react';

const FilterWrapper = props => (
  <div className="w-1/6 p-1">
    <div className="p-2 cursor-move bg-white border rounded" {...props} />
  </div>
);

export default FilterWrapper;
