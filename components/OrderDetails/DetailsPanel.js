import PropTypes from 'prop-types';
import React, { useState } from 'react';

import ToggleButton from './ToggleButton';

const DetailsPanel = (props) => {
  const {
    label,
    initiallyExpanded,
    ...restProps
  } = props;

  const [expanded, setExpanded] = useState(initiallyExpanded);

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between pt-2">
        <h3 className="font-normal text-grey-darkest">{label}</h3>
        <ToggleButton
          expanded={expanded}
          handleClick={() => setExpanded(exp => !exp)}
        />
      </div>
      {expanded && (
        <div className="mt-2" {...restProps} />
      )}
    </div>
  );
};

DetailsPanel.defaultProps = {
  initiallyExpanded: true,
};

DetailsPanel.propTypes = {
  label: PropTypes.string.isRequired,
  initiallyExpanded: PropTypes.bool,
};

export default DetailsPanel;
