import React from 'react';
import PropTypes from 'prop-types';
import { useKey } from 'react-use';

const CloseButton = React.memo(({ onClick }) => {
  useKey('Escape', onClick);

  return (
    <i // eslint-disable-line
      className="fas fa-times cursor-pointer text-grey"
      onClick={onClick}
      role="button"
      tabIndex="0"
    />
  );
});

CloseButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default CloseButton;
