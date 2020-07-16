import React, { useMemo, useCallback } from 'react';
import sortBy from 'lodash/sortBy';
import startCase from 'lodash/startCase';

import { InputLabel, SelectMulti } from '~/components/common/inputs';

const SubstituteProductTypeInput = ({
  handleChange,
  productTypes,
  selectedType,
  name,
}) => {
  const generateProductTypeOption = useCallback((pt) => {
    const value = (!!pt && pt !== '')
      ? pt
      : '';

    const label = (!!pt && pt.length > 0)
      ? startCase(pt)
      : '[Any Product Type]';

    return { value, label };
  }, [productTypes]);

  const options = useMemo(
    () => sortBy(
      Object.values(productTypes).map(generateProductTypeOption),
      'label',
      'asc',
    ),
    [productTypes],
  );

  return (
    <>
      <InputLabel name={name}>PRODUCT TYPE (optional)</InputLabel>
      <SelectMulti
        name={name}
        options={options}
        isMulti={false}
        placeholder="Select Product Type..."
        value={generateProductTypeOption(selectedType)}
        onChange={({ value }) => handleChange({
          target: {
            value,
            name,
          },
        })}
      />
    </>
  );
};

SubstituteProductTypeInput.propTypes = {
  // @TODO: add proptypes
};

export default SubstituteProductTypeInput;
