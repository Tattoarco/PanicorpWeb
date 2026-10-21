export default function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  className = "",
  ...props
}) 

{
  const baseStyles =
    "font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center gap-2 active:scale-95";

  const variants = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 shadow-sm shadow-indigo-600/30",
    secondary:
      "bg-slate-800 text-white hover:bg-slate-900 focus:ring-slate-700",
    outline:
      "border border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-slate-500 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
    ghost:
      "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 focus:ring-slate-400",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
