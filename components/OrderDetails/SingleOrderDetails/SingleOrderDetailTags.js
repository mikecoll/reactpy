import React from 'react';
import PropTypes from 'prop-types';
import { orderType } from '~/types';

const SingleOrderDetailTags = ({ order: { tags } }) => (
  <div className="flex flex-wrap mb-2 text-xs">
    {tags.map((label, index) => (
      <div className="m-1 bg-teal text-white p-2 rounded-full text-center" key={index}>
        {label}
      </div>
    ))}
  </div>
);

SingleOrderDetailTags.propTypes = {
  order: orderType.isRequired,
};

export default SingleOrderDetailTags;
