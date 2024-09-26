import React from 'react';

const Input = ({ label, type = 'text', name, value, onChange, placeholder, required = false }) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
      />
    </div>
  );
};

export default Input;
