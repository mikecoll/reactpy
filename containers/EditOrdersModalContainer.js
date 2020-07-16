import PropTypes from 'prop-types';
import React from 'react';

import EditOrdersModal from '../components/Modals/EditOrders';
import EditOrderLoader from './EditOrderLoader';

import { eventShouldRelease, eventShouldStage } from '../components/Modals/ModalFooter';

import updateOrderHelper from '../utilities/api/helpers/updateOrderHelper';

class EditOrderModalContainer extends React.Component {
  constructor() {
    super();

    this.state = {
      warehouseId: '',
      dryIce: '',
      tnt: '',
      priority: '',
      process: '',
      noSaturdayDelivery: '',
      noSaturdayExpress: '',
      noSaturdayOntrac: '',
      noSaturdayGls: '',
      lineHaul: '',
      carrierCode: '',
      serviceCode: '',
      isResidential: '',
      errors: {},
      isLoading: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChanges = this.handleChanges.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  get ordersPayload() {
    const { selectedOrders } = this.props;
    const {
      warehouseId,
      dryIce,
      tnt,
      priority,
      process,
      noSaturdayDelivery,
      noSaturdayExpress,
      noSaturdayOntrac,
      noSaturdayGls,
      lineHaul,
      carrierCode,
      serviceCode,
      isResidential,
    } = this.state;
    return {
      ids: selectedOrders,
      warehouse_id: warehouseId ? parseInt(warehouseId, 10) : undefined,
      dry_ice: dryIce || undefined,
      tnt: tnt || undefined,
      priority: priority || undefined,
      process: process || undefined,
      no_saturday_delivery: noSaturdayDelivery ? noSaturdayDelivery === '1' : undefined,
      no_saturday_express: noSaturdayExpress ? noSaturdayExpress === '1' : undefined,
      no_saturday_ontrac: noSaturdayOntrac ? noSaturdayOntrac === '1' : undefined,
      no_saturday_gls: noSaturdayGls ? noSaturdayGls === '1' : undefined,
      line_haul: lineHaul || undefined,
      carrier_code: carrierCode || undefined,
      service_code: serviceCode || undefined,
      is_residential: isResidential ? isResidential === '1' : undefined,
    };
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleChanges(changes) {
    this.setState({ ...changes });
  }

  async handleSubmit(e) {
    const { onUpdate, toastManager } = this.props;
    const shouldRelease = eventShouldRelease(e);
    const shouldStage = eventShouldStage(e);

    this.setState({ isLoading: true });

    const { error } = await updateOrderHelper({
      payload: this.ordersPayload,
      toastManager,
    });

    if (error) {
      console.error('EditOrdersModalContainer.handleSubmit().catch()', { error }); // eslint-disable-line
      this.setState({ errors: error.response.data.errors || error });
    }

    this.setState({ isLoading: false });

    await onUpdate({ shouldRelease, shouldStage });
  }


  render() {
    const { isLoading } = this.state;
    const { innerRef } = this.props;

    if (isLoading) {
      return <EditOrderLoader cols={1} ref={innerRef} />;
    }
    return (
      <EditOrdersModal
        {...this.props}
        {...this.state}
        ref={innerRef}
        handleChange={this.handleChange}
        handleChanges={this.handleChanges}
        handleSubmit={this.handleSubmit}
      />
    );
  }
}

EditOrderModalContainer.propTypes = {
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

export default EditOrderModalContainer;
