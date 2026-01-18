'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Bell, Search, Moon, Sun, Menu, X, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

interface Notification {
    id: string;
    type: 'warning' | 'success' | 'info';
    title: string;
    message: string;
    time: string;
    link?: string;
}

const mockNotifications: Notification[] = [
    {
        id: '1',
        type: 'warning',
        title: 'Préstamo Vencido',
        message: 'Carlos López tiene un pago vencido de $2,500',
        time: 'Hace 5 min',
        link: '/cobranza',
    },
    {
        id: '2',
        type: 'success',
        title: 'Pago Recibido',
        message: 'María García realizó un pago de $1,500',
        time: 'Hace 15 min',
        link: '/pagos',
    },
    {
        id: '3',
        type: 'info',
        title: 'Nuevo Cliente',
        message: 'Se registró Roberto Hernández como nuevo cliente',
        time: 'Hace 1 hora',
        link: '/clientes',
    },
];

interface HeaderProps {
    title?: string;
    onMenuClick?: () => void;
    showSearch?: boolean;
    notifications?: number;
}

export function Header({
    title,
    onMenuClick,
    showSearch = true,
    notifications = 2,
}: HeaderProps) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);
    const [showNotifications, setShowNotifications] = React.useState(false);
    const notifRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Close notifications when clicking outside
    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getNotifIcon = (type: Notification['type']) => {
        switch (type) {
            case 'warning':
                return <AlertTriangle className="h-4 w-4 text-amber-500" />;
            case 'success':
                return <CheckCircle className="h-4 w-4 text-green-500" />;
            case 'info':
                return <Info className="h-4 w-4 text-blue-500" />;
        }
    };

    return (
        <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-gray-200 bg-white/80 backdrop-blur-xl px-6 dark:border-gray-800 dark:bg-gray-900/80">
            {/* Mobile menu button */}
            <button
                onClick={onMenuClick}
                className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
            >
                <Menu className="h-5 w-5" />
            </button>

            {/* Title */}
            {title && (
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {title}
                </h1>
            )}

            {/* Search */}
            {showSearch && (
                <div className="hidden flex-1 md:block max-w-md">
                    <Input
                        placeholder="Buscar clientes, préstamos..."
                        leftIcon={<Search className="h-4 w-4" />}
                        className="bg-gray-100 border-0 dark:bg-gray-800"
                    />
                </div>
            )}

            <div className="flex-1" />

            {/* Actions */}
            <div className="flex items-center gap-2">
                {/* Theme toggle */}
                {mounted && (
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="rounded-xl p-2.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
                    >
                        {theme === 'dark' ? (
                            <Sun className="h-5 w-5" />
                        ) : (
                            <Moon className="h-5 w-5" />
                        )}
                    </button>
                )}

                {/* Notifications */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative rounded-xl p-2.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <Bell className="h-5 w-5" />
                        {notifications > 0 && (
                            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                                {notifications > 9 ? '9+' : notifications}
                            </span>
                        )}
                    </button>

                    {/* Notifications Dropdown */}
                    {showNotifications && (
                        <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800 overflow-hidden animate-fade-in">
                            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-4 py-3">
                                <h3 className="font-semibold text-gray-900 dark:text-white">Notificaciones</h3>
                                <button
                                    onClick={() => setShowNotifications(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="max-h-80 overflow-y-auto">
                                {mockNotifications.map((notif) => (
                                    <Link
                                        key={notif.id}
                                        href={notif.link || '#'}
                                        onClick={() => setShowNotifications(false)}
                                        className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <div className="mt-0.5">
                                            {getNotifIcon(notif.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {notif.title}
                                            </p>
                                            <p className="text-sm text-gray-500 truncate">
                                                {notif.message}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {notif.time}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3">
                                <Link
                                    href="/auditoria"
                                    onClick={() => setShowNotifications(false)}
                                    className="text-sm text-primary-500 hover:text-primary-600 font-medium"
                                >
                                    Ver todas las notificaciones →
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
