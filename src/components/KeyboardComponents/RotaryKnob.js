import React from 'react';

const knobMax = 32;
const defaultStep = 1;

const convertToKnobValue = (value, min, max) =>
  Math.max(0, Math.min(knobMax, ((value - min) * knobMax) / (max - min)));
const convertFromKnobValue = (value, min, max) =>
  ((max - min) * Math.max(0, Math.min(knobMax, value))) / knobMax + min;

const RotaryKnob = ({
  className,
  displayValue,
  max,
  min,
  onSetValue,
  step = defaultStep,
  style,
  title,
  value,
}) => {
  const adjustedValue = React.useMemo(
    () => Math.max(0, Math.min(knobMax, convertToKnobValue(value, min, max))),
    [value, min, max]
  );

  const onWheel = React.useCallback(
    e => onSetValue(value + step * (e.deltaY < 0 ? 1 : -1)),
    [value, step, min, max]
  );

  return (
    <div
      className={`rotary-knob ${displayValue && 'with-value'} ${
        title && 'with-title'
      } ${className}`}
      style={style}
    >
      {title && <div className="title">{title}</div>}
      <div className="knob-overlay" onWheel={onWheel}></div>
      <div className="knob-inner">
        <div className="ticks">
          {Array.from(Array(24)).map((_, idx) => (
            <div
              key={idx}
              className={`tick ${idx < adjustedValue && 'active'}`}
            ></div>
          ))}
        </div>
      </div>
      {displayValue && (
        <div className="value-wrap">
          <div className="value-display">{value}</div>
        </div>
      )}
    </div>
  );
};

export default RotaryKnob;
