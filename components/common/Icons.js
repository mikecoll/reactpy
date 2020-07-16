import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const commonClasses = 'px-1 cursor-pointer';

const baseIconPropTypes = {
  className: PropTypes.string,
};
const baseIconDefaultProps = {
  className: null, /* eslint-disable-line react/default-props-match-prop-types */
};

const generateIcon = (iconClass) => {
  const Component = ({ className, ...restProps }) => (
    <i
      {...restProps}
      className={classNames(commonClasses, iconClass, className)}
    />
  );

  Component.defaultProps = baseIconDefaultProps;
  Component.propTypes = baseIconPropTypes;

  return Component;
};

export const SelectAll = generateIcon('fa fa-check-double');
export const Trash = generateIcon('fa fa-trash');
export const Clear = generateIcon('fa fa-stream');
export const Copy = generateIcon('far fa-copy');
export const LongArrowRight = generateIcon('fas fa-long-arrow-right');

export const Beef = generateIcon('fas fa-hamburger');
export const Chicken = generateIcon('fas fa-drumstick-bite');
export const Bacon = generateIcon('fas fa-bacon');
export const Box = generateIcon('fas fa-box-open');
export const HotDog = generateIcon('fas fa-hotdog');
export const Fish = generateIcon('fas fa-fish');
export const Pork = generateIcon('fas fa-piggy-bank');
export const OtherBoxItem = generateIcon('fas fa-utensils');
export const Substitution = generateIcon('fas fa-exchange-alt');

export const ChevronUp = generateIcon('fas fa-chevron-up');
export const ChevronDown = generateIcon('fas fa-chevron-down');

export const Accordion = ({ className, expanded, ...restProps }) => (
  <i
    {...restProps}
    className={classNames(
      commonClasses,
      'fas',
      expanded ? 'fa-chevron-up' : 'fa-chevron-down',
      className,
    )}
  />
);
Accordion.defaultProps = baseIconDefaultProps;
Accordion.propTypes = {
  ...baseIconPropTypes,
  expanded: PropTypes.bool.isRequired,
};

export const Refresh = ({ className, refreshing, ...restProps }) => (
  <i
    {...restProps}
    className={classNames(
      commonClasses,
      'fas fa-sync',
      refreshing && 'fa-spin',
      className,
    )}
  />
);
Refresh.defaultProps = {
  ...baseIconDefaultProps,
  refreshing: false,
};
Refresh.propTypes = {
  ...baseIconPropTypes,
  refreshing: PropTypes.bool,
};
