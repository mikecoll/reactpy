import PropTypes from 'prop-types';
import React from 'react';

import ModalFooter from './ModalFooter';

import CloseButton from './CloseButton';

import pluralizeOrder from '../../utilities/pluralizeOrder';

const CancelOrdersModal = React.forwardRef(({
  error, handleModalClose, handleSubmit, selectedOrders,
}, ref) => (
  <form onSubmit={handleSubmit} ref={ref}>
    <div className="flex items-center justify-between p-4">
      <h2 className="font-normal mr-8 text-grey-darkest">
        {`Cancel ${pluralizeOrder(selectedOrders)}`}
      </h2>
      <CloseButton onClick={handleModalClose} />
    </div>
    {error && (
      <div className="mb-4 px-4">
        <p className="text-red text-xs">{error}</p>
      </div>
    )}
    <ModalFooter
      handleModalClose={handleModalClose}
      handleSubmit={handleSubmit}
      saveAndActionShouldShow={false}
      ctaLabel={`Cancel ${pluralizeOrder(selectedOrders)}`}
    />
  </form>
));

CancelOrdersModal.defaultProps = {
  error: '',
};

CancelOrdersModal.propTypes = {
  error: PropTypes.string,
  handleModalClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  selectedOrders: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default CancelOrdersModal;
