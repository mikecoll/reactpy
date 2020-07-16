/* eslint-disable import/prefer-default-export */
import PropTypes from 'prop-types';

export const orderFlagsType = PropTypes.shape({
  has_shipped: PropTypes.bool,
  has_released: PropTypes.bool,
  has_canceled: PropTypes.bool,
  has_staged: PropTypes.bool,
  has_onLoad: PropTypes.bool,
});
