import React from 'react';
import PropTypes from 'prop-types';

import {
  InputGroup,
  SelectInput,
  TextInput,
  Validators,
} from '~/components/common/inputs';

import CarrierServiceSelectInput from '../../Orders/CarrierServiceSelectInput';

import WarehouseContext from '~/contexts/WarehouseContext';

const yesNoOptions = [
  { label: 'Yes', value: '1' },
  { label: 'No', value: '0' },
];

const OrderPanel = ({
  dimensions,
  dryIce,
  handleChange,
  handleChanges,
  noSaturdayDelivery,
  noSaturdayExpress,
  noSaturdayOntrac,
  noSaturdayGls,
  lineHaul,
  priority,
  process,
  serviceCode,
  carrierCode,
  tnt,
  warehouseId,
  weight,
  isResidential,
  disabled,
  register,
  getErrors,
}) => (
  <div className="mb-4 px-4">
    <h3 className="text-grey-darkest font-normal mb-4">Order</h3>
    <InputGroup>
      <WarehouseContext.Consumer>
        {({ warehouses }) => (
          <SelectInput
            error={getErrors('warehouse_id', 'warehouseId')}
            handleChange={handleChange}
            label="Warehouse"
            name="warehouseId"
            options={warehouses.map(warehouse => (
              { label: warehouse.name, value: warehouse.id.toString() }
            ))}
            showEmptyOption={false}
            value={warehouseId}
            disabled={disabled}
            ref={register({ required: true })}
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
        disabled={disabled}
        ref={register({
          required: true,
          min: 1,
          max: 999,
          validate: { positive: Validators.positive },
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
        disabled={disabled}
        ref={register({
          required: true,
          min: 1,
          max: 2,
          validate: { positive: Validators.positive },
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
        disabled={disabled}
        ref={register({ required: true, min: 0, max: 1 })}
      />
    </InputGroup>
    <InputGroup>
      <TextInput
        error={getErrors('process')}
        handleChange={handleChange}
        label="Process"
        name="process"
        value={process}
        disabled={disabled}
        ref={register({ required: true, min: 0, max: 1 })}
      />
    </InputGroup>
    <InputGroup>
      <SelectInput
        error={getErrors('no_saturday_delivery', 'noSaturdayDelivery')}
        handleChange={handleChange}
        label="No Saturday Delivery"
        name="noSaturdayDelivery"
        options={yesNoOptions}
        showEmptyOption={false}
        value={noSaturdayDelivery}
        disabled={disabled}
        ref={register({ required: true })}
      />
    </InputGroup>
    <InputGroup>
      <SelectInput
        error={getErrors('no_saturday_express', 'noSaturdayExpress')}
        handleChange={handleChange}
        label="No Saturday Express"
        name="noSaturdayExpress"
        options={yesNoOptions}
        showEmptyOption={false}
        value={noSaturdayExpress}
        disabled={disabled}
        ref={register({ required: true })}
      />
    </InputGroup>
    <InputGroup>
      <SelectInput
        error={getErrors('no_saturday_ontrac', 'noSaturdayOntrac')}
        handleChange={handleChange}
        label="No Saturday Ontrac"
        name="noSaturdayOntrac"
        options={yesNoOptions}
        showEmptyOption={false}
        value={noSaturdayOntrac}
        disabled={disabled}
        ref={register({ required: true })}
      />
    </InputGroup>
    <InputGroup>
      <SelectInput
        error={getErrors('no_saturday_gls', 'noSaturdayGls')}
        handleChange={handleChange}
        label="No Saturday GLS"
        name="noSaturdayGls"
        options={yesNoOptions}
        showEmptyOption={false}
        value={noSaturdayGls}
        disabled={disabled}
        ref={register({ required: true })}
      />
    </InputGroup>
    <InputGroup>
      <TextInput
        error={getErrors('lineHaul')}
        handleChange={handleChange}
        label="Line Haul"
        name="lineHaul"
        value={lineHaul}
        disabled={disabled}
      />
    </InputGroup>
    <InputGroup>
      <TextInput
        error={getErrors('dimensions')}
        handleChange={handleChange}
        label="Dimensions"
        name="dimensions"
        value={dimensions}
        disabled={disabled}
        ref={register({
          required: true,
          min: 0.01,
          max: 99999999.99,
          validate: { positive: Validators.positive },
        })}
      />
    </InputGroup>
    <InputGroup>
      <TextInput
        type="number"
        error={getErrors('order_weight', 'weight')}
        handleChange={handleChange}
        label="Weight"
        name="weight"
        value={weight}
        disabled={disabled}
        ref={register({
          required: true,
          min: 0.01,
          max: 999999.99,
          validate: { positive: Validators.positive },
        })}
      />
    </InputGroup>
    <InputGroup>
      <CarrierServiceSelectInput
        error={getErrors('shippingCarrierService')}
        serviceCode={serviceCode}
        carrierCode={carrierCode}
        onChange={handleChanges}
        disabled={disabled}
        ref={register({ required: true })}
      />
    </InputGroup>
    <InputGroup>
      <SelectInput
        error={getErrors('is_residential', 'isResidential')}
        handleChange={handleChange}
        label="Is Residential"
        name="isResidential"
        options={yesNoOptions}
        showEmptyOption={false}
        value={isResidential}
        disabled={disabled}
        ref={register({ required: true })}
      />
    </InputGroup>
  </div>
);

OrderPanel.defaultProps = {
  disabled: false,
  lineHaul: null,
};

OrderPanel.propTypes = {
  dimensions: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  dryIce: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleChanges: PropTypes.func.isRequired,
  noSaturdayDelivery: PropTypes.string.isRequired,
  noSaturdayExpress: PropTypes.string.isRequired,
  noSaturdayOntrac: PropTypes.string.isRequired,
  noSaturdayGls: PropTypes.string.isRequired,
  lineHaul: PropTypes.string,
  priority: PropTypes.string.isRequired,
  process: PropTypes.string.isRequired,
  serviceCode: PropTypes.string.isRequired,
  carrierCode: PropTypes.string.isRequired,
  tnt: PropTypes.string.isRequired,
  warehouseId: PropTypes.string.isRequired,
  weight: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  isResidential: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  register: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.instanceOf(Element),
    }),
  ]).isRequired,
  getErrors: PropTypes.func.isRequired,
};

export default OrderPanel;
