'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, History, User, FileText, DollarSign, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';

// Mock data
const auditData = [
    {
        id: '1',
        usuario: 'admin@sistema.com',
        accion: 'Creó préstamo #00005',
        tipo: 'prestamo',
        ip: '192.168.1.100',
        fecha: '2026-01-17T12:30:00',
    },
    {
        id: '2',
        usuario: 'admin@sistema.com',
        accion: 'Registró pago de $1,500 para préstamo #00001',
        tipo: 'pago',
        ip: '192.168.1.100',
        fecha: '2026-01-17T11:45:00',
    },
    {
        id: '3',
        usuario: 'gerente@sistema.com',
        accion: 'Aprobó préstamo #00004',
        tipo: 'prestamo',
        ip: '192.168.1.101',
        fecha: '2026-01-17T10:20:00',
    },
    {
        id: '4',
        usuario: 'admin@sistema.com',
        accion: 'Creó cliente: Juan Pérez García',
        tipo: 'cliente',
        ip: '192.168.1.100',
        fecha: '2026-01-17T09:15:00',
    },
    {
        id: '5',
        usuario: 'admin@sistema.com',
        accion: 'Modificó configuración: Tasa de interés',
        tipo: 'config',
        ip: '192.168.1.100',
        fecha: '2026-01-16T18:00:00',
    },
    {
        id: '6',
        usuario: 'cajero@sistema.com',
        accion: 'Registró pago de $5,000 para préstamo #00004',
        tipo: 'pago',
        ip: '192.168.1.102',
        fecha: '2026-01-16T16:30:00',
    },
    {
        id: '7',
        usuario: 'admin@sistema.com',
        accion: 'Inició sesión',
        tipo: 'auth',
        ip: '192.168.1.100',
        fecha: '2026-01-16T09:00:00',
    },
];

const tipoIcons = {
    prestamo: <FileText className="h-4 w-4" />,
    pago: <DollarSign className="h-4 w-4" />,
    cliente: <User className="h-4 w-4" />,
    config: <Settings className="h-4 w-4" />,
    auth: <User className="h-4 w-4" />,
};

const tipoColors = {
    prestamo: 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400',
    pago: 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400',
    cliente: 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400',
    config: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    auth: 'bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-400',
};

export default function AuditoriaPage() {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [filtroTipo, setFiltroTipo] = React.useState<string>('todos');

    const filteredAudit = auditData.filter(a => {
        const matchesSearch = a.accion.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.usuario.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTipo = filtroTipo === 'todos' || a.tipo === filtroTipo;
        return matchesSearch && matchesTipo;
    });

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
                    📋 Auditoría
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Registro de actividades del sistema
                </p>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="py-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="flex-1">
                            <Input
                                placeholder="Buscar en bitácora..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                leftIcon={<Search className="h-4 w-4" />}
                            />
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {[
                                { id: 'todos', label: 'Todos' },
                                { id: 'prestamo', label: 'Préstamos' },
                                { id: 'pago', label: 'Pagos' },
                                { id: 'cliente', label: 'Clientes' },
                                { id: 'config', label: 'Config' },
                            ].map((tipo) => (
                                <button
                                    key={tipo.id}
                                    onClick={() => setFiltroTipo(tipo.id)}
                                    className={cn(
                                        'rounded-full px-3 py-1.5 text-xs font-medium transition-all',
                                        filtroTipo === tipo.id
                                            ? 'bg-primary-500 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
                                    )}
                                >
                                    {tipo.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Audit Log */}
            <Card padding="none">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Tipo
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Acción
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Usuario
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    IP
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Fecha/Hora
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {filteredAudit.map((log) => (
                                <tr
                                    key={log.id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
                                            tipoColors[log.tipo as keyof typeof tipoColors]
                                        )}>
                                            {tipoIcons[log.tipo as keyof typeof tipoIcons]}
                                            {log.tipo.charAt(0).toUpperCase() + log.tipo.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-gray-900 dark:text-white">
                                            {log.accion}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {log.usuario}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-mono text-gray-500">
                                            {log.ip}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {formatDate(log.fecha, { includeTime: true })}
                                        </p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4 dark:border-gray-700">
                    <p className="text-sm text-gray-500">
                        Mostrando <span className="font-medium">1-{filteredAudit.length}</span> de{' '}
                        <span className="font-medium">{filteredAudit.length}</span> registros
                    </p>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" disabled>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
