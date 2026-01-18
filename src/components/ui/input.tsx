'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, hint, leftIcon, rightIcon, id, ...props }, ref) => {
        const inputId = id || React.useId();

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        {label}
                        {props.required && <span className="ml-1 text-red-500">*</span>}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-gray-400">{leftIcon}</span>
                        </div>
                    )}
                    <input
                        type={type}
                        id={inputId}
                        className={cn(
                            'flex h-11 w-full rounded-xl border bg-gray-50 px-4 py-2 text-sm transition-all duration-200',
                            'placeholder:text-gray-400',
                            'focus:bg-white focus:outline-none focus:ring-2 focus:ring-offset-0',
                            'disabled:cursor-not-allowed disabled:opacity-50',
                            'dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500',
                            error
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                                : 'border-gray-200 focus:border-primary-500 focus:ring-primary-500/20 dark:border-gray-700',
                            leftIcon && 'pl-10',
                            rightIcon && 'pr-10',
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                    {rightIcon && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <span className="text-gray-400">{rightIcon}</span>
                        </div>
                    )}
                </div>
                {error && (
                    <p className="mt-1.5 text-sm text-red-500">{error}</p>
                )}
                {hint && !error && (
                    <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">{hint}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export { Input };
