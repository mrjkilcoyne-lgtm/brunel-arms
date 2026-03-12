import clsx from 'clsx';
import type { ReactNode } from 'react';

type BadgeVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'consul'
  | 'hearth'
  | 'lodge'
  | 'command';

type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 text-slate-700 ring-slate-200/60',
  primary: 'bg-forge-50 text-forge-700 ring-forge-200/60',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-200/60',
  warning: 'bg-amber-50 text-amber-700 ring-amber-200/60',
  danger: 'bg-red-50 text-red-700 ring-red-200/60',
  info: 'bg-sky-50 text-sky-700 ring-sky-200/60',
  consul: 'bg-blue-50 text-blue-700 ring-blue-200/60',
  hearth: 'bg-orange-50 text-orange-700 ring-orange-200/60',
  lodge: 'bg-green-50 text-green-700 ring-green-200/60',
  command: 'bg-purple-50 text-purple-700 ring-purple-200/60',
};

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-slate-400',
  primary: 'bg-forge-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  info: 'bg-sky-500',
  consul: 'bg-blue-500',
  hearth: 'bg-orange-500',
  lodge: 'bg-green-500',
  command: 'bg-purple-500',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'text-[10px] px-1.5 py-0.5',
  md: 'text-xs px-2 py-0.5',
  lg: 'text-xs px-2.5 py-1',
};

export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 font-medium rounded-full ring-1 ring-inset whitespace-nowrap',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {dot && (
        <span
          className={clsx('w-1.5 h-1.5 rounded-full flex-shrink-0', dotColors[variant])}
        />
      )}
      {children}
    </span>
  );
}
