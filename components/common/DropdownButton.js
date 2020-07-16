import PropTypes from 'prop-types';
import React, {
  useState, useEffect, useRef,
} from 'react';
import classNames from 'classnames';
import { useClickAway } from 'react-use';

import { buttonDisabledType } from '../../types';
import someDisabled from '../../utilities/someDisabled';

import Button from './Button';
import ButtonGroup from './ButtonGroup';

const baseClass = 'btn-dropdown relative';

const DropdownButton = React.forwardRef((props, ref) => {
  const {
    children,
    className,
    label,
    alignRight,
    disabled,
    ...otherProps
  } = props;

  const node = ref || useRef();

  const [expanded, setExpanded] = useState(false);

  useClickAway(node, (e) => {
    if (!node.current.contains(e.target)) {
      setExpanded(false); // outside dropdown click;
    }
  });

  // if the component is disabled it should be collapse
  useEffect(() => {
    someDisabled(disabled) && setExpanded(false);
  }, [disabled]);

  return (
    <span ref={node}>
      <Button
        {...otherProps}
        onClick={() => setExpanded(exp => !exp)}
        className={classNames(
          baseClass,
          expanded && 'expanded',
          className,
        )}
        disabled={disabled}
      >
        {label}
      </Button>
      {expanded && (
        <div
          className={classNames(
            'dropdown-menu shadow',
            alignRight && 'right',
          )}
        >
          <ButtonGroup className="absolute left-0" vertical>
            {children}
          </ButtonGroup>
        </div>
      )}
    </span>
  );
});

DropdownButton.defaultProps = {
  alignRight: false,
  label: (<i className="fa fa-ellipsis-v" />),
  className: '',
  disabled: false,
};

DropdownButton.propTypes = {
  className: PropTypes.string,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
  ]),
  alignRight: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  disabled: buttonDisabledType,
};

export default DropdownButton;
