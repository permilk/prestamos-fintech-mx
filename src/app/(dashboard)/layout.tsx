'use client';

import * as React from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    // Mock user data - replace with actual auth
    const usuario = {
        nombre: 'Administrador',
        email: 'admin@sistema.com',
        rol: 'Administrador',
    };

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
            {/* Sidebar - Desktop */}
            <div className="hidden lg:block">
                <Sidebar
                    nombreEmpresa="Préstamos Fintech MX"
                    usuario={usuario}
                    alertasVencidos={3}
                />
            </div>

            {/* Sidebar - Mobile overlay */}
            {sidebarOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                    <div className="fixed inset-y-0 left-0 z-50 lg:hidden">
                        <Sidebar
                            nombreEmpresa="Préstamos Fintech MX"
                            usuario={usuario}
                            alertasVencidos={3}
                        />
                    </div>
                </>
            )}

            {/* Main content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header
                    onMenuClick={() => setSidebarOpen(true)}
                    notifications={2}
                />

                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
