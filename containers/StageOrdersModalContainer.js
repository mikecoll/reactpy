import PropTypes from 'prop-types';
import React from 'react';

import StageOrdersModal from '../components/Modals/StageOrders';

class StageOrdersModalContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const { onUpdate } = this.props;
    onUpdate({ shouldStage: true });
  }

  render() {
    const { innerRef } = this.props;

    return (
      <StageOrdersModal
        {...this.props}
        {...this.state}
        ref={innerRef}
        handleSubmit={this.handleSubmit}
      />
    );
  }
}

StageOrdersModalContainer.propTypes = {
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

export default StageOrdersModalContainer;
