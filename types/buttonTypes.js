/* eslint-disable import/prefer-default-export */
import PropTypes from 'prop-types';

export const buttonDisabledType = PropTypes.oneOfType([
  PropTypes.bool,
  PropTypes.arrayOf(PropTypes.bool),
  PropTypes.arrayOf([
    PropTypes.bool,
    PropTypes.func,
  ]),
]);
