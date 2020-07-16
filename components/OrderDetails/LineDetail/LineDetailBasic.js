import PropTypes from 'prop-types';
import React from 'react';

export const lineDetailWrapperClass = 'flex justify-between py-2 px-1 z-10 text-sm text-grey-darkest';

const LineDetailBasic = (props) => {
  const {
    label,
    value,
    shouldColorize,
    color,
    normalizedPercent,
    onClick,
  } = props;

  const bgPercentStyle = {
    width: `${parseFloat(normalizedPercent).toFixed(2)}%`,
  };

  return (
    <div className="relative h-8 border-t" onClick={onClick}>
      {shouldColorize && (
        <div
          className={
            `absolute h-6 mt-1 pin z-auto rounded-sm opacity-50 bg-${color}`
          }
          style={bgPercentStyle}
        />
      )}

      <div className={lineDetailWrapperClass}>
        <div className="relative truncate">
          {label}
        </div>
        <div className="relative float-right text-right">
          {value}
        </div>
      </div>

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
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
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
