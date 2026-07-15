import { forwardRef } from "react";

const VARIANTS = {
  primary:   "bg-lavender hover:bg-lavender/90 text-white shadow-sm",
  secondary: "border border-lavender/15 text-white/50 hover:bg-white/5",
  danger:    "bg-tomato text-white hover:bg-tomato/90",
  ghost:     "text-white/30 hover:bg-white/5 hover:text-white/60",
};

const SIZES = {
  sm: "min-h-9 px-3 text-xs",
  md: "min-h-11 px-4 text-sm",
};

const Button = forwardRef(function Button(
  { variant = "primary", size = "md", loading, disabled, className = "", children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-lavender/50 focus-visible:outline-none disabled:opacity-40 disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
});

export default Button;
