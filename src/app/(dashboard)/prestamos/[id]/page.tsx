'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
    ArrowLeft,
    Receipt,
    Calendar,
    Clock,
    ChevronDown,
    ChevronUp,
    Printer,
    Download,
} from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

// Mock loan data
const prestamoData = {
    id: '1',
    clienteId: '1',
    cliente: 'Juan Pérez García',
    monto: 15000,
    montoTotal: 18000,
    tasaInteres: 20,
    cat: '42.5%',
    plazo: 12,
    frecuencia: 'mensual',
    sistema: 'frances',
    cuotaMensual: 1500,
    fechaDesembolso: '2026-01-15',
    fechaProximoPago: '2026-02-15',
    cuotasPagadas: 0,
    saldoPendiente: 18000,
    estado: 'activo',
};

const cronograma = [
    { numero: 1, fecha: '2026-02-15', capital: 1200, interes: 250, iva: 40, total: 1490, saldo: 16500, pagado: false },
    { numero: 2, fecha: '2026-03-15', capital: 1220, interes: 230, iva: 37, total: 1487, saldo: 15020, pagado: false },
    { numero: 3, fecha: '2026-04-15', capital: 1240, interes: 210, iva: 34, total: 1484, saldo: 13500, pagado: false },
    { numero: 4, fecha: '2026-05-15', capital: 1260, interes: 190, iva: 30, total: 1480, saldo: 11940, pagado: false },
    { numero: 5, fecha: '2026-06-15', capital: 1280, interes: 170, iva: 27, total: 1477, saldo: 10340, pagado: false },
    { numero: 6, fecha: '2026-07-15', capital: 1300, interes: 150, iva: 24, total: 1474, saldo: 8700, pagado: false },
    { numero: 7, fecha: '2026-08-15', capital: 1320, interes: 130, iva: 21, total: 1471, saldo: 7020, pagado: false },
    { numero: 8, fecha: '2026-09-15', capital: 1340, interes: 110, iva: 18, total: 1468, saldo: 5300, pagado: false },
    { numero: 9, fecha: '2026-10-15', capital: 1360, interes: 90, iva: 14, total: 1464, saldo: 3540, pagado: false },
    { numero: 10, fecha: '2026-11-15', capital: 1380, interes: 70, iva: 11, total: 1461, saldo: 1740, pagado: false },
    { numero: 11, fecha: '2026-12-15', capital: 1400, interes: 50, iva: 8, total: 1458, saldo: 0, pagado: false },
    { numero: 12, fecha: '2027-01-15', capital: 1500, interes: 0, iva: 0, total: 1500, saldo: 0, pagado: false },
];

const pagosHistorial = [
    // No payments yet for this loan
];

