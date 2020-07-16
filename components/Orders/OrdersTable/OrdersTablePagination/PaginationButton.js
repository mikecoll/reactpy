import PropTypes from 'prop-types';
import React from 'react';

class PaginationButton extends React.Component {
  get className() {
    const { disabled } = this.props;
    return disabled
      ? 'cursor-default ml-4 text-grey text-sm'
      : 'ml-4 text-grey-darkest text-sm';
  }

  render() {
    const { disabled, handleClick, label } = this.props;
    return (
      <button
        className={this.className}
        disabled={disabled}
        onClick={handleClick}
        type="button"
      >
        {label}
      </button>
    );
  }
}

PaginationButton.propTypes = {
  disabled: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

export default PaginationButton;
