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

const useWheelValueChanging = ({
  max,
  min,
  onSetValue,
  step = defaultStep,
  value,
}) => {
  const ref = React.useRef({
    factor: 1,
    max,
    min,
    step,
    value,
  });
  const elementRef = React.useRef();

  React.useEffect(() => {
    ref.current.step = step;
    ref.current.value = value;
    ref.current.min = min;
    ref.current.max = max;
  }, [value, step, min, max]);

  const resetFactor = React.useMemo(
    () =>
      debounce(() => {
        ref.current.factor = ref.current.step;
      }, 25),
    []
  );

  React.useEffect(() => {
    const onWheel = e => {
      e.stopPropagation();
      e.stopImmediatePropagation();
      e.preventDefault();

      const { value, step, min, max } = ref.current;
      const newValue =
        value + step * ref.current.factor * (e.deltaY < 0 ? 1 : -1);
      onSetValue(Math.min(max, Math.max(min, newValue)));
      ref.current.factor += step;
      resetFactor();
    };

    elementRef.current.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      elementRef.current.removeEventListener('wheel', onWheel, {
        passive: false,
      });
    };
  }, []);

  return { elementRef };
};

const useClickValueChanging = ({ max, min, onSetValue, value }) => {
  const ref = React.useRef({
    y: null,
    mouseMovelistener: null,
    mouseUplistener: null,
    mouseDown: false,
    value: value,
  });
  const [dragging, setDragging] = React.useState(false);

  React.useEffect(() => {
    ref.current.value = value;
  }, [value]);

  const handleMouseUp = React.useCallback(
    e => {
      if (e.button === 0) {
        setDragging(false);
        window.removeEventListener('mousemove', ref.current.mouseMovelistener);
        window.removeEventListener('mouseup', ref.current.mouseUplistener);
        ref.current.listener = null;
      }
    },
    [setDragging]
  );

  const handleMouseMove = React.useCallback(
    e => {
      const newValue = Math.min(
        max,
        Math.max(min, ref.current.value + ref.current.y - e.pageY)
      );
      ref.current.y = e.pageY;
      onSetValue(newValue);
    },
    [onSetValue, min, max]
  );

  const onMouseDown = React.useCallback(e => {
    if (e.button === 0) {
      setDragging(true);
      ref.current.y = e.pageY;
      //ref.current.mouseMovelistener = debounce(handleMouseMove, 10);
      ref.current.mouseMovelistener = handleMouseMove;
      ref.current.mouseUplistener = handleMouseUp;

      window.addEventListener('mousemove', ref.current.mouseMovelistener);
      window.addEventListener('mouseup', ref.current.mouseUplistener);
    }
  }, []);

  return { dragging, onMouseDown };
};

const RotaryKnob = props => {
  const {
    centerBased,
    className,
    displayValue,
    max,
    min,
    style,
    title,
    value,
  } = props;

  const angle = React.useMemo(
    () => convertToKnobAngle(value, min, max, centerBased),
    [value, min, max]
  );

  const { onWheel, elementRef } = useWheelValueChanging(props);

  const { dragging, onMouseDown } = useClickValueChanging(props);

  return (
    <div
      className={`rotary-knob ${displayValue && 'with-value'} ${
        title && 'with-title'
      } ${className}`}
      style={style}
    >
      {dragging && <div className="window-overlay"></div>}
      {title && <div className="title">{title}</div>}
      <div
        className="knob-overlay"
        onMouseDown={onMouseDown}
        ref={elementRef}
      ></div>
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
