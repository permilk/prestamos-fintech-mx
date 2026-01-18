'use client';

import * as React from 'react';
import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save, DollarSign, CreditCard, Building, QrCode, Receipt, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { cn, formatCurrency } from '@/lib/utils';

// Mock loan data
const prestamosMock = [
    { id: '1', cliente: 'Juan Pérez García', saldoPendiente: 18000, cuotaMensual: 1500 },
    { id: '2', cliente: 'María García López', saldoPendiente: 9600, cuotaMensual: 800 },
    { id: '3', cliente: 'Carlos López Martínez', saldoPendiente: 30000, cuotaMensual: 2500 },
    { id: '4', cliente: 'Roberto Hernández Díaz', saldoPendiente: 50000, cuotaMensual: 5000 },
];

const metodosPago = [
    { id: 'efectivo', label: 'Efectivo', icon: DollarSign, color: 'bg-green-500' },
    { id: 'spei', label: 'SPEI', icon: Building, color: 'bg-blue-500' },
    { id: 'oxxo', label: 'OXXO', icon: Receipt, color: 'bg-orange-500' },
    { id: 'codi', label: 'CoDi/DiMo', icon: QrCode, color: 'bg-purple-500' },
    { id: 'tarjeta', label: 'Tarjeta', icon: CreditCard, color: 'bg-indigo-500' },
];

// Loading component for Suspense
function LoadingFallback() {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
        </div>
    );
}

