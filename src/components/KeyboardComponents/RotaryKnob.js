import React from 'react';

const Button = ({ className, max, min, onSetValue, style, value }) => {
  return (
    <div className={`rotary-knob ${className}`} style={style}>
      <div className="knob-overlay"></div>
      <div className="knob-inner"></div>
      <div className="ticks">
        {Array.from(Array(24)).map((_, idx) => (
          <div key={idx} className={`tick ${idx >= 16 && 'active'}`}></div>
        ))}
      </div>
    </div>
  );
};

export default Button;
