'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Clock,
    Calendar,
    User,
    HandCoins,
    Printer,
    RefreshCw,
    CalendarPlus,
    Check,
    X,
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

// Mock pawn data
const empenoData = {
    id: '1',
    cliente: 'Juan Pérez García',
    clienteId: '1',
    articulo: 'Anillo de oro 14k con diamante',
    descripcion: 'Anillo de compromiso de oro amarillo 14 kilates con diamante central de 0.5 quilates, corte brillante. Incluye certificado GIA.',
    categoria: 'Joyería',
    marca: 'Tiffany & Co.',
    serie: 'TIF-2024-78542',
    imagenes: [
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=600&h=400&fit=crop',
    ],
    valorAvaluo: 15000,
    montoPrestado: 10000,
    tasaInteres: 10,
    fechaEmpeno: '2026-01-10',
    fechaVencimiento: '2026-04-10',
    estado: 'activo',
    diasRestantes: 83,
    interesesGenerados: 1000,
    montoLiquidar: 11000,
};

// Simple Modal Component
function Modal({
    isOpen,
    onClose,
    title,
    children
}: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />
            <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

export default function EmpenoDetallePage() {
    const router = useRouter();
    const empeno = empenoData;
    const [imagenActiva, setImagenActiva] = React.useState(0);
    const [showRenovarModal, setShowRenovarModal] = React.useState(false);
    const [showExtenderModal, setShowExtenderModal] = React.useState(false);
    const [successMessage, setSuccessMessage] = React.useState('');

    const handlePrint = () => {
        window.print();
    };

    const handleRenovar = () => {
        setShowRenovarModal(false);
        setSuccessMessage('¡Empeño renovado exitosamente! El nuevo vencimiento es el 10/07/2026');
        setTimeout(() => setSuccessMessage(''), 5000);
    };

    const handleExtender = () => {
        setShowExtenderModal(false);
        setSuccessMessage('¡Plazo extendido exitosamente! 30 días adicionales agregados');
        setTimeout(() => setSuccessMessage(''), 5000);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Success Message */}
            {successMessage && (
                <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-xl bg-green-500 px-4 py-3 text-white shadow-lg animate-fade-in">
                    <Check className="h-5 w-5" />
                    {successMessage}
                </div>
            )}

            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/empenos">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Empeño #{empeno.id.padStart(4, '0')}
                            </h1>
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                                Activo
                            </span>
                        </div>
                        <p className="text-sm text-gray-500">{empeno.articulo}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link href={`/pagos/nuevo?empeno=${empeno.id}`}>
                        <Button>
                            <HandCoins className="h-4 w-4" />
                            Rescatar Artículo
                        </Button>
                    </Link>
                    <Button variant="outline" onClick={handlePrint}>
                        <Printer className="h-4 w-4" />
                        Imprimir
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Images Gallery */}
                <Card className="overflow-hidden">
                    <div className="aspect-video bg-gray-100 dark:bg-gray-800">
                        <img
                            src={empeno.imagenes[imagenActiva]}
                            alt={empeno.articulo}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <CardContent className="py-4">
                        <div className="flex gap-2">
                            {empeno.imagenes.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setImagenActiva(idx)}
                                    className={cn(
                                        'w-20 h-14 rounded-lg overflow-hidden border-2 transition-all',
                                        imagenActiva === idx
                                            ? 'border-primary-500'
                                            : 'border-transparent opacity-60 hover:opacity-100'
                                    )}
                                >
                                    <img src={img} alt={`Vista ${idx + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Details */}
                <div className="space-y-6">
                    {/* Article Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Información del Artículo</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500">Categoría</p>
                                    <p className="font-medium">{empeno.categoria}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Marca/Modelo</p>
                                    <p className="font-medium">{empeno.marca}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-xs text-gray-500">Número de Serie</p>
                                    <p className="font-mono text-sm">{empeno.serie}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Descripción</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {empeno.descripcion}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Client Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <User className="h-4 w-4 text-primary-500" />
                                Cliente
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Link
                                href={`/clientes/${empeno.clienteId}`}
                                className="flex items-center gap-3 rounded-lg bg-gray-50 p-4 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600 font-bold text-lg dark:bg-primary-900 dark:text-primary-300">
                                    JP
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {empeno.cliente}
                                    </p>
                                    <p className="text-sm text-primary-500">Ver perfil completo →</p>
                                </div>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Financial Summary */}
            <Card className="overflow-hidden" padding="none">
                <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-6 text-white">
                    <h3 className="text-lg font-semibold mb-6">Resumen Financiero</h3>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-xl bg-white/10 p-4">
                            <p className="text-sm text-white/70">Valor Avalúo</p>
                            <p className="text-2xl font-bold font-mono">
                                {formatCurrency(empeno.valorAvaluo)}
                            </p>
                        </div>
                        <div className="rounded-xl bg-white/10 p-4">
                            <p className="text-sm text-white/70">Monto Prestado</p>
                            <p className="text-2xl font-bold font-mono">
                                {formatCurrency(empeno.montoPrestado)}
                            </p>
                        </div>
                        <div className="rounded-xl bg-white/10 p-4">
                            <p className="text-sm text-white/70">Intereses ({empeno.tasaInteres}% mensual)</p>
                            <p className="text-2xl font-bold font-mono">
                                {formatCurrency(empeno.interesesGenerados)}
                            </p>
                        </div>
                        <div className="rounded-xl bg-white/20 p-4">
                            <p className="text-sm text-white/70">Total a Liquidar</p>
                            <p className="text-2xl font-bold font-mono">
                                {formatCurrency(empeno.montoLiquidar)}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                                <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Fecha de Empeño</p>
                                <p className="font-medium">{formatDate(empeno.fechaEmpeno)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-900">
                                <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Fecha de Vencimiento</p>
                                <p className="font-medium">{formatDate(empeno.fechaVencimiento)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                                <Clock className="h-5 w-5 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Días Restantes</p>
                                <p className="font-medium text-green-600">{empeno.diasRestantes} días</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Actions */}
            <Card>
                <CardContent className="py-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                        <Link href={`/pagos/nuevo?empeno=${empeno.id}`}>
                            <Button size="lg" className="w-full sm:w-auto">
                                <HandCoins className="h-5 w-5" />
                                Rescatar Artículo - {formatCurrency(empeno.montoLiquidar)}
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => setShowRenovarModal(true)}
                        >
                            <RefreshCw className="h-4 w-4" />
                            Renovar Empeño
                        </Button>
                        <Button
                            variant="secondary"
                            size="lg"
                            onClick={() => setShowExtenderModal(true)}
                        >
                            <CalendarPlus className="h-4 w-4" />
                            Extender Plazo
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Renovar Modal */}
            <Modal
                isOpen={showRenovarModal}
                onClose={() => setShowRenovarModal(false)}
                title="Renovar Empeño"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Al renovar el empeño, se pagará el interés acumulado de {formatCurrency(empeno.interesesGenerados)} y se reiniciará el plazo por 3 meses más.
                    </p>
                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-500">Intereses a pagar:</span>
                            <span className="font-semibold">{formatCurrency(empeno.interesesGenerados)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Nuevo vencimiento:</span>
                            <span className="font-semibold">10/07/2026</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="flex-1" onClick={() => setShowRenovarModal(false)}>
                            Cancelar
                        </Button>
                        <Button className="flex-1" onClick={handleRenovar}>
                            Confirmar Renovación
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Extender Modal */}
            <Modal
                isOpen={showExtenderModal}
                onClose={() => setShowExtenderModal(false)}
                title="Extender Plazo"
            >
                <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Extender el plazo agrega 30 días adicionales al vencimiento actual. Se aplicarán los intereses correspondientes.
                    </p>
                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-500">Costo extensión:</span>
                            <span className="font-semibold">{formatCurrency(empeno.montoPrestado * 0.1)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Nuevo vencimiento:</span>
                            <span className="font-semibold">10/05/2026</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" className="flex-1" onClick={() => setShowExtenderModal(false)}>
                            Cancelar
                        </Button>
                        <Button className="flex-1" onClick={handleExtender}>
                            Confirmar Extensión
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
