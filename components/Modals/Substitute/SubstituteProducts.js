import React, { useMemo } from 'react';
import { sortBy } from 'lodash';
import PropTypes from 'prop-types';
import { useKeyPressEvent } from 'react-use';

import { InputGroup } from '~/components/common/inputs';
import Alert from '~/components/common/Alert';
import Loading from '~/components/common/Loading';
import ModalFooter from '../ModalFooter';

import { useProductsState } from '~/contexts/ProductsContext';

import pluralizeOrder from '~/utilities/pluralizeOrder';
import ModalHeader from '../ModalHeader';
import SubstituteProductInput from './SubstituteProductInput';

const SubstituteProductsModal = React.forwardRef((props, ref) => {
  const {
    handleChange,
    handleModalClose,
    handleSubmit,
    isLoading,
    isPosting,
    selectedOrders,
    originalProductId,
    replacementProductId,
    commonProducts,
  } = props;

  const { products } = useProductsState();

  const sortedProducts = products
    .sort((a, b) => (a.sku < b.sku ? 1 : -1))
    .sort((a, b) => (a.sku == '000000' ? -1 : b.sku == '000000' ? 1 : 0));
  const sortedCommonProducts = commonProducts.sort((a, b) => (a.sku < b.sku ? 1 : -1));

  const isDisabled = isPosting
    || sortedCommonProducts.length === 0
    || isLoading
    || originalProductId === ''
    || replacementProductId === '';

  useKeyPressEvent(
    'Enter',
    e => !isDisabled && handleSubmit(e),
  );

  if (isLoading) {
    const message = `Gathering common products in ${pluralizeOrder(
      selectedOrders,
    )}`;
    return <Loading message={message} />;
  }

  return (
    <form onSubmit={handleSubmit} ref={ref}>
      <div className="flex flex-col max-w-lg p-4">
        <ModalHeader
          title={`Substitute ${pluralizeOrder(selectedOrders)}`}
          handleModalClose={handleModalClose}
        />
        {sortedCommonProducts.length === 0 && (
          <Alert type="info">
            {`The selected ${pluralizeOrder(selectedOrders)} do not have any common products.`}
          </Alert>
        )}

        {sortedCommonProducts.length > 0 && (
          <>
            <InputGroup>
              <SubstituteProductInput
                name="originalProductId"
                verb="original"
                selectedProductId={originalProductId}
                selectableProducts={sortedCommonProducts}
                handleChange={handleChange}
              />
            </InputGroup>
            <InputGroup>
              <SubstituteProductInput
                name="replacementProductId"
                verb="replacement"
                selectedProductId={replacementProductId}
                selectableProducts={sortedProducts}
                handleChange={handleChange}
              />
            </InputGroup>
          </>
        )}
      </div>
      <ModalFooter
        handleModalClose={handleModalClose}
        handleSubmit={handleSubmit}
        disabled={isDisabled}
        ctaLabel="Substitute"
        releasableAction
        saveAndActionShouldShow={false}
      />
    </form>
  );
});

SubstituteProductsModal.defaultProps = {
  originalProductId: '',
  replacementProductId: '',
};

SubstituteProductsModal.propTypes = {
  commonProducts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    sku: PropTypes.string.isRequired,
  })).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleModalClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isPosting: PropTypes.bool.isRequired,
  selectedOrders: PropTypes.arrayOf(PropTypes.number).isRequired,
  originalProductId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  replacementProductId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
};

export default SubstituteProductsModal;
