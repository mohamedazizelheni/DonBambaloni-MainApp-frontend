import React from 'react';

const Button = ({ children, onClick, type = 'button', className = '', disabled = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 bg-black text-white  hover:bg-gray-900 rounded-lg focus:outline-none  ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
