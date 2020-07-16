import React from 'react';

import { orderType } from '~/types';
import EstDate, { dateTimeFormats } from '~/components/common/EstDate';

import LineDetailBasic from '../LineDetail/LineDetailBasic';

const SingleOrderDetailsOrder = ({ order }) => {
  const formatProp = {
    format: dateTimeFormats.long,
  };

  return (
    <>
      <LineDetailBasic label="Warehouse" value={order.warehouse.name} />
      <LineDetailBasic label="Ordered At" value={<EstDate format={dateTimeFormats.short} value={order.order_date} />} />
      <LineDetailBasic label="Invoice Number" value={order.invoice_number} />

      <LineDetailBasic label="Hold Until" value={<EstDate {...formatProp} value={order.order_hold_until} />} />
      <LineDetailBasic label="Released Date" value={<EstDate {...formatProp} value={order.order_released_date} />} />
      <LineDetailBasic label="Shipped At" value={<EstDate {...formatProp} value={order.shipped_at} />} />
      <LineDetailBasic label="Canceled At" value={<EstDate {...formatProp} value={order.canceled_at} />} />
      <LineDetailBasic label="DC Pulled At" value={<EstDate {...formatProp} value={order.dc_pulled_at} />} />
      <LineDetailBasic label="Ship From" value={<EstDate format={dateTimeFormats.short} value={order.ship_range_start} />} />
      <LineDetailBasic label="Ship Until" value={<EstDate format={dateTimeFormats.short} value={order.ship_range_end} />} />

      <LineDetailBasic label="Dry Ice" value={order.dry_ice} />
      <LineDetailBasic label="TNT" value={order.tnt} />
      <LineDetailBasic label="Priority" value={order.priority} />
      <LineDetailBasic label="Process" value={order.process} />
      <LineDetailBasic label="No Saturday Delivery" value={order.no_saturday_delivery ? 'Y' : 'N'} />
      <LineDetailBasic label="No Saturday Express" value={order.no_saturday_express ? 'Y' : 'N'} />
      <LineDetailBasic label="No Saturday OnTrac" value={order.no_saturday_ontrac ? 'Y' : 'N'} />
      <LineDetailBasic label="No Saturday GLS" value={order.no_saturday_gls ? 'Y' : 'N'} />
      <LineDetailBasic label="Dimensions" value={order.dimensions} />
      <LineDetailBasic label="Weight" value={order.weight} />
      <LineDetailBasic label="Box Type" value={order.is_custom ? 'Custom' : 'Curated'} />
      <LineDetailBasic label="Includes Addons" value={order.includes_addons ? 'Y' : 'N'} />
      <LineDetailBasic label="On Load" value={order.onload_at ? 'Y' : 'N'} />
      <LineDetailBasic label="Is Residential" value={order.is_residential ? 'Y' : 'N'} />
      <LineDetailBasic label="Is Reship" value={order.is_reship ? 'Y' : 'N'} />
    </>
  );
};

SingleOrderDetailsOrder.propTypes = {
  order: orderType.isRequired,
};

export default SingleOrderDetailsOrder;
