import PropTypes from 'prop-types';
import React from 'react';

const MultipleLineDetail = ({ label, value }) => (
  <div className="border-t py-2">
    <span className="block text-grey-darker text-sm">{label}</span>
    {value
      && <span className="block mt-2 text-grey-darkest text-sm">{value}</span>
    }
  </div>
);

MultipleLineDetail.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
};

MultipleLineDetail.defaultProps = {
  value: '',
};

export default MultipleLineDetail;
