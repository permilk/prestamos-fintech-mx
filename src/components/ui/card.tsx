'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'bordered' | 'elevated' | 'glass';
    padding?: 'none' | 'sm' | 'default' | 'lg';
    hover?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'default', padding = 'default', hover = false, ...props }, ref) => {
        const variants = {
            default: 'bg-white dark:bg-gray-800 shadow-sm',
            bordered: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
            elevated: 'bg-white dark:bg-gray-800 shadow-lg',
            glass: 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20',
        };

        const paddings = {
            none: '',
            sm: 'p-4',
            default: 'p-6',
            lg: 'p-8',
        };

        return (
            <div
                ref={ref}
                className={cn(
                    'rounded-2xl transition-all duration-200',
                    variants[variant],
                    paddings[padding],
                    hover && 'hover:shadow-lg hover:-translate-y-1 cursor-pointer',
                    className
                )}
                {...props}
            />
        );
    }
);

Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn('flex flex-col space-y-1.5', className)}
            {...props}
        />
    )
);

CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
    ({ className, ...props }, ref) => (
        <h3
            ref={ref}
            className={cn('text-xl font-semibold leading-none tracking-tight text-gray-900 dark:text-white', className)}
            {...props}
        />
    )
);

CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
    ({ className, ...props }, ref) => (
        <p
            ref={ref}
            className={cn('text-sm text-gray-500 dark:text-gray-400', className)}
            {...props}
        />
    )
);

CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div ref={ref} className={cn('', className)} {...props} />
    )
);

CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn('flex items-center pt-4', className)}
            {...props}
        />
    )
);

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
