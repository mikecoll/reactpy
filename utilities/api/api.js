/* eslint-disable no-undef */

export const getOrder = (id, flow = null) => (
  axios.get(route('api.orders.show', { order: id, flow }))
);

export const postOrderIds = filters => (
  axios.post(route('api.orders.order-ids'), filters)
);

export const postOrderNumbers = orderIds => (
  axios.post(route('api.orders.order-numbers'), { orderIds })
);

export const postDistinctProductIdsProductTypes = orderIds => (
  axios.post(route('api.orders.distinct-product-ids'), { orderIds })
);

export const updateOrder = (orderId, order) => (
  axios.put(route('api.orders.update', orderId), order)
);

export const createStagedOrders = orderIds => (
  axios.post(route('api.orders.stage'), { orderIds })
);

export const applyOrderRuleRunner = orderIds => (
  axios.post(route('api.orders.apply-order-rule-runner'), { orderIds })
);

export const createUnstagedOrders = orderIds => (
  axios.post(route('api.orders.unstage'), { orderIds })
);

export const getOrders = filters => (
  axios.post(route('api.orders.index'), filters)
);

export const getAggregateOrder = (orderIds, flow = null) => (
  axios.post(route('api.orders.aggregate', { flow }), { orderIds })
);

export const updateOrders = orders => (
  axios.put(route('api.orders.bulk-update'), orders)
);

export const createHeldOrders = (orderIds, orderHoldUntil) => (
  axios.post(route('api.orders.held'), { orderIds, orderHoldUntil })
);

export const releasedOrdersApi = {
  create: orderIds => (
    axios.post(route('api.orders.released'), { orderIds })
  ),
  preflight: {
    processZero: orderIds => (
      axios.post(route('api.orders.released.preflight.process-zero'), { orderIds })
    ),
    laserShip: orderIds => (
      axios.post(route('api.orders.released.preflight.lasership'), { orderIds })
    ),
  },
};

export const getCommonProducts = orderIds => (
  axios.post(route('api.substitutions.common-products'), { orderIds })
);

export const createSubstitutions = (
  orderIds,
  originalProductId,
  replacementProductId,
) => (
    axios.post(route('api.substitutions.create'), {
      orderIds,
      originalProductId,
      replacementProductId,
    })
  );

export const createAdvancedSubstitutions = args => (
  axios.post(route('api.substitutions.advanced'), { ...args })
);

export const createCanceledOrders = orderIds => (
  axios.post(route('api.orders.canceled'), { orderIds })
);

export const getOrdersExport = (orderIds, exportType) => (
  axios.post(route('api.orders.export'), {
    orderIds,
    exportType,
  })
);

export const updateUserPreference = (userId, data) => (
  axios.put(route('api.users.update', { id: userId }), data)
);

export const getUser = () => (
  axios.get(route('api.get-user'))
);

export const getShippingCarrierServices = () => (
  axios.get(route('api.shipping-carrier-services.index'))
);

export const getLineHaulOptions = () => (
  axios.get(route('api.line-haul-options'))
);

export const getOrderProductsProductTypes = () => (
  axios.get(route('api.order-products.product-types'))
);

export const getProductQuantities = ({ flow }) => (
  axios.get(route('api.product-quantities.index', {
    flow,
  }))
);

export const zipTablesUploadImport = payload => (
  axios.post(route('api.ziptable.import'), payload)
);

export const trackingUploadImport = payload => (
  axios.post(route('api.imports.tracking-numbers'), payload)
);
