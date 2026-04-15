import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const buttonStyle: React.CSSProperties = {
    padding: size === 'sm' ? '0.5rem 0.75rem' : size === 'lg' ? '0.75rem 1.5rem' : '0.625rem 1.25rem',
    borderRadius: 'var(--radius)',
    fontSize: size === 'sm' ? '0.875rem' : size === 'lg' ? '1.125rem' : '1rem',
    border: variant === 'outline' ? '1px solid var(--border)' : 'none',
    backgroundColor: variant === 'primary' ? 'var(--primary)' : variant === 'secondary' ? 'var(--muted)' : 'transparent',
    color: variant === 'primary' ? 'var(--primary-foreground)' : 'var(--foreground)',
    opacity: disabled || isLoading ? 0.6 : 1,
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    boxShadow: variant === 'primary' ? 'var(--shadow)' : 'none',
    fontWeight: 500,
  };

  return (
    <button
      style={buttonStyle}
      disabled={disabled || isLoading}
      className={`btn-${variant} ${className}`}
      {...props}
    >
      {isLoading && <div className="spinner" style={{ borderTopColor: 'currentColor' }}></div>}
      {children}
    </button>
  );
};

export default Button;
