import PropTypes from 'prop-types';
import React from 'react';

import {
  InputGroup,
  TextInput,
} from '~/components/common/inputs';
import { Validators } from '../../common/inputs';

const ShippingPanel = ({
  city,
  country,
  email,
  handleChange,
  name,
  phone,
  postalCode,
  state,
  street1,
  street2,
  ignoreValidation,
  deliveryNotes,
  disabled,
  register,
  getErrors,
  carrierCode,
}) => (
  <div className="mb-4 px-4">
    <h3 className="text-grey-darkest font-normal mb-4">Shipping</h3>
    <InputGroup>
      <TextInput
        error={getErrors('customer_email', 'email')}
        handleChange={handleChange}
        label="Email"
        name="email"
        value={email}
        disabled={disabled}
        ref={register({
          required: true,
          pattern: Validators.patterns.email,
        })}
      />
    </InputGroup>
    <InputGroup>
      <TextInput
        error={getErrors('customer_name', 'name')}
        handleChange={handleChange}
        label="Name"
        name="name"
        value={name}
        disabled={disabled}
        ref={register({ required: true })}
      />
    </InputGroup>
    <InputGroup>
      <TextInput
        error={getErrors('customer_street_1', 'street1')}
        handleChange={handleChange}
        label="Street Address 1"
        name="street1"
        value={street1}
        disabled={disabled}
        ref={register({ required: true })}
      />
    </InputGroup>
    <InputGroup>
      <TextInput
        error={getErrors('customer_street_2', 'street2')}
        handleChange={handleChange}
        label="Street Address 2"
        name="street2"
        value={street2 || ''}
        disabled={disabled}
        ref={register}
      />
    </InputGroup>
    <InputGroup>
      <TextInput
        error={getErrors('customer_city', 'city')}
        handleChange={handleChange}
        label="City"
        name="city"
        value={city}
        disabled={disabled}
        ref={register({ required: true })}
      />
    </InputGroup>
    <InputGroup>
      <TextInput
        error={getErrors('customer_state', 'state')}
        handleChange={handleChange}
        label="State"
        name="state"
        value={state}
        disabled={disabled}
        ref={register({ required: true })}
      />
    </InputGroup>
    <InputGroup>
      <TextInput
        error={getErrors('customer_postal_code', 'postalCode')}
        handleChange={handleChange}
        label="Postal Code"
        name="postalCode"
        value={postalCode}
        disabled={disabled}
        ref={register({
          required: true,
          minLength: 5,
        })}
      />
    </InputGroup>
    <InputGroup>
      <TextInput
        error={getErrors('customer_country', 'country')}
        handleChange={handleChange}
        label="Country"
        name="country"
        value={country}
        disabled={disabled}
        ref={register({ required: true })}
      />
    </InputGroup>
    <InputGroup>
      <TextInput
        error={getErrors('customer_phone', 'phone')}
        handleChange={handleChange}
        label="Phone"
        name="phone"
        value={phone}
        disabled={disabled}
        ref={register({
          required: true,
          pattern: Validators.patterns.phone,
        })}
      />
    </InputGroup>
    <InputGroup>
      <TextInput
        error={getErrors('ignore_validation', 'ignoreValidation')}
        handleChange={handleChange}
        label="Ignore Validation"
        name="ignoreValidation"
        value={ignoreValidation}
        disabled={disabled}
        ref={register({ required: true })}
      />
    </InputGroup>
    <InputGroup>
      <TextInput
        error={getErrors('delivery_notes', 'deliveryNotes')}
        handleChange={handleChange}
        label="Delivery Notes"
        name="deliveryNotes"
        value={deliveryNotes}
        disabled={disabled}
        ref={register({
          maxLength: {
            value: carrierCode.toLowerCase() === 'gls' ? 100 : 255,
            message: `Maximum Length exceeded for ${carrierCode} (
              ${deliveryNotes && deliveryNotes.length}/${carrierCode.toLowerCase() === 'gls' ? 100 : 255}
            )`,
          },
        })}
        textArea
      />
    </InputGroup>
  </div>
);

ShippingPanel.defaultProps = {
  street2: '',
  disabled: false,
  deliveryNotes: '',
};

ShippingPanel.propTypes = {
  city: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  postalCode: PropTypes.string.isRequired,
  state: PropTypes.string.isRequired,
  street1: PropTypes.string.isRequired,
  street2: PropTypes.string,
  ignoreValidation: PropTypes.string.isRequired,
  deliveryNotes: PropTypes.string,
  disabled: PropTypes.bool,
  register: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.instanceOf(Element),
    }),
  ]).isRequired,
  getErrors: PropTypes.func.isRequired,
  carrierCode: PropTypes.string.isRequired,
};

export default ShippingPanel;
