import { get } from 'lodash';

import { ordersAggregateBase } from '../contexts/AggregateOrdersState';

function sumOrderProductQuantity(orderProductQuantity, acc) {
  const { sku, quantity } = orderProductQuantity;
  if (sku) {
    if (sku in acc) {
      acc[sku].quantity += quantity;
    } else {
      acc[sku] = orderProductQuantity;
    }
  }
}

function sumOrdersAggregate(orders, acc) {
  Object.keys(acc).forEach((key) => {
    acc[key] += get(orders, key, 0);
  });
}

function aggregateAggregateResponses(responses) {
  const result = responses.reduce((acc, response) => {
    const orderProducts = get(response, 'data.data.orderProducts');
    const orders = get(response, 'data.data.orders');

    orderProducts.forEach(orderProductQuantity => sumOrderProductQuantity(
      orderProductQuantity,
      acc.products,
    ));

    sumOrdersAggregate(orders, acc.orders);

    return acc;
  }, {
    products: {},
    orders: { ...ordersAggregateBase },
  });

  return {
    ...result,
    products: result.products,
  };
}

export default aggregateAggregateResponses;
