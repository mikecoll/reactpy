import React, {
  useMemo, useEffect, useState, useCallback,
} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { get } from 'lodash';

import { OrdersTableRowLoader } from './OrdersTableRow';

import OrdersTableColumnsConfig from './OrdersTableColumnsConfig';

import {
  useFiltersState,
  useFiltersDispatch,
} from '~/contexts/FiltersState';

import useFetch from '~/hooks/useFetch';

import { postOrderIds } from '~/utilities/api';
import useHotKeySelectedOrdersDispatch from '~/hooks/orders/useHotKeySelectedOrdersDispatch';

const SelectAllRow = ({ numSelected, totalSelected }) => {
  const [hasSelectedAll, setHasSelectedAll] = useState(false);
  const [{ data, isLoading, isError }, setUrl] = useFetch();

  const { filters } = useFiltersState();
  const { getFilterParameters } = useFiltersDispatch();
  const { selectMany } = useHotKeySelectedOrdersDispatch();

  const selectAllOrderIds = useCallback(() => {
    setUrl(
      postOrderIds(
        getFilterParameters(filters),
      ),
    );
  }, [filters]);

  useEffect(() => {
    if (data) {
      const selectQueriedIds = async () => {
        const orderIds = get(data, 'data.data');
        const roughNewTotal = numSelected + orderIds.length;

        selectMany(orderIds);
        // set hasSelectedAll to TRUE IF (orderIds.length !== roughNewTotal)
        setHasSelectedAll(orderIds.length !== roughNewTotal);
      };

      selectQueriedIds();
    }
  }, [data]);

  return useMemo(() => {
    if (isLoading) {
      return (<OrdersTableRowLoader />);
    }

    if (isError) {
      throw new Error(isError);
    }

    return (
      (
        <tr className="border">
          <td
            className={classNames(
              'text-grey-darkest text-sm p-3',
              hasSelectedAll && 'text-green font-bold',
            )}
            colSpan={OrdersTableColumnsConfig.length}
          >
            {hasSelectedAll && (
              <>
                {`${numSelected} filtered orders are selected`}
              </>
            )}
            {!hasSelectedAll && numSelected !== totalSelected && (
              <>
                <span className="font-bold">{numSelected}</span>
                {` order${numSelected > 1 ? 's' : ''} selected. `}
                <button
                  className="font-bold hover:underline text-blue-dark"
                  onClick={selectAllOrderIds}
                  type="button"
                >
                  {`Select all ${totalSelected} orders`}
                </button>
              </>
            )}
          </td>
        </tr>
      )
    );
  }, [isLoading, isError, numSelected, totalSelected, hasSelectedAll]);
};

SelectAllRow.propTypes = {
  numSelected: PropTypes.number.isRequired,
  totalSelected: PropTypes.number.isRequired,
};

export default SelectAllRow;
