import React from 'react';

const Pad = ({
  active,
  children,
  className,
  index,
  on,
  onClick,
  onWheel,
  overlayChildren,
  ...props
}) => {
  const handleClick = React.useCallback(
    e => {
      if (onClick) onClick(index, on, e);
    },
    [index, on, onClick]
  );

  const handleWheel = React.useCallback(
    e => {
      if (onWheel) onWheel(index, e.deltaY < 0 ? 'up' : 'down', e);
    },
    [index, onWheel]
  );

  return (
    <div
      className={`keyboard-pad ${className} ${active && 'active'} ${
        on && 'on'
      }`}
      onClick={handleClick}
      onWheel={handleWheel}
      {...props}
    >
      <div className="pad-overlay">{overlayChildren}</div>
      <div className="pad-inner">{children}</div>
    </div>
  );
};

export default Pad;
