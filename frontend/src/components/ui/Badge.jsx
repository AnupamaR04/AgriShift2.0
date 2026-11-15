import React from 'react';

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  icon: Icon = null,
}) {
  const variants = {
    default: 'bg-agri-sand text-agri-forest border-agri-sand',
    success: 'bg-agri-mist text-agri-forest border-agri-sage/50',
    forest: 'bg-agri-forest text-white border-transparent',
    satellite: 'bg-blue-50 text-blue-800 border-blue-200',
    weather: 'bg-amber-50 text-amber-800 border-amber-200',
    kerala: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    warning: 'bg-orange-50 text-orange-800 border-orange-200',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 rounded-full font-medium',
    md: 'text-xs px-2.5 py-1 rounded-full font-medium',
    lg: 'text-sm px-3.5 py-1.5 rounded-full font-semibold',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 border ${variants[variant] || variants.default} ${sizes[size] || sizes.md} ${className}`}>
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      {children}
    </span>
  );
}

export default Badge;
