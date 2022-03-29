import { useMemo } from 'react';

const headStyle = {
  opacity: 0.9,
  fill: '#000',
  fillOpacity: 1,
  fillRule: 'evenodd',
  stroke: 'none',
  strokeWidth: 0.2,
  strokeMiterlimit: 4,
  strokeDashoffset: 0,
  strokeOpacity: 1,
};
const stemStyle = {
  fill: 'none',
  fillOpacity: 0.75,
  fillRule: 'evenodd',
  stroke: '#000',
  strokeWidth: 1.5,
  strokeLinecap: 'butt',
  strokeLinejoin: 'miter',
  strokeMiterlimit: 4,
  strokeDasharray: 'none',
  strokeOpacity: 1,
};
const flagStyle = {
  fill: '#000',
  fillOpacity: 1,
  fillRule: 'evenodd',
  stroke: 'none',
  strokeWidth: '1px',
  strokeLinecap: 'butt',
  strokeLinejoin: 'miter',
  strokeOpacity: 1,
};

const useStyles = color =>
  useMemo(
    () => ({
      flagStyle: { ...flagStyle, fill: color },
      headStyle: { ...headStyle, fill: color },
      stemStyle: { ...stemStyle, stroke: color },
    }),
    [color]
  );

export { flagStyle, headStyle, stemStyle, useStyles };
