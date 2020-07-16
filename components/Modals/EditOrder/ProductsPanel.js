import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { sortBy, get } from 'lodash';

import Button from '~/components/common/Button';
import ProductsDropdown from './ProductsDropdown';

import ProductsContext from '~/contexts/ProductsContext';
import { InputErrorMessages } from '~/components/common/inputs';

const textColors = {
  enabled: 'text-grey-darkest',
  disabled: 'text-grey',
};

class ProductsPanel extends React.Component {
  constructor() {
    super();

    this.onQuantityChange = this.onQuantityChange.bind(this);
    this.onSelectedProductChange = this.onSelectedProductChange.bind(this);
  }

  onQuantityChange(productId, productType, event) {
    const { value } = event.target;
    const { handleQuantityChange } = this.props;
    if (Number.isNaN(value) || value === '') {
      handleQuantityChange(productId, productType, 1);
    } else {
      handleQuantityChange(productId, productType, parseInt(value, 10));
    }
  }

  onSelectedProductChange(event) {
    event.preventDefault();
    const { value } = event.target;
    const { handleSelectedProductChange } = this.props;
    if (value) {
      const { products } = this.context;
      const { name, id, sku } = products.find(
        product => product.id === parseInt(value, 10),
      );
      handleSelectedProductChange({
        name,
        product_id: id,
        quantity: 1,
        sku,
      });
    } else {
      handleSelectedProductChange(null);
    }
  }

  get availableProducts() {
    const { orderProductIds } = this;
    return this.sortedProducts
      .filter(product => orderProductIds.indexOf(product.id) === -1);
  }

  get orderProductIds() {
    const { orderProducts } = this.props;
    return orderProducts.map(orderProduct => orderProduct.product_id);
  }

  get orderProducts() {
    const { orderProducts } = this.props;
    return sortBy(orderProducts, orderProduct => orderProduct.sku);
  }

  get sortedProducts() {
    const { products } = this.context;
    return sortBy(products, product => product.sku);
  }

  get OrderProducts() {
    const { orderProducts } = this;

    const {
      register,
      handleProductRemoval,
      disabled,
    } = this.props;

    return orderProducts.map(({
      product_id: productId,
      quantity,
      sku,
      name,
      product_type: productType,
    }, idx) => {
      const inputName = `orderProduct[${sku}].quantity`;

      return (
        <div className="flex items-center justify-between mb-2" key={`${sku}-${productType || idx}`}>
          <label className="w-full justify-between flex items-center mr-2" htmlFor={`${productId}-quantity`}>
            <span className={classNames(
              'mr-2',
              (disabled) ? textColors.disabled : textColors.enabled,
            )}
            >
              {`${sku} - ${name} ${productType ? ` (${productType})` : ''}`}
            </span>
            <input
              type="number"
              className="w-16 bg-grey-lighter p-2 rounded text-sm"
              id={`orderProduct-${productId}-quantity`}
              min="1"
              name={inputName}
              onChange={event => this.onQuantityChange(productId, productType, event)}
              value={quantity}
              disabled={disabled}
              ref={register({ required: true, min: 1, max: 999 })}
            />
          </label>
          <Button
            onClick={() => handleProductRemoval(productId)}
            disabled={disabled}
            rounded
            border
          >
            Remove
          </Button>
        </div>
      );
    });
  }

  render() {
    const {
      selectedProduct,
      disabled,
      register,
      handleProductAddition,
      getErrors,
    } = this.props;

    return (
      <div className="mb-4 px-4">
        <h3 className={classNames(
          'font-normal mb-4',
          (disabled) ? textColors.disabled : textColors.enabled,
        )}
        >
          Products
        </h3>

        <div className="flex justify-between mb-2">
          <div className="mr-2">
            <ProductsDropdown
              handleChange={this.onSelectedProductChange}
              name="selectedProduct"
              products={this.availableProducts}
              value={selectedProduct ? selectedProduct.product_id.toString() : ''}
              disabled={disabled}
              ref={register}
            />
          </div>
          <Button disabled={disabled || !selectedProduct} onClick={handleProductAddition}>
            Add
          </Button>
        </div>
        {getErrors('order_products') && <InputErrorMessages error={getErrors('order_products')} />}
        {this.OrderProducts}
      </div>
    );
  }
}

ProductsPanel.contextType = ProductsContext;

ProductsPanel.defaultProps = {
  selectedProduct: {},
  disabled: false,
};

ProductsPanel.propTypes = {
  handleProductAddition: PropTypes.func.isRequired,
  handleProductRemoval: PropTypes.func.isRequired,
  handleQuantityChange: PropTypes.func.isRequired,
  handleSelectedProductChange: PropTypes.func.isRequired,
  orderProducts: PropTypes.arrayOf(PropTypes.shape({
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
  disabled: PropTypes.bool,
  register: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.instanceOf(Element),
    }),
  ]).isRequired,
  getErrors: PropTypes.func.isRequired,
};

export default ProductsPanel;
