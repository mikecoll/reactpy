import PropTypes from 'prop-types';
import React from 'react';

import HoldOrdersModal from '../components/Modals/HoldOrders';

import { createHeldOrders } from '../utilities/api';

class HoldOrdersModalContainer extends React.Component {
  constructor() {
    super();

    this.state = {
      date: new Date(),
      error: null,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(date) {
    this.setState({ date });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { selectedOrders, toastManager } = this.props;
    const { date } = this.state;
    createHeldOrders(selectedOrders, date)
      .then(() => {
        const { onUpdate } = this.props;

        const notificationText = (selectedOrders.length === 1)
          ? 'Successfully marked order as Hold'
          : `Successfully marked ${selectedOrders.length} orders as Hold`;

        toastManager.add(
          notificationText,
          { appearance: 'success', autoDismiss: true },
        );
        onUpdate();
      })
      .catch((error) => {
        const message = error.response.data.errors.orderHoldUntil[0];
        this.setState({ error: message });
        toastManager.add(
          `Error: Failed to Hold Order(s): '${message}'`,
          { appearance: 'error', autoDismiss: true },
        );
      });
  }

  render() {
    const { innerRef } = this.props;

    return (
      <HoldOrdersModal
        {...this.props}
        {...this.state}
        ref={innerRef}
        handleChange={this.handleChange}
        handleSubmit={this.handleSubmit}
      />
    );
  }
}

HoldOrdersModalContainer.propTypes = {
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

export default HoldOrdersModalContainer;
