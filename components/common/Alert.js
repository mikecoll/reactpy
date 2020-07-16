import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Button from './Button';

export const AlertTypes = {
  info: 'info',
  success: 'success',
  warning: 'warning',
  danger: 'danger',
  // convince mapping for errror => danger
  error: 'danger',
  // convince mapping for notice => info
  notice: 'info',
};

const Alert = React.forwardRef(({ type, className, ...rest }, ref) => {
  const alertType = AlertTypes[type] || 'info';

  return (
    <div
      ref={ref}
      className={classNames(
        'p-4 mt-0 rounded font-light',
        alertType === AlertTypes.info && 'bg-teal text-white',
        alertType === AlertTypes.success && 'bg-green text-white',
        alertType === AlertTypes.warning && 'bg-orange text-white',
        alertType === AlertTypes.danger && 'bg-red text-white',
        className,
      )}
      {...rest}
    />
  );
});

Alert.defaultProps = {
  type: 'info',
  className: '',
};

Alert.propTypes = {
  type: PropTypes.oneOf(Object.keys(AlertTypes)),
  className: PropTypes.string,
};

// @NOTE: this is specifically designed to be used with:
//       ./ErrorBoundary.ErrorBoundaryFallbackComponent
export const Error = ({ error, componentStack }) => {
  const [expanded, setExpanded] = useState(false);

  const message = (error && error.toString()) || null;

  return (
    <Alert type="warning">
      <h3 className="pb-2">
        {!message.includes('Error') && 'Error:'}
        {message && ` ${message}`}
      </h3>

      {componentStack && (
        <>
          <Button onClick={() => setExpanded(!expanded)}>
            {expanded ? 'Hide' : 'View'}
            {' '}
            Error Details
          </Button>
          {expanded && (
            <pre className="p-2 overflow-y-scroll">
              {componentStack}
            </pre>
          )}
        </>

      )}
    </Alert>
  );
};

Error.defaultProps = {
  componentStack: null,
};

Error.propTypes = {
  error: PropTypes.any.isRequired, // eslint-disable-line
  componentStack: PropTypes.any, // eslint-disable-line
};

export default Alert;
