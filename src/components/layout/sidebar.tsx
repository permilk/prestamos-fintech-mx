'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Users,
    Wallet,
    Receipt,
    Calculator,
    Settings,
    FileBarChart,
    AlertTriangle,
    PiggyBank,
    Package,
    Shield,
    History,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Bell,
    User,
} from 'lucide-react';

interface NavItem {
    title: string;
    href: string;
    icon: React.ReactNode;
    badge?: number;
    badgeVariant?: 'default' | 'danger';
}

interface NavSection {
    title: string;
    items: NavItem[];
    adminOnly?: boolean;
}

const navigation: NavSection[] = [
    {
        title: '',
        items: [
            { title: 'Dashboard', href: '/', icon: <LayoutDashboard className="h-5 w-5" /> },
        ],
    },
    {
        title: 'Operaciones',
        items: [
            { title: 'Clientes', href: '/clientes', icon: <Users className="h-5 w-5" /> },
            { title: 'Préstamos', href: '/prestamos', icon: <Wallet className="h-5 w-5" /> },
            { title: 'Pagos', href: '/pagos', icon: <Receipt className="h-5 w-5" /> },
            { title: 'Simulador', href: '/simulador', icon: <Calculator className="h-5 w-5" /> },
        ],
    },
    {
        title: 'Servicios',
        items: [
            { title: 'Empeños', href: '/empenos', icon: <Package className="h-5 w-5" /> },
            { title: 'Ahorros', href: '/ahorros', icon: <PiggyBank className="h-5 w-5" /> },
        ],
    },
    {
        title: 'Reportes',
        items: [
            { title: 'Reportes', href: '/reportes', icon: <FileBarChart className="h-5 w-5" /> },
            { title: 'Cobranza', href: '/cobranza', icon: <AlertTriangle className="h-5 w-5" /> },
        ],
    },
    {
        title: 'Administración',
        adminOnly: true,
        items: [
            { title: 'Usuarios', href: '/usuarios', icon: <Shield className="h-5 w-5" /> },
            { title: 'Auditoría', href: '/auditoria', icon: <History className="h-5 w-5" /> },
            { title: 'Configuración', href: '/configuracion', icon: <Settings className="h-5 w-5" /> },
        ],
    },
];

interface SidebarProps {
    className?: string;
    logo?: string;
    nombreEmpresa?: string;
    alertasVencidos?: number;
    usuario?: {
        nombre: string;
        email: string;
        rol: string;
    };
}

export function Sidebar({
    className,
    logo,
    nombreEmpresa = 'Préstamos MX',
    alertasVencidos = 0,
    usuario,
}: SidebarProps) {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = React.useState(false);

    // Add badge to Cobranza if there are overdue loans
    const navWithBadges = navigation.map(section => ({
        ...section,
        items: section.items.map(item => {
            if (item.href === '/cobranza' && alertasVencidos > 0) {
                return { ...item, badge: alertasVencidos, badgeVariant: 'danger' as const };
            }
            return item;
        }),
    }));

    return (
        <aside
            className={cn(
                'flex h-screen flex-col bg-gray-900 text-white transition-all duration-300',
                collapsed ? 'w-20' : 'w-64',
                className
            )}
        >
            {/* Header / Logo */}
            <div className="flex h-16 items-center justify-between border-b border-gray-800 px-4">
                {!collapsed && (
                    <Link href="/" className="flex items-center gap-3">
                        {logo ? (
                            <img src={logo} alt="Logo" className="h-10 w-10 rounded-xl object-contain bg-white p-1" />
                        ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500">
                                <Wallet className="h-6 w-6" />
                            </div>
                        )}
                        <span className="font-semibold text-sm truncate">{nombreEmpresa}</span>
                    </Link>
                )}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="rounded-lg p-2 hover:bg-gray-800 transition-colors"
                >
                    {collapsed ? (
                        <ChevronRight className="h-5 w-5" />
                    ) : (
                        <ChevronLeft className="h-5 w-5" />
                    )}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4">
                {navWithBadges.map((section, sectionIndex) => (
                    <div key={sectionIndex} className="mb-4">
                        {section.title && !collapsed && (
                            <p className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                {section.title}
                            </p>
                        )}
                        <ul className="space-y-1 px-2">
                            {section.items.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <li key={item.href}>
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                                                isActive
                                                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                                                collapsed && 'justify-center'
                                            )}
                                        >
                                            {item.icon}
                                            {!collapsed && (
                                                <>
                                                    <span className="flex-1">{item.title}</span>
                                                    {item.badge && (
                                                        <span
                                                            className={cn(
                                                                'rounded-full px-2 py-0.5 text-xs font-semibold',
                                                                item.badgeVariant === 'danger'
                                                                    ? 'bg-red-500 text-white'
                                                                    : 'bg-gray-700 text-gray-300'
                                                            )}
                                                        >
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            {/* User section */}
            {usuario && (
                <div className="border-t border-gray-800 p-4">
                    <div className={cn('flex items-center gap-3', collapsed && 'justify-center')}>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-500 font-semibold">
                            {usuario.nombre.charAt(0).toUpperCase()}
                        </div>
                        {!collapsed && (
                            <div className="flex-1 overflow-hidden">
                                <p className="truncate text-sm font-medium">{usuario.nombre}</p>
                                <p className="truncate text-xs text-gray-500">{usuario.rol}</p>
                            </div>
                        )}
                        {!collapsed && (
                            <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors">
                                <LogOut className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                </div>
            )}
        </aside>
    );
}
