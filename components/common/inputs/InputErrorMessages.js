import React from 'react';
import PropTypes from 'prop-types';
import { isString } from 'lodash';

import InputErrorLine from './InputErrorLine';

export const ErrorPropType = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.shape({
    message: PropTypes.string,
    type: PropTypes.string,
    ref: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Element),
    ]),
  }),
]);

const InputErrorMessages = React.memo(({ error }) => error && (
  <InputErrorLine
    message={isString(error) ? error : error.message || null}
    type={error.type || null}
    inputRef={error.ref || null}
  />
));

InputErrorMessages.defaultProps = {
  error: null,
};

InputErrorMessages.propTypes = {
  error: ErrorPropType,
};

export default InputErrorMessages;
