import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  style?: React.CSSProperties;
}

const Card: React.FC<CardProps> = ({ children, title, description, className = '', style }) => {
  const cardStyle: React.CSSProperties = {
    backgroundColor: 'var(--card)',
    color: 'var(--card-foreground)',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border)',
    boxShadow: 'var(--shadow)',
    padding: '1.5rem',
    overflow: 'hidden',
    ...style,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: 600,
    marginBottom: '0.5rem',
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: '0.875rem',
    color: 'var(--muted-foreground)',
    marginBottom: '1.5rem',
  };

  return (
    <div style={cardStyle} className={`card ${className} animate-in`}>
      {(title || description) && (
        <div style={{ marginBottom: '1.5rem' }}>
          {title && <h3 style={titleStyle}>{title}</h3>}
          {description && <p style={descriptionStyle}>{description}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
