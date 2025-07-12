// components/PickupForm/FormField.jsx
import React from 'react';

const FormField = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  required = false, 
  options = null, 
  placeholder = '',
  className = ''
}) => {
  const inputId = `field-${label.toLowerCase().replace(/\s+/g, '-')}`;

  const baseInputClasses = `w-full px-3 py-2 border border-gray-300 rounded-md text-sm 
    focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 ${className}`;

  const renderInput = () => {
    if (type === 'select') {
      return (
        <div className="relative">
          <select
            id={inputId}
            value={value}
            onChange={onChange}
            required={required}
            className={`${baseInputClasses} appearance-none cursor-pointer pr-8`}
          >
            <option value="">Select {label}</option>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      );
    }

    if (type === 'textarea') {
      return (
        <textarea
          id={inputId}
          value={value}
          onChange={onChange}
          required={required}
          className={`${baseInputClasses} resize-none`}
          placeholder={placeholder}
          rows={3}
        />
      );
    }

    return (
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        className={baseInputClasses}
        placeholder={placeholder}
      />
    );
  };

  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      {renderInput()}
    </div>
  );
};

export default FormField;
