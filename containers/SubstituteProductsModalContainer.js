import PropTypes from 'prop-types';
import React from 'react';

import SubstituteProductsModal from '../components/Modals/Substitute/SubstituteProducts';

import { eventShouldRelease } from '../components/Modals/ModalFooter';

import { createSubstitutions, getCommonProducts } from '../utilities/api';

class SubstituteProductsModalContainer extends React.Component {
  constructor() {
    super();

    this.state = {
      commonProducts: [],
      errors: {},
      isLoading: true,
      isPosting: false,
      originalProductId: '',
      replacementProductId: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.loadCommonProducts();
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleSubmit(e) {
    e.preventDefault();

    const { toastManager, onUpdate } = this.props;
    const shouldRelease = eventShouldRelease(e);

    this.setState({ isPosting: true }, () => {
      const { selectedOrders } = this.props;
      const { originalProductId, replacementProductId } = this.state;
      createSubstitutions(selectedOrders, originalProductId, replacementProductId)
        .then(() => {
          const notificationText = (selectedOrders.length === 1)
            ? 'Successfully Substituted Order Product'
            : `Successfully Substituted ${selectedOrders.length} Orders Products`;

          toastManager.add(
            notificationText,
            { appearance: 'success', autoDismiss: true },
          );
          onUpdate({ shouldRelease });
        })
        .catch((error) => {
          toastManager.add(
            'Failed to Substitute Order Product',
            { appearance: 'error', autoDismiss: true },
          );
          const { errors } = error.response.data;
          this.setState({ errors, isPosting: false });
        });
    });
  }

  loadCommonProducts() {
    const { selectedOrders } = this.props;
    getCommonProducts(selectedOrders)
      .then(response => this.setState({
        commonProducts: response.data.data,
        isLoading: false,
      }));
  }

  render() {
    const { innerRef } = this.props;

    return (
      <SubstituteProductsModal
        {...this.props}
        {...this.state}
        ref={innerRef}
        handleChange={this.handleChange}
        handleSubmit={this.handleSubmit}
      />
    );
  }
}

SubstituteProductsModalContainer.propTypes = {
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

export default SubstituteProductsModalContainer;
