import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Button from '~/components/common/Button';

import {
  InputGroup,
  TextInput,
} from '~/components/common/inputs';
import ButtonGroup from '~/components/common/ButtonGroup';

const textColors = {
  enabled: 'text-grey-darkest',
  disabled: 'text-grey',
};

class OrderTrackingPanel extends React.Component {
  constructor() {
    super();
  }

  onTrackingChange(trackingId, event) {
    const { value } = event.target;
    const { handleTrackingChange } = this.props;

    handleTrackingChange(trackingId, value);
  }

  onTrackingAddition() {
    const { handleTrackingAddition } = this.props;

    handleTrackingAddition();
  }

  onTrackingRemoval(trackingId) {
    const { handleTrackingRemoval } = this.props;
    handleTrackingRemoval(trackingId);
  }

  render() {
    const {
      trackings,
      disabled,
      register,
      getErrors,
    } = this.props;

    return (
      <div className="mb-4 px-4">
        <h3 className={classNames(
          'font-normal mb-4',
          (disabled) ? textColors.disabled : textColors.enabled,
        )}
        >
          Tracking Numbers
        </h3>

        <div className="flex flex-col mb-2">
          {trackings.length === 0 && (
            <div className="w-full flex flex-row">
              <p className="mr-2 flex-grow items-center flex opacity-75">No tracking number(s)</p>
              <Button
                className="flex-grow-0"
                disabled={disabled}
                onClick={() => this.onTrackingAddition()}
                border
                rounded
              >
                Add Tracking Number
              </Button>
            </div>
          )}

          {trackings.map((t, k) => (
            <InputGroup className="flex flex-row">
              <TextInput
                className="flex-grow mr-2"
                name="tracking"
                disabled={disabled}
                value={t.tracking_number}
                placeholder="Enter a Tracking Number"
                handleChange={event => this.onTrackingChange(t.id, event)}
                ref={register({
                  required: true,
                  min: 1,
                })}
              />
              <ButtonGroup className="flex-gro-0">
                <Button
                  disabled={disabled}
                  onClick={() => this.onTrackingRemoval(t.id)}
                >
                  Remove
                </Button>
                {k === trackings.length - 1 && (
                  <Button
                    disabled={disabled}
                    onClick={() => this.onTrackingAddition()}
                  >
                    Add
                  </Button>
                )}
              </ButtonGroup>
            </InputGroup>
          ))}
        </div>
      </div>
    );
  }
}

OrderTrackingPanel.defaultProps = {
  disabled: false,
};

OrderTrackingPanel.propTypes = {
  trackings: PropTypes.array.isRequired,
  disabled: PropTypes.bool,
  handleTrackingChange: PropTypes.func.isRequired,
  handleTrackingAddition: PropTypes.func.isRequired,
  handleTrackingRemoval: PropTypes.func.isRequired,
  register: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({
      current: PropTypes.instanceOf(Element),
    }),
  ]).isRequired,
  getErrors: PropTypes.func.isRequired,
};

export default OrderTrackingPanel;