export default function PrestamoDetallePage() {
    const [showFullSchedule, setShowFullSchedule] = React.useState(false);
    const prestamo = prestamoData;
    const displayedSchedule = showFullSchedule ? cronograma : cronograma.slice(0, 5);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/prestamos">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Préstamo #{prestamo.id.padStart(5, '0')}
                            </h1>
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                                Activo
                            </span>
                        </div>
                        <Link
                            href={`/clientes/${prestamo.clienteId}`}
                            className="text-sm text-primary-500 hover:underline"
                        >
                            {prestamo.cliente}
                        </Link>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link href={`/pagos/nuevo?prestamo=${prestamo.id}`}>
                        <Button>
                            <Receipt className="h-4 w-4" />
                            Registrar Pago
                        </Button>
                    </Link>
                    <Button variant="outline" onClick={() => window.print()}>
                        <Printer className="h-4 w-4" />
                        Imprimir
                    </Button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="py-4">
                        <p className="text-sm text-gray-500">Monto Prestado</p>
                        <p className="text-2xl font-bold font-mono text-gray-900 dark:text-white">
                            {formatCurrency(prestamo.monto)}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="py-4">
                        <p className="text-sm text-gray-500">Saldo Pendiente</p>
                        <p className="text-2xl font-bold font-mono text-primary-600">
                            {formatCurrency(prestamo.saldoPendiente)}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="py-4">
                        <p className="text-sm text-gray-500">Cuota Mensual</p>
                        <p className="text-2xl font-bold font-mono text-gray-900 dark:text-white">
                            {formatCurrency(prestamo.cuotaMensual)}
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-amber-50 dark:bg-amber-900/20">
                    <CardContent className="py-4">
                        <p className="text-sm text-amber-600 dark:text-amber-400">Próximo Pago</p>
                        <p className="text-xl font-bold text-amber-700 dark:text-amber-300">
                            {formatDate(prestamo.fechaProximoPago, { short: true })}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Loan Details */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-base">Detalles del Préstamo</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Tasa de Interés</p>
                                <p className="font-semibold">{prestamo.tasaInteres}% mensual</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">CAT</p>
                                <p className="font-semibold">{prestamo.cat}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Plazo</p>
                                <p className="font-semibold">{prestamo.plazo} meses</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Frecuencia</p>
                                <p className="font-semibold capitalize">{prestamo.frecuencia}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Sistema</p>
                                <p className="font-semibold capitalize">{prestamo.sistema === 'frances' ? 'Francés' : prestamo.sistema}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Desembolso</p>
                                <p className="font-semibold">{formatDate(prestamo.fechaDesembolso, { short: true })}</p>
                            </div>
                        </div>

                        <div className="pt-4 border-t dark:border-gray-700">
                            <div className="flex justify-between mb-2">
                                <span className="text-sm text-gray-500">Progreso de Pago</span>
                                <span className="text-sm font-medium">{prestamo.cuotasPagadas}/{prestamo.plazo}</span>
                            </div>
                            <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                <div
                                    className="h-full bg-primary-500 rounded-full transition-all"
                                    style={{ width: `${(prestamo.cuotasPagadas / prestamo.plazo) * 100}%` }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Amortization Schedule */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-primary-500" />
                            Cronograma de Pagos
                        </CardTitle>
                        <Button variant="ghost" size="sm" onClick={() => {
                            const csvContent = "Cuota,Fecha,Capital,Interes,IVA,Total,Saldo\n" +
                                cronograma.map(c => `${c.numero},${c.fecha},${c.capital},${c.interes},${c.iva},${c.total},${c.saldo}`).join("\n");
                            const blob = new Blob([csvContent], { type: 'text/csv' });
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `cronograma_prestamo_${prestamoData.id}.csv`;
                            a.click();
                        }}>
                            <Download className="h-4 w-4" />
                            Exportar
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b dark:border-gray-700">
                                        <th className="py-2 text-left font-medium text-gray-500">#</th>
                                        <th className="py-2 text-left font-medium text-gray-500">Fecha</th>
                                        <th className="py-2 text-right font-medium text-gray-500">Capital</th>
                                        <th className="py-2 text-right font-medium text-gray-500">Interés</th>
                                        <th className="py-2 text-right font-medium text-gray-500">IVA</th>
                                        <th className="py-2 text-right font-medium text-gray-500">Total</th>
                                        <th className="py-2 text-right font-medium text-gray-500">Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayedSchedule.map((cuota) => (
                                        <tr key={cuota.numero} className="border-b dark:border-gray-800">
                                            <td className="py-3 font-mono">{cuota.numero}</td>
                                            <td className="py-3">{formatDate(cuota.fecha, { short: true })}</td>
                                            <td className="py-3 text-right font-mono">{formatCurrency(cuota.capital)}</td>
                                            <td className="py-3 text-right font-mono">{formatCurrency(cuota.interes)}</td>
                                            <td className="py-3 text-right font-mono text-gray-500">{formatCurrency(cuota.iva)}</td>
                                            <td className="py-3 text-right font-mono font-semibold">{formatCurrency(cuota.total)}</td>
                                            <td className="py-3 text-right">
                                                <span className={cn(
                                                    'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                                                    cuota.pagado
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                                        : 'bg-gray-100 text-gray-500 dark:bg-gray-800'
                                                )}>
                                                    {cuota.pagado ? 'Pagado' : 'Pendiente'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {cronograma.length > 5 && (
                            <button
                                onClick={() => setShowFullSchedule(!showFullSchedule)}
                                className="mt-4 w-full flex items-center justify-center gap-2 py-2 text-sm text-primary-500 hover:text-primary-600"
                            >
                                {showFullSchedule ? (
                                    <>
                                        <ChevronUp className="h-4 w-4" />
                                        Mostrar menos
                                    </>
                                ) : (
                                    <>
                                        <ChevronDown className="h-4 w-4" />
                                        Ver cronograma completo ({cronograma.length - 5} más)
                                    </>
                                )}
                            </button>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Payment History */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Receipt className="h-5 w-5 text-primary-500" />
                        Historial de Pagos
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {pagosHistorial.length === 0 ? (
                        <div className="text-center py-8">
                            <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">Aún no hay pagos registrados para este préstamo</p>
                            <Link href={`/pagos/nuevo?prestamo=${prestamo.id}`}>
                                <Button className="mt-4" size="sm">
                                    <Receipt className="h-4 w-4" />
                                    Registrar Primer Pago
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div>
                            {/* Payment history would go here */}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
