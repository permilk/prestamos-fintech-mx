'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
    {
        variants: {
            variant: {
                default: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
                primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300',
                success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
                warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
                danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
                info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
                outline: 'border border-current bg-transparent',
            },
            size: {
                sm: 'px-2 py-0.5 text-xs',
                default: 'px-2.5 py-0.5 text-xs',
                lg: 'px-3 py-1 text-sm',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
    dot?: boolean;
}

function Badge({ className, variant, size, dot, children, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant, size }), className)} {...props}>
            {dot && (
                <span
                    className={cn(
                        'mr-1.5 h-1.5 w-1.5 rounded-full',
                        variant === 'success' && 'bg-emerald-500',
                        variant === 'warning' && 'bg-amber-500',
                        variant === 'danger' && 'bg-red-500',
                        variant === 'info' && 'bg-blue-500',
                        variant === 'primary' && 'bg-primary-500',
                        (!variant || variant === 'default') && 'bg-gray-500'
                    )}
                />
            )}
            {children}
        </div>
    );
}

export { Badge, badgeVariants };
