import React from 'react';
import Button from './Button';

const LatchingButton = ({
  activeColor,
  children,
  defaultActive,
  onActiveChanged,
  onClick,
  ...props
}) => {
  const [active, setActive] = React.useState(!!defaultActive);

  React.useEffect(() => {
    if (onActiveChanged) onActiveChanged(active);
  }, [active]);

  const handleClick = React.useCallback(
    e => {
      setActive(currentActive => !currentActive);
      if (onClick) onClick(e);
    },
    [setActive, onClick]
  );

  return (
    <Button
      className={`keyboard-latching-button ${
        active && 'active'
      } ${activeColor}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Button>
  );
};

export default LatchingButton;
