'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                default:
                    'bg-primary-500 text-white hover:bg-primary-600 focus-visible:ring-primary-500 shadow-lg shadow-primary-500/25',
                secondary:
                    'bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700',
                outline:
                    'border border-gray-200 bg-transparent hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800',
                ghost:
                    'hover:bg-gray-100 dark:hover:bg-gray-800',
                success:
                    'bg-emerald-500 text-white hover:bg-emerald-600 focus-visible:ring-emerald-500 shadow-lg shadow-emerald-500/25',
                danger:
                    'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500 shadow-lg shadow-red-500/25',
                warning:
                    'bg-amber-500 text-white hover:bg-amber-600 focus-visible:ring-amber-500 shadow-lg shadow-amber-500/25',
                link:
                    'text-primary-500 underline-offset-4 hover:underline',
            },
            size: {
                sm: 'h-9 px-3 text-xs',
                default: 'h-11 px-5',
                lg: 'h-12 px-8 text-base',
                xl: 'h-14 px-10 text-lg',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    loading?: boolean;
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, loading, disabled, asChild = false, children, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button';

        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                disabled={disabled || loading}
                {...props}
            >
                {loading && (
                    <svg
                        className="h-4 w-4 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>
                )}
                {children}
            </Comp>
        );
    }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
