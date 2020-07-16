import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { startCase } from 'lodash';

const InputErrorMessage = React.memo(
  ({ name, type }) => {
    const options = {
      required: `${startCase(name)} is ${type}`,
      positive: `${startCase(name)} must be positive.`,
      default: `Fix ${startCase(name)} ${type}`,
    };

    return (type && options[type])
      ? options[type]
      : options.default;
  },
);

InputErrorMessage.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

const InputErrorLine = ({ message = null, type = null, inputRef = null }) => {
  const { name: inputRefName } = inputRef;

  return (
    <p
      onClick={() => inputRef && inputRef.focus()}
      className={classNames(
        'mt-1 text-red text-xs',
        inputRef && 'cursor-pointer',
        type,
      )}
    >
      {message && message}
      {!message && inputRef && <InputErrorMessage name={inputRefName} type={type} />}
    </p>
  );
};

InputErrorLine.defaultProps = {
  message: null,
  type: null,
  inputRef: null,
};

InputErrorLine.propTypes = {
  message: PropTypes.string,
  type: PropTypes.string,
  inputRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.instanceOf(Element),
    }),
  ]),
};

export default InputErrorLine;
