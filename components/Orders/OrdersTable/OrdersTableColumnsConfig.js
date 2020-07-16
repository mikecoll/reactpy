
import moment from 'moment';
import 'moment-timezone';
import { utcToEst, timeZoneString } from '~/components/common/EstDate';

const OrdersTableColumnsConfig = [
  {
    label: 'Number',
    orderBy: 'order_number',
    orderKey: 'order_number',
  },
  {
    label: 'DC',
    orderBy: 'warehouse_id',
    orderKey: 'warehouse',
  },
  {
    label: 'Ordered',
    orderBy: 'order_date',
    orderKey: 'order_date',
    modifyDisplay: dateString => (
      utcToEst(dateString) // default to dateTimeFormats.short
    ),
  },
  {
    label: 'Age',
    orderBy: 'order_date',
    orderKey: 'age',
    modifyDisplay: dateString => (
      moment.utc(dateString).tz(timeZoneString).fromNow()
    ),
  },
  {
    label: 'ST',
    orderBy: 'order_customer_shipping.customer_state',
    orderKey: 'order_customer_shipping.customer_state',
  },
  {
    label: 'Zip',
    orderBy: 'order_customer_shipping.customer_postal_code',
    orderKey: 'order_customer_shipping.customer_postal_code',
    modifyDisplay: zip => zip.substring(0, 5),
  },
  {
    label: 'Carrier',
    orderBy: 'order_shipping.carrier_code',
    orderKey: 'shipping.carrier_code',
  },
  {
    label: 'Service',
    orderBy: 'order_shipping.service_code',
    orderKey: 'shipping.service_code',
  },
  {
    label: 'Ice',
    orderBy: 'dry_ice',
    orderKey: 'dry_ice',
  },
  {
    label: 'TNT',
    orderBy: 'tnt',
    orderKey: 'tnt',
  },
  {
    label: 'PRIO',
    orderBy: 'priority',
    orderKey: 'priority',
  },
  {
    label: 'RROC',
    orderBy: 'process',
    orderKey: 'process',
  },
];

export default OrdersTableColumnsConfig;
