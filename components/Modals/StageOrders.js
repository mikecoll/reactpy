import PropTypes from 'prop-types';
import React from 'react';

import ModalFooter from './ModalFooter';

import CloseButton from './CloseButton';

import pluralizeOrder from '../../utilities/pluralizeOrder';
import { Error as AlertError } from '~/components/common/Alert';

const StageOrdersModal = React.forwardRef(({
  error, handleModalClose, handleSubmit, selectedOrders,
}, ref) => (
  <form onSubmit={handleSubmit} ref={ref}>
    <div className="flex items-center justify-between p-4">
      <h2 className="font-normal mr-8 text-grey-darkest">
        {`Stage ${pluralizeOrder(selectedOrders)}`}
      </h2>
      <CloseButton onClick={handleModalClose} />
    </div>
    {error && (
      <AlertError error={error.message} />
    )}
    <ModalFooter
      handleModalClose={handleModalClose}
      handleSubmit={handleSubmit}
      ctaLabel={`Stage ${pluralizeOrder(selectedOrders)}`}
    />
  </form>
));

StageOrdersModal.defaultProps = {
  error: '',
};

StageOrdersModal.propTypes = {
  error: PropTypes.string,
  handleModalClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  selectedOrders: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default StageOrdersModal;