// Main content component
function NuevoPagoContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const prestamoIdParam = searchParams.get('prestamo');

    const [loading, setLoading] = React.useState(false);
    const [prestamoId, setPrestamoId] = React.useState(prestamoIdParam || '');
    const [monto, setMonto] = React.useState<number>(0);
    const [metodoPago, setMetodoPago] = React.useState('efectivo');
    const [referencia, setReferencia] = React.useState('');

    const prestamoSeleccionado = prestamosMock.find(p => p.id === prestamoId);

    React.useEffect(() => {
        if (prestamoSeleccionado) {
            setMonto(prestamoSeleccionado.cuotaMensual);
        }
    }, [prestamoSeleccionado]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Redirect to payments list
        router.push('/pagos');
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
            {/* Page Header */}
            <div className="flex items-center gap-4">
                <Link href="/pagos">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Registrar Pago
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Registra un nuevo pago de préstamo
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Loan Selection */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Seleccionar Préstamo</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <select
                            value={prestamoId}
                            onChange={(e) => setPrestamoId(e.target.value)}
                            required
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-800"
                        >
                            <option value="">Seleccionar préstamo...</option>
                            {prestamosMock.map((p) => (
                                <option key={p.id} value={p.id}>
                                    #{p.id.padStart(5, '0')} - {p.cliente} - Saldo: {formatCurrency(p.saldoPendiente)}
                                </option>
                            ))}
                        </select>

                        {prestamoSeleccionado && (
                            <div className="mt-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                                <div className="grid gap-4 sm:grid-cols-3">
                                    <div>
                                        <p className="text-xs text-gray-500">Cliente</p>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {prestamoSeleccionado.cliente}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Saldo Pendiente</p>
                                        <p className="font-mono font-semibold text-gray-900 dark:text-white">
                                            {formatCurrency(prestamoSeleccionado.saldoPendiente)}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Cuota Mensual</p>
                                        <p className="font-mono font-semibold text-primary-600">
                                            {formatCurrency(prestamoSeleccionado.cuotaMensual)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Payment Amount */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Monto del Pago</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Input
                            type="number"
                            step="0.01"
                            value={monto}
                            onChange={(e) => setMonto(Number(e.target.value))}
                            leftIcon={<span className="text-gray-500">$</span>}
                            required
                        />

                        {prestamoSeleccionado && (
                            <div className="mt-3 flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setMonto(prestamoSeleccionado.cuotaMensual)}
                                    className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                                >
                                    1 Cuota ({formatCurrency(prestamoSeleccionado.cuotaMensual)})
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMonto(prestamoSeleccionado.cuotaMensual * 2)}
                                    className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300"
                                >
                                    2 Cuotas
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMonto(prestamoSeleccionado.saldoPendiente)}
                                    className="rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900 dark:text-emerald-300"
                                >
                                    Liquidar Total
                                </button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Payment Method */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Método de Pago</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
                            {metodosPago.map((metodo) => {
                                const Icon = metodo.icon;
                                return (
                                    <button
                                        type="button"
                                        key={metodo.id}
                                        onClick={() => setMetodoPago(metodo.id)}
                                        className={cn(
                                            'flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all',
                                            metodoPago === metodo.id
                                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                                                : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                                        )}
                                    >
                                        <div className={cn('rounded-full p-2 text-white', metodo.color)}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <span className="text-sm font-medium">{metodo.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {metodoPago === 'spei' && (
                            <div className="mt-4 space-y-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl animate-fade-in">
                                <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300">Datos de Transferencia SPEI</h4>
                                <Input
                                    label="Clave de Rastreo"
                                    value={referencia}
                                    onChange={(e) => setReferencia(e.target.value)}
                                    placeholder="Ej: MXBA20260117123456789"
                                    required
                                />
                            </div>
                        )}

                        {metodoPago === 'oxxo' && (
                            <div className="mt-4 space-y-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl animate-fade-in">
                                <h4 className="text-sm font-medium text-orange-700 dark:text-orange-300">Datos de Pago OXXO</h4>
                                <Input
                                    label="Folio de Pago"
                                    value={referencia}
                                    onChange={(e) => setReferencia(e.target.value)}
                                    placeholder="Ej: 12345678901234"
                                    required
                                />
                            </div>
                        )}

                        {metodoPago === 'codi' && (
                            <div className="mt-4 space-y-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl animate-fade-in">
                                <h4 className="text-sm font-medium text-purple-700 dark:text-purple-300">Datos de Pago CoDi/DiMo</h4>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Input
                                        label="ID de Operación"
                                        value={referencia}
                                        onChange={(e) => setReferencia(e.target.value)}
                                        placeholder="Ej: CODI20260117001"
                                        required
                                    />
                                    <Input
                                        label="Banco Emisor"
                                        placeholder="Ej: BBVA, Banorte, Santander"
                                    />
                                </div>
                                <Input
                                    label="Número de Celular del Pagador"
                                    placeholder="Ej: 55 1234 5678"
                                />
                            </div>
                        )}

                        {metodoPago === 'tarjeta' && (
                            <div className="mt-4 space-y-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl animate-fade-in">
                                <h4 className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Datos de Pago con Tarjeta</h4>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Input
                                        label="Número de Autorización"
                                        value={referencia}
                                        onChange={(e) => setReferencia(e.target.value)}
                                        placeholder="Ej: 123456"
                                        required
                                    />
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Tipo de Tarjeta
                                        </label>
                                        <select className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-800">
                                            <option value="debito">Débito</option>
                                            <option value="credito">Crédito</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Input
                                        label="Últimos 4 Dígitos"
                                        placeholder="****"
                                        maxLength={4}
                                    />
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Terminal
                                        </label>
                                        <select className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-800">
                                            <option value="clip">Clip</option>
                                            <option value="mercadopago">Mercado Pago</option>
                                            <option value="getnet">Getnet</option>
                                            <option value="banorte">Banorte TPV</option>
                                            <option value="otro">Otro</option>
                                        </select>
                                    </div>
                                </div>
                                <Input
                                    label="Nombre del Titular (opcional)"
                                    placeholder="Como aparece en la tarjeta"
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <Link href="/pagos">
                        <Button variant="outline" type="button" className="w-full sm:w-auto">
                            Cancelar
                        </Button>
                    </Link>
                    <Button
                        type="submit"
                        loading={loading}
                        disabled={!prestamoId || monto <= 0}
                        className="w-full sm:w-auto"
                    >
                        <Save className="h-4 w-4" />
                        Registrar Pago de {formatCurrency(monto)}
                    </Button>
                </div>
            </form>
        </div>
    );
}

// Wrapper with Suspense for useSearchParams
export default function NuevoPagoPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <NuevoPagoContent />
        </Suspense>
    );
}
