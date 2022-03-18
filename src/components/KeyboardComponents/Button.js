import React from 'react';

const Button = ({ children, className, index, onClick, ...props }) => {
  return (
    <div
      className={`keyboard-button ${className}`}
      onClick={onClick}
      {...props}
    >
      <div className="button-overlay"></div>
      <div className="button-inner">{children}</div>
    </div>
  );
};

export default Button;
