import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Loading = React.forwardRef(({
  message, subMessage, size, className, icon,
}, ref) => (
  <div ref={ref} className="text-center p-8 font-thin">
    <div className="m-center">
      <span className={classNames(
        'text-gray-700',
        subMessage && 'pb-2',
        size === 'large' && 'text-3xl',
        size === 'medium' && 'text-2xl',
        size === 'small' && 'text-1xl',
        className,
      )}
      >
        <i className={classNames(
          icon || 'fas fa-cog',
          'fa-spin',
        )}
        />
        <span className="pl-2">
          { message || 'Loading' }
          {' ...'}
        </span>
        {subMessage && (
          <div className="text-gray-300 text-2xl pt-4">{subMessage}</div>
        )}
      </span>
    </div>
  </div>
));

Loading.defaultProps = {
  message: null,
  subMessage: null,
  size: 'large',
  className: null,
  icon: null,
};

Loading.propTypes = {
  subMessage: PropTypes.string,
  message: PropTypes.string,
  size: PropTypes.oneOf(['large', 'medium', 'small']),
  className: PropTypes.string,
  icon: PropTypes.string,
};

export default Loading;
