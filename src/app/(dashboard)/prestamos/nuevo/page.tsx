'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save, Calculator, Info } from 'lucide-react';
import Link from 'next/link';
import { cn, formatCurrency } from '@/lib/utils';
import {
    calcularCAT,
    generarTablaAmortizacion,
    type FrecuenciaPago,
    type SistemaAmortizacion,
} from '@/lib/finance';

// Mock clients for dropdown
const clientesMock = [
    { id: '1', nombre: 'Juan Pérez García' },
    { id: '2', nombre: 'María García López' },
    { id: '3', nombre: 'Carlos López Martínez' },
    { id: '4', nombre: 'Ana Rodríguez Sánchez' },
    { id: '5', nombre: 'Roberto Hernández Díaz' },
];

export default function NuevoPrestamoPage() {
    const router = useRouter();

    const [loading, setLoading] = React.useState(false);
    const [formData, setFormData] = React.useState({
        clienteId: '',
        monto: 10000,
        tasaInteres: 20,
        plazo: 12,
        frecuencia: 'mensual' as FrecuenciaPago,
        sistema: 'francia' as SistemaAmortizacion,
    });

    // Real-time calculation
    const calculation = React.useMemo(() => {
        try {
            const tabla = generarTablaAmortizacion({
                capital: formData.monto,
                tasaMensual: formData.tasaInteres,
                plazo: formData.plazo,
                frecuencia: formData.frecuencia,
                sistema: 'frances',
                fechaInicio: new Date(),
            });

            const catResult = calcularCAT({
                montoPrestado: formData.monto,
                tasaInteresMensual: formData.tasaInteres,
                plazoMeses: formData.plazo,
            });

            return {
                cuota: tabla.resumen.cuotaPromedio,
                totalAPagar: tabla.resumen.totalAPagar,
                totalIntereses: tabla.resumen.totalIntereses,
                totalIVA: tabla.resumen.totalIVA,
                cat: catResult.catFormateado,
            };
        } catch {
            return null;
        }
    }, [formData]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Redirect to loans list
        router.push('/prestamos');
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="flex items-center gap-4">
                <Link href="/prestamos">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Nuevo Préstamo
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Configura los términos del préstamo
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Form */}
                    <div className="space-y-6">
                        {/* Client Selection */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Cliente</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <select
                                    value={formData.clienteId}
                                    onChange={(e) => setFormData({ ...formData, clienteId: e.target.value })}
                                    required
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-800"
                                >
                                    <option value="">Seleccionar cliente...</option>
                                    {clientesMock.map((c) => (
                                        <option key={c.id} value={c.id}>{c.nombre}</option>
                                    ))}
                                </select>
                                <Link
                                    href="/clientes/nuevo"
                                    className="mt-2 inline-block text-sm text-primary-500 hover:underline"
                                >
                                    + Registrar nuevo cliente
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Loan Terms */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Calculator className="h-5 w-5 text-primary-500" />
                                    Términos del Préstamo
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <Input
                                    label="Monto a Prestar"
                                    type="number"
                                    value={formData.monto}
                                    onChange={(e) => setFormData({ ...formData, monto: Number(e.target.value) })}
                                    leftIcon={<span className="text-gray-500">$</span>}
                                    required
                                />

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Input
                                        label="Tasa de Interés"
                                        type="number"
                                        step="0.1"
                                        value={formData.tasaInteres}
                                        onChange={(e) => setFormData({ ...formData, tasaInteres: Number(e.target.value) })}
                                        rightIcon={<span className="text-gray-500">%</span>}
                                        required
                                    />
                                    <Input
                                        label="Número de Cuotas"
                                        type="number"
                                        value={formData.plazo}
                                        onChange={(e) => setFormData({ ...formData, plazo: Number(e.target.value) })}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Frecuencia de Pago
                                    </label>
                                    <div className="flex gap-2">
                                        {(['semanal', 'quincenal', 'mensual'] as const).map((freq) => (
                                            <button
                                                type="button"
                                                key={freq}
                                                onClick={() => setFormData({ ...formData, frecuencia: freq })}
                                                className={cn(
                                                    'flex-1 rounded-xl border-2 p-3 text-center text-sm font-medium transition-all',
                                                    formData.frecuencia === freq
                                                        ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                                                        : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                                                )}
                                            >
                                                {freq === 'semanal' ? 'Semanal' : freq === 'quincenal' ? 'Quincenal' : 'Mensual'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <Input
                                    label="Fecha de Inicio"
                                    type="date"
                                    defaultValue={new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Summary */}
                    <div className="space-y-6">
                        <Card className="sticky top-4">
                            <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-6 text-white rounded-t-2xl">
                                <h3 className="text-lg font-semibold mb-4">Resumen del Préstamo</h3>

                                {calculation ? (
                                    <>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div>
                                                <p className="text-sm text-white/70">Cuota por período</p>
                                                <p className="text-3xl font-bold font-mono">
                                                    {formatCurrency(calculation.cuota)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-white/70">Total a Pagar</p>
                                                <p className="text-3xl font-bold font-mono">
                                                    {formatCurrency(calculation.totalAPagar)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-6 grid gap-4 sm:grid-cols-3">
                                            <div className="rounded-xl bg-white/10 p-3">
                                                <p className="text-xs text-white/70">Intereses</p>
                                                <p className="text-lg font-semibold font-mono">
                                                    {formatCurrency(calculation.totalIntereses)}
                                                </p>
                                            </div>
                                            <div className="rounded-xl bg-white/10 p-3">
                                                <p className="text-xs text-white/70">IVA</p>
                                                <p className="text-lg font-semibold font-mono">
                                                    {formatCurrency(calculation.totalIVA)}
                                                </p>
                                            </div>
                                            <div className="rounded-xl bg-white/10 p-3">
                                                <p className="text-xs text-white/70">CAT</p>
                                                <p className="text-lg font-semibold">
                                                    {calculation.cat}
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-white/70">Complete los datos para ver el cálculo</p>
                                )}
                            </div>

                            <div className="bg-blue-50 p-4 dark:bg-blue-900/20">
                                <div className="flex items-start gap-2">
                                    <Info className="h-5 w-5 shrink-0 text-blue-500" />
                                    <p className="text-xs text-blue-700 dark:text-blue-300">
                                        El CAT y el IVA se calculan conforme a regulaciones Banxico y SAT.
                                    </p>
                                </div>
                            </div>

                            <CardContent className="pt-6">
                                <div className="flex flex-col gap-3">
                                    <Button type="submit" loading={loading} className="w-full">
                                        <Save className="h-4 w-4" />
                                        Crear Préstamo
                                    </Button>
                                    <Link href="/prestamos">
                                        <Button variant="outline" type="button" className="w-full">
                                            Cancelar
                                        </Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    );
}
