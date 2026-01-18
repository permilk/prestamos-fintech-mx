'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import {
    Plus,
    Search,
    ChevronLeft,
    ChevronRight,
    Receipt,
    Check,
    Clock,
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

// Mock data
const pagosData = [
    {
        id: '1',
        prestamoId: '1',
        cliente: 'Juan Pérez García',
        monto: 1500,
        metodoPago: 'efectivo',
        concepto: 'Cuota 1/12',
        fechaPago: '2026-01-17T10:30:00',
        estado: 'completado',
        reciboPor: 'Admin',
    },
    {
        id: '2',
        prestamoId: '2',
        cliente: 'María García López',
        monto: 800,
        metodoPago: 'spei',
        concepto: 'Cuota 1/12',
        fechaPago: '2026-01-16T14:22:00',
        estado: 'completado',
        reciboPor: 'Admin',
    },
    {
        id: '3',
        prestamoId: '4',
        cliente: 'Roberto Hernández Díaz',
        monto: 5000,
        metodoPago: 'oxxo',
        concepto: 'Cuota 3/12',
        fechaPago: '2026-01-15T09:15:00',
        estado: 'completado',
        reciboPor: 'Cajero 1',
    },
    {
        id: '4',
        prestamoId: '4',
        cliente: 'Roberto Hernández Díaz',
        monto: 5000,
        metodoPago: 'efectivo',
        concepto: 'Cuota 2/12',
        fechaPago: '2025-12-15T11:45:00',
        estado: 'completado',
        reciboPor: 'Admin',
    },
];

const metodoPagoLabels = {
    efectivo: { label: 'Efectivo', color: 'bg-green-100 text-green-700' },
    spei: { label: 'SPEI', color: 'bg-blue-100 text-blue-700' },
    oxxo: { label: 'OXXO', color: 'bg-orange-100 text-orange-700' },
    codi: { label: 'CoDi', color: 'bg-purple-100 text-purple-700' },
    tarjeta: { label: 'Tarjeta', color: 'bg-indigo-100 text-indigo-700' },
};

export default function PagosPage() {
    const [searchTerm, setSearchTerm] = React.useState('');

    const filteredPagos = pagosData.filter(p =>
        p.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.includes(searchTerm)
    );

    const totalHoy = pagosData
        .filter(p => new Date(p.fechaPago).toDateString() === new Date().toDateString())
        .reduce((sum, p) => sum + p.monto, 0);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
                        🧾 Pagos
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Registro de pagos recibidos
                    </p>
                </div>
                <Link href="/pagos/nuevo">
                    <Button>
                        <Plus className="h-4 w-4" />
                        Registrar Pago
                    </Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
                <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                    <CardContent className="py-4">
                        <p className="text-sm text-white/80">Cobrado Hoy</p>
                        <p className="text-2xl font-bold font-mono">{formatCurrency(totalHoy)}</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <CardContent className="py-4">
                        <p className="text-sm text-white/80">Pagos Este Mes</p>
                        <p className="text-2xl font-bold">{pagosData.length}</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-violet-500 to-violet-600 text-white">
                    <CardContent className="py-4">
                        <p className="text-sm text-white/80">Total Mes</p>
                        <p className="text-2xl font-bold font-mono">
                            {formatCurrency(pagosData.reduce((sum, p) => sum + p.monto, 0))}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="py-4">
                    <Input
                        placeholder="Buscar por cliente o ID de pago..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        leftIcon={<Search className="h-4 w-4" />}
                    />
                </CardContent>
            </Card>

            {/* Payments Table */}
            <Card padding="none">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Folio / Cliente
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Monto
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Método
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Concepto
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Fecha/Hora
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
                            {filteredPagos.map((pago) => (
                                <tr
                                    key={pago.id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-mono text-xs text-gray-500">#{pago.id.padStart(6, '0')}</p>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {pago.cliente}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                            +{formatCurrency(pago.monto)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                                            metodoPagoLabels[pago.metodoPago as keyof typeof metodoPagoLabels]?.color
                                        )}>
                                            {metodoPagoLabels[pago.metodoPago as keyof typeof metodoPagoLabels]?.label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            {pago.concepto}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                                            <Clock className="h-3.5 w-3.5" />
                                            {formatDate(pago.fechaPago, { includeTime: true })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900 dark:text-green-300">
                                            <Check className="h-3 w-3" />
                                            Completado
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="ghost" size="sm">
                                            <Receipt className="h-4 w-4" />
                                            Recibo
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4 dark:border-gray-700">
                    <p className="text-sm text-gray-500">
                        Mostrando <span className="font-medium">1-{filteredPagos.length}</span> de{' '}
                        <span className="font-medium">{filteredPagos.length}</span> pagos
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
