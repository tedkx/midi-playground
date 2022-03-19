import React from 'react';
import { debounce } from 'lodash';

const minAngle = -144;
const maxAngle = 144;
const tickAngleDiff = 12;

const angleScale = maxAngle - minAngle;
const numOfTicks = angleScale / tickAngleDiff;
const defaultStep = 1;

const convertToKnobAngle = (value, min, max) => {
  const knobValue = ((value - min) * angleScale) / (max - min) + minAngle;
  return Math.max(minAngle, Math.min(maxAngle, knobValue));
};

const getTickProps = (tickIndex, angle, centerBased) => {
  const tickAngle = minAngle + tickAngleDiff * tickIndex;
  const active = !centerBased
    ? angle > minAngle && tickAngle <= angle
    : angle < 0
    ? tickAngle <= 0 && tickAngle >= angle
    : tickAngle >= 0 && tickAngle <= angle;

  return {
    className: `tick ${active && 'active'}`,
    key: tickIndex,
    style: {
      transform: `rotate(${tickAngle}deg)`,
    },
  };
};

const RotaryKnob = ({
  centerBased,
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
  const ref = React.useRef({
    factor: 1,
  });

  const resetFactor = React.useMemo(
    () =>
      debounce(() => {
        ref.current.factor = step;
      }, 25),
    [step]
  );

  const angle = React.useMemo(
    () => convertToKnobAngle(value, min, max, centerBased),
    [value, min, max]
  );

  const onWheel = React.useCallback(
    e => {
      const newValue =
        value + step * ref.current.factor * (e.deltaY < 0 ? 1 : -1);
      onSetValue(Math.min(max, Math.max(min, newValue)));
      ref.current.factor += step;
      resetFactor();
    },
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
        <div
          className="marker"
          style={{ transform: `rotate(${angle}deg)` }}
        ></div>
        <div className="ticks">
          {Array.from(Array(numOfTicks + 1)).map((_, idx) => (
            <div key={idx} {...getTickProps(idx, angle, centerBased)}></div>
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
