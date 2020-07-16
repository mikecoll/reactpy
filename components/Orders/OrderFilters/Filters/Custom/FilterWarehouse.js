import React from 'react';
import PropTypes from 'prop-types';

import { useFiltersState, useFiltersDispatch } from '~/contexts/FiltersState';
import WarehouseContext from '~/contexts/WarehouseContext';

import SelectInput from '~/components/common/inputs/SelectInput';


const FilterWarehouse = ({ name }) => {
  const { eventFilterChange } = useFiltersDispatch();
  const { filters: { warehouseId } } = useFiltersState();

  return (
    <WarehouseContext.Consumer>
      {({ warehouses }) => (
        <SelectInput
          handleChange={eventFilterChange}
          label="Warehouse"
          name={name}
          options={warehouses.map(warehouse => (
            { label: warehouse.name, value: warehouse.id.toString() }
          ))}
          showEmptyOption
          value={warehouseId}
        />
      )}
    </WarehouseContext.Consumer>
  );
};

FilterWarehouse.propTypes = {
  name: PropTypes.string.isRequired,
};

export default FilterWarehouse;
