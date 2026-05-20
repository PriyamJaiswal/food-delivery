import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] hover:opacity-90 shadow-md hover:shadow-lg',
  secondary: 'border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary-light)]',
  ghost: 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]',
  danger: 'text-white bg-[var(--color-error)] hover:opacity-90',
  success: 'text-white bg-[var(--color-success)] hover:opacity-90',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3.5 text-base rounded-xl',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  ...props
}) => {
  return (
    <button
      className={clsx(
        'font-semibold transition-all duration-200 inline-flex items-center justify-center gap-2 cursor-pointer',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};

export default Button;
