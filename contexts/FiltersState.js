import React, { useReducer, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  isEmpty, isArray, isString, isNumber, set, isObject,
} from 'lodash';
import 'moment-timezone';

import { childrenType } from '../types';
import useDebounce from '../hooks/useDebounce';

import { estToUtc, dateTimeFormats } from '~/components/common/EstDate';

export const filtersDebounce = 200; // 200ms

export const initialFiltersState = {
  filters: {
    direction: 'asc',
    orderBy: 'order_date',
    page: 1,
    skuFilters: [],
    flow: 'unprocessed',
    pageSize: window.pageSize,
    // @NOTE: carrierCode & serviceCode default to these values
    carrierCode: null,
    serviceCode: null,
    dynamicProteinQty: {
      meat_group: null,
      qty: null,
    },
    lineHaul: null,
  },
};

export const SkuFilterHelper = {
  generate: ({ sku, skuExclude = false, typeExclude = [] }) => (
    { sku, skuExclude, typeExclude }
  ),
  generateExcludeType: ({ type, exclude = false }) => (
    { type, exclude }
  ),
};

export const TypeExcludeProptype = PropTypes.shape({
  type: PropTypes.string,
  exclude: PropTypes.bool,
});

export const SkuFilterPropType = PropTypes.shape({
  sku: PropTypes.string,
  skuExclude: PropTypes.bool,
  typeExclude: PropTypes.arrayOf(TypeExcludeProptype),
});

export const ProductTypesPropType = PropTypes.object; /* eslint react/forbid-prop-types: 0 */

const clearSelectionFiltersOmit = [
  'direction',
  'orderBy',
  'page',
  'pageSize',
];

const FiltersStateContext = React.createContext();
const FiltersDispatchContext = React.createContext();

const FiltersActions = {
  reset: 'FiltersActions.reset',
  change: 'FiltersActions.change',
  changes: 'FiltersActions.changes',
  replaceSkuFilter: 'FiltersActions.replaceSkuFilter',
};

const reducerChangeFilter = (
  state,
  { payload: { key, value } },
) => {
  /* @NOTE: carrierService is a special case handled by a single FilterInput
    *        which also needs to be reset like a normal filter so we fork
    *        the logic here for the simplicity of both code paths.
    */
  if (key === 'carrierService') {
    const {
      carrierCode,
      serviceCode,
    } = value || { ...initialFiltersState.filters };

    return {
      ...state,
      filters: {
        ...state.filters,
        carrierCode,
        serviceCode,
      },
    };
  } if (key.includes('.')) { // allows for dot notation
    const newState = { ...state };

    newState.filters = set(
      newState.filters,
      key,
      value,
    );

    return newState;
  }

  return {
    ...state,
    filters: {
      ...state.filters,
      [key]: value,
    },
  };
};

const FiltersReducer = (state, action) => {
  switch (action.type) {
    case FiltersActions.reset: {
      return { ...initialFiltersState };
    }
    case FiltersActions.change: {
      return reducerChangeFilter(
        state,
        action,
      );
    }
    case FiltersActions.changes: {
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };
    }
    case FiltersActions.replaceSkuFilter: {
      const { sku: replaceSku, replace } = action.payload;

      let foundReplace = false;
      const skuFilters = state.filters.skuFilters.map((sf) => {
        // @NOTE: you can pass a falsy-value to replace and this function will
        //        remove the skuFilter as expected.
        if (sf.sku === replaceSku) {
          foundReplace = true;

          return (!replace)
            ? replace
            : { ...replace };
        }

        return sf;
      }).filter(sf => !!sf);

      const newSkuFilters = (foundReplace)
        ? skuFilters
        : [...skuFilters, replace];

      return {
        ...state,
        filters: {
          ...state.filters,
          skuFilters: newSkuFilters,
        },
      };
    }
    default:
      throw new Error(`Unknown action type: '${action.type}'`);
  }
};

const FiltersProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    // import useReducerDebugger from '../hooks/useReducerDebugger';
    // useReducerDebugger(FiltersReducer, 'FiltersReducer'),
    FiltersReducer,
    initialFiltersState,
  );

  const dispatchState = {
    dispatch,
    resetFilters: () => dispatch({ type: FiltersActions.reset }),
    resetFilter: key => dispatch({
      type: FiltersActions.change,
      payload: {
        key,
        value: initialFiltersState[key] || null,
      },
    }),
    changeFilter: (key, value) => {
      dispatch({
        type: FiltersActions.change,
        payload: { key, value },
      });
    },
    changeFilters: (newFilters) => {
      dispatch({
        type: FiltersActions.changes,
        payload: newFilters,
      });
    },
    replaceSkuFilter: ({ sku, replace }) => {
      dispatch({
        type: FiltersActions.replaceSkuFilter,
        payload: { sku, replace },
      });
    },
    changeSort: (nOrderBy, nDirection) => dispatch({
      type: FiltersActions.changes,
      payload: {
        orderBy: nOrderBy,
        direction: nDirection,
      },
    }),
    eventFilterChange: event => dispatch({
      type: FiltersActions.change,
      payload: {
        key: event.target.name,
        value: event.target.value,
      },
    }),
    getFilterParameters: () => {
      const { filters } = state;

      const estDates = Object.keys(filters)
        // filter only the dates
        .filter(filterKey => filters[filterKey] instanceof Date)
        // update the params with EST value (the FE is always assumed to be in EST)
        .reduce(
          (acc, filterKey) => {
            if (
              filterKey.includes('shipped')
              && filters.flow !== 'shipped'
            ) {
              // if the flow is not shipped, don't include the shipped
              return acc;
            }

            const utcDate = estToUtc(
              filters[filterKey],
              dateTimeFormats.iso8601,
            );

            acc[filterKey] = utcDate;
            return acc;
          },
          {},
        );

      const params = {
        ...filters,
        ...estDates,
      };

      return Object.keys(params).filter(p => (
        params[p] !== null
        && (
          (isArray(params[p]) && !isEmpty(params[p]))
          || (isString(params[p]) && params[p] !== '')
          || (isNumber(params[p]))
          || (isObject(params[p]))
        )
      ))
        .reduce((acc, p) => {
          acc[p] = params[p];
          return acc;
        }, {});
    },
  };

  return (
    <FiltersStateContext.Provider value={state}>
      <FiltersDispatchContext.Provider value={dispatchState}>
        {children}
      </FiltersDispatchContext.Provider>
    </FiltersStateContext.Provider>
  );
};

FiltersProvider.propTypes = {
  children: childrenType.isRequired,
};

const FiltersStateConsumer = FiltersStateContext.Consumer;
const FiltersDispatchConsumer = FiltersDispatchContext.Consumer;

const useFiltersState = () => {
  const context = useContext(FiltersStateContext);
  if (context === undefined) {
    throw new Error('useFiltersState must be within a FiltersProvider');
  }
  return context;
};

// @NOTE: when using the filter state within an effect, you should use this
//        debounced version to avoid unintended side-effects.
const useDebouncedFiltersState = () => useDebounce(
  useFiltersState(),
  filtersDebounce,
);

const useFiltersDispatch = () => {
  const context = useContext(FiltersDispatchContext);
  if (context === undefined) {
    throw new Error('useFiltersState must be within a FiltersProvider');
  }
  return context;
};

export {
  FiltersProvider,
  FiltersActions,

  FiltersStateConsumer,
  FiltersDispatchConsumer,

  useFiltersState,
  useDebouncedFiltersState,
  useFiltersDispatch,

  clearSelectionFiltersOmit,
};
