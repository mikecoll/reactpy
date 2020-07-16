import PropTypes from 'prop-types';
import React, { useState, useCallback, useMemo } from 'react';
import { get } from 'lodash';

import Loading from '~/components/common/Loading';
import Button from '~/components/common/Button';
import Accordion from '~/components/common/Accordion';
import ButtonGroup from '~/components/common/ButtonGroup';
import { Error as AlertError } from '~/components/common/Alert';

import { trackingUploadImport } from '~/utilities/api';
import { useLayoutDispatch } from '~/contexts/LayoutState';

import CloseButton from '../CloseButton';

const TrackingUploadModal = ({
  handleModalClose, innerRef,
}) => {
  const [error, setError] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState(false);

  const { notify } = useLayoutDispatch();

  const onFileChange = useCallback((e) => {
    setFile(e.target.files[0]);
  });

  const fileUpload = useCallback(async ({ override }) => {
    if (!file) {
      return handleModalClose();
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append('csv_file', file);
    formData.append('override_validation', override ? 1 : 0);

    try {
      const response = await trackingUploadImport(formData);

      const {
        data: {
          message,
        },
      } = response;

      // @NOTE intentionally triggering a notification that won't be dismissed
      notify.addToast(
        message,
        {
          appearance: 'success',
          autoDismiss: true,
        },
      );

      return handleModalClose();
    } catch (err) {
      const message = get(err, 'response.data.message', get(err, 'message', err));
      const stack = JSON.stringify(get(err, 'response.data.trace', get(err, 'stack', err)), null, 2);
      const type = get(err, 'response.data.type', get(err, 'type', err));
      const data = get(err, 'response.data.data.errors', get(err, 'errors', err));

      setError({ message, stack, type });
      setValidationErrors(data);
      console.log('TrackingUploadModal.fileUpload.error', { err });
    } finally {
      setSubmitting(false);
    }
  }, [file]);

  const onFormSubmit = useCallback(({ override }) => (e) => {
    e.preventDefault(); // Stop form submit
    return fileUpload({ override });
  });

  const UploadForm = useMemo(() => (
    <form onSubmit={onFormSubmit} className="flex flex-col">
      <div className="text-sm opacity-75 p-2 pt-0">
        <p>
          The Bulk Tracking Number accepts the following columns:
        </p>
        <ul>
          <li>
            <b>order_number</b>
            {' '}
            — Required
          </li>
          <li>
            <b>tracking_number</b>
            {' '}
            — Required
          </li>
          <li>
            <b>shipped_at</b>
            {' '}
            — Required (Eastern Daylight Time; EDT)
          </li>
          <li>
            <b>carrier_code</b>
            {' '}
            — Optional
          </li>
          <li>
            <b>service_code</b>
            {' '}
            — Optional
          </li>
          <li>
            <b>zipcode</b>
            {' '}
            — Optional
          </li>
        </ul>
      </div>
      <Button className="mt-2 mb-4">
        <input
          type="file"
          name="csv_file"
          onChange={onFileChange}
        />
      </Button>
      <Button onClick={onFormSubmit({ override: false })} variant="primary">
        Submit
      </Button>
    </form>
  ), [onFileChange, onFormSubmit]);

  const ValidationForm = useMemo(() => (
    <form onSubmit={onFormSubmit} className="flex flex-col">
      <div className="text-sm opacity-75 p-2 pt-0 mb-5">
        <Accordion title={`${validationErrors.length} Validation Errors`}>
          <ul className="pl-4">
            {validationErrors.map(e => <li className="pb-2">{e}</li>)}
          </ul>
        </Accordion>
      </div>
      <ButtonGroup>
        <Button onClick={onFormSubmit({ override: true })} variant="blue" className="mr-2">
          Import
        </Button>

        <Button onClick={handleModalClose} variant="primary">
          Cancel
        </Button>
      </ButtonGroup>
    </form>
  ), [validationErrors]);

  if (submitting) {
    return (
      <Loading
        message="Uploading Tracking Update"
      />
    );
  }

  return (
    <div ref={innerRef} className="flex flex-col max-w-lg">
      <div className="flex items-center justify-between p-4">
        <h1 className="font-normal mr-8 text-grey-darkest">
          Tracking Upload
        </h1>
        <CloseButton onClick={handleModalClose} />
      </div>
      <div className="p-4">
        {!error && UploadForm}
        {(error && error.type != 'validation') && <AlertError error={error.message} componentStack={error.stack} />}
        {(error && error.type == 'validation') && ValidationForm}
      </div>
    </div>
  );
};

TrackingUploadModal.propTypes = {
  handleModalClose: PropTypes.func.isRequired,
  innerRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }).isRequired,
};

export default TrackingUploadModal;
