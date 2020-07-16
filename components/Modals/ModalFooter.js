import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import { AuthPermissions, useAuthDispatch } from '~/contexts/AuthState';

import Button from '../common/Button';
import ButtonGroup from '../common/ButtonGroup';
import { useFiltersState } from '~/contexts/FiltersState';

export const ModalFooterDataActions = {
  save: 'save',
  stage: 'save_and_stage',
  release: 'save_and_release',
};

export const eventShouldRelease = e => e.target
  && e.target.getAttribute('data-action') === ModalFooterDataActions.release;

export const eventShouldStage = e => e.target
  && e.target.getAttribute('data-action') === ModalFooterDataActions.stage;

export const saveAndActionButtonShouldDisplay = (flow) => {
  switch (flow) {
    case 'canceled':
    case 'shipped':
    case 'released':
      return false;

    case 'held':
    case 'unprocessed':
    case 'staged':
    default:
      return true;
  }
};

const ModalFooter = ({
  handleModalClose,
  handleSubmit,
  ctaLabel,
  disabled,
  saveAndActionShouldShow,
}) => {
  const { hasPermission } = useAuthDispatch();
  const { filters: { flow } } = useFiltersState();

  const SaveAndStage = (
    <Button
      variant="solid-red"
      onClick={handleSubmit}
      data-action={ModalFooterDataActions.stage}
      disabled={disabled}
    >
      Save &amp; Stage
    </Button>
  );

  const Cancel = (
    <Button
      variant="default"
      onClick={handleModalClose}
      disabled={disabled}
      border
      rounded
    >
      Cancel
    </Button>
  );

  const Save = (
    <Button
      variant="solid-blue"
      onClick={handleSubmit}
      data-action={ModalFooterDataActions.save}
      disabled={disabled}
    >
      {ctaLabel}
    </Button>
  );

  const SaveAndRelease = (
    <Button
      variant="blue"
      onClick={handleSubmit}
      data-action={ModalFooterDataActions.release}
      disabled={disabled}
    >
      Save &amp; Release
    </Button>
  );

  const unprocessedFlow = (flow === 'unprocessed');
  const SaveAndAction = unprocessedFlow ? SaveAndStage : SaveAndRelease;

  return (
    <div className="bg-grey-lighter flex justify-between p-4">
      {Cancel}
      <ButtonGroup>
        {saveAndActionShouldShow
          && hasPermission(AuthPermissions.order.orderWrite)
          && saveAndActionButtonShouldDisplay(flow)
          && (SaveAndAction)
        }

        <Button
          variant="solid-blue"
          onClick={handleSubmit}
          data-action={ModalFooterDataActions.save}
          disabled={disabled}
        >
          {ctaLabel}
        </Button>
      </ButtonGroup>
    </div>
  );
};

ModalFooter.defaultProps = {
  ctaLabel: 'Save',
  disabled: false,
  saveAndActionShouldShow: true,
};

ModalFooter.propTypes = {
  handleModalClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  ctaLabel: PropTypes.string,
  disabled: PropTypes.bool,
  saveAndActionShouldShow: PropTypes.bool,
};

export default ModalFooter;
