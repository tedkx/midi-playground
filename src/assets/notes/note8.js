/* from https://commons.wikimedia.org/wiki/Category:SVG_musical_notation */
import React from 'react';
import { useStyles } from './styles';

const Note8 = ({ color = '#000' }) => {
  const { flagStyle, headStyle, stemStyle } = useStyles(color);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      version="1.0"
      width="24.886"
      height="41.75"
      id="svg1533"
    >
      <defs id="defs1536" />
      <g transform="translate(-427.1495,-34.28441)" id="g12994">
        <path
          d="M 431.56955,65.847427 C 428.17371,67.667397 426.36427,70.961977 427.47733,73.440387 C 428.66459,76.084027 432.74434,76.830107 436.58391,75.105757 C 440.42347,73.381397 442.57607,69.836357 441.38881,67.192727 C 440.20154,64.549087 436.1218,63.803007 432.28223,65.527357 C 432.04226,65.635127 431.79595,65.726097 431.56955,65.847427 z "
          style={headStyle}
          id="path12112"
        />
        <path
          d="M 441.18705,68.62194 L 441.18705,35.03437"
          style={stemStyle}
          id="path12114"
        />
        <path
          d="M 441.1824,35.99421 C 440.6199,42.30671 446.02495,44.56795 448.6824,47.49421 C 451.20836,50.27568 452.13107,53.48393 452.02788,56.48981 C 452.00033,57.29238 451.78245,60.76992 449.41343,64.25653 C 452.58135,55.50942 449.6319,51.99847 446.75047,49.20495 C 443.26053,45.82149 440.66435,42.63277 441.1824,35.99421 z "
          style={flagStyle}
          id="path12116"
        />
      </g>
    </svg>
  );
};

export default Note8;
