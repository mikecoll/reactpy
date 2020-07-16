import {
  oneOfType,
  arrayOf,
  bool,
  instanceOf,
  number,
  shape,
  string,
  func,
  node,
} from 'prop-types';

export * from './buttonTypes';
export * from './orderFlagsType';

export const attentionMessageType = shape({
  brand: string.isRequired,
  created_at: string.isRequired,
  order_message: string.isRequired,
  order_message_json: string.isRequired,
  order_number: string.isRequired,
  order_status: string.isRequired,
  updated_at: string.isRequired,
});

export const abbreviatedOrderType = shape({
  id: number.isRequired,
  warehouse: string.isRequired,
  order_number: string.isRequired,
  order_date: string.isRequired,
  age: string.isRequired,
  shipped_at: string, // nullable
  dry_ice: string.isRequired,
  tnt: string.isRequired,
  priority: string.isRequired,
  process: string.isRequired,
  shipping: shape({
    carrier_code: string.isRequired,
    service_code: string.isRequired,
    line_haul: string.isRequired,
  }).isRequired,
  attention_messages: arrayOf(attentionMessageType),
  tags: arrayOf(string),
});

export const customerShippingType = shape({
  id: number.isRequired,
  email: string.isRequired,
  name: string.isRequired,
  street_1: string.isRequired,
  street_2: string,
  city: string.isRequired,
  state: string.isRequired,
  postal_code: string.isRequired,
  country: string.isRequired,
  phone: string,
});

export const messageType = shape({
  id: number.isRequired,
  delivery_notes: string,
  gift_message: string,
});

export const orderProductQuantitiesType = arrayOf(shape({
  name: string.isRequired,
  sku: string.isRequired,
  quantity: string.number,
}));

export const ordersType = arrayOf(abbreviatedOrderType);

export const orderProductType = shape({
  product_id: number.isRequired,
  name: string.isRequired,
  product_type: string, // nullable
  meat_group: string,
  sku: string.isRequired,
  quantity: number.isRequired,
});

export const substitutionType = shape({
  order_id: number.isRequired,
  product_type: string, // nullable
  original_product_id: number.isRequired,
  replacement_product_id: number.isRequired,
  quantity: number.isRequired,
  created_at: string.isRequired,
  updated_at: string.isRequired,
});

export const shippingType = shape({
  id: number.isRequired,
  carrier_code: string.isRequired,
  service_code: string.isRequired,
});

export const trackingsType = arrayOf(shape({
  id: number.isRequired,
  tracking_number: string.isRequired,
}));

export const warehouseType = shape({
  id: number.isRequired,
  name: string.isRequired,
});

export const orderType = shape({
  id: number.isRequired,
  warehouse: warehouseType.isRequired,
  order_number: string.isRequired,
  order_date: string.isRequired,
  invoice_number: string.isRequired,
  order_hold_until: string,
  order_released_date: string,
  shipped_at: string,
  dry_ice: string.isRequired,
  tnt: string.isRequired,
  priority: string.isRequired,
  process: string.isRequired,
  no_saturday_delivery: bool.isRequired,
  no_saturday_express: bool.isRequired,
  no_saturday_ontrac: bool.isRequired,
  no_saturday_gls: bool.isRequired,
  dimensions: oneOfType([
    number,
    string,
  ]).isRequired,
  weight: number.isRequired,
  is_custom: bool.isRequired,
  includes_addons: bool.isRequired,
  is_residential: bool.isRequired,
  customer_shipping: customerShippingType.isRequired,
  message: messageType.isRequired,
  products: arrayOf(orderProductType).isRequired,
  substitutions: arrayOf(substitutionType).isRequired,
  shipping: shippingType.isRequired,
  trackings: trackingsType.isRequired,
});

export const ordersTableColumnsConfigType = shape({
  label: string.isRequired,
  orderBy: string.isRequired,
  orderKey: string.isRequired,
  modifyDisplay: func,
});

export const childrenType = oneOfType([
  arrayOf(node),
  node,
]);
