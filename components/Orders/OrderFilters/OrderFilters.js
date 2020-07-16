import React, { useCallback } from 'react';
import { useLocalStorage } from 'react-use';
import classNames from 'classnames';

import { useFiltersDispatch } from '~/contexts/FiltersState';

import AttributeFilters from './AttributeFilters';
import FlowFilters from './FlowFilters';
import { SkusFilter } from './SkusFilter';

import Button, { buttonBaseClass } from '~/components/common/Button';
import ButtonGroup from '~/components/common/ButtonGroup';
import * as Icons from '~/components/common/Icons';

const OrderFilters = React.memo(() => {
  const [visible, setVisible] = useLocalStorage('dom-filters-visibility', true);
  const { resetFilters } = useFiltersDispatch();

  const toggleVisible = useCallback(
    () => setVisible(!visible),
    [visible],
  );

  return (
    <div className="mb-4">

      <ButtonGroup className="w-full">
        <FlowFilters />

        <div
          className={classNames(
            buttonBaseClass,
            'text-right text-grey-dark cursor-not-allowed',
          )}
        >
          Filters
        </div>

        <Button
          onClick={resetFilters}
          className={{ 'p-2': false, 'px-3': false }}
        >
          <Icons.Clear />
        </Button>

        <Button
          onClick={toggleVisible}
          className={{ 'p-2': false, 'px-3': false }}
        >
          <Icons.Accordion expanded={visible} />
        </Button>

      </ButtonGroup>

      {visible && (
        <div className="pt-2">
          <AttributeFilters />
          <SkusFilter />
        </div>
      )}
    </div>
  );
});

export default OrderFilters;
