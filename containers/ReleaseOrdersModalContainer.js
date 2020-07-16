import React from 'react';
import PropTypes from 'prop-types';

import ReleaseOrdersModal from '../components/Modals/releaseOrders/ReleaseOrders';

const ReleaseOrdersModalContainer = (props) => {
  const {
    innerRef,
    ...restProps
  } = props;

  return (
    <ReleaseOrdersModal
      ref={innerRef}
      {...restProps}
    />
  );
};

ReleaseOrdersModalContainer.propTypes = {
  innerRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }).isRequired,
};

export default ReleaseOrdersModalContainer;
