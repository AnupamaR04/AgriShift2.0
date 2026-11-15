import React from 'react';

export function Card({
  children,
  className = '',
  hoverEffect = false,
  padding = 'default',
  ...props
}) {
  const paddings = {
    none: '',
    sm: 'p-4',
    default: 'p-6 sm:p-7',
    lg: 'p-8 sm:p-10',
  };

  return (
    <div
      className={`bg-white rounded-2xl border border-agri-sand shadow-soft transition-all duration-200 ${
        hoverEffect ? 'hover:shadow-card hover:-translate-y-0.5 hover:border-agri-sage/60' : ''
      } ${paddings[padding] || paddings.default} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, icon: Icon, action, className = '' }) {
  return (
    <div className={`flex items-start justify-between pb-5 mb-5 border-b border-agri-sand/60 ${className}`}>
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-agri-mist flex items-center justify-center text-agri-forest shrink-0">
            <Icon className="w-5 h-5 text-agri-paddy" />
          </div>
        )}
        <div>
          <h3 className="text-lg font-display font-bold text-agri-forest">{title}</h3>
          {subtitle && <p className="text-xs text-agri-forest/70 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

export default Card;
