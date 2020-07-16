import React from 'react';
import PropTypes from 'prop-types';

import { InputLabel, SelectMulti } from '~/components/common/inputs';

export const generateProductOption = commonProduct => ({
  label: `${commonProduct.sku} - ${commonProduct.name}`,
  value: commonProduct && commonProduct.id,
});

const SubstituteProductInput = ({
  verb,
  selectableProducts,
  selectedProductId,
  handleChange,
  name,
}) => {
  const verbLower = verb && verb.toLowerCase();
  const verbUcFirst = verb
        && verb.charAt(0).toUpperCase() + verb.slice(1);

  const selectedProduct = selectedProductId
    && selectableProducts.find(p => p.id === selectedProductId);

  return (
    <>
      <InputLabel name={name}>
        {`${verb.toUpperCase()} PRODUCT`}
      </InputLabel>
      <SelectMulti
        name={name}
        options={selectableProducts.map(generateProductOption)}
        isMulti={false}
        placeholder={`Select ${verbUcFirst} Product...`}
        value={selectedProduct && generateProductOption(selectedProduct)}
        onChange={({ value }) => handleChange({
          target: {
            value,
            name,
          },
        })}
      />
    </>
  );
};

SubstituteProductInput.defaultProps = {
  selectedProductId: null,
};

SubstituteProductInput.propTypes = {
  verb: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  selectableProducts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    sku: PropTypes.string,
  })).isRequired,
  selectedProductId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  handleChange: PropTypes.func.isRequired,
};

export default SubstituteProductInput;
