import React from 'react';
import RotaryKnob from './RotaryKnob';

const ParameterKnob = ({ name, onSetParameter, ...props }) => {
  const handleValueChange = React.useCallback(
    value => onSetParameter(name, value),
    [name, onSetParameter]
  );

  return (
    <div className="parameter-knob">
      <RotaryKnob displayValue onSetValue={handleValueChange} {...props} />
    </div>
  );
};

export default ParameterKnob;
