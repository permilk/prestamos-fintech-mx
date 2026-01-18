'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save, PiggyBank } from 'lucide-react';
import Link from 'next/link';

// Mock clients for dropdown
const clientesMock = [
    { id: '1', nombre: 'Juan Pérez García' },
    { id: '2', nombre: 'María García López' },
    { id: '3', nombre: 'Carlos López Martínez' },
];

export default function NuevaCuentaAhorroPage() {
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        router.push('/ahorros');
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-2xl mx-auto">
            {/* Page Header */}
            <div className="flex items-center gap-4">
                <Link href="/ahorros">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Nueva Cuenta de Ahorro
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Registra una nueva cuenta de ahorro para un cliente
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <PiggyBank className="h-5 w-5 text-primary-500" />
                            Datos de la Cuenta
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Cliente <span className="text-red-500">*</span>
                            </label>
                            <select
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
                        </div>

                        <Input
                            label="Depósito Inicial"
                            type="number"
                            name="deposito"
                            placeholder="5000"
                            required
                            leftIcon={<span className="text-gray-500">$</span>}
                        />

                        <Input
                            label="Tasa de Interés Anual (%)"
                            type="number"
                            step="0.1"
                            name="tasa"
                            defaultValue="5"
                            required
                            hint="Tasa de rendimiento anual"
                        />

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Tipo de Cuenta
                            </label>
                            <select
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-800"
                            >
                                <option value="regular">Ahorro Regular</option>
                                <option value="plazo_fijo">Plazo Fijo</option>
                                <option value="navideño">Ahorro Navideño</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <Link href="/ahorros">
                        <Button variant="outline" type="button" className="w-full sm:w-auto">
                            Cancelar
                        </Button>
                    </Link>
                    <Button type="submit" loading={loading} className="w-full sm:w-auto">
                        <Save className="h-4 w-4" />
                        Crear Cuenta
                    </Button>
                </div>
            </form>
        </div>
    );
}
