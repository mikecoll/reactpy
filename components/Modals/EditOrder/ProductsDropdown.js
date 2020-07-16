import PropTypes from 'prop-types';
import React from 'react';

const ProductsDropdown = React.forwardRef(({
  handleChange, name, products, value,
}, ref) => (
  <div className="select">
    <select
      className="appearance-none bg-grey-lighter block pr-8 px-4 py-2 rounded text-sm"
      id={name}
      name={name}
      onChange={handleChange}
      value={value}
      ref={ref}
    >
      <option>Select a Product to add ...</option>
      {products.map(product => (
        <option key={product.id} value={product.id}>
          {`${product.sku} - ${product.name}`}
        </option>
      ))}
    </select>
  </div>
));

ProductsDropdown.propTypes = {
  handleChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  products: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    sku: PropTypes.string.isRequired,
  })).isRequired,
  value: PropTypes.string.isRequired,
};

export default ProductsDropdown;
