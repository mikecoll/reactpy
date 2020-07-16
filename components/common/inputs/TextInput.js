import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import InputErrorMessages, { ErrorPropType } from './InputErrorMessages';
import InputLabel from './InputLabel';

const TextInput = React.forwardRef((props, ref) => {
  const {
    error, handleChange, label, name,
    value, disabled, textArea, className,
    type,
    ...restProps
  } = props;

  const inputProps = {
    ...restProps,
    className: 'bg-grey-lighter p-2 rounded text-sm',
    id: name,
    name,
    onChange: handleChange,
    type,
    value: value || '',
    disabled,
    ref,
  };

  /* @NOTE: Because value can be undefied,
    *         simply binding `value={value}` causes a react error
    *         because technically it is switching between a controlled
    *         and uncontrolled element — which should not be done; thus
    *         the `value={value || ''}` is necessary.
    */
  return (
    <div className={classNames(className)}>
      {label && (
        <InputLabel name={name}>
          {label}
        </InputLabel>
      )}
      {textArea ? <textarea {...inputProps} /> : <input {...inputProps} />}

      {error && <InputErrorMessages error={error} />}
    </div>
  );
});

TextInput.defaultProps = {
  error: null,
  disabled: false,
  value: null,
  textArea: false,
  className: null,
  type: 'text',
};

TextInput.propTypes = {
  error: ErrorPropType,
  handleChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  textArea: PropTypes.bool,
  className: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),
  type: PropTypes.string,
};

export default TextInput;
