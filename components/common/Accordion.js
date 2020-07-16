import PropTypes from 'prop-types';
import React, {
  useState,
} from 'react';

import { childrenType } from '../../types';
import { ChevronDown, ChevronUp } from './Icons';

const Accordion = React.forwardRef((props, ref) => {
  const {
    title,
    children,
  } = props;

  const [expanded, setExpanded] = useState(false);

  const Icon = expanded ? ChevronUp : ChevronDown;

  return (
    <div ref={ref}>
      <header
        className="flex justify-between items-center p-5 pl-8 pr-8 cursor-pointer select-none"
        onClick={() => setExpanded(exp => !exp)}
      >
        <span className="font-thin text-xl mr-4">
          {title}
        </span>
        <div className="rounded-full border border w-7 h-7 flex items-center justify-center p-2">
          <Icon />
        </div>
      </header>

      {expanded && (
        <div className="pl-8 pr-8 pb-5 text-grey-darkest">
          {children}
        </div>
      )}
    </div>
  );
});

Accordion.propTypes = {
  title: PropTypes.string.isRequired,
  children: childrenType.isRequired,
};

export default Accordion;
