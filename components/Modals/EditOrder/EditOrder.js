import PropTypes from 'prop-types';
import React, { useCallback } from 'react';

import CloseButton from '../CloseButton';
import ModalFooter from '../ModalFooter';

import ShippingPanel from './ShippingPanel';
import OrderPanel from './OrderPanel';
import ProductsPanel from './ProductsPanel';
import OrderTrackingPanel from './OrderTrackingPanel';

import Alert from '~/components/common/Alert';

import useEditOrderForm from '~/hooks/orders/useEditOrderForm';

import { AuthPermissions, useAuthDispatch } from '~/contexts/AuthState';

const EditOrderModal = React.forwardRef(({
  city,
  country,
  dimensions,
  dryIce,
  email,
  errors,
  handleChange,
  handleChanges,
  handleModalClose,
  handleTrackingChange,
  handleTrackingAddition,
  handleTrackingRemoval,
  handleProductAddition,
  handleProductRemoval,
  handleQuantityChange,
  handleSelectedProductChange,
  handleSubmit: propsHandleSubmit,
  name,
  noSaturdayDelivery,
  noSaturdayExpress,
  noSaturdayOntrac,
  noSaturdayGls,
  lineHaul,
  order_number: orderNumber,
  phone,
  postalCode,
  ignoreValidation,
  deliveryNotes,
  priority,
  process,
  products,
  selectedProduct,
  serviceCode,
  carrierCode,
  trackings,
  state,
  street1,
  street2,
  tnt,
  warehouseId,
  weight,
  shipped_at: shippedAt,
  order_released_date: releasedDate,
  isResidential,
}, ref) => {
  const { hasPermission } = useAuthDispatch();

  let warningStatus = null;
  if (releasedDate || shippedAt) {
    warningStatus = (releasedDate && !shippedAt) ? 'Released' : 'Shipped';
  }

  const [
    { register },
    { handleSubmit: formHandleSubmit, getErrors },
  ] = useEditOrderForm(errors);

  const EditOrderBody = (
    <div className="flex">
      {hasPermission(AuthPermissions.order.orderWrite) && (
        <OrderPanel
          dimensions={dimensions}
          dryIce={dryIce}
          handleChange={handleChange}
          handleChanges={handleChanges}
          noSaturdayDelivery={noSaturdayDelivery}
          noSaturdayExpress={noSaturdayExpress}
          noSaturdayOntrac={noSaturdayOntrac}
          noSaturdayGls={noSaturdayGls}
          lineHaul={lineHaul}
          priority={priority}
          process={process}
          serviceCode={serviceCode}
          carrierCode={carrierCode}
          tnt={tnt}
          warehouseId={warehouseId}
          weight={weight}
          isResidential={isResidential}
          disabled={!hasPermission(AuthPermissions.order.orderWrite)}
          register={register}
          getErrors={getErrors}
        />
      )}
      <ShippingPanel
        city={city}
        country={country}
        email={email}
        errors={errors}
        handleChange={handleChange}
        name={name}
        phone={phone}
        postalCode={postalCode}
        state={state}
        street1={street1}
        street2={street2}
        ignoreValidation={ignoreValidation}
        disabled={!hasPermission(AuthPermissions.order.shippingWrite)}
        register={register}
        getErrors={getErrors}
        deliveryNotes={deliveryNotes}
        carrierCode={carrierCode}
      />
      <div className="flex flex-col">
        {hasPermission(AuthPermissions.order.productsWrite) && (
          <ProductsPanel
            errors={errors}
            handleProductAddition={handleProductAddition}
            handleProductRemoval={handleProductRemoval}
            handleQuantityChange={handleQuantityChange}
            handleSelectedProductChange={handleSelectedProductChange}
            orderProducts={products}
            selectedProduct={selectedProduct}
            disabled={
              !hasPermission(AuthPermissions.order.productsWrite)
            }
            register={register}
            getErrors={getErrors}
          />
        )}
        {hasPermission(AuthPermissions.order.trackingWrite) && (
          <OrderTrackingPanel
            errors={errors}
            handleTrackingChange={handleTrackingChange}
            handleTrackingAddition={handleTrackingAddition}
            handleTrackingRemoval={handleTrackingRemoval}
            trackings={trackings}
            disabled={
              !hasPermission(AuthPermissions.order.productsWrite)
            }
            register={register}
            getErrors={getErrors}
          />
        )}
      </div>
    </div>
  );

  const onSubmit = useCallback((data, e) => {
    propsHandleSubmit(e);
  }, [propsHandleSubmit]);

  return (
    <div className="overflow max-h-screen" ref={ref}>
      <form onSubmit={formHandleSubmit(onSubmit)}>
        <div className="flex items-center justify-between p-4">
          <h2 className="font-normal mr-8 text-grey-darkest">
            {`Edit Order ${orderNumber}`}
          </h2>
          <CloseButton onClick={handleModalClose} />
        </div>
        {warningStatus && (
          <Alert className="m-4 mt-0">
            Notice: Order has already been
            {` ${warningStatus}`}
          </Alert>
        )}
        {EditOrderBody}
        <ModalFooter
          handleModalClose={handleModalClose}
          handleSubmit={formHandleSubmit(onSubmit)}
        />
      </form>
    </div>
  );
});

