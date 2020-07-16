import React from 'react';

import LoaderSvgWrapper from '~/components/common/LoaderSvgWrapper';

const FilterLoader = () => (
  <LoaderSvgWrapper height="36.5" width="180">
    <rect x="0" y="0" rx="0.12" ry="0.12" width="130" height="10" />
    <rect x="0" y="14" rx="0.12" ry="0.12" width="180" height="22" />
  </LoaderSvgWrapper>
);

export default FilterLoader;
