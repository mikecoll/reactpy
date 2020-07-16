import PropTypes from 'prop-types';
import React, { useCallback } from 'react';

import { useKeyPressEvent } from 'react-use';
import ModalFooter from '../ModalFooter';
import CloseButton from '../CloseButton';

import pluralizeOrder from '~/utilities/pluralizeOrder';

const ReleaseOrdersModal = React.forwardRef(({
  error, handleModalClose, onUpdate, selectedOrders,
}, ref) => {
  const handleSubmit = useCallback(() => onUpdate({ shouldRelease: true }));

  // hotkey the enter key to release orders
  useKeyPressEvent('Enter', handleSubmit);

  return (
    <form onSubmit={handleSubmit} ref={ref}>
      <div className="flex items-center justify-between p-4">
        <h2 className="font-normal mr-8 text-grey-darkest">
          {`Release ${pluralizeOrder(selectedOrders)}`}
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
        handleSubmit={() => onUpdate({ shouldRelease: true })}
        ctaLabel="Release"
      />
    </form>
  );
});

ReleaseOrdersModal.defaultProps = {
  error: '',
};

ReleaseOrdersModal.propTypes = {
  error: PropTypes.string,
  handleModalClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  selectedOrders: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default ReleaseOrdersModal;
