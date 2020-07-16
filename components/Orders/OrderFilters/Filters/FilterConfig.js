import { keyBy, startCase } from 'lodash';

import {
  InputTypes,
  SelectInput,
  TextInput,
  DateInput,
} from './Inputs';

import {
  FilterWarehouse,
  FilterCarrierService,
  FilterPageSize,
  FilterDynamicProteinQty,
  FilterLineHaul,
  meatGroupOptions,
} from './Custom';

export const filterOptionsYesNo = [
  { label: 'Yes', value: '1' },
  { label: 'No', value: '0' },
];

const boxTypeOptions = [
  { label: 'Custom', value: 'custom' },
  { label: 'Curated', value: 'curated' },
];

const filterConfigHasTrackingNumber = {
  inputType: InputTypes.select,
  showEmptyOption: false,
  options: [
    { label: 'Yes/No - Has TN?', value: '' },
    ...filterOptionsYesNo,
  ],
};

const filterConfigContainsOneSkuOfMeatGroup = {
  inputType: InputTypes.select,
  options: meatGroupOptions,
  label: 'Has Exactly One SKU of',
  placeholder: 'Select a Meat Group',
};

/**
 * Filters keyed by name — eg the value on FilterState that
 *      will be manupulated by the input.
 */
const filterConfig = {
  warehouseId: { inputType: InputTypes.component, FilterComponent: FilterWarehouse },
  trackingNumbers: { inputType: InputTypes.text },
  tnt: { inputType: InputTypes.text, placeholder: 'TNT' },
  shippedStartDate: { inputType: InputTypes.date },
  shippedEndDate: { inputType: InputTypes.date, endOfDay: true },
  releasedStartDate: { inputType: InputTypes.date },
  releasedEndDate: { inputType: InputTypes.date, endOfDay: true },
  process: { inputType: InputTypes.text },
  priority: { inputType: InputTypes.text },
  postalCodes: { inputType: InputTypes.text },
  pageSize: { inputType: InputTypes.component, FilterComponent: FilterPageSize },
  orderNumbers: { inputType: InputTypes.text },
  orderedStartDate: { inputType: InputTypes.date },
  orderedEndDate: { inputType: InputTypes.date, endOfDay: true },
  shipRangeStart: { inputType: InputTypes.date },
  shipRangeEnd: { inputType: InputTypes.date, endOfDay: true },
  onLoad: { inputType: InputTypes.select, options: filterOptionsYesNo },
  noSaturdayOntrac: { inputType: InputTypes.select, options: filterOptionsYesNo },
  noSaturdayGls: { inputType: InputTypes.select, options: filterOptionsYesNo },
  noSaturdayExpress: { inputType: InputTypes.select, options: filterOptionsYesNo },
  noSaturdayDelivery: { inputType: InputTypes.select, options: filterOptionsYesNo },
  isResidential: { inputType: InputTypes.select, options: filterOptionsYesNo },
  isReship: { inputType: InputTypes.select, options: filterOptionsYesNo },
  isShippable: { inputType: InputTypes.select, options: filterOptionsYesNo },
  isFulfillable: { inputType: InputTypes.select, options: filterOptionsYesNo },
  isEditable: { inputType: InputTypes.select, options: filterOptionsYesNo },
  includesAddons: { inputType: InputTypes.select, options: filterOptionsYesNo },
  hasTrackingNumber: { ...filterConfigHasTrackingNumber },
  hasSubstitution: { inputType: InputTypes.select, options: filterOptionsYesNo },
  hasOrderAttentionNeeded: { label: 'Has Attention Needed', inputType: InputTypes.select, options: filterOptionsYesNo },
  hasOneSkuOfMeatGroup: { ...filterConfigContainsOneSkuOfMeatGroup },
  dynamicProteinQty: { inputType: InputTypes.component, FilterComponent: FilterDynamicProteinQty },
  hasDcPulledAt: { inputType: InputTypes.select, options: filterOptionsYesNo },
  dryIce: { inputType: InputTypes.text },
  customerNameEmail: { inputType: InputTypes.text },
  carrierService: { inputType: InputTypes.component, FilterComponent: FilterCarrierService },
  lineHaul: { inputType: InputTypes.component, FilterComponent: FilterLineHaul },
  boxType: { inputType: InputTypes.select, options: boxTypeOptions },
};

// @TODO: re-enable these when dropdown is in place
const filterSort = {
  orderNumbers: 100,
  orderedStartDate: 99,
  orderedEndDate: 98,

  shippedStartDate: 87,
  shippedEndDate: 86,

  releasedStartDate: 85,
  releasedEndDate: 84,

  warehouseId: 96,
  boxType: 95,
  tnt: 94,
  process: 93,
  carrierService: 88,

  pageSize: 73,
  priority: 70,
  customerNameEmail: 67,
  dryIce: 60,
  postalCodes: 60,
  trackingNumbers: 58,

  noSaturdayDelivery: 80,
  noSaturdayOntrac: 47,
  noSaturdayExpress: 40,
  noSaturdayGls: 39,

  hasTrackingNumber: 17,

  isEditable: 17,
  isShippable: 13,
  isFulfillable: 13,
  includesAddons: 10,
};


const getFilterComponent = (config) => {
  const { inputType, FilterComponent = null } = config;

  switch (inputType) {
    case InputTypes.component:
      return FilterComponent;

    case InputTypes.select:
      return SelectInput;

    case InputTypes.date:
      return DateInput;

    case InputTypes.text:
    default: // @NOTE: the default is a text input
      return TextInput;
  }
};

const sortedFilters = Object.keys(filterConfig)
  .map((name) => {
    const sort = filterSort[name] || 0;
    const visible = sort === 100;

    const { inputType, ...restConfig } = filterConfig[name];

    return {
      ...restConfig,
      FilterComponent: getFilterComponent(filterConfig[name]),
      sort,
      name, // @NOTE: All inputs depend on this attribute
      placeholder: inputType !== InputTypes.component
        ? restConfig.placeholder || startCase(name)
        : null,
    };
  })

  .sort((a, b) => b.sort - a.sort);

// @NOTE: exporting an object keyed by the input name
export default keyBy(sortedFilters, 'name');
