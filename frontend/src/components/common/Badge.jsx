import React from 'react';

export const Badge = ({ children, variant = 'default', size = 'md', className = '', style = {} }) => {
  const baseClasses = 'inline-flex items-center font-bold tracking-tight border-2 border-charcoal';
  
  const sizeClasses = {
    sm: 'px-1.5 py-0.2 text-[11px]',
    md: 'px-2 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  };

  const variantClasses = {
    default: 'bg-white text-charcoal shadow-bauhaus-sm',
    primary: 'bg-forest text-white shadow-bauhaus-sm',
    forest: 'bg-forest text-white shadow-bauhaus-sm',
    crop: 'bg-crop text-white shadow-bauhaus-sm',
    gold: 'bg-gold text-charcoal shadow-bauhaus-sm',
    earth: 'bg-earth text-white shadow-bauhaus-sm',
    sage: 'bg-sage text-charcoal shadow-bauhaus-sm',
    cream: 'bg-cream text-charcoal shadow-bauhaus-sm',
    warning: 'bg-gold text-charcoal shadow-bauhaus-sm',
    danger: 'bg-earth text-white shadow-bauhaus-sm',
    info: 'bg-sage text-charcoal shadow-bauhaus-sm',
  };

  const variantStyles = {
    default: { backgroundColor: '#FFFFFF', color: '#172016' },
    primary: { backgroundColor: '#14532D', color: '#FFFFFF' },
    forest: { backgroundColor: '#14532D', color: '#FFFFFF' },
    crop: { backgroundColor: '#4D7C0F', color: '#FFFFFF' },
    gold: { backgroundColor: '#EAB308', color: '#172016' },
    earth: { backgroundColor: '#92400E', color: '#FFFFFF' },
    sage: { backgroundColor: '#DDE7D8', color: '#172016' },
    cream: { backgroundColor: '#F7F4EA', color: '#172016' },
    warning: { backgroundColor: '#EAB308', color: '#172016' },
    danger: { backgroundColor: '#92400E', color: '#FFFFFF' },
    info: { backgroundColor: '#DDE7D8', color: '#172016' },
  };

  return (
    <span
      style={{ ...(variantStyles[variant] || variantStyles.default), ...style }}
      className={`${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${variantClasses[variant] || variantClasses.default} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
