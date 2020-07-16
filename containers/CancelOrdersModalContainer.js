import PropTypes from 'prop-types';
import React from 'react';
import { get } from 'lodash';

import CancelOrdersModal from '../components/Modals/CancelOrders';

import { createCanceledOrders } from '../utilities/api';

class CancelOrdersModalContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const { selectedOrders, toastManager } = this.props;
    createCanceledOrders(selectedOrders)
      .then(() => {
        const { onUpdate } = this.props;

        const message = (selectedOrders.length === 1)
          ? 'Successfully Canceled Order'
          : `Successfully Canceled ${selectedOrders.length} Orders`;

        toastManager.add(message, { appearance: 'success', autoDismiss: true });
        onUpdate();
      })
      .catch((error) => {
        const message = get(error, 'response.data.errors.selectedOrders.0', error);
        this.setState({ error: message });
        toastManager.add(
          `Error: Failed to Cancel Order(s): '${message}'`,
          { appearance: 'error', autoDismiss: true },
        );
      });
  }

  render() {
    const { innerRef } = this.props;

    return (
      <CancelOrdersModal
        {...this.props}
        {...this.state}
        ref={innerRef}
        handleSubmit={this.handleSubmit}
      />
    );
  }
}

CancelOrdersModalContainer.propTypes = {
  handleModalClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  selectedOrders: PropTypes.arrayOf(PropTypes.number).isRequired,
  toastManager: PropTypes.shape({
    add: PropTypes.func,
  }).isRequired,
  innerRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }).isRequired,
};

export default CancelOrdersModalContainer;
