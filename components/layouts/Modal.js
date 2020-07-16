import PropTypes from 'prop-types';
import React from 'react';

const Modal = ({ children }) => (
  <div className="fixed flex flex-col pin z-50">
    <div className="bg-grey-darkest fixed opacity-25 pin" />
    <div className="bg-white border m-auto relative rounded shadow max-h-screen overflow-scroll">
      {children}
    </div>
  </div>
);

Modal.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Modal;
