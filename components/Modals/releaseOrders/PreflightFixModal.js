import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { usePrevious } from 'react-use';

import CloseButton from '../CloseButton';

const PreflightFixModal = React.memo(({
  handleModalClose,
  onUpdate,
  selectedOrders,
  innerRef,
  ModalHeader,
  ModalBody,
  releaseUponSelectedOrdersChange,
}) => {
  /* Re-atempt to release if the selectedOrders changes
   * (eg when/if orders that fail preflights are removed from the selection
   *  we will trigger the re-release)
   */
  const prevSelectedOrders = usePrevious(selectedOrders);
  useEffect(() => {
    if (
      releaseUponSelectedOrdersChange
      && prevSelectedOrders && prevSelectedOrders !== selectedOrders
    ) {
      onUpdate({ shouldRelease: true });
    }
  }, [selectedOrders]);

  return (
    <div ref={innerRef} className="flex flex-col max-w-lg">
      <div className="flex items-center justify-between p-4">
        <h1 className="font-normal mr-8 text-grey-darkest">
          {ModalHeader}
        </h1>
        <CloseButton onClick={handleModalClose} />
      </div>
      <div className="p-4">
        {ModalBody}
      </div>
    </div>
  );
});

PreflightFixModal.defaultProps = {
  releaseUponSelectedOrdersChange: true,
};

PreflightFixModal.propTypes = {
  handleModalClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  selectedOrders: PropTypes.arrayOf(PropTypes.number).isRequired,
  innerRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }).isRequired,
  ModalHeader: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.node,
  ]).isRequired,
  ModalBody: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.node,
  ]).isRequired,
  releaseUponSelectedOrdersChange: PropTypes.bool,
};

export default PreflightFixModal;
