import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading,
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center rounded-xl font-bold text-xs tracking-widest uppercase transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';

  /* Glass blurred gradient — no solid accent/blue */
  const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary:
      'px-5 py-2 text-white border border-white/18 bg-linear-to-br from-white/16 via-white/6 to-white/12 backdrop-blur-md shadow-[0_8px_28px_rgba(0,0,0,0.18)] hover:from-white/22 hover:via-white/10 hover:to-white/16 hover:border-white/24',
    secondary:
      'px-5 py-2 text-text-muted border border-white/10 bg-linear-to-br from-white/6 via-white/3 to-white/8 backdrop-blur-md hover:text-white hover:from-white/10 hover:via-white/5 hover:to-white/12 hover:border-white/16',
    danger:
      'px-5 py-2 text-white border border-rose-400/25 bg-linear-to-br from-rose-500/25 via-rose-500/10 to-white/8 backdrop-blur-md shadow-[0_8px_28px_rgba(0,0,0,0.18)] hover:from-rose-500/35 hover:via-rose-500/15 hover:border-rose-400/35',
    ghost:
      'px-3 py-1.5 text-text-muted border border-transparent bg-transparent backdrop-blur-sm hover:text-white hover:border-white/10 hover:bg-white/8',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
};

export default Button;
