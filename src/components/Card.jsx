// src/components/Card.jsx
export default function Card({
  title,
  subtitle,
  description,
  icon,
  badge,
  children,
  className = "",
}) {
  return (
    <div
      className={`rounded-xl border p-6 flex flex-col justify-between transition-all duration-200 ${className}`}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          {icon && (
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950 rounded-lg text-indigo-600 dark:text-indigo-400">
              {icon}
            </div>
          )}
          {badge && (
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300">
              {badge}
            </span>
          )}
        </div>
        {title && <h3 className="text-xl font-bold mb-1">{title}</h3>}
        {subtitle && (
          <p className="text-sm font-medium text-indigo-500 mb-2">{subtitle}</p>
        )}
        {description && (
          <p className="text-sm leading-relaxed text-slate-400 mb-4">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="mt-4 pt-4 border-t border-slate-800">{children}</div>
      )}
    </div>
  );
}
