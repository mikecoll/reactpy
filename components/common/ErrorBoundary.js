import React from 'react';
import PropTypes from 'prop-types';

import { Error as ErrorAlert } from './Alert';

export const ErrorBoundaryFallbackComponent = props => (
  <ErrorAlert {...props} />
);

// @NOTE: as of 8.9.19 ErrorBoundareis require class based React components
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      info: null,
    };
  }

  componentDidCatch(error, info) {
    const { onError } = this.props;

    if (typeof onError === 'function') {
      try {
        onError.call(this, error, info ? info.componentStack : '');
      } catch (ignoredError) {
        console.info('ErrorBoundary Ignored error', { ignoredError }); // eslint-disable-line
      }
    }

    this.setState({ error, info });
  }

  render() {
    const { children, FallbackComponent } = this.props;
    const { error, info } = this.state;

    if (error !== null) {
      return (
        <FallbackComponent
          componentStack={info ? info.componentStack : ''}
          error={error}
        />
      );
    }

    return children || null;
  }
}

ErrorBoundary.defaultProps = {
  FallbackComponent: ErrorBoundaryFallbackComponent,
  onError: null,
};

ErrorBoundary.propTypes = {
  FallbackComponent: PropTypes.any, // eslint-disable-line
  onError: PropTypes.func,
  children: PropTypes.any.isRequired // eslint-disable-line
};

export default ErrorBoundary;

export const withErrorBoundary = (
  Component,
  FallbackComponent,
  onError,
) => {
  const Wrapped = props => (
    <ErrorBoundary FallbackComponent={FallbackComponent} onError={onError}>
      <Component {...props} />
    </ErrorBoundary>
  );

  // Format for display in DevTools
  const name = Component.displayName || Component.name;
  Wrapped.displayName = name
    ? `WithErrorBoundary(${name})`
    : 'WithErrorBoundary';

  return Wrapped;
};
