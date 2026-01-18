'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import {
    Plus,
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    Eye,
    Receipt,
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

// Mock data
const prestamosData = [
    {
        id: '1',
        cliente: 'Juan Pérez García',
        clienteId: '1',
        monto: 15000,
        montoTotal: 18000,
        cuotaMensual: 1500,
        plazo: 12,
        frecuencia: 'mensual',
        tasaInteres: 20,
        cat: '42.5%',
        fechaDesembolso: '2026-01-15',
        fechaProximoPago: '2026-02-15',
        cuotasPagadas: 0,
        saldoPendiente: 18000,
        estado: 'activo',
    },
    {
        id: '2',
        cliente: 'María García López',
        clienteId: '2',
        monto: 8000,
        montoTotal: 9600,
        cuotaMensual: 800,
        plazo: 12,
        frecuencia: 'mensual',
        tasaInteres: 20,
        cat: '42.5%',
        fechaDesembolso: '2026-01-14',
        fechaProximoPago: '2026-02-14',
        cuotasPagadas: 0,
        saldoPendiente: 9600,
        estado: 'activo',
    },
    {
        id: '3',
        cliente: 'Carlos López Martínez',
        clienteId: '3',
        monto: 25000,
        montoTotal: 30000,
        cuotaMensual: 2500,
        plazo: 12,
        frecuencia: 'mensual',
        tasaInteres: 20,
        cat: '42.5%',
        fechaDesembolso: '2025-12-10',
        fechaProximoPago: '2026-01-10',
        cuotasPagadas: 0,
        saldoPendiente: 30000,
        estado: 'vencido',
        diasMora: 7,
    },
    {
        id: '4',
        cliente: 'Roberto Hernández Díaz',
        clienteId: '5',
        monto: 50000,
        montoTotal: 60000,
        cuotaMensual: 5000,
        plazo: 12,
        frecuencia: 'mensual',
        tasaInteres: 20,
        cat: '42.5%',
        fechaDesembolso: '2025-11-01',
        fechaProximoPago: '2026-02-01',
        cuotasPagadas: 2,
        saldoPendiente: 50000,
        estado: 'activo',
    },
];

const estadoColors = {
    solicitud: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    aprobado: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    activo: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    vencido: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    liquidado: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
};

const estadoLabels = {
    solicitud: 'Solicitud',
    aprobado: 'Aprobado',
    activo: 'Activo',
    vencido: 'Vencido',
    liquidado: 'Liquidado',
};

export default function PrestamosPage() {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [filtroEstado, setFiltroEstado] = React.useState<string>('todos');

    const filteredPrestamos = prestamosData.filter(p => {
        const matchesSearch = p.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.id.includes(searchTerm);
        const matchesEstado = filtroEstado === 'todos' || p.estado === filtroEstado;
        return matchesSearch && matchesEstado;
    });

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
                        💰 Préstamos
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Gestiona todos los préstamos activos
                    </p>
                </div>
                <Link href="/prestamos/nuevo">
                    <Button>
                        <Plus className="h-4 w-4" />
                        Nuevo Préstamo
                    </Button>
                </Link>
            </div>

            {/* Stats Summary */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <CardContent className="py-4">
                        <p className="text-sm text-white/80">Total Préstamos</p>
                        <p className="text-2xl font-bold">{prestamosData.length}</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <CardContent className="py-4">
                        <p className="text-sm text-white/80">Capital Prestado</p>
                        <p className="text-2xl font-bold font-mono">
                            {formatCurrency(prestamosData.reduce((sum, p) => sum + p.monto, 0))}
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
                    <CardContent className="py-4">
                        <p className="text-sm text-white/80">Por Recuperar</p>
                        <p className="text-2xl font-bold font-mono">
                            {formatCurrency(prestamosData.reduce((sum, p) => sum + p.saldoPendiente, 0))}
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
                    <CardContent className="py-4">
                        <p className="text-sm text-white/80">Vencidos</p>
                        <p className="text-2xl font-bold">
                            {prestamosData.filter(p => p.estado === 'vencido').length}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="py-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="flex-1">
                            <Input
                                placeholder="Buscar por cliente o ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                leftIcon={<Search className="h-4 w-4" />}
                            />
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {['todos', 'activo', 'vencido', 'liquidado'].map((estado) => (
                                <button
                                    key={estado}
                                    onClick={() => setFiltroEstado(estado)}
                                    className={cn(
                                        'rounded-full px-4 py-1.5 text-sm font-medium transition-all',
                                        filtroEstado === estado
                                            ? 'bg-primary-500 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
                                    )}
                                >
                                    {estado === 'todos' ? 'Todos' : estadoLabels[estado as keyof typeof estadoLabels]}
                                </button>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Loans Table */}
            <Card padding="none">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    ID / Cliente
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Monto
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Cuota
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Próximo Pago
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Saldo
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Estado
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {filteredPrestamos.map((prestamo) => (
                                <tr
                                    key={prestamo.id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-mono text-xs text-gray-500">#{prestamo.id.padStart(5, '0')}</p>
                                            <Link
                                                href={`/clientes/${prestamo.clienteId}`}
                                                className="font-medium text-gray-900 dark:text-white hover:text-primary-500"
                                            >
                                                {prestamo.cliente}
                                            </Link>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-mono font-semibold text-gray-900 dark:text-white">
                                                {formatCurrency(prestamo.monto)}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                CAT: {prestamo.cat}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-mono font-medium text-gray-900 dark:text-white">
                                                {formatCurrency(prestamo.cuotaMensual)}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {prestamo.cuotasPagadas}/{prestamo.plazo} pagadas
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className={cn(
                                            "text-sm",
                                            prestamo.estado === 'vencido' ? 'text-red-600 font-semibold' : 'text-gray-600 dark:text-gray-400'
                                        )}>
                                            {formatDate(prestamo.fechaProximoPago, { short: true })}
                                        </p>
                                        {prestamo.diasMora && (
                                            <p className="text-xs text-red-500">{prestamo.diasMora} días de mora</p>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-mono font-semibold text-gray-900 dark:text-white">
                                            {formatCurrency(prestamo.saldoPendiente)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                                            estadoColors[prestamo.estado as keyof typeof estadoColors]
                                        )}>
                                            {estadoLabels[prestamo.estado as keyof typeof estadoLabels]}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/prestamos/${prestamo.id}`}>
                                                <Button variant="ghost" size="sm">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Link href={`/pagos/nuevo?prestamo=${prestamo.id}`}>
                                                <Button variant="outline" size="sm">
                                                    <Receipt className="h-4 w-4" />
                                                    Pago
                                                </Button>
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4 dark:border-gray-700">
                    <p className="text-sm text-gray-500">
                        Mostrando <span className="font-medium">1-{filteredPrestamos.length}</span> de{' '}
                        <span className="font-medium">{filteredPrestamos.length}</span> préstamos
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
