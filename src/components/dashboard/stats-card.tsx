'use client';

import * as React from 'react';
import { cn, formatCurrency, formatPercent } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface StatsCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
        label?: string;
    };
    variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
    loading?: boolean;
}

const variantStyles = {
    primary: 'from-primary-500 to-primary-600',
    success: 'from-emerald-500 to-emerald-600',
    warning: 'from-amber-500 to-amber-600',
    danger: 'from-red-500 to-red-600',
    info: 'from-blue-500 to-blue-600',
    purple: 'from-violet-500 to-violet-600',
};

export function StatsCard({
    title,
    value,
    subtitle,
    icon,
    trend,
    variant = 'primary',
    loading = false,
}: StatsCardProps) {
    if (loading) {
        return (
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 p-6 shadow-lg animate-pulse">
                <div className="space-y-3">
                    <div className="h-4 w-24 rounded bg-white/20" />
                    <div className="h-8 w-32 rounded bg-white/20" />
                    <div className="h-3 w-20 rounded bg-white/20" />
                </div>
            </div>
        );
    }

    return (
        <div
            className={cn(
                'relative overflow-hidden rounded-2xl bg-gradient-to-br p-6 text-white shadow-lg',
                'transition-all duration-300 hover:shadow-xl hover:-translate-y-1',
                variantStyles[variant]
            )}
        >
            {/* Decorative circles */}
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10" />
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/5" />

            <div className="relative z-10">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-white/80">{title}</p>
                        <h3 className="text-3xl font-bold tracking-tight font-mono">
                            {typeof value === 'number' ? formatCurrency(value) : value}
                        </h3>
                        {subtitle && (
                            <p className="text-xs text-white/70">{subtitle}</p>
                        )}
                    </div>
                    <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
                        {icon}
                    </div>
                </div>

                {trend && (
                    <div className="mt-4 flex items-center gap-1.5">
                        {trend.isPositive ? (
                            <TrendingUp className="h-4 w-4 text-white/90" />
                        ) : (
                            <TrendingDown className="h-4 w-4 text-white/90" />
                        )}
                        <span className="text-sm font-medium">
                            {trend.isPositive ? '+' : ''}{formatPercent(trend.value)}
                        </span>
                        {trend.label && (
                            <span className="text-xs text-white/70">{trend.label}</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
