import React, { Profiler } from 'react';
import classNames from 'classnames';

import { Clear as ClearIcon } from '../common/Icons';
import Button from '../common/Button';
import ButtonGroup from '../common/ButtonGroup';
import DropdownButton from '../common/DropdownButton';

import {
  useSelectedOrdersState,
  useSelectedOrdersDispatch,
} from '../../contexts/SelectedOrdersState';

import useOrderActions from '../../hooks/orders/useOrderActions';

const moreActionsIcon = <i className="fa fa-ellipsis-v" />;

const NUM_VISIBLE_ACTIONS = 4;

const OrderActions = () => {
  const { selectedOrders } = useSelectedOrdersState();
  const { resetSelectedOrders } = useSelectedOrdersDispatch();

  const selectedOrdersMessage = `${selectedOrders.length} order${selectedOrders.length === 1 ? '' : 's'} selected`;

  const actions = useOrderActions();

  const primaryActions = actions.slice(0, NUM_VISIBLE_ACTIONS);
  const otherActions = actions.slice(NUM_VISIBLE_ACTIONS, actions.length);

  return (
    <>
      <div
        className="bg-grey-lighter mb-4 p-2 rounded text-grey-dark clearfix flex flex-row items-stretch"
      >
        <div className={classNames(
          'flex-auto py-2 pl-1',
          selectedOrders.length && 'text-grey-darkest',
        )}
        >
          {selectedOrdersMessage}
        </div>
        {selectedOrders.length > 0 && (
          <Button border rounded onClick={resetSelectedOrders} className="flex-inital">
            <ClearIcon />
            Clear Selection
          </Button>
        )}
      </div>
      <ButtonGroup className="w-full border">
        {primaryActions.map(({ label, icon = null, ...otherProps }) => (
          <Button key={label} {...otherProps}>
            {icon}
            {label}
          </Button>
        ))}
        {otherActions.length && (
          <DropdownButton
            disabled={!selectedOrders.length}
            label={moreActionsIcon}
            alignRight
          >
            {otherActions.map(({ label, ...otherProps }) => (
              <Button key={label} {...otherProps}>
                {label}
              </Button>
            ))}
          </DropdownButton>
        )}
      </ButtonGroup>
    </>
  );
};

export default OrderActions;
