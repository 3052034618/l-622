import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/utils';
import { motion } from 'framer-motion';

type ProgressVariant = 'primary' | 'success' | 'warning' | 'danger';

interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  variant?: ProgressVariant;
  showLabel?: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const variantClasses: Record<ProgressVariant, string> = {
  primary: 'bg-primary-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  danger: 'bg-danger-500',
};

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, variant = 'primary', showLabel = false, label, size = 'md', animated = true, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const displayLabel = label || `${Math.round(percentage)}%`;

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {showLabel && (
          <div className="flex justify-between mb-1.5">
            <span className="text-sm font-medium text-slate-700">{displayLabel}</span>
            <span className="text-sm text-slate-500">{value} / {max}</span>
          </div>
        )}
        <div className={cn('w-full bg-slate-200 rounded-full overflow-hidden', sizeClasses[size])}>
          <motion.div
            initial={animated ? { width: 0 } : false}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={cn('h-full rounded-full', variantClasses[variant])}
          />
        </div>
      </div>
    );
  }
);

Progress.displayName = 'Progress';
