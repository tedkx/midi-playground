import React from 'react';

const Pad = ({ active, className, style }) => {
  return (
    <div
      className={`pad ${className} ${active && 'active'}`}
      style={style}
    ></div>
  );
};

export default Pad;
