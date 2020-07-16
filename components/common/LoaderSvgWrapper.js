import React from 'react';
import ContentLoader from 'react-content-loader';

const LoaderSvgWrapper = React.forwardRef((props, ref) => (
  <ContentLoader
    height={1}
    width={100}
    speed={2}
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
    className="block"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMinYMin slice"
    ref={ref}
    {...props}
  />
));

export default LoaderSvgWrapper;
