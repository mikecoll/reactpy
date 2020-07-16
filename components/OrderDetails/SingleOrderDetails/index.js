import React, { useEffect, useMemo, useState } from 'react';
import { List } from 'react-content-loader';

import { Error as AlertError } from '../../common/Alert';

import DetailsPanel from '../DetailsPanel';

import SingleOrderDetailsAttentionMessages from './SingleOrderDetailsAttentionMessages';
import SingleOrderDetailProducts from './SingleOrderDetailsProducts';
import SingleOrderDetailsCustomer from './SingleOrderDetailsCustomer';
import SingleOrderDetailsOrder from './SingleOrderDetailsOrder';
import SingleOrderDetailsShipping from './SingleOrderDetailsShipping';

import {
  useAggregateOrdersDispatch,
} from '~/contexts/AggregateOrdersState';
import {
  useSelectedOrdersState,
  useSelectedOrdersDispatch,
} from '~/contexts/SelectedOrdersState';
import { useFiltersState } from '~/contexts/FiltersState';

import useFetch from '~/hooks/useFetch';

import { getOrder } from '~/utilities/api';
import SingleOrderDetailTags from './SingleOrderDetailTags';

const SingleOrderDetails = () => {
  const { selectedOrders } = useSelectedOrdersState();
  const { updateOrderFlags } = useAggregateOrdersDispatch();
  const { addListener } = useSelectedOrdersDispatch();

  const [forceUpdate, setForceUpdate] = useState(false);
  const [mounted, setMounted] = useState(true);
  const [order, setOrder] = useState(false);

  const [{ data, isLoading, isError }, setUrl] = useFetch();

  const { filters: { flow } } = useFiltersState();

  const updateSingleOrderDetailsData = () => mounted
    && selectedOrders
    && setUrl(getOrder(selectedOrders[0], flow));


  useEffect(
    () => {
      // @TODO: figure out why this data is nexted 3x
      if (mounted && !isLoading && data && data.data && data.data.data) {
        setOrder(data.data.data);
        updateOrderFlags.single(data.data.data);
      }
    },
    [mounted, isLoading, data],
  );

  // useEffect(() => mounted && addListener(updateSingleOrderDetailsData), []);
  useEffect(() => addListener(() => setForceUpdate(true)), []);
  useEffect(() => { forceUpdate && updateSingleOrderDetailsData(); }, [forceUpdate]);

  useEffect(() => () => mounted && setMounted(false), []);

  useEffect(() => {
    mounted && updateSingleOrderDetailsData();
  }, [selectedOrders, selectedOrders.length]);

  return useMemo(() => {
    if (!mounted || !order || isLoading) {
      return <List width={250} height={250} />;
    }

    if (isError) {
      return (<AlertError error={isError} />);
    }

    const orderUpdatedAtDate = Date.parse(order.updated_at);
    const alertOrderAttentionNeeded = order.attention_messages.filter(
      attentionMessage => Date.parse(attentionMessage.updated_at) > orderUpdatedAtDate,
    );

    return (
      <>
        {alertOrderAttentionNeeded.length > 0 && (
          <SingleOrderDetailsAttentionMessages
            attentionMessages={alertOrderAttentionNeeded}
            alertType="warning"
          />
        )}

        <h2 className="font-normal mb-4 text-grey-darkest flex flex-row justify-between">
          <span>{`Order ${order.order_number} `}</span>
          <span className="text-sm text-white flex-grow text-right align-text-bottom">
            {order.id}
          </span>
        </h2>

        <SingleOrderDetailTags order={order} />

        <DetailsPanel label="Order">
          <SingleOrderDetailsOrder order={order} />
        </DetailsPanel>
        <DetailsPanel label="Shipping">
          <SingleOrderDetailsShipping order={order} />
        </DetailsPanel>
        <DetailsPanel label="Products">
          <SingleOrderDetailProducts order={order} />
        </DetailsPanel>
        <DetailsPanel label="Customer">
          <SingleOrderDetailsCustomer order={order} />
        </DetailsPanel>
        <DetailsPanel label="Attention Needed Messages" initiallyExpanded={false}>
          <SingleOrderDetailsAttentionMessages attentionMessages={order.attention_messages} />
        </DetailsPanel>
      </>
    );
  }, [order, isLoading, isError]);
};

export default SingleOrderDetails;
