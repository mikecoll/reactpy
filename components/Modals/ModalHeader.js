import React from 'react';
import PropTypes from 'prop-types';

import CloseButton from './CloseButton';

const ModalHeader = ({ title, handleModalClose }) => (
  <div className="flex items-center justify-between pb-3">
    <h1 className="font-normal mr-8 text-grey-darkest">
      {title}
    </h1>
    <CloseButton onClick={handleModalClose} />
  </div>
);

ModalHeader.propTypes = {
  title: PropTypes.string.isRequired,
  handleModalClose: PropTypes.func.isRequired,
};

export default ModalHeader;
