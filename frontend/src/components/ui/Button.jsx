import React from 'react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-agri-forest hover:bg-agri-dark text-white focus:ring-agri-paddy shadow-sm hover:shadow active:scale-[0.99]',
    secondary: 'bg-agri-mist hover:bg-agri-sage/40 text-agri-forest focus:ring-agri-leaf border border-agri-sage/40',
    outline: 'border border-agri-paddy text-agri-forest hover:bg-agri-mist/50 focus:ring-agri-paddy',
    ghost: 'text-agri-forest hover:bg-agri-sand/60 focus:ring-agri-leaf',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    gold: 'bg-agri-gold hover:bg-agri-terracotta text-agri-forest font-semibold shadow-sm focus:ring-agri-gold',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
}

export default Button;
