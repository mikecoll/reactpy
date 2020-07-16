import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import SortIcon from './SortIcon';

const SortButton = React.memo(({
  changeFilters,
  currentDirection,
  currentOrderBy,
  label,
  orderBy,
}) => {
  const isActive = currentOrderBy === orderBy;

  const toggledDirection = (isActive && currentDirection === 'asc')
    ? 'desc'
    : 'asc';

  return (
    <button
      className={classNames(
        'text-left uppercase flex flex-no-wrap',
        (isActive) ? 'font-bold text-grey-darkest' : 'text-grey-darker',
      )}
      onClick={() => changeFilters({ orderBy, direction: toggledDirection })}
      type="button"
    >
      {label}
      <SortIcon
        isActive={isActive}
        toggledDirection={toggledDirection}
      />
    </button>
  );
});

SortButton.propTypes = {
  currentDirection: PropTypes.string.isRequired,
  currentOrderBy: PropTypes.string.isRequired,
  changeFilters: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
};

export default SortButton;
