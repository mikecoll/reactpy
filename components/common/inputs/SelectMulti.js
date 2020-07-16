import React from 'react';
import Select from 'react-select';

const SelectMulti = React.forwardRef((props, ref) => (
  <Select
    isMulti
    isSearchable
    {...props}
    ref={ref}
    styles={{
      control: provided => ({
        ...provided,
        borderColor: '#dae1e7',
      }),
    }}
  />
));

export default SelectMulti;
