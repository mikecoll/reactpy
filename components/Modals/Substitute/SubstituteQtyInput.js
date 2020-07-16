import React from 'react';
import PropTypes from 'prop-types';

import { TextInput } from '~/components/common/inputs';


const SubstituteQtyInput = inputProps => (
  <TextInput
    {...inputProps}
    type="number"
  />
);

SubstituteQtyInput.defaultProps = {
  value: null,
  disabled: false,
};

SubstituteQtyInput.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,

  value: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  disabled: PropTypes.bool,
};

export default SubstituteQtyInput;
