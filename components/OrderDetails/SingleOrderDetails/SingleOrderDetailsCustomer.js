import React from 'react';

import { orderType } from '~/types';

import LineDetailBasic from '../LineDetail/LineDetailBasic';
import MultipleLineDetail from '../MultipleLineDetail';

const SingleOrderDetailsCustomer = ({ order }) => (
  <>
    <LineDetailBasic label="Email" value={order.customer_shipping.email} />
    <LineDetailBasic label="Name" value={order.customer_shipping.name} />
    <LineDetailBasic label="Street Address 1" value={order.customer_shipping.street_1} />
    <LineDetailBasic label="Street Address 2" value={order.customer_shipping.street_2} />
    <LineDetailBasic label="City" value={order.customer_shipping.city} />
    <LineDetailBasic label="State" value={order.customer_shipping.state} />
    <LineDetailBasic label="Postal Code" value={order.customer_shipping.postal_code} />
    <LineDetailBasic label="Country" value={order.customer_shipping.country} />
    <LineDetailBasic label="Phone Number" value={order.customer_shipping.phone} />
    <MultipleLineDetail label="Delivery Notes" value={order.message.delivery_notes} />
    <MultipleLineDetail label="Gift Message" value={order.message.gift_message} />
  </>
);

SingleOrderDetailsCustomer.propTypes = {
  order: orderType.isRequired,
};

export default SingleOrderDetailsCustomer;
