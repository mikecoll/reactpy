import { isNumber } from 'lodash';

const pluralizeOrder = (ordersAry, verb = 'Order', forceShowNumber = false) => {
  const len = (isNumber(ordersAry))
    ? ordersAry
    : ordersAry.length;

  if (!forceShowNumber && len === 1) {
    return verb;
  }

  return `${len} ${verb}${(len > 1) ? 's' : ''}`;
};

export default pluralizeOrder;
