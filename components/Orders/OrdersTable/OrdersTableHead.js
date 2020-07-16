import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import classNames from 'classnames';

import SortButton from './SortButton';
import OrdersTableColumnsConfig from './OrdersTableColumnsConfig';

import {
  useFiltersState,
  useFiltersDispatch,
} from '~/contexts/FiltersState';

const OrdersTableHead = ({ selectAllChecked, onToggleAllChecked }) => {
  const { filters: { direction, orderBy } } = useFiltersState();
  const { changeFilters } = useFiltersDispatch();

  return useMemo(() => (
    <thead>
      <tr className="border">
        <th
          className="p-3 text-left border-r"
          onClick={() => onToggleAllChecked(!selectAllChecked)}
        >
          <i
            className={classNames(
              'far text-grey-darker cursor-pointer',
              (selectAllChecked) ? 'fa-minus-square' : 'fa-square',
            )}
          />
        </th>

        {OrdersTableColumnsConfig.map(config => (
          <th
            key={config.label}
            className="whitespace-no-wrap p-3 text-left text-xs"
          >

            <SortButton
              currentDirection={direction}
              currentOrderBy={orderBy}
              changeFilters={changeFilters}
              label={config.label}
              orderBy={config.orderBy}
            />

          </th>
        ))}

      </tr>
    </thead>
  ), [direction, orderBy, selectAllChecked]);
};

OrdersTableHead.propTypes = {
  onToggleAllChecked: PropTypes.func.isRequired,
  selectAllChecked: PropTypes.bool.isRequired,
};

export default OrdersTableHead;
