'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save, Package, Camera } from 'lucide-react';
import Link from 'next/link';

// Mock clients for dropdown
const clientesMock = [
    { id: '1', nombre: 'Juan Pérez García' },
    { id: '2', nombre: 'María García López' },
    { id: '3', nombre: 'Carlos López Martínez' },
];

export default function NuevoEmpenoPage() {
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        router.push('/empenos');
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="flex items-center gap-4">
                <Link href="/empenos">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Nuevo Empeño
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Registra un nuevo artículo en garantía
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Client Selection */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-lg">Cliente</CardTitle>
                    </CardHeader>
                    <CardContent>
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
                    </CardContent>
                </Card>

                {/* Item Details */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Package className="h-5 w-5 text-primary-500" />
                            Datos del Artículo
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Input
                            label="Descripción del Artículo"
                            name="descripcion"
                            placeholder="Ej: Anillo de oro 14k con diamante 0.5ct"
                            required
                        />

                        <div className="grid gap-6 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Categoría <span className="text-red-500">*</span>
                                </label>
                                <select
                                    required
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-800"
                                >
                                    <option value="">Seleccionar...</option>
                                    <option value="joyeria">Joyería</option>
                                    <option value="electronica">Electrónica</option>
                                    <option value="herramientas">Herramientas</option>
                                    <option value="vehiculos">Vehículos</option>
                                    <option value="electrodomesticos">Electrodomésticos</option>
                                    <option value="otro">Otro</option>
                                </select>
                            </div>
                            <Input
                                label="Marca/Modelo"
                                name="marca"
                                placeholder="Ej: Rolex Submariner"
                            />
                        </div>

                        <Input
                            label="Número de Serie / Características"
                            name="serie"
                            placeholder="Número de serie o características identificables"
                        />

                        {/* Photo upload placeholder */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Fotografías del Artículo
                            </label>
                            <div className="grid gap-4 sm:grid-cols-3">
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className="flex aspect-square items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800 cursor-pointer hover:border-primary-500"
                                    >
                                        <div className="text-center">
                                            <Camera className="mx-auto h-8 w-8 text-gray-400" />
                                            <p className="mt-1 text-xs text-gray-500">Foto {i}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Valuation */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-lg">Avalúo y Préstamo</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6 sm:grid-cols-2">
                        <Input
                            label="Valor del Avalúo"
                            type="number"
                            name="avaluo"
                            placeholder="15000"
                            required
                            leftIcon={<span className="text-gray-500">$</span>}
                            hint="Valor estimado del artículo"
                        />
                        <Input
                            label="Monto a Prestar"
                            type="number"
                            name="prestamo"
                            placeholder="10000"
                            required
                            leftIcon={<span className="text-gray-500">$</span>}
                            hint="Generalmente 60-70% del avalúo"
                        />
                        <Input
                            label="Tasa de Interés Mensual (%)"
                            type="number"
                            step="0.1"
                            name="tasa"
                            defaultValue="10"
                            required
                        />
                        <Input
                            label="Plazo (meses)"
                            type="number"
                            name="plazo"
                            defaultValue="3"
                            required
                        />
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <Link href="/empenos">
                        <Button variant="outline" type="button" className="w-full sm:w-auto">
                            Cancelar
                        </Button>
                    </Link>
                    <Button type="submit" loading={loading} className="w-full sm:w-auto">
                        <Save className="h-4 w-4" />
                        Registrar Empeño
                    </Button>
                </div>
            </form>
        </div>
    );
}
