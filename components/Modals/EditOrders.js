import PropTypes from 'prop-types';
import React, { useCallback } from 'react';

import useEditOrderForm from '~/hooks/orders/useEditOrderForm';

import Alert from '../common/Alert';

import CloseButton from './CloseButton';

import {
  InputGroup,
  SelectInput,
  TextInput,
  Validators,
} from '~/components/common/inputs';
import ModalFooter from './ModalFooter';

import CarrierServiceSelectInput from '../Orders/CarrierServiceSelectInput';

import WarehouseContext from '../../contexts/WarehouseContext';

import { AuthPermissions, useAuthDispatch } from '../../contexts/AuthState';
import { useAggregateOrdersState } from '../../contexts/AggregateOrdersState';
import { useSelectedOrdersState } from '../../contexts/SelectedOrdersState';

import pluralizeOrder from '../../utilities/pluralizeOrder';

const yesNoOptions = [
  { label: 'Yes', value: '1' },
  { label: 'No', value: '0' },
];

const EditOrdersModal = React.forwardRef(({
  dryIce,
  errors,
  handleChange,
  handleChanges,
  handleModalClose,
  handleSubmit: propsHandleSubmit,
  noSaturdayDelivery,
  noSaturdayExpress,
  noSaturdayOntrac,
  noSaturdayGls,
  lineHaul,
  priority,
  process,
  carrierCode,
  serviceCode,
  tnt,
  warehouseId,
  isResidential,
}, ref) => {
  const { selectedOrders } = useSelectedOrdersState();
  const { hasSomePermissions } = useAuthDispatch();
  const { orders } = useAggregateOrdersState();

  const [
    { register },
    { handleSubmit: formHandleSubmit, getErrors },
  ] = useEditOrderForm(errors);

  const canOrderWrite = hasSomePermissions([
    AuthPermissions.globalWrite,
    AuthPermissions.order.orderWrite,
  ]);

  let warningStatus = null;
  if (orders.shipped > 0 || orders.released > 0) {  // eslint-disable-line
    warningStatus = (orders.released > 0 && orders.shipped === 0)
      ? 'Released'
      : 'Shipped';
  }

  const ModalBody = (
    <>
      <div className="p-4 pt-0">
        {warningStatus && (
          <Alert className="mb-2">
            Notice: Orders have already been
            {` ${warningStatus}`}
          </Alert>
        )}
        <Alert type="info">
          Fields left blank will not be updated.
        </Alert>
      </div>
      <div className="mb-4 px-4 w-64 flex flex-col m-center">
        {canOrderWrite && (
          <>
            <InputGroup>
              <WarehouseContext.Consumer>
                {({ warehouses }) => (
                  <SelectInput
                    error={getErrors('warehouse_id', 'warehouseId')}
                    handleChange={handleChange}
                    label="Warehouses"
                    name="warehouseId"
                    options={warehouses.map(warehouse => (
                      { label: warehouse.name, value: warehouse.id.toString() }
                    ))}
                    showEmptyOption
                    value={warehouseId}
                    ref={register()}
                  />
                )}
              </WarehouseContext.Consumer>
            </InputGroup>
            <InputGroup>
              <TextInput
                error={getErrors('dry_ice', 'dryIce')}
                handleChange={handleChange}
                label="Dry Ice"
                name="dryIce"
                value={dryIce}
                ref={register({
                  min: 1,
                  max: 999,
                  validate: { positive: Validators.optional.positive },
                })}
              />
            </InputGroup>
            <InputGroup>
              <TextInput
                error={getErrors('tnt')}
                handleChange={handleChange}
                label="TNT"
                name="tnt"
                value={tnt}
                ref={register({
                  required: false,
                  min: 1,
                  max: 2,
                  validate: { positive: Validators.optional.positive },
                })}
              />
            </InputGroup>
            <InputGroup>
              <TextInput
                error={getErrors('priority')}
                handleChange={handleChange}
                label="Priority"
                name="priority"
                value={priority}
                ref={register({ required: false, min: 0, max: 1 })}
              />
            </InputGroup>
            <InputGroup>
              <TextInput
                error={getErrors('process')}
                handleChange={handleChange}
                label="Process"
                name="process"
                value={process}
                ref={register({ required: false, min: 0, max: 1 })}
              />
            </InputGroup>
            <InputGroup>
              <SelectInput
                error={getErrors('no_saturday_delivery', 'noSaturdayDelivery')}
                handleChange={handleChange}
                label="No Saturday Delivery"
                name="noSaturdayDelivery"
                options={yesNoOptions}
                showEmptyOption
                value={noSaturdayDelivery}
                ref={register()}
              />
            </InputGroup>
            <InputGroup>
              <SelectInput
                error={getErrors('no_saturday_express', 'noSaturdayExpress')}
                handleChange={handleChange}
                label="No Saturday Express"
                name="noSaturdayExpress"
                options={yesNoOptions}
                showEmptyOption
                value={noSaturdayExpress}
                ref={register()}
              />
            </InputGroup>
            <InputGroup>
              <SelectInput
                error={getErrors('no_saturday_ontrac', 'noSaturdayOntrac')}
                handleChange={handleChange}
                label="No Saturday Ontrac"
                name="noSaturdayOntrac"
                options={yesNoOptions}
                showEmptyOption
                value={noSaturdayOntrac}
                ref={register()}
              />
            </InputGroup>
            <InputGroup>
              <SelectInput
                error={getErrors('no_saturday_gls', 'noSaturdayGls')}
                handleChange={handleChange}
                label="No Saturday GLS"
                name="noSaturdayGls"
                options={yesNoOptions}
                showEmptyOption
                value={noSaturdayGls}
                ref={register()}
              />
            </InputGroup>
            <InputGroup>
              <SelectInput
                error={getErrors('is_residential', 'isResidential')}
                handleChange={handleChange}
                label="Is Residential"
                name="isResidential"
                options={yesNoOptions}
                showEmptyOption
                value={isResidential}
                ref={register()}
              />
            </InputGroup>
          </>
        )}
        <InputGroup>
          <TextInput
            error={getErrors('line_haul', 'lineHaul')}
            handleChange={handleChange}
            label="Line Haul"
            name="lineHaul"
            value={lineHaul}
          />
        </InputGroup>
        <InputGroup>
          <CarrierServiceSelectInput
            error={getErrors('shippingCarrierService')}
            carrierCode={carrierCode}
            serviceCode={serviceCode}
            onChange={handleChanges}
            ref={register()}
          />
        </InputGroup>
      </div>
    </>
  );

  const onSubmit = useCallback((data, e) => {
    console.info('EditOrders.onSubmit', { data, e }); /* eslint-disable-line */
    propsHandleSubmit(e);
  }, [propsHandleSubmit]);

  return (
    <form onSubmit={formHandleSubmit(onSubmit)} ref={ref}>
      <div className="flex items-center justify-between p-4">
        <h2 className="font-normal mr-8 text-grey-darkest">
          {`Edit ${pluralizeOrder(selectedOrders)}`}
        </h2>
        <CloseButton onClick={handleModalClose} />
      </div>
      {ModalBody}
      <ModalFooter
        handleModalClose={handleModalClose}
        handleSubmit={formHandleSubmit(onSubmit)}
        releasableAction
      />
    </form>
  );
});

EditOrdersModal.defaultProps = {
  lineHaul: null,
};

EditOrdersModal.propTypes = {
  carrierCode: PropTypes.string.isRequired,
  dryIce: PropTypes.string.isRequired,
  errors: PropTypes.shape({
    carrier_code: PropTypes.array,
    dry_ice: PropTypes.array,
    no_saturday_delivery: PropTypes.array,
    no_saturday_express: PropTypes.array,
    priority: PropTypes.array,
    process: PropTypes.array,
    service_code: PropTypes.array,
    tnt: PropTypes.array,
    warehouse_id: PropTypes.array,
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleChanges: PropTypes.func.isRequired,
  handleModalClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  noSaturdayDelivery: PropTypes.string.isRequired,
  noSaturdayExpress: PropTypes.string.isRequired,
  noSaturdayOntrac: PropTypes.string.isRequired,
  noSaturdayGls: PropTypes.string.isRequired,
  lineHaul: PropTypes.string,
  priority: PropTypes.string.isRequired,
  process: PropTypes.string.isRequired,
  serviceCode: PropTypes.string.isRequired,
  tnt: PropTypes.string.isRequired,
  warehouseId: PropTypes.string.isRequired,
};

export default EditOrdersModal;
