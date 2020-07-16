/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import classNames from 'classnames';

import {
  useFiltersDispatch,
  SkuFilterHelper,
  SkuFilterPropType,
  ProductTypesPropType,
} from '~/contexts/FiltersState';

import LoaderSvgWrapper from '~/components/common/LoaderSvgWrapper';
import * as Icons from '~/components/common/Icons';
import CardActions from '~/components/layouts/CardActions';

const COMPONENT_WIDTH = 170;

const ProductTypeSelectLoader = (
  <LoaderSvgWrapper height="58" width={COMPONENT_WIDTH}>
    <rect x="115" y="0" rx="5" ry="5" width="15" height="15" />
    <rect x="135" y="0" rx="5" ry="5" width="15" height="15" />
    <rect x={COMPONENT_WIDTH - 15} y="0" rx="5" ry="5" width="15" height="15" />
    <rect x="0" y="0" rx="5" ry="5" width="100" height="15" />
    <rect x="0" y="20" rx="5" ry="5" width={COMPONENT_WIDTH} height="38" />
  </LoaderSvgWrapper>
);

const ProductTypeSelect = ({ skuFilter, productTypes, isLoading }) => {
  const { replaceSkuFilter } = useFiltersDispatch();

  const options = useMemo(() => {
    const currentTypes = skuFilter.typeExclude.map(sf => sf.type);
    return Object.keys(productTypes)
      .map(ot => ({ value: ot, label: productTypes[ot] }))
      .filter(o => !currentTypes.includes(o.value));
  }, [productTypes, skuFilter.typeExclude]);

  const addProductType = useCallback(({ value: type }) => replaceSkuFilter({
    sku: skuFilter.sku,
    replace: {
      ...skuFilter,
      typeExclude: [
        SkuFilterHelper.generateExcludeType({ type }),
        ...skuFilter.typeExclude,
      ],
    },
  }), [skuFilter]);

  const selectAllTypes = useCallback(() => {
    const currentTypes = skuFilter.typeExclude.map(te => te.type);
    const replace = SkuFilterHelper.generate({
      sku: skuFilter.sku,
      typeExclude: [
        ...skuFilter.typeExclude,
        ...Object.keys(productTypes)
          .map((type) => {
            const idx = currentTypes.indexOf(type);

            return (idx === -1)
              ? SkuFilterHelper.generateExcludeType({ type })
              : null;
          })
          .filter(i => !!i),
      ],
    });

    replaceSkuFilter({
      sku: skuFilter.sku,
      replace,
    });
  }, [skuFilter, productTypes]);

  const toggleExclude = useCallback(() => {
    const excludeBools = skuFilter.typeExclude.map(te => te.exclude);

    const countEnabled = excludeBools.filter(te => !!te).length;
    const countDisabled = excludeBools.filter(te => !te).length;

    let toggleValue;
    if (countEnabled >= countDisabled) {
      toggleValue = !(countEnabled === excludeBools.length);
    } else {
      toggleValue = (countDisabled === excludeBools.length);
    }

    const replace = {
      ...skuFilter,
      typeExclude: skuFilter.typeExclude.map(
        te => ({ ...te, exclude: toggleValue }),
      ),
    };

    return replaceSkuFilter({
      sku: skuFilter.sku,
      replace,
    });
  });

  const selectAllClicked = useCallback(
    () => ((skuFilter.typeExclude.length !== Object.keys(productTypes).length)
      ? selectAllTypes()
      : toggleExclude()),
  );


  const removeAllTypes = useCallback(() => replaceSkuFilter({
    sku: skuFilter.sku,
    replace: SkuFilterHelper.generate({ sku: skuFilter.sku }),
  }), [skuFilter]);

  const removeSkuFilter = () => replaceSkuFilter({
    sku: skuFilter.sku,
    replace: null,
  }, [skuFilter.sku]);

  if (isLoading) {
    return ProductTypeSelectLoader;
  }

  return (
    <>
      <div className="flex py-1 text-grey-darker text-xs uppercase">
        <div className={classNames(
          'flex-grow',
          skuFilter.skuExclude && 'text-grey-dark',
        )}
        >
          Type
        </div>
        <CardActions>
          {!skuFilter.skuExclude && (
            <>
              <Icons.SelectAll
                className="flex-grow text-right"
                onClick={() => selectAllClicked()}
              />
              <Icons.Clear
                className="flex-grow text-right"
                onClick={() => removeAllTypes()}
              />
            </>
          )}
          <Icons.Trash
            className="flex-grow text-right"
            onClick={() => removeSkuFilter()}
          />
        </CardActions>
      </div>
      <Select
        className={classNames(
          'w-100',
          skuFilter.skuExclude && 'cursor-not-allowed opacity-50',
        )}
        defaultValue={false}
        value={false}
        options={options}
        onChange={addProductType}
        noOptionsMessage={() => 'All Product Types Selected'}
        isDisabled={skuFilter.skuExclude}
      />
    </>
  );
};

ProductTypeSelect.propTypes = {
  productTypes: ProductTypesPropType.isRequired,
  skuFilter: SkuFilterPropType.isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default ProductTypeSelect;
