import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import Button from '~/components/common/Button';

const FlowButton = ({
  active, count, handleClick, label,
}) => (
  <Button
    className={{
      flex: true,
      'items-center': true,
      'justify-center': true,
      'xl:p-0': true,
      'xl:px-0': true,
      'text-grey-darkest': active,
    }}
    onClick={handleClick}
  >
    <span className={classNames(
      'block rounded-full',
      'mr-1 xl:mr-2',
      'w-2 h-2 xl:w-3 xl:h-3', // circle size
      active ? 'bg-green-dark' : 'bg-grey-light',
    )}
    />
    {label}
    {count > 0 && ` (${count})`}
  </Button>
);

FlowButton.propTypes = {
  active: PropTypes.bool.isRequired,
  count: PropTypes.number.isRequired,
  handleClick: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

export default FlowButton;
