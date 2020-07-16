import React from 'react';
import PropTypes from 'prop-types';

const InputLabel = (props) => {
  const { name } = props;

  return (
    <label
      className="block mb-1 text-grey-darker text-xs uppercase"
      htmlFor={name}
      {...props}
    />
  );
};

InputLabel.propTypes = {
  name: PropTypes.string.isRequired,
};

export default InputLabel;
