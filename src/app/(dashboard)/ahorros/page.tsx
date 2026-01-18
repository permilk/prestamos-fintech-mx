'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Plus, Search, PiggyBank, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

// Mock data
const ahorrosData = [
    {
        id: '1',
        cliente: 'Juan Pérez García',
        clienteId: '1',
        saldo: 25000,
        tasaInteres: 5,
        fechaApertura: '2025-06-15',
        ultimoMovimiento: '2026-01-15',
        estado: 'activo',
    },
    {
        id: '2',
        cliente: 'María García López',
        clienteId: '2',
        saldo: 45000,
        tasaInteres: 6,
        fechaApertura: '2025-03-20',
        ultimoMovimiento: '2026-01-10',
        estado: 'activo',
    },
    {
        id: '3',
        cliente: 'Ana Rodríguez Sánchez',
        clienteId: '4',
        saldo: 55000,
        tasaInteres: 6,
        fechaApertura: '2024-11-01',
        ultimoMovimiento: '2026-01-05',
        estado: 'activo',
    },
];

const movimientosRecientes = [
    { id: '1', cuenta: '1', tipo: 'deposito', monto: 5000, fecha: '2026-01-15', cliente: 'Juan Pérez' },
    { id: '2', cuenta: '2', tipo: 'deposito', monto: 10000, fecha: '2026-01-10', cliente: 'María García' },
    { id: '3', cuenta: '3', tipo: 'retiro', monto: 2000, fecha: '2026-01-05', cliente: 'Ana Rodríguez' },
    { id: '4', cuenta: '1', tipo: 'interes', monto: 104.17, fecha: '2026-01-01', cliente: 'Juan Pérez' },
];

export default function AhorrosPage() {
    const [searchTerm, setSearchTerm] = React.useState('');

    const filteredAhorros = ahorrosData.filter(a =>
        a.cliente.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalCaptado = ahorrosData.reduce((sum, a) => sum + a.saldo, 0);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
                        🏦 Ahorros
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Gestiona cuentas de ahorro de clientes
                    </p>
                </div>
                <Link href="/ahorros/nueva">
                    <Button>
                        <Plus className="h-4 w-4" />
                        Nueva Cuenta
                    </Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
                <Card className="bg-gradient-to-br from-violet-500 to-violet-600 text-white">
                    <CardContent className="py-4">
                        <p className="text-sm text-white/80">Total Captado</p>
                        <p className="text-2xl font-bold font-mono">{formatCurrency(totalCaptado)}</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <CardContent className="py-4">
                        <p className="text-sm text-white/80">Cuentas Activas</p>
                        <p className="text-2xl font-bold">{ahorrosData.length}</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                    <CardContent className="py-4">
                        <p className="text-sm text-white/80">Tasa Promedio</p>
                        <p className="text-2xl font-bold">5.67% anual</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Accounts List */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <PiggyBank className="h-5 w-5 text-primary-500" />
                            Cuentas de Ahorro
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input
                            placeholder="Buscar cuenta..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            leftIcon={<Search className="h-4 w-4" />}
                        />

                        <div className="space-y-3">
                            {filteredAhorros.map((cuenta) => (
                                <div
                                    key={cuenta.id}
                                    className="flex items-center justify-between rounded-xl bg-gray-50 p-4 dark:bg-gray-800"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-600 font-semibold dark:bg-violet-900 dark:text-violet-300">
                                            {cuenta.cliente.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                        </div>
                                        <div>
                                            <Link
                                                href={`/clientes/${cuenta.clienteId}`}
                                                className="font-medium text-gray-900 dark:text-white hover:text-primary-500"
                                            >
                                                {cuenta.cliente}
                                            </Link>
                                            <p className="text-xs text-gray-500">
                                                Tasa: {cuenta.tasaInteres}% anual
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-mono font-semibold text-gray-900 dark:text-white">
                                            {formatCurrency(cuenta.saldo)}
                                        </p>
                                        <div className="flex gap-1 mt-1">
                                            <Button variant="ghost" size="sm">
                                                <ArrowDownRight className="h-3 w-3 text-green-500" />
                                            </Button>
                                            <Button variant="ghost" size="sm">
                                                <ArrowUpRight className="h-3 w-3 text-red-500" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Movements */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Movimientos Recientes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {movimientosRecientes.map((mov) => (
                                <div
                                    key={mov.id}
                                    className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800 last:border-0"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            'flex h-8 w-8 items-center justify-center rounded-full',
                                            mov.tipo === 'deposito' ? 'bg-green-100 text-green-600' :
                                                mov.tipo === 'retiro' ? 'bg-red-100 text-red-600' :
                                                    'bg-blue-100 text-blue-600'
                                        )}>
                                            {mov.tipo === 'deposito' ? <TrendingUp className="h-4 w-4" /> :
                                                mov.tipo === 'retiro' ? <TrendingDown className="h-4 w-4" /> :
                                                    <PiggyBank className="h-4 w-4" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                {mov.tipo === 'deposito' ? 'Depósito' :
                                                    mov.tipo === 'retiro' ? 'Retiro' : 'Interés Generado'}
                                            </p>
                                            <p className="text-xs text-gray-500">{mov.cliente}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={cn(
                                            'font-mono font-semibold',
                                            mov.tipo === 'deposito' || mov.tipo === 'interes' ? 'text-green-600' : 'text-red-600'
                                        )}>
                                            {mov.tipo === 'retiro' ? '-' : '+'}
                                            {formatCurrency(mov.monto)}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {formatDate(mov.fecha, { short: true })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
