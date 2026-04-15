import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', style, ...props }, ref) => {
    const inputStyle: React.CSSProperties = {
      width: '100%',
      padding: '0.625rem 0.875rem',
      borderRadius: 'var(--radius)',
      border: `1px solid ${error ? '#ef4444' : 'var(--input)'}`,
      backgroundColor: 'var(--background)',
      color: 'var(--foreground)',
      fontSize: '1rem',
      transition: 'all 0.2s ease',
      outline: 'none',
      ...style,
    };

    const labelStyle: React.CSSProperties = {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: 500,
      marginBottom: '0.375rem',
      color: 'var(--muted-foreground)',
    };

    const errorStyle: React.CSSProperties = {
      fontSize: '0.75rem',
      color: '#ef4444',
      marginTop: '0.25rem',
    };

    return (
      <div style={{ marginBottom: '1rem' }}>
        {label && <label style={labelStyle}>{label}</label>}
        <input ref={ref} style={inputStyle} className={className} {...props} />
        {error && <p style={errorStyle}>{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
