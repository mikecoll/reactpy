import React, { useMemo } from 'react';
import { max } from 'lodash';
import PropTypes from 'prop-types';

import LineDetailBasic from './LineDetail/LineDetailBasic';

const AggregateLineItems = React.memo((props) => {
  const {
    lineItems,
    color,
    DetailComponent,
  } = props;

  const total = useMemo(() => lineItems.reduce((sum, lineItem) => (
    sum + lineItem.value
  ), 0.00), [lineItems]);

  /* disabled shouldColorize functionality to default to always on */
  const shouldColorize = true;

  const percentageLineItems = useMemo(() => {
    const lineItemsWithPercents = lineItems
      .map(lineItem => ({
        ...lineItem,
        percent: shouldColorize
          ? ((parseFloat(lineItem.value) / total) * 100)
          : 0,
        total,
      }));

    const liPercentMax = max(lineItemsWithPercents.map(liwp => liwp.percent));

    // Normalize percentages
    return lineItemsWithPercents.map(lineItem => ({
      ...lineItem,
      normalizedPercent: shouldColorize
        ? ((parseFloat(lineItem.percent) / liPercentMax) * 100)
        : 0,
    }));
  }, [lineItems, shouldColorize]);

  return percentageLineItems.map(lineItem => (
    <DetailComponent
      key={lineItem.id}
      {...lineItem}
      shouldColorize={shouldColorize}
      color={lineItem.color || color}
    />
  ));
});

AggregateLineItems.defaultProps = {
  color: 'blue-lighter',
  DetailComponent: LineDetailBasic,
};

AggregateLineItems.propTypes = {
  lineItems: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      label: PropTypes.string,
      value: PropTypes.number,
    }),
  ).isRequired,
  color: PropTypes.string,
  DetailComponent: PropTypes.elementType,
};

export default AggregateLineItems;
