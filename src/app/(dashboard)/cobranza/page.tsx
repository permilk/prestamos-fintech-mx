'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import {
    AlertTriangle,
    Phone,
    MessageSquare,
    Clock,
    ChevronRight,
    Calendar,
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

// Mock data - overdue loans
const vencidosData = [
    {
        id: '3',
        cliente: 'Carlos López Martínez',
        clienteId: '3',
        telefono: '5552468135',
        monto: 25000,
        saldoPendiente: 30000,
        cuotaVencida: 2500,
        fechaVencimiento: '2026-01-10',
        diasMora: 7,
        intentosContacto: 2,
        ultimoContacto: '2026-01-15',
        notas: 'Prometió pagar el viernes',
    },
    {
        id: '5',
        cliente: 'Pedro Sánchez Luna',
        clienteId: '6',
        telefono: '5551234567',
        monto: 12000,
        saldoPendiente: 14400,
        cuotaVencida: 1200,
        fechaVencimiento: '2026-01-05',
        diasMora: 12,
        intentosContacto: 5,
        ultimoContacto: '2026-01-16',
        notas: 'No contesta llamadas',
    },
    {
        id: '6',
        cliente: 'Laura Martínez Ruiz',
        clienteId: '7',
        telefono: '5559876543',
        monto: 8000,
        saldoPendiente: 9600,
        cuotaVencida: 800,
        fechaVencimiento: '2026-01-12',
        diasMora: 5,
        intentosContacto: 1,
        ultimoContacto: '2026-01-14',
        notas: 'Pidió extensión de 1 semana',
    },
];

export default function CobranzaPage() {
    const totalMora = vencidosData.reduce((sum, v) => sum + v.saldoPendiente, 0);
    const totalCuotasVencidas = vencidosData.reduce((sum, v) => sum + v.cuotaVencida, 0);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
                        ⚠️ Cobranza
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Gestiona préstamos vencidos y seguimiento de cobranza
                    </p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
                <Card className="border-l-4 border-l-red-500 bg-red-50 dark:bg-red-900/20">
                    <CardContent className="py-4">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="h-8 w-8 text-red-500" />
                            <div>
                                <p className="text-sm text-red-600 dark:text-red-400">Préstamos Vencidos</p>
                                <p className="text-2xl font-bold text-red-700 dark:text-red-300">{vencidosData.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-orange-500 bg-orange-50 dark:bg-orange-900/20">
                    <CardContent className="py-4">
                        <div className="flex items-center gap-3">
                            <Clock className="h-8 w-8 text-orange-500" />
                            <div>
                                <p className="text-sm text-orange-600 dark:text-orange-400">Cuotas Vencidas</p>
                                <p className="text-2xl font-bold text-orange-700 dark:text-orange-300 font-mono">
                                    {formatCurrency(totalCuotasVencidas)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-900/20">
                    <CardContent className="py-4">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="h-8 w-8 text-amber-500" />
                            <div>
                                <p className="text-sm text-amber-600 dark:text-amber-400">Capital en Mora</p>
                                <p className="text-2xl font-bold text-amber-700 dark:text-amber-300 font-mono">
                                    {formatCurrency(totalMora)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Overdue Loans List */}
            <div className="space-y-4">
                {vencidosData.map((vencido) => (
                    <Card key={vencido.id} className="border-l-4 border-l-red-500">
                        <CardContent className="py-4">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                {/* Client Info */}
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 font-bold text-lg dark:bg-red-900 dark:text-red-300">
                                        {vencido.diasMora}d
                                    </div>
                                    <div>
                                        <Link
                                            href={`/clientes/${vencido.clienteId}`}
                                            className="font-semibold text-gray-900 dark:text-white hover:text-primary-500"
                                        >
                                            {vencido.cliente}
                                        </Link>
                                        <p className="text-sm text-gray-500">
                                            Préstamo #{vencido.id.padStart(5, '0')} • Vencido: {formatDate(vencido.fechaVencimiento, { short: true })}
                                        </p>
                                        <p className="mt-1 flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                                            <Phone className="h-3.5 w-3.5" />
                                            {vencido.telefono}
                                        </p>
                                    </div>
                                </div>

                                {/* Amounts */}
                                <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                                    <div>
                                        <p className="text-xs text-gray-500">Cuota Vencida</p>
                                        <p className="font-mono font-semibold text-red-600">
                                            {formatCurrency(vencido.cuotaVencida)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Saldo Total</p>
                                        <p className="font-mono font-semibold text-gray-900 dark:text-white">
                                            {formatCurrency(vencido.saldoPendiente)}
                                        </p>
                                    </div>
                                    <div className="col-span-2 lg:col-span-1">
                                        <p className="text-xs text-gray-500">Último Contacto</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {formatDate(vencido.ultimoContacto, { short: true })} ({vencido.intentosContacto} intentos)
                                        </p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <a href={`tel:${vencido.telefono}`}>
                                        <Button variant="outline" size="sm">
                                            <Phone className="h-4 w-4" />
                                            Llamar
                                        </Button>
                                    </a>
                                    <a href={`https://wa.me/52${vencido.telefono}?text=Hola%20${encodeURIComponent(vencido.cliente)}%2C%20le%20recordamos%20que%20tiene%20un%20pago%20pendiente.`} target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline" size="sm">
                                            <MessageSquare className="h-4 w-4" />
                                            WhatsApp
                                        </Button>
                                    </a>
                                    <Link href={`/pagos/nuevo?prestamo=${vencido.id}`}>
                                        <Button size="sm">
                                            Registrar Pago
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Notes */}
                            {vencido.notas && (
                                <div className="mt-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        <strong>Notas:</strong> {vencido.notas}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {vencidosData.length === 0 && (
                <Card className="py-12 text-center">
                    <CardContent>
                        <div className="text-6xl mb-4">🎉</div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            ¡Sin préstamos vencidos!
                        </h3>
                        <p className="text-gray-500">Todos los clientes están al día con sus pagos.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
