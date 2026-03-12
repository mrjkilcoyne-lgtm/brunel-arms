import { type ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus, type LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface KPICardProps {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label?: string;
  };
  prefix?: string;
  suffix?: string;
  variant?: 'default' | 'consul' | 'hearth' | 'lodge' | 'command';
  className?: string;
  children?: ReactNode;
}

const variantStyles: Record<string, { iconBg: string; iconText: string; trendUp: string }> = {
  default: { iconBg: 'bg-slate-100', iconText: 'text-slate-600', trendUp: 'text-emerald-600' },
  consul: { iconBg: 'bg-blue-50', iconText: 'text-consul', trendUp: 'text-emerald-600' },
  hearth: { iconBg: 'bg-orange-50', iconText: 'text-hearth', trendUp: 'text-emerald-600' },
  lodge: { iconBg: 'bg-green-50', iconText: 'text-lodge', trendUp: 'text-emerald-600' },
  command: { iconBg: 'bg-purple-50', iconText: 'text-command', trendUp: 'text-emerald-600' },
};

export default function KPICard({
  label,
  value,
  icon: Icon,
  trend,
  prefix,
  suffix,
  variant = 'default',
  className,
  children,
}: KPICardProps) {
  const styles = variantStyles[variant];
  const trendPositive = trend && trend.value > 0;
  const trendNegative = trend && trend.value < 0;
  const trendNeutral = trend && trend.value === 0;

  return (
    <div
      className={clsx(
        'bg-white rounded-xl border border-slate-200/60 p-5 hover-card',
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-ink-tertiary uppercase tracking-wider mb-1">
            {label}
          </p>
          <p className="text-2xl font-semibold text-ink tracking-tight">
            {prefix}
            {typeof value === 'number' ? value.toLocaleString() : value}
            {suffix && <span className="text-base font-normal text-ink-tertiary ml-0.5">{suffix}</span>}
          </p>
        </div>
        {Icon && (
          <div className={clsx('flex-shrink-0 p-2.5 rounded-lg', styles.iconBg)}>
            <Icon className={clsx('w-5 h-5', styles.iconText)} />
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-3 flex items-center gap-1.5">
          {trendPositive && <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />}
          {trendNegative && <TrendingDown className="w-3.5 h-3.5 text-red-500" />}
          {trendNeutral && <Minus className="w-3.5 h-3.5 text-slate-400" />}
          <span
            className={clsx(
              'text-xs font-medium',
              trendPositive && 'text-emerald-600',
              trendNegative && 'text-red-600',
              trendNeutral && 'text-slate-500',
            )}
          >
            {trendPositive && '+'}
            {trend.value}%
          </span>
          {trend.label && (
            <span className="text-xs text-ink-faint">{trend.label}</span>
          )}
        </div>
      )}

      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}
