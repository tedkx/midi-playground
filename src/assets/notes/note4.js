/* from https://commons.wikimedia.org/wiki/Category:SVG_musical_notation */
import React from 'react';
import { stemStyle, useStyles } from './styles';

const Note4 = ({ color = '#000' }) => {
  const { headStyle, stemStyle } = useStyles(color);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.0"
      width="14.566"
      height="41.919998"
      id="svg1497"
    >
      <defs id="defs1500" />
      <g transform="matrix(-1,0,0,-1,313.2829,340.3223)" id="g11029">
        <path
          d="M 303.13715,299.65106 C 299.74131,301.47103 297.93187,304.76561 299.04493,307.24402 C 300.23219,309.88766 304.31194,310.63374 308.15151,308.90939 C 311.99107,307.18503 314.14367,303.63999 312.95641,300.99636 C 311.76914,298.35272 307.6894,297.60664 303.84983,299.33099 C 303.60986,299.43876 303.36355,299.52973 303.13715,299.65106 z "
          style={headStyle}
          id="path11031"
        />
        <path
          d="M 299.50465,305.98445 L 299.50465,339.57202"
          style={stemStyle}
          id="path11033"
        />
      </g>
    </svg>
  );
};

export default Note4;
