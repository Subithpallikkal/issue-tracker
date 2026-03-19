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
    'inline-flex items-center justify-center rounded-xl font-bold text-xs tracking-widest uppercase transition-all focus:outline-none focus:ring-1 focus:ring-accent/60 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';

  const variants: Record<NonNullable<ButtonProps['variant']>, string> = {
    primary:
      'bg-accent text-white shadow-lg shadow-accent/20 hover:bg-accent-hover px-5 py-2',
    secondary:
      'bg-white/5 text-text-muted border border-border hover:text-white hover:bg-white/10 px-5 py-2',
    danger:
      'bg-red-600/90 text-white shadow-lg shadow-red-600/30 hover:bg-red-500 px-5 py-2',
    ghost:
      'bg-transparent text-text-muted hover:text-white hover:bg-white/5 px-3 py-1.5',
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
