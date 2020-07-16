import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import classNames from 'classnames';
import { isString, isArray } from 'lodash';

import { buttonDisabledType } from '~/types';
import someDisabled from '~/utilities/someDisabled';

// const baseClass = 'btn p-2 px-3 shadow uppercase text-xs lg:text-sm';
export const buttonBaseClass = {
  btn: true,
  'p-2': true,
  'px-3': true,
  uppercase: true,
  'text-xs': true,
  'xl:text-sm': true,
};

const classStrToObj = (str) => {
  let retObj = str;
  if (isString(retObj)) {
    retObj = retObj.split(' ');
  }

  if (isArray(retObj)) {
    retObj = retObj.reduce(
      (acc, c) => ({ ...acc, [c]: true }),
      {},
    );
  }

  return retObj;
};

const Button = React.forwardRef((props, ref) => {
  const {
    className: propsClassName,
    disabled,
    border,
    rounded,
    variant,
    type,
    ...otherProps
  } = props;

  // if any of the disabled are/return `true` the button should be disabled
  const isDisabled = someDisabled(disabled);

  const variantClasses = useMemo(() => {
    switch (variant) {
      case 'primary':
      case 'solid-blue':
        return 'bg-blue-dark text-white bg-white hover:bg-blue-darker';
      case 'blue':
        return 'bg-white text-blue-dark hover:bg-grey-lighter';
      case 'warning':
      case 'orange':
        return 'bg-white text-orange-dark hover:bg-grey-lighter';
      case 'outline':
        return 'bg-transparent border-white text-white hover:opacity-75';
      default:
        return 'bg-white text-grey-darkest';
    }
  }, [variant]);

  const className = useMemo(() => {
    const variantClass = classStrToObj(
      isDisabled
        ? 'disabled bg-grey-lightest cursor-default text-grey'
        : variantClasses,
    );

    const baseBtnClass = {
      ...buttonBaseClass,
      ...variantClass,
    };

    if (!propsClassName) {
      return baseBtnClass;
    }

    const classNameObj = classStrToObj(propsClassName);

    return {
      ...baseBtnClass,
      ...classNameObj,
    };
  }, [propsClassName, isDisabled]);

  return (
    <button // eslint-disable-line
      {...otherProps}
      ref={ref}
      type={type}
      disabled={isDisabled}
      className={classNames(
        className,
        border && 'border',
        rounded && 'rounded',
      )}
    />
  );
});

Button.defaultProps = {
  disabled: false,
  className: null,
  border: false,
  rounded: false,
  variant: 'default',
  type: 'button',
};

Button.propTypes = {
  disabled: buttonDisabledType,
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
  ]),
  border: PropTypes.bool,
  rounded: PropTypes.bool,
  variant: PropTypes.string,
  type: PropTypes.string,
};

export default Button;
