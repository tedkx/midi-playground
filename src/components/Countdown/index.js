import React from 'react';

const interval = 1000;

const Countdown = ({ from, onCompletion }) => {
  const [current, setCurrent] = React.useState({
    number: from + 1,
    active: false,
  });

  const ref = React.useRef({
    activationPending: false,
    timeoutId: null,
  });

  React.useEffect(() => {
    setCurrent({ number: from + 1, active: false });
  }, [from]);

  React.useEffect(() => {
    const { active, number } = current;

    if (active) {
      ref.current.timeoutId = setTimeout(() => {
        if (number > 1) setCurrent(curr => ({ ...curr, active: false }));
        else onCompletion();
      }, interval - 50);
    } else if (ref.current.activationPending) {
      ref.current.activationPending = false;
      setTimeout(() => setCurrent({ ...current, active: true }), 50);
    } else if (typeof number === 'number' && number > 0) {
      ref.current.activationPending = true;
      setCurrent({ number: number - 1, active: false });
    }
  }, [current, onCompletion]);

  React.useEffect(() => {
    return () => clearTimeout(ref.current.timeoutId);
  }, []);

  return (
    <div className="countdown">
      <div className="countdown-inner">
        {current.number > 0 && (
          <div className={`countdown-number ${current.active && 'active'}`}>
            {current.number}
          </div>
        )}
      </div>
    </div>
  );
};

export default Countdown;
