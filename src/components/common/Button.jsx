import React from 'react';

const Button = ({ children, onClick, type = 'button', className = '', disabled = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
