import React, { useMemo } from 'react';

import { orderType } from '~/types';
import EstDate, { dateTimeFormats } from '~/components/common/EstDate';

import LineDetailBasic from '../LineDetail/LineDetailBasic';

const SingleOrderDetailsShipping = ({ order }) => {
  const trackingNumbers = useMemo(
    () => order.trackings
      .map(tracking => tracking.tracking_number)
      .join(', '),
    [order.trackings],
  );

  return (
    <>
      <LineDetailBasic label="Carrier" value={order.shipping.carrier_code} />
      <LineDetailBasic label="Carrier Service" value={order.shipping.service_code} />
      <LineDetailBasic label="Line Haul" value={order.shipping.line_haul} />
      <LineDetailBasic label="Tracking Numbers" value={trackingNumbers} />
      <LineDetailBasic label="Ignore Address Validation" value={order.customer_shipping.ignore_validation ? 'Y' : 'N'} />
    </>
  );
};

SingleOrderDetailsShipping.propTypes = {
  order: orderType.isRequired,
};

export default SingleOrderDetailsShipping;
