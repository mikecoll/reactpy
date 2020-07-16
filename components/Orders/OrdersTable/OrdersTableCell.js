import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { get } from 'lodash';

import {
  abbreviatedOrderType,
  ordersTableColumnsConfigType,
} from '~/types';

const OrdersTableCell = React.memo((props) => {
  const {
    order,
    config,
    orderBy,
    disabled,
    ...otherProps
  } = props;

  const modifyDisplay = get(config, 'modifyDisplay', s => s);


  const cellValue = modifyDisplay(get(order, config.orderKey));

  return (
    <td
      {...otherProps}
      className={classNames(
        'text-sm p-3',
        (!disabled && orderBy === config.orderBy) && 'font-bold text-grey-darker',
      )}
    >
      {cellValue}
    </td>
  );
});

OrdersTableCell.defaultProps = {
  orderBy: 'order_date',
  disabled: false,
};

OrdersTableCell.propTypes = {
  order: abbreviatedOrderType.isRequired,
  config: ordersTableColumnsConfigType.isRequired,
  orderBy: PropTypes.string,
  disabled: PropTypes.bool,
};

export default OrdersTableCell;
