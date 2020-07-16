import PropTypes from 'prop-types';
import React from 'react';

import PaginationButton from './PaginationButton';

import { useFiltersDispatch } from '~/contexts/FiltersState';

import OrdersTableColumnsConfig from '../OrdersTableColumnsConfig';

const OrdersTablePagination = React.memo(({ lastPage, page }) => {
  const { changeFilter } = useFiltersDispatch();

  const changePage = p => changeFilter('page', p);

  return (
    <tr className="border">
      <td colSpan={OrdersTableColumnsConfig.length + 1}>
        <div className="flex items-center justify-between p-3 text-grey-darker uppercase">
          <span className="text-xs">{`Page ${page} of ${lastPage}`}</span>
          <div className="flex list-reset">
            <PaginationButton
              disabled={page === 1}
              handleClick={() => changePage(1)}
              label="First"
            />
            <PaginationButton
              disabled={page === 1}
              handleClick={() => changePage(page - 1)}
              label="Previous"
            />
            <PaginationButton
              disabled={page === lastPage}
              handleClick={() => changePage(page + 1)}
              label="Next"
            />
            <PaginationButton
              disabled={page === lastPage}
              handleClick={() => changePage(lastPage)}
              label="Last"
            />
          </div>
        </div>
      </td>
    </tr>
  );
});

OrdersTablePagination.propTypes = {
  lastPage: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
};

export default OrdersTablePagination;
