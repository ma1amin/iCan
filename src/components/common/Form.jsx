import React from 'react';
import PropTypes from 'prop-types';
import './Form.css';

const Input = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled = false,
  error,
  required = false,
  fullWidth = false,
  icon,
  name,
  className
}) => {
  const inputClasses = [
    'form-input',
    error && 'form-input-error',
    disabled && 'form-input-disabled',
    fullWidth && 'form-input-full-width',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className="form-field">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="form-required">*</span>}
        </label>
      )}
      {icon && (
        <div className="form-input-wrapper">
          <span className="form-input-icon">{typeof icon === 'string' ? icon : icon}</span>
          <input
            type={type}
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            className={inputClasses}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
            style={{ paddingLeft: '36px' }}
          />
        </div>
      )}
      {!icon && (
        <input
          type={type}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={inputClasses}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
        />
      )}
      {error && (
        <span id={`${name}-error`} className="form-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

const Select = ({
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  error,
  required = false,
  fullWidth = false,
  name
}) => {
  const selectClasses = [
    'form-select',
    error && 'form-input-error',
    disabled && 'form-input-disabled',
    fullWidth && 'form-input-full-width'
  ].filter(Boolean).join(' ');

  return (
    <div className="form-field">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="form-required">*</span>}
        </label>
      )}
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={selectClasses}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      >
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
            disabled={option.disabled || (option.value === '' && !placeholder)}
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <span id={`${name}-error`} className="form-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

const Textarea = ({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  disabled = false,
  error,
  required = false,
  fullWidth = false,
  resize = 'vertical',
  name,
  className
}) => {
  const textareaClasses = [
    'form-textarea',
    error && 'form-input-error',
    disabled && 'form-input-disabled',
    fullWidth && 'form-input-full-width',
    className
  ].filter(Boolean).join(' ');

  const resizeStyle = {
    resize: resize === 'none' ? 'none' : resize
  };

  return (
    <div className="form-field">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="form-required">*</span>}
        </label>
      )}
      <textarea
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={textareaClasses}
        style={resizeStyle}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <span id={`${name}-error`} className="form-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

const Checkbox = ({
  label,
  checked,
  onChange,
  disabled = false,
  error,
  name
}) => {
  return (
    <div className="form-field form-field-checkbox">
      <label className="form-checkbox-label">
        <input
          type="checkbox"
          name={name}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="form-checkbox"
          aria-invalid={!!error}
        />
        <span className="form-checkbox-text">{label}</span>
      </label>
      {error && <span className="form-error">{error}</span>}
    </div>
  );
};

// PropTypes
Input.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.oneOf(['text', 'email', 'phone', 'date', 'datetime', 'datetime-local', 'number', 'password']),
  disabled: PropTypes.bool,
  error: PropTypes.string,
  required: PropTypes.bool,
  fullWidth: PropTypes.bool,
  icon: PropTypes.node,
  name: PropTypes.string,
  className: PropTypes.string
};

Select.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  required: PropTypes.bool,
  fullWidth: PropTypes.bool,
  name: PropTypes.string
};

Textarea.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  rows: PropTypes.number,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  required: PropTypes.bool,
  fullWidth: PropTypes.bool,
  resize: PropTypes.oneOf(['none', 'vertical', 'horizontal', 'both']),
  name: PropTypes.string,
  className: PropTypes.string
};

Checkbox.propTypes = {
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  error: PropTypes.string,
  name: PropTypes.string
};

export { Input, Select, Textarea, Checkbox };