EditOrderModal.defaultProps = {
  selectedProduct: {},
  street2: '',
  // @TODO fix these lazy attributes
  shipped_at: null,
  order_released_date: null,
  lineHaul: null,
  deliveryNotes: null,
};

EditOrderModal.propTypes = {
  carrierCode: PropTypes.string.isRequired,
  city: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  dimensions: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  dryIce: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  errors: PropTypes.shape({
    carrier_code: PropTypes.array,
    customer_city: PropTypes.array,
    customer_country: PropTypes.array,
    customer_email: PropTypes.array,
    customer_name: PropTypes.array,
    customer_phone: PropTypes.array,
    customer_postal_code: PropTypes.array,
    customer_state: PropTypes.array,
    customer_street_1: PropTypes.array,
    customer_street_2: PropTypes.array,
    dimensions: PropTypes.array,
    dry_ice: PropTypes.array,
    no_saturday_delivery: PropTypes.array,
    no_saturday_express: PropTypes.array,
    order_products: PropTypes.array,
    order_weight: PropTypes.array,
    priority: PropTypes.array,
    process: PropTypes.array,
    service_code: PropTypes.array,
    tnt: PropTypes.array,
    warehouse_id: PropTypes.array,
    is_residential: PropTypes.array,
    ignore_validation: PropTypes.array,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleChanges: PropTypes.func.isRequired,
  handleModalClose: PropTypes.func.isRequired,
  handleTrackingChange: PropTypes.func.isRequired,
  handleTrackingAddition: PropTypes.func.isRequired,
  handleTrackingRemoval: PropTypes.func.isRequired,
  handleProductAddition: PropTypes.func.isRequired,
  handleProductRemoval: PropTypes.func.isRequired,
  handleQuantityChange: PropTypes.func.isRequired,
  handleSelectedProductChange: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  noSaturdayDelivery: PropTypes.string.isRequired,
  noSaturdayExpress: PropTypes.string.isRequired,
  noSaturdayOntrac: PropTypes.string.isRequired,
  noSaturdayGls: PropTypes.string.isRequired,
  lineHaul: PropTypes.string,
  deliveryNotes: PropTypes.string,
  order_number: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  postalCode: PropTypes.string.isRequired,
  priority: PropTypes.string.isRequired,
  process: PropTypes.string.isRequired,
  products: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    product_id: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    sku: PropTypes.string.isRequired,
  })).isRequired,
  selectedProduct: PropTypes.shape({
    name: PropTypes.string.isRequired,
    product_id: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    sku: PropTypes.string.isRequired,
  }),
  serviceCode: PropTypes.string.isRequired,
  trackings: PropTypes.array.isRequired,
  state: PropTypes.string.isRequired,
  street1: PropTypes.string.isRequired,
  street2: PropTypes.string,
  tnt: PropTypes.string.isRequired,
  warehouseId: PropTypes.string.isRequired,
  weight: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  ignoreValidation: PropTypes.string.isRequired,

  shipped_at: PropTypes.string,
  order_released_date: PropTypes.string,
};

export default EditOrderModal;
