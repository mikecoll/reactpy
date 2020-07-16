import PropTypes from 'prop-types';
import React from 'react';

import Button from '~/components/common/Button';
import { Accordion as AccordionIcon } from '~/components/common/Icons';

const ToggleButton = ({ expanded, handleClick }) => (
  <Button border rounded onClick={handleClick}>
    {expanded ? 'Collapse' : 'Expand'}
    <AccordionIcon className="pl-2" expanded={expanded} />
  </Button>
);

ToggleButton.propTypes = {
  expanded: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
};

export default ToggleButton;
