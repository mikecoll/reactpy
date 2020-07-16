import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import { childrenType } from '../../types';

const baseClass = 'rounded border';

const ButtonGroup = React.forwardRef((props, ref) => {
  const {
    children,
    className,
    vertical,
    ...otherProps
  } = props;

  return (
    <div
      {...otherProps}
      ref={ref}
      className={classNames(
        baseClass,
        vertical
          ? 'btn-group-vertical z-10'
          : 'btn-group',
        className,
      )}
    >
      {children}
    </div>
  );
});

ButtonGroup.defaultProps = {
  vertical: false,
  className: '',
};

ButtonGroup.propTypes = {
  className: PropTypes.string,
  vertical: PropTypes.bool,
  children: childrenType.isRequired,
};

export default ButtonGroup;
