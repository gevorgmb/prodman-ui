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
  style,
  ...props
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);

  const getBackgroundColor = () => {
    if (disabled || isLoading) {
      return variant === 'primary' ? 'var(--primary)' : variant === 'secondary' ? 'var(--muted)' : 'transparent';
    }
    if (variant === 'primary') return isHovered ? 'var(--primary-hover)' : 'var(--primary)';
    if (variant === 'secondary') return isHovered ? 'var(--border)' : 'var(--muted)';
    if (variant === 'ghost') return isHovered ? 'var(--muted)' : 'transparent';
    return isHovered ? 'var(--muted)' : 'transparent'; // outline
  };

  const buttonStyle: React.CSSProperties = {
    padding: size === 'sm' ? '0.5rem 0.75rem' : size === 'lg' ? '0.75rem 1.5rem' : '0.625rem 1.25rem',
    borderRadius: 'var(--radius)',
    fontSize: size === 'sm' ? '0.875rem' : size === 'lg' ? '1.125rem' : '1rem',
    border: variant === 'outline' ? '1px solid var(--border)' : 'none',
    backgroundColor: getBackgroundColor(),
    color: variant === 'primary' ? 'var(--primary-foreground)' : 'var(--foreground)',
    opacity: disabled || isLoading ? 0.6 : 1,
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    boxShadow: variant === 'primary' ? (isHovered ? 'var(--shadow-lg)' : 'var(--shadow)') : 'none',
    fontWeight: 600,
    transform: isActive ? 'scale(0.98)' : 'none',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    ...style,
  };

  return (
    <button
      style={buttonStyle}
      disabled={disabled || isLoading}
      className={`btn-${variant} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsActive(false); }}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      {...props}
    >
      {isLoading && <div className="spinner" style={{ borderTopColor: 'currentColor', marginRight: '0.5rem' }}></div>}
      {children}
    </button>
  );
};

export default Button;
