import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import EditOrderModal from '../components/Modals/EditOrder/EditOrder';
import EditOrderLoader from './EditOrderLoader';

import { eventShouldRelease, eventShouldStage } from '../components/Modals/ModalFooter';


import { getOrder } from '../utilities/api';
import updateOrderHelper from '../utilities/api/helpers/updateOrderHelper';

class EditOrderModalContainer extends React.Component {
  constructor(props) {
    super(props);

    const { selectedOrders } = props;

    this.state = {
      errors: {},
      selectedProduct: null,
      isLoading: true,
      mounted: true,

      orderId: selectedOrders[0],

      carrierCode: '',
      city: '',
      country: '',
      dimensions: '',
      dryIce: '',
      email: '',
      name: '',
      phone: '',
      order_number: '',
      postalCode: '',
      priority: '',
      process: '',
      products: [],
      order_released_date: '',
      serviceCode: '',
			trackings: [],
      shipped_at: '',
      state: '',
      street1: '',
      street2: '',
      tnt: '',
      weight: '',
      warehouseId: '',
      noSaturdayDelivery: '0',
      noSaturdayExpress: '0',
      noSaturdayOntrac: '0',
      noSaturdayGls: '0',
      lineHaul: '',
      ignoreValidation: '',
      deliveryNotes: '',
      isResidential: true,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleChanges = this.handleChanges.bind(this);
		this.handleTrackingChange = this.handleTrackingChange.bind(this);
		this.handleTrackingAddition = this.handleTrackingAddition.bind(this);
		this.handleTrackingRemoval = this.handleTrackingRemoval.bind(this);
    this.handleProductAddition = this.handleProductAddition.bind(this);
    this.handleProductRemoval = this.handleProductRemoval.bind(this);
    this.handleQuantityChange = this.handleQuantityChange.bind(this);
    this.handleSelectedProductChange = this.handleSelectedProductChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    const { orderId } = this.state;
    this.setState({ isLoading: true });

    const response = await getOrder(orderId);

    this.order = response.data.data;
    this.setState({ isLoading: false });
  }

  componentWillUnmount() {
    this.setState({ mounted: false });
  }

  set order(inOrder) {
    const order = {
      carrierCode: inOrder.shipping.carrier_code,
      city: inOrder.customer_shipping.city,
      country: inOrder.customer_shipping.country,
      dimensions: inOrder.dimensions,
      dryIce: inOrder.dry_ice,
      email: inOrder.customer_shipping.email,
      name: inOrder.customer_shipping.name,
      noSaturdayDelivery: inOrder.no_saturday_delivery ? '1' : '0',
      noSaturdayExpress: inOrder.no_saturday_express ? '1' : '0',
      noSaturdayOntrac: inOrder.no_saturday_ontrac ? '1' : '0',
      noSaturdayGls: inOrder.no_saturday_gls ? '1' : '0',
      lineHaul: inOrder.shipping.line_haul,
      ignoreValidation: inOrder.customer_shipping.ignore_validation ? '1' : '0',
      phone: inOrder.customer_shipping.phone,
      order_number: inOrder.order_number,
      postalCode: inOrder.customer_shipping.postal_code,
      priority: inOrder.priority,
      process: inOrder.process,
      products: inOrder.products,
      order_released_date: inOrder.order_released_date, // eslint-disable-line
      serviceCode: inOrder.shipping.service_code,
			trackings: inOrder.trackings,
      shipped_at: inOrder.shipped_at, // eslint-disable-line
      state: inOrder.customer_shipping.state,
      street1: inOrder.customer_shipping.street_1,
      street2: inOrder.customer_shipping.street_2,
      tnt: inOrder.tnt,
      warehouseId: inOrder.warehouse.id.toString(),
      weight: inOrder.weight,
      deliveryNotes: inOrder.message.delivery_notes,
      isResidential: inOrder.is_residential ? '1' : '0',
    };

    this.setState(state => (state.mounted ? { ...order } : state));

    return this;
  }

  get orderPayload() {
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
      dimensions,
      weight,
      carrierCode,
      serviceCode,
			trackings,
      email,
      name,
      street1,
      street2,
      city,
      state,
      postalCode,
      country,
      phone,
      products,
      ignoreValidation,
      deliveryNotes,
      isResidential,
    } = this.state;

    return {
      warehouse_id: parseInt(warehouseId, 10),
      dry_ice: dryIce,
      tnt,
      priority,
      process,
      no_saturday_delivery: noSaturdayDelivery === '1',
      no_saturday_express: noSaturdayExpress === '1',
      no_saturday_ontrac: noSaturdayOntrac === '1',
      no_saturday_gls: noSaturdayGls === '1',
      line_haul: lineHaul,
      dimensions,
      order_weight: weight,
      carrier_code: carrierCode,
      service_code: serviceCode,
			trackings: trackings,
      customer_email: email,
      customer_name: name,
      customer_street_1: street1,
      customer_street_2: street2 || null,
      customer_city: city,
      customer_state: state,
      customer_postal_code: postalCode,
      customer_country: country,
      customer_phone: phone,
      ignore_validation: ignoreValidation,
      order_products: products.map(product => ({ ...product, product_quantity: product.quantity })),
      delivery_notes: deliveryNotes,
      is_residential: isResidential === '1',
    };
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleChanges(changes) {
    this.setState({ ...changes });
  }

	handleTrackingChange(trackingId, tracking_number) {
		const { trackings } = this.state;

		this.setState({
			trackings: trackings.map(t => 
				(t.id === trackingId ? {...t, tracking_number} : t))
		});
	}

	handleTrackingAddition() {
		const { trackings } = this.state;
		this.setState({
			trackings: trackings.concat({
				id: trackings.length ? -(Math.abs(trackings[trackings.length-1].id)+1) : -1,
			}),
		});
	}
	
	handleTrackingRemoval(trackingId) {
		const { trackings } = this.state;
		this.setState({
			trackings: trackings.filter(t => t.id !== trackingId),
		});
	}

  handleProductAddition() {
    const { products, selectedProduct } = this.state;
    this.setState({
      products: [...products, selectedProduct],
      selectedProduct: null,
    });
  }

  handleProductRemoval(productId) {
    const { products } = this.state;
    this.setState({
      products: products.filter(product => product.product_id !== productId),
    });
  }

  handleSelectedProductChange(selectedProduct) {
    this.setState({ selectedProduct });
  }

  async handleSubmit(e) {
    e.preventDefault();

    const {
      onUpdate,
      toastManager,
    } = this.props;

    const { orderId } = this.state;
    const shouldRelease = eventShouldRelease(e);
    const shouldStage = eventShouldStage(e);
    const payload = this.orderPayload;

    this.setState({ isLoading: true });

    const { error } = await updateOrderHelper({ orderId, payload, toastManager });

    if (error) {
      const errors = get(error, 'response.data.errors', {});
      this.setState({ errors });
    } else {
      await onUpdate({ shouldRelease, shouldStage });
    }
  }

  handleQuantityChange(productId, productType, quantity) {
    const { products } = this.state;
    const productIndex = products.findIndex(product => (
      product.product_id === productId && product.product_type === productType
    ));

    this.setState({
      products: products.map((product, index) => {
        if (index !== productIndex) {
          return product;
        }
        return { ...product, quantity };
      }),
    });
  }

  render() {
    const { isLoading } = this.state;
    const { innerRef } = this.props;

    if (isLoading) {
      return <EditOrderLoader cols={4} ref={innerRef} />;
    }

    return (
      <EditOrderModal
        {...this.props}
        {...this.state}
        ref={innerRef}
        handleChange={this.handleChange}
        handleChanges={this.handleChanges}
				handleTrackingChange={this.handleTrackingChange}
				handleTrackingAddition={this.handleTrackingAddition}
				handleTrackingRemoval={this.handleTrackingRemoval}
        handleProductAddition={this.handleProductAddition}
        handleProductRemoval={this.handleProductRemoval}
        handleQuantityChange={this.handleQuantityChange}
        handleSelectedProductChange={this.handleSelectedProductChange}
        handleSubmit={this.handleSubmit}
      />
    );
  }
}

// orderNumber={order.order_number}

EditOrderModalContainer.propTypes = {
  handleModalClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  toastManager: PropTypes.shape({
    add: PropTypes.func,
  }).isRequired,
  selectedOrders: PropTypes.arrayOf(PropTypes.number).isRequired,
  innerRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }).isRequired,
};

export default EditOrderModalContainer;
