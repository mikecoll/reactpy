import DatePicker from 'react-datepicker';
import PropTypes from 'prop-types';
import React from 'react';

import CloseButton from './CloseButton';
import ModalFooter from './ModalFooter';

import pluralizeOrder from '../../utilities/pluralizeOrder';

import 'react-datepicker/dist/react-datepicker.css';

const OrderHoldUntilInput = React.forwardRef(({ onClick, value }, ref) => (
  <button
    className="bg-grey-lighter p-2 rounded text-sm"
    onClick={onClick}
    ref={ref}
    type="button"
  >
    {value}
  </button>
));

OrderHoldUntilInput.propTypes = {
  onClick: PropTypes.func, // eslint-disable-line react/require-default-props
  value: PropTypes.string, // eslint-disable-line react/require-default-props
};

const HoldOrdersModal = React.forwardRef(({
  date, error, handleChange, handleModalClose, handleSubmit, selectedOrders,
}, ref) => (
  <form onSubmit={handleSubmit} ref={ref}>
    <div className="flex items-center justify-between p-4">
      <h2 className="font-normal mr-8 text-grey-darkest">
        {`Hold ${pluralizeOrder(selectedOrders)}`}
      </h2>
      <CloseButton onClick={handleModalClose} />
    </div>
    <label className="block mb-4 px-4" htmlFor="orderHoldUntil">
      <span className="block mb-1 text-grey-darker text-xs uppercase">Date</span>
      <DatePicker
        customInput={<OrderHoldUntilInput />}
        dateFormat="yyyy-MM-dd"
        onChange={handleChange}
        selected={date}
      />
      {error && <p className="mt-1 text-red text-xs">{error}</p>}
    </label>
    <ModalFooter
      handleModalClose={handleModalClose}
      handleSubmit={handleSubmit}
      ctaLabel={`Hold ${pluralizeOrder(selectedOrders)}`}
      saveAndActionShouldShow={false}
    />
  </form>
));

HoldOrdersModal.defaultProps = {
  date: '',
  error: '',
};

HoldOrdersModal.propTypes = {
  date: PropTypes.instanceOf(Date),
  error: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  handleModalClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  selectedOrders: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default HoldOrdersModal;
