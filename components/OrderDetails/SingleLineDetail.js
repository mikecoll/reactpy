import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

const LineDetailBasic = (props) => {
  const {
    label,
    value,
    shouldColorize,
    color,
    percent,
    normalizedPercent,
    total,
    onClick,
    ...restProps
  } = props;

  const bgPercentStyle = {
    width: `${parseFloat(normalizedPercent).toFixed(2)}%`,
  };

  return (
    <div
      className={classNames(
        'relative h-8 border-t',
        onClick && 'cursor-pointer',
      )}
      onClick={onClick || null}
    >
      <div className="absolute w-full py-2 px-1 z-10 text-sm text-grey-darkest">
        <span className="">
          {label}
        </span>
        <span className="float-right">
          {value}
        </span>
      </div>

      {shouldColorize && (
        <div
          className={classNames(
            'absolute h-6 mt-1 pin z-auto rounded-sm opacity-50',
            `bg-${color}`,
          )}
          style={bgPercentStyle}
        />
      )}
    </div>
  );
};

LineDetailBasic.defaultProps = {
  label: '[label not provided]',
  value: '',
  percent: 0.0,
  normalizedPercent: 0.0,
  color: 'blue',
  shouldColorize: false,
  total: 0,
  onClick: null,
};

LineDetailBasic.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.element,
    PropTypes.node,
  ]),
  percent: PropTypes.number,
  normalizedPercent: PropTypes.number,
  total: PropTypes.number,
  color: PropTypes.string,
  shouldColorize: PropTypes.bool,
  onClick: PropTypes.func,
};

export default LineDetailBasic;
