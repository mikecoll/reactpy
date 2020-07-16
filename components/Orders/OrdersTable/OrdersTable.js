import React, {
  useEffect, useMemo, useState,
} from 'react';
import { times } from 'lodash';
import { usePrevious } from 'react-use';

import Alert from '../../common/Alert';
import LoaderSvgWrapper from '../../common/LoaderSvgWrapper';

import OrdersTableHead from './OrdersTableHead';
import OrdersTablePagination from './OrdersTablePagination/OrdersTablePagination';
import OrdersTableRow, { OrdersTableRowLoader } from './OrdersTableRow';
import SelectAllRow from './SelectAllRow';

import {
  useDebouncedFiltersState,
  useFiltersDispatch,
} from '~/contexts/FiltersState';

import useSelectedOrdersActions from '~/hooks/orders/useSelectedOrdersActions';

const OrdersTable = () => {
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [forceUpdate, setForceUpdate] = useState(false);

  // @NOTE: filters will be provided by props in the future to support
  //        other types of filtering (eg advanced filters)
  // @NOTE: note the ussage of the debouncedFilters value rather than the raw
  //        filters — this ensures we are updating the values efficently
  const { filters } = useDebouncedFiltersState();
  const { changeFilter, getFilterParameters } = useFiltersDispatch();

  const { pageSize, page, flow } = filters;

  const [
    {
      orders,

      selectAllChecked,

      lastPage,
      total,
      totalSelected,
      selectedCount,

      isLoading,
      isError,
    },
    {
      setOrdersParams,

      addListener,
      onToggleAllChecked,
    },
  ] = useSelectedOrdersActions();

  // @NOTE: used to determin how many loading rows to show
  const prevOrdersLength = usePrevious(orders.length);

  const updateOrdersTableData = () => {
    setOrdersParams(getFilterParameters());
    setForceUpdate(false);
  };

  useEffect(() => addListener(() => setForceUpdate(true)), []);
  useEffect(() => { forceUpdate && updateOrdersTableData(); }, [forceUpdate]);

  /* @NOTE: this is the primary effect that triggers tabel data to update
   * when filters are changed. Utilizing a JSON.stringify here ensures
   * that we don't force react to do a deep comparison of the filters.
   */
  useEffect(
    () => { updateOrdersTableData(); },
    [JSON.stringify(filters)],
  );

  // Effect: Track the first load/render with valid orders vs subsiquent renders
  useEffect(() => {
    if (isFirstLoad && orders.length > 0) {
      setIsFirstLoad(false);
    }
  }, [orders]);

  const SearchArchivedOrders = () => (
    <span>
      <small> Click <span onClick={() => changeFilter('flow', 'archived')} className="cursor-pointer text-blue">here</span> if you'd like to search archived orders.</small>
    </span>
  );

  return useMemo(() => (
    <>
      {isError && (
        <Alert type="danger">
          <pre>
            {JSON.stringify(isError, null, 2)}
          </pre>
        </Alert>
      )}

      {(!isLoading && orders.length === 0)
        ? (
          <p>
            No Orders Found.
            {flow !== 'archived' ? <SearchArchivedOrders /> : ''}
          </p>
        )
        : (
          <>
            <p className="text-sm text-grey-darker pb-2">
              {!isLoading
                ? `Found ${total.toLocaleString()} Orders`
                : (
                  <LoaderSvgWrapper height="1" width="100">
                    <rect x="0" y="0" rx="0.12" ry="0.12" width="25" height="1" />
                  </LoaderSvgWrapper>
                )
              }
            </p>

            <table className="bg-white mb-4 w-full">
              {!isLoading && (
                <OrdersTableHead
                  selectAllChecked={selectAllChecked}
                  onToggleAllChecked={onToggleAllChecked}
                />
              )}
              <tbody>
                {selectAllChecked && selectedCount !== totalSelected && (
                  <SelectAllRow
                    numSelected={selectedCount}
                    totalSelected={totalSelected}
                  />
                )}
                {isLoading && times(
                  (prevOrdersLength ? (prevOrdersLength + 1) : pageSize),
                  i => (
                    <OrdersTableRowLoader key={i} />
                  ),
                )}
                {!isLoading && orders.map(order => (
                  <OrdersTableRow
                    key={order.id}
                    order={order}
                  />
                ))}
                <OrdersTablePagination
                  lastPage={lastPage}
                  page={page}
                />
              </tbody>
            </table>
          </>
        )}
    </>
  ), [isError, isLoading, orders, selectAllChecked, selectedCount]);
};

export default OrdersTable;
