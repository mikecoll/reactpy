import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import classNames from 'classnames';

import { abbreviatedOrderType } from '~/types';

import LoaderSvgWrapper from '~/components/common/LoaderSvgWrapper';

import OrdersTableCell from './OrdersTableCell';
import OrdersTableColumnsConfig from './OrdersTableColumnsConfig';

import { useFiltersState } from '~/contexts/FiltersState';
import {
  usePendingOrderUpdatesDispatch,
} from '~/contexts/PendingOrderUpdatesState';
import useHotKeySelectedOrdersDispatch from '~/hooks/orders/useHotKeySelectedOrdersDispatch';

const defaultClassNames = {
  tr: 'text-grey-darker border',
};

export const OrdersTableRowLoader = React.memo(() => (
  <tr className={defaultClassNames.tr}>
    <td colSpan={OrdersTableColumnsConfig.length + 1} className="p-2">
      <LoaderSvgWrapper width="100" height="2">
        <rect x="0" y="0" rx="0.25" ry="0.25" width="100" height="2" />
      </LoaderSvgWrapper>
    </td>
  </tr>
));

const OrdersTableRow = ({
  isLoading,
  order,
}) => {
  const { filters: { orderBy } } = useFiltersState();
  const {
    includesOrderId: pendingOrderUpdatesIncludes,
  } = usePendingOrderUpdatesDispatch();

  const {
    selectToggle,
    selectSingle,
    includesOrderId: selectedOrderIdsIncludes,
  } = useHotKeySelectedOrdersDispatch();

  const selected = selectedOrderIdsIncludes(order.id);
  const pendingUpdate = pendingOrderUpdatesIncludes(order.id);

  return useMemo(() => (
    <tr
      className={classNames(
        defaultClassNames.tr,
        selected && 'bg-grey-lighter',
        !pendingUpdate && !selected && 'hover:bg-grey-lighter',
        pendingUpdate && 'disabled text-grey cursor-not-allowed',
      )}
    >
      <td
        className={classNames(
          'p-3 border-r',
          !pendingUpdate && 'cursor-pointer',
        )}
        onClick={() => !pendingUpdate && selectToggle(order.id)}
        role="cell"
      >
        <i
          className={classNames(
            !pendingUpdate && selected && 'far fa-check-square',
            !pendingUpdate && !selected && 'far fa-square',
            pendingUpdate && 'fas fa-cog fa-spin',
          )}
        />
        {selected}
      </td>

      {OrdersTableColumnsConfig.map(config => (
        <OrdersTableCell
          onClick={() => !pendingUpdate && selectSingle(order.id)}
          key={config.orderKey}
          order={order}
          orderBy={orderBy}
          config={config}
          disabled={pendingUpdate}
        />
      ))}

    </tr>
  ), [isLoading, order, orderBy, selected, pendingUpdate]);
};

OrdersTableRow.defaultProps = {
  isLoading: true,
};

OrdersTableRow.propTypes = {
  order: abbreviatedOrderType.isRequired,
  isLoading: PropTypes.bool,
};

export default OrdersTableRow;
