import React, { useState, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import sortBy from 'lodash/sortBy';
import { useKeyPressEvent } from 'react-use';

import { useProductsState } from '~/contexts/ProductsContext';
import { useLayoutDispatch } from '~/contexts/LayoutState';
import useDistinctProductIdsProductTypes from '~/hooks/products/useDistinctProductIdsProductTypes';

import { InputGroup } from '~/components/common/inputs';
import { Error as AlertError } from '~/components/common/Alert';
import Loading from '~/components/common/Loading';

import ModalFooter from '~/components/Modals/ModalFooter';

import SubstituteProductInput from './SubstituteProductInput';
import SubstituteProductTypeInput from './SubstituteProductTypeInput';

import pluralizeOrder from '~/utilities/pluralizeOrder';
import { createAdvancedSubstitutions } from '~/utilities/api';
import ModalHeader from '../ModalHeader';
import SubstituteQtyInput from './SubstituteQtyInput';

const INITAL_MODAL_STATE = {
  decreaseProductId: '',
  increaseProductId: '',
  productType: '',
  qtyDecrease: null,
  qtyIncrease: null,
};

const HelpText = props => (
  <p
    className="mt-1 text-xs opacity-75 max-w-xs"
    {...props}
  />
);

const SubstituteProductTypesModel = (props) => {
  const { notify } = useLayoutDispatch();

  const {
    handleModalClose,
    onUpdate,
    selectedOrders,
    innerRef,
  } = props;

  const [selectableProducts, setSelectableProducts] = useState([]);
  const [formState, setFormState] = useState(INITAL_MODAL_STATE);

  const { products: unsortedProducts } = useProductsState();
  const allProducts = useMemo(
    () => unsortedProducts
      .sort((a, b) => (a.sku < b.sku ? 1 : -1)) // sort skus decending
      .sort((a, b) => (a.sku == '000000' ? -1 : b.sku == '000000' ? 1 : 0)),
    [unsortedProducts],
  );

  const [{
    isLoading,
    isError: isDistinctProductIdsError,
    productTypes,
  }] = useDistinctProductIdsProductTypes(({ productIds }) => {
    if (productIds && productIds.length) {
      const products = productIds
        .map(
          // map over the productIds `pId`
          pId => allProducts.find(
            p => p.id === pId, // return an array of products
          ),
        )
        .sort((a, b) => (a.sku < b.sku ? 1 : -1)); // sort skus decending

      setSelectableProducts(products);
    }
  }, selectedOrders);

  const handleSubmit = async () => {
    try {
      const result = await createAdvancedSubstitutions({
        ...formState,
        orderIds: selectedOrders,
      });
      notify.success(result.data.message);
      /* @NOTE using `onUpdate()` vs `handleModalClose()`
       * to ensure view is refreshed after substitution.
       */
      onUpdate();
    } catch (err) {
      notify.error(JSON.stringify(err));
    }
  };

  const isDisabled = isLoading
    || formState.decreaseProductId === ''
    || formState.increaseProductId === '';

  useKeyPressEvent(
    'Enter',
    e => !isDisabled && handleSubmit(e),
  );

  const handleChange = useCallback(e => setFormState(state => ({
    ...state,
    [e.target.name]: e.target.value,
  })));

  if (isLoading) {
    const message = `Gathering distinct products in ${pluralizeOrder(
      selectedOrders,
      'order',
    )}`;
    return <Loading message={message} />;
  }

  return (
    <div ref={innerRef}>
      <div className="flex flex-col max-w-lg p-4">
        <ModalHeader
          title={`Substitute ${pluralizeOrder(selectedOrders)}`}
          handleModalClose={handleModalClose}
        />
        {isDistinctProductIdsError && <AlertError error={isDistinctProductIdsError} />}
        {selectableProducts.length > 0 && (
          <>
            <InputGroup>
              <SubstituteProductInput
                name="decreaseProductId"
                verb="original"
                selectedProductId={formState.decreaseProductId}
                selectableProducts={selectableProducts}
                handleChange={handleChange}
              />
              <HelpText>
                The Product to be removed from orders.
              </HelpText>
            </InputGroup>
            <InputGroup>
              <SubstituteProductInput
                name="increaseProductId"
                verb="replacement"
                selectedProductId={formState.increaseProductId}
                selectableProducts={allProducts}
                handleChange={handleChange}
              />
              <HelpText>
                The Product that will replace the ORIGINAL PRODUCT.
              </HelpText>
            </InputGroup>

            <div className="border-b my-4 mb-6" />

            <InputGroup>
              <SubstituteProductTypeInput
                name="productType"
                productTypes={productTypes}
                selectedType={formState.productType}
                handleChange={handleChange}
              />
              <HelpText>
                <b>Note:</b>
                {' '}
                If no
                <em>Product Type</em>
                {' '}
                is selected, multiple substitutions can occur on orders containing the same ORIGINAL PRODUCT with different PRODUCT TYPE.
              </HelpText>
            </InputGroup>

            {/* <InputGroup>
              <SubstituteQtyInput
                label="Quantity Decrease (Optional)"
                name="qtyDecrease"
                value={formState.qtyDecrease}
                handleChange={handleChange}
                disabled={isLoading || formState.decreaseProductId === ''}
              />
              <HelpText>
                Controls the maximum quantity to be substituted of any given orderProduct.
              </HelpText>
              <HelpText>
                <b>Note:</b>
                {' '}
                Leave EMPTY to substitute the maximum number of products per order.
              </HelpText>
            </InputGroup> */}
            {/* <InputGroup>
              <SubstituteQtyInput
                label="Quantity Increase (Optional)"
                name="qtyIncrease"
                value={formState.qtyIncrease}
                handleChange={handleChange}
                disabled={isLoading || formState.increaseProductId === ''}
              />
              <HelpText>
                <b>
                  Using an QUANTITY INCREASE of ZERO will
                  {' '}
                  <b>delete products</b>
                  {' '}
                  from orders.
                </b>
                {' '}
                These
                {' '}
                <em>'substitutions'</em>
                {' '}
                will be reported in the Subs export report.
              </HelpText>
              <HelpText>
                <b>Note:</b>
                {' '}
                Leave EMPTY to substitute the maximum number of products per order.
              </HelpText>
            </InputGroup> */}
          </>
        )}
      </div>
      <ModalFooter
        handleModalClose={handleModalClose}
        handleSubmit={handleSubmit}
        saveAndActionShouldShow={false}
        disabled={isDisabled}
        ctaLabel="Substitute"
      />
    </div>
  );
};

SubstituteProductTypesModel.propTypes = {
  handleModalClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  selectedOrders: PropTypes.arrayOf(PropTypes.number).isRequired,
  innerRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }).isRequired,
};

export default SubstituteProductTypesModel;
