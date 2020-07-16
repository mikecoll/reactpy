import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { isObject } from 'lodash';

import InputErrorMessages, { ErrorPropType } from './InputErrorMessages';
import InputLabel from './InputLabel';

const SelectInput = React.forwardRef((props, ref) => {
  const {
    error, handleChange, label, name, options,
    showEmptyOption, value, disabled, placeholder,
    className,
    ...restProps
  } = props;

  return (
    <div className={classNames(className)}>
      <InputLabel name={name}>
        {label}
      </InputLabel>
      <div className="select rounded">
        <select
          {...restProps}
          className={classNames(
            'bg-grey-lighter text-sm rounded',
            showEmptyOption && 'show-empty-option',
            (!value || value === '') && 'text-grey-darker',
          )}
          id={name}
          name={name}
          onChange={handleChange}
          value={value}
          disabled={disabled}
          ref={ref}
        >
          {showEmptyOption && (
            <option value="">
              {placeholder || `Select ${label}`}
            </option>
          )}
          {options.map((option, i) => (
            <option
              key={(isObject(option.value) ? i : option.value)}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>

        {error && <InputErrorMessages error={error} />}
      </div>


    </div>
  );
});

SelectInput.defaultProps = {
  showEmptyOption: true,
  placeholder: null,
  error: null,
  disabled: false,
  value: '',
};

SelectInput.propTypes = {
  error: ErrorPropType,
  handleChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired, // eslint-disable-line
  })).isRequired,
  showEmptyOption: PropTypes.bool,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  className: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),
};

export default SelectInput;
