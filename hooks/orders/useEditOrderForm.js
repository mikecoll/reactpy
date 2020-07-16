import { useCallback } from 'react';
import { get } from 'lodash';
import { useForm } from 'react-hook-form';


const useEditOrderForm = (errors) => {
  const {
    register,
    handleSubmit,
    errors: formErrors,
  } = useForm({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    submitFocusError: true,
  });

  const getErrors = useCallback(
    (dataKey, inputName) => {
      const error = (dataKey && errors[dataKey] && errors[dataKey][0])
        || (inputName && errors[inputName] && errors[inputName][0])
        || (inputName && get(formErrors, inputName))
        || (dataKey && get(formErrors, dataKey));
      return error;
    },
    [formErrors],
  );

  return [
    { register, errors },
    { handleSubmit, getErrors },
  ];
};

export default useEditOrderForm;
