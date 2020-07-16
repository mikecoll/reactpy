import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import LoaderSvgWrapper from '../components/common/LoaderSvgWrapper';

const EditOrderLoader = React.forwardRef((props, ref) => {
  const {
    cols = 1,
    className,
    height = 400,
    width = 200,
    ...restProps
  } = props;

  const formLoaders = [];
  for (let i = 0; i < cols; i += 1) {
    formLoaders.push(
      <div
        ref={ref}
        key={i}
        className={classNames(
          'p-4 w-full',
          className,
        )}
        {...restProps}
      >
        <LoaderSvgWrapper height={height} width={width} className="w-full">
          <rect x="0" y="18" rx="3" ry="3" width="83" height="25" />

          <rect x="0" y="60" rx="2" ry="2" width="100" height="10" />
          <rect x="0" y="75" rx="2" ry="2" width="140" height="20" />

          <rect x="0" y="110" rx="2" ry="2" width="100" height="10" />
          <rect x="0" y="125" rx="2" ry="2" width="140" height="20" />

          <rect x="0" y="160" rx="2" ry="2" width="100" height="10" />
          <rect x="0" y="175" rx="2" ry="2" width="140" height="20" />

          <rect x="0" y="210" rx="2" ry="2" width="100" height="10" />
          <rect x="0" y="225" rx="2" ry="2" width="140" height="20" />

          <rect x="0" y="260" rx="2" ry="2" width="100" height="10" />
          <rect x="0" y="275" rx="2" ry="2" width="140" height="20" />

          <rect x="0" y="310" rx="2" ry="2" width="100" height="10" />
          <rect x="0" y="325" rx="2" ry="2" width="140" height="20" />
        </LoaderSvgWrapper>
      </div>,
    );
  }

  return (
    <div className={classNames(
      'overflow-scroll max-h-screen',
      cols === 1 && 'max-w-sm m-center',
      cols > 1 && 'max-w-2xl',
    )}
    >
      <div className="p-4 flex">
        {formLoaders}
      </div>
    </div>
  );
});

EditOrderLoader.defaultProps = {
  className: null,
  width: 200,
  height: 400,
};

EditOrderLoader.propTypes = {
  cols: PropTypes.number.isRequired,
  className: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
};

export default EditOrderLoader;
