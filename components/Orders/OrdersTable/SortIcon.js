import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

const SortIcon = React.memo(({ isActive, toggledDirection }) => (
  <i className={classNames(
    'pl-1 fa',
    !isActive && 'fa-sort text-gray-300',
    isActive && ((toggledDirection === 'asc') ? 'fa-sort-up' : 'fa-sort-down'),
  )}
  />
));

SortIcon.propTypes = {
  isActive: PropTypes.bool.isRequired,
  toggledDirection: PropTypes.string.isRequired,
};

export default SortIcon;
