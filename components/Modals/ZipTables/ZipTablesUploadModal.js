import PropTypes from 'prop-types';
import React, { useState, useCallback, useMemo } from 'react';
import { get } from 'lodash';

import Loading from '~/components/common/Loading';
import Button from '~/components/common/Button';
import { Error as AlertError } from '~/components/common/Alert';

import { zipTablesUploadImport } from '~/utilities/api';
import { useLayoutDispatch } from '~/contexts/LayoutState';

import CloseButton from '../CloseButton';

const ZipTablesUploadModal = ({
  handleModalClose, innerRef,
}) => {
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [file, setFile] = useState(null);

  const { notify } = useLayoutDispatch();

  const onFileChange = useCallback((e) => {
    setFile(e.target.files[0]);
  });

  const fileUpload = useCallback(async () => {
    if (!file) {
      return handleModalClose();
    }

    setSubmitting(true);

    const formData = new FormData();
    formData.append('csv_file', file);

    try {
      const response = await zipTablesUploadImport(formData);

      const {
        data: {
          data: {
            importUuid,
          },
          message,
        },
      } = response;

      // @NOTE intentionally triggering a notification that won't be dismissed
      notify.addToast(
        `${message} (${importUuid})`,
        {
          appearance: 'success',
          autoDismiss: false,
        },
      );

      return handleModalClose();
    } catch (err) {
      const message = get(err, 'response.data.message', get(err, 'message', err));
      const stack = JSON.stringify(get(err, 'response.data.trace', get(err, 'stack', err)), null, 2);

      setError({ message, stack });
      console.log('ZipTablesUploadModal.fileUpload.error', { err });
    } finally {
      setSubmitting(false);
    }
  }, [file]);

  const onFormSubmit = useCallback((e) => {
    e.preventDefault(); // Stop form submit
    return fileUpload();
  });

  const UploadForm = useMemo(() => (
    <form onSubmit={onFormSubmit} className="flex flex-col">
      <Button>
        <input
          type="file"
          name="csv_file"
          onChange={onFileChange}
        />
      </Button>
      <Button onClick={onFormSubmit} variant="primary">
        Submit
      </Button>
    </form>
  ), [onFileChange, onFormSubmit]);

  if (submitting) {
    return (
      <Loading
        message="Uploading Ziptable Update"
      />
    );
  }

  return (
    <div ref={innerRef} className="flex flex-col max-w-lg">
      <div className="flex items-center justify-between p-4">
        <h1 className="font-normal mr-8 text-grey-darkest">
          Zip Tables Upload
        </h1>
        <CloseButton onClick={handleModalClose} />
      </div>
      <div className="p-4">
        {!error && UploadForm}
        {error && <AlertError error={error.message} componentStack={error.stack} />}
      </div>
    </div>
  );
};

ZipTablesUploadModal.propTypes = {
  handleModalClose: PropTypes.func.isRequired,
  innerRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }).isRequired,
};

export default ZipTablesUploadModal;
