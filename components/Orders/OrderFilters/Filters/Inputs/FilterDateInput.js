import React, { useCallback } from 'react';
import DatePicker from 'react-datepicker';
import PropTypes from 'prop-types';
import { startCase } from 'lodash';
import moment from 'moment';

import {
  useFiltersState,
  useFiltersDispatch,
} from '~/contexts/FiltersState';

import Button from '~/components/common/Button';

import 'react-datepicker/dist/react-datepicker.css';

const DateInput = React.forwardRef(({ onClick, value }, ref) => (
  <Button
    className={{
      'xl:text-sm': false,
      'bg-grey-lighter': true,
      'bg-white': false,
      'hover:bg-grey-lighter': false,
      'hover:bg-grey-light': true,
      'mr-2': true,
      'px-3': false,
      'text-grey-darkest': !!value,
      'text-grey-darker': !value,
    }}
    rounded
    onClick={onClick}
    type="button"
    ref={ref}
  >
    {value || 'Select date'}
  </Button>
));

DateInput.defaultProps = {
  onClick: null,
  value: null,
};

DateInput.propTypes = {
  onClick: PropTypes.func,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date),
  ]),
};

const FilterDateInput = ({ name, endOfDay }) => {
  const { changeFilter } = useFiltersDispatch();
  const { filters: { [name]: value } } = useFiltersState();

  const onChange = useCallback((val) => {
    const offsetDate = endOfDay
      ? moment(val).endOf('day').toDate()
      : moment(val).startOf('day').toDate();

    return changeFilter(name, offsetDate);
  }, [name, changeFilter, endOfDay]);


  return (
    <>
      <label
        className="block mb-1 text-grey-darker text-xs uppercase"
        htmlFor={name}
      >
        {startCase(name)}
      </label>
      <div className="flex items-center" style={{ paddingTop: '3px' }}>
        <DatePicker
          className="max-w-1/2 truncate"
          customInput={<DateInput value={value} />}
          dateFormat="yyyy-MM-dd"
          onChange={onChange}
          selected={value}
        />
        <Button
          className={{ 'xl:text-sm': false, 'max-w-12': true }}
          onClick={() => changeFilter(name, null)}
          type="button"
        >
          Clear
        </Button>
      </div>
    </>
  );
};

FilterDateInput.defaultProps = {
  value: null,
  endOfDay: false,
};

FilterDateInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.instanceOf(Date),
  endOfDay: PropTypes.bool,
};

export default FilterDateInput;
