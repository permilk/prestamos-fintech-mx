'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import {
    calcularCAT,
    generarTablaAmortizacion,
    type FrecuenciaPago,
    type SistemaAmortizacion,
} from '@/lib/finance';
import { Calculator, FileText, Download, Info, ChevronDown, ChevronUp, Printer, Check } from 'lucide-react';
import Link from 'next/link';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export function LoanSimulator() {
    const [monto, setMonto] = React.useState(10000);
    const [tasaInteres, setTasaInteres] = React.useState(20);
    const [plazo, setPlazo] = React.useState(12);
    const [frecuencia, setFrecuencia] = React.useState<FrecuenciaPago>('mensual');
    const [sistema, setSistema] = React.useState<SistemaAmortizacion>('frances');
    const [showFullSchedule, setShowFullSchedule] = React.useState(false);
    const [successMessage, setSuccessMessage] = React.useState('');

    const showSuccess = (msg: string) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    // Calculate results
    const result = React.useMemo(() => {
        if (!monto || !tasaInteres || !plazo) return null;

        try {
            const tablaResult = generarTablaAmortizacion({
                capital: monto,
                tasaMensual: tasaInteres,
                plazo,
                frecuencia,
                sistema,
                fechaInicio: new Date(),
            });

            const catResult = calcularCAT({
                montoPrestado: monto,
                tasaInteresMensual: tasaInteres,
                plazoMeses: plazo,
            });

            return {
                cuotaMensual: tablaResult.resumen.cuotaPromedio,
                totalAPagar: tablaResult.resumen.totalAPagar,
                totalIntereses: tablaResult.resumen.totalIntereses,
                totalIVA: tablaResult.resumen.totalIVA,
                cat: catResult.catFormateado,
                cronograma: tablaResult.cronograma,
            };
        } catch (error) {
            console.error('Error calculating simulation:', error);
            return null;
        }
    }, [monto, tasaInteres, plazo, frecuencia, sistema]);

    const frequencyLabels: Record<FrecuenciaPago, string> = {
        semanal: 'Semanal',
        quincenal: 'Quincenal',
        mensual: 'Mensual',
    };

    const systemLabels: Record<SistemaAmortizacion, string> = {
        frances: 'Cuota Fija (Francés)',
        aleman: 'Amortización Constante (Alemán)',
        simple: 'Interés Simple (Flat)',
    };

    // Generate professional PDF
    const generatePDF = () => {
        if (!result) return;

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // Header with blue bar
        doc.setFillColor(30, 64, 175);
        doc.rect(0, 0, pageWidth, 45, 'F');

        // Company name
        doc.setFontSize(22);
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text('Préstamos Fintech MX', 14, 20);

        // Report title
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('COTIZACIÓN DE PRÉSTAMO', 14, 30);

        // Date
        doc.setFontSize(10);
        doc.text(`Fecha: ${new Date().toLocaleDateString('es-MX', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })}`, pageWidth - 14, 20, { align: 'right' });

        // Folio
        doc.text(`Folio: COT-${Date.now().toString().slice(-6)}`, pageWidth - 14, 30, { align: 'right' });

        // Summary boxes
        let y = 55;

        // Loan parameters box
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(14, y, pageWidth - 28, 45, 3, 3, 'F');
        doc.setDrawColor(226, 232, 240);
        doc.roundedRect(14, y, pageWidth - 28, 45, 3, 3, 'S');

        doc.setFontSize(11);
        doc.setTextColor(30, 64, 175);
        doc.setFont('helvetica', 'bold');
        doc.text('PARÁMETROS DEL PRÉSTAMO', 20, y + 10);

        doc.setFontSize(10);
        doc.setTextColor(71, 85, 105);
        doc.setFont('helvetica', 'normal');

        const col1 = 20;
        const col2 = 80;
        const col3 = 140;

        doc.text('Monto Solicitado:', col1, y + 22);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(`$${monto.toLocaleString()}`, col1, y + 30);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        doc.text('Tasa de Interés:', col2, y + 22);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(`${tasaInteres}% mensual`, col2, y + 30);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        doc.text('Plazo:', col3, y + 22);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(`${plazo} ${frequencyLabels[frecuencia].toLowerCase()}es`, col3, y + 30);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        doc.text(`Sistema: ${systemLabels[sistema]}`, col1, y + 40);

        y += 55;

        // Results summary - Blue highlight box
        doc.setFillColor(30, 64, 175);
        doc.roundedRect(14, y, pageWidth - 28, 40, 3, 3, 'F');

        doc.setFontSize(10);
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'normal');

        const boxWidth = (pageWidth - 28) / 4;

        // Payment per period
        doc.text('Cuota por Período', 14 + boxWidth * 0 + 5, y + 12);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(`$${result.cuotaMensual.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 14 + boxWidth * 0 + 5, y + 26);

        // Total to pay
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Total a Pagar', 14 + boxWidth * 1 + 5, y + 12);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(`$${result.totalAPagar.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 14 + boxWidth * 1 + 5, y + 26);

        // Total interest
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('Total Intereses', 14 + boxWidth * 2 + 5, y + 12);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(`$${result.totalIntereses.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, 14 + boxWidth * 2 + 5, y + 26);

        // CAT
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('CAT', 14 + boxWidth * 3 + 5, y + 12);
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(result.cat || 'N/A', 14 + boxWidth * 3 + 5, y + 26);

        y += 50;

        // Amortization table title
        doc.setFontSize(12);
        doc.setTextColor(30, 64, 175);
        doc.setFont('helvetica', 'bold');
        doc.text('CRONOGRAMA DE PAGOS', 14, y);

        y += 5;

        // Amortization table
        autoTable(doc, {
            startY: y,
            head: [['#', 'Fecha', 'Cuota', 'Capital', 'Interés', 'IVA', 'Saldo']],
            body: result.cronograma.map(row => [
                row.numeroCuota.toString(),
                new Date(row.fechaVencimiento).toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: '2-digit' }),
                `$${row.cuotaTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                `$${row.abonoCapital.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                `$${row.intereses.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                `$${row.ivaIntereses.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                `$${row.saldoFinal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
            ]),
            theme: 'grid',
            headStyles: {
                fillColor: [30, 64, 175],
                fontSize: 9,
                fontStyle: 'bold',
                halign: 'center'
            },
            bodyStyles: { fontSize: 8 },
            columnStyles: {
                0: { halign: 'center', cellWidth: 12 },
                1: { halign: 'center', cellWidth: 22 },
                2: { halign: 'right', fontStyle: 'bold' },
                3: { halign: 'right' },
                4: { halign: 'right' },
                5: { halign: 'right' },
                6: { halign: 'right' },
            },
            alternateRowStyles: { fillColor: [248, 250, 252] },
            margin: { left: 14, right: 14 },
            foot: [[
                '', 'TOTALES:',
                `$${result.totalAPagar.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                `$${monto.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                `$${result.totalIntereses.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                `$${(result.totalIVA || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                '$0.00'
            ]],
            footStyles: { fillColor: [30, 64, 175], textColor: [255, 255, 255], fontStyle: 'bold' },
        });

        // Footer with disclaimer
        const pageHeight = doc.internal.pageSize.getHeight();
        let finalY = (doc as any).lastAutoTable.finalY + 10;

        // Check if there's enough space for disclaimer + footer (need ~50px)
        if (finalY + 50 > pageHeight - 25) {
            doc.addPage();
            finalY = 20;
        }

        // Disclaimer box
        doc.setFillColor(254, 243, 199);
        doc.roundedRect(14, finalY, pageWidth - 28, 30, 3, 3, 'F');
        doc.setDrawColor(251, 191, 36);
        doc.roundedRect(14, finalY, pageWidth - 28, 30, 3, 3, 'S');

        doc.setFontSize(9);
        doc.setTextColor(146, 64, 14);
        doc.setFont('helvetica', 'bold');
        doc.text('AVISO IMPORTANTE:', 20, finalY + 10);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text('Esta cotización es informativa y no representa una aprobación de crédito.', 20, finalY + 18);
        doc.text('La tasa y condiciones finales pueden variar según el análisis crediticio. El CAT es calculado conforme a Banxico.', 20, finalY + 25);

        // Page footer - always at bottom
        doc.setDrawColor(226, 232, 240);
        doc.line(14, pageHeight - 18, pageWidth - 14, pageHeight - 18);

        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.text('Préstamos Fintech MX © 2026 - Documento informativo', 14, pageHeight - 10);
        doc.text('www.prestamosfintech.mx | Tel: (55) 1234-5678', pageWidth - 14, pageHeight - 10, { align: 'right' });

        doc.save(`cotizacion_prestamo_${Date.now()}.pdf`);
        showSuccess('PDF generado exitosamente');
    };

    // Print function - opens PDF in new tab for printing
    const handlePrint = () => {
        if (!result) return;

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // Header with blue bar
        doc.setFillColor(30, 64, 175);
        doc.rect(0, 0, pageWidth, 45, 'F');

        // Company name
        doc.setFontSize(22);
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text('Prestamos Fintech MX', 14, 20);

        // Report title
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('COTIZACION DE PRESTAMO', 14, 30);

        // Date
        doc.setFontSize(10);
        doc.text(`Fecha: ${new Date().toLocaleDateString('es-MX')}`, pageWidth - 14, 20, { align: 'right' });

        // Summary
        let y = 55;
        doc.setTextColor(30, 64, 175);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('RESUMEN DE COTIZACION', 14, y);

        y += 15;
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');

        const summaryData = [
            ['Monto Solicitado:', `$${monto.toLocaleString()}`],
            ['Tasa de Interes:', `${tasaInteres}% mensual`],
            ['Plazo:', `${plazo} cuotas (${frequencyLabels[frecuencia]})`],
            ['Cuota por Periodo:', `$${result.cuotaMensual.toLocaleString(undefined, { minimumFractionDigits: 2 })}`],
            ['Total a Pagar:', `$${result.totalAPagar.toLocaleString(undefined, { minimumFractionDigits: 2 })}`],
            ['Total Intereses:', `$${result.totalIntereses.toLocaleString(undefined, { minimumFractionDigits: 2 })}`],
            ['CAT:', result.cat || 'N/A'],
        ];

        summaryData.forEach(([label, value]) => {
            doc.setFont('helvetica', 'normal');
            doc.text(label, 20, y);
            doc.setFont('helvetica', 'bold');
            doc.text(value, 80, y);
            y += 8;
        });

        // Open in new tab for printing
        const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
        showSuccess('PDF abierto para imprimir');
    };

    // Export CSV
    const exportCSV = () => {
        if (!result) return;

        const headers = ['#', 'Fecha', 'Cuota', 'Capital', 'Interés', 'IVA', 'Saldo'];
        const rows = result.cronograma.map(row => [
            row.numeroCuota,
            new Date(row.fechaVencimiento).toLocaleDateString('es-MX'),
            row.cuotaTotal.toFixed(2),
            row.abonoCapital.toFixed(2),
            row.intereses.toFixed(2),
            row.ivaIntereses.toFixed(2),
            row.saldoFinal.toFixed(2),
        ]);

        const csvContent = '\uFEFF' + [
            `Cotización de Préstamo - Préstamos Fintech MX`,
            `Fecha: ${new Date().toLocaleDateString('es-MX')}`,
            `Monto: $${monto.toLocaleString()}`,
            `Tasa: ${tasaInteres}% mensual`,
            `Plazo: ${plazo} cuotas`,
            '',
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cronograma_prestamo_${Date.now()}.csv`;
        a.click();

        showSuccess('Archivo CSV exportado');
    };

    return (
        <div className="grid gap-6 lg:grid-cols-2">
            {/* Success Toast */}
            {successMessage && (
                <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-xl bg-green-500 px-4 py-3 text-white shadow-lg animate-fade-in">
                    <Check className="h-5 w-5" />
                    {successMessage}
                </div>
            )}

            {/* Form */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calculator className="h-5 w-5 text-primary-500" />
                        Configurar Préstamo
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Monto */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Monto a Prestar
                        </label>
                        <Input
                            type="number"
                            value={monto}
                            onChange={(e) => setMonto(Number(e.target.value))}
                            leftIcon={<span className="text-gray-500">$</span>}
                        />
                        <div className="mt-2 flex gap-2 flex-wrap">
                            {[5000, 10000, 25000, 50000, 100000].map((amount) => (
                                <button
                                    key={amount}
                                    type="button"
                                    onClick={() => setMonto(amount)}
                                    className={cn(
                                        'rounded-lg px-3 py-1.5 text-xs font-medium transition-all',
                                        monto === amount
                                            ? 'bg-primary-500 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
                                    )}
                                >
                                    {formatCurrency(amount, { decimals: 0 })}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tasa y Plazo */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Tasa de Interés Mensual
                            </label>
                            <Input
                                type="number"
                                step="0.5"
                                value={tasaInteres}
                                onChange={(e) => setTasaInteres(Number(e.target.value))}
                                rightIcon={<span className="text-gray-500">%</span>}
                            />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Número de Cuotas
                            </label>
                            <Input
                                type="number"
                                value={plazo}
                                onChange={(e) => setPlazo(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    {/* Frecuencia */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Frecuencia de Pago
                        </label>
                        <div className="flex gap-2">
                            {(['semanal', 'quincenal', 'mensual'] as const).map((freq) => (
                                <button
                                    key={freq}
                                    type="button"
                                    onClick={() => setFrecuencia(freq)}
                                    className={cn(
                                        'flex-1 rounded-xl border-2 py-3 text-center text-sm font-medium transition-all',
                                        frecuencia === freq
                                            ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                                            : 'border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400'
                                    )}
                                >
                                    {frequencyLabels[freq]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sistema de Amortización */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Sistema de Amortización
                        </label>
                        <select
                            value={sistema}
                            onChange={(e) => setSistema(e.target.value as SistemaAmortizacion)}
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                        >
                            {(['frances', 'aleman', 'simple'] as const).map((sys) => (
                                <option key={sys} value={sys}>
                                    {systemLabels[sys]}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <Link href="/prestamos/nuevo" className="flex-1">
                            <Button className="w-full">
                                Crear Préstamo
                            </Button>
                        </Link>
                        <Button variant="outline" onClick={handlePrint} title="Imprimir">
                            <Printer className="h-4 w-4" />
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Results */}
            <div className="space-y-6">
                {/* Summary Card */}
                <Card className="overflow-hidden" padding="none">
                    <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-6 text-white">
                        <h3 className="mb-6 text-lg font-semibold">Resumen del Préstamo</h3>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <p className="text-sm text-white/70">Cuota por período</p>
                                <p className="text-3xl font-bold font-mono">
                                    {result ? formatCurrency(result.cuotaMensual) : '$0.00'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-white/70">Total a Pagar</p>
                                <p className="text-3xl font-bold font-mono">
                                    {result ? formatCurrency(result.totalAPagar) : '$0.00'}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-3">
                            <div className="rounded-xl bg-white/10 p-3">
                                <p className="text-xs text-white/70">Intereses</p>
                                <p className="text-lg font-semibold font-mono">
                                    {result ? formatCurrency(result.totalIntereses) : '$0.00'}
                                </p>
                            </div>
                            <div className="rounded-xl bg-white/10 p-3">
                                <p className="text-xs text-white/70">IVA Intereses</p>
                                <p className="text-lg font-semibold font-mono">
                                    {result ? formatCurrency(result.totalIVA) : '$0.00'}
                                </p>
                            </div>
                            <div className="rounded-xl bg-white/10 p-3">
                                <p className="text-xs text-white/70">CAT</p>
                                <p className="text-lg font-semibold">
                                    {result?.cat || '0.0% Sin IVA'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 p-4 dark:bg-blue-900/20">
                        <div className="flex items-start gap-2">
                            <Info className="h-5 w-5 shrink-0 text-blue-500" />
                            <p className="text-xs text-blue-700 dark:text-blue-300">
                                El CAT (Costo Anual Total) es calculado conforme a la metodología de Banxico.
                                El IVA se aplica sobre los intereses al 16%.
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Amortization Table Preview */}
                {result && result.cronograma && result.cronograma.length > 0 && (
                    <Card>
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <FileText className="h-5 w-5 text-primary-500" />
                                    Cronograma de Pagos
                                </CardTitle>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={exportCSV}>
                                        <Download className="h-4 w-4" />
                                        CSV
                                    </Button>
                                    <Button size="sm" onClick={generatePDF}>
                                        <Download className="h-4 w-4" />
                                        PDF
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-gray-200 dark:border-gray-700">
                                            <th className="py-3 text-left font-semibold text-gray-500">#</th>
                                            <th className="py-3 text-left font-semibold text-gray-500">Fecha</th>
                                            <th className="py-3 text-right font-semibold text-gray-500">Cuota</th>
                                            <th className="py-3 text-right font-semibold text-gray-500">Capital</th>
                                            <th className="py-3 text-right font-semibold text-gray-500">Interés</th>
                                            <th className="py-3 text-right font-semibold text-gray-500">Saldo</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(showFullSchedule ? result.cronograma : result.cronograma.slice(0, 5)).map((row) => (
                                            <tr
                                                key={row.numeroCuota}
                                                className="border-b border-gray-100 dark:border-gray-800"
                                            >
                                                <td className="py-3 font-medium">{row.numeroCuota}</td>
                                                <td className="py-3 text-gray-600 dark:text-gray-400">
                                                    {formatDate(row.fechaVencimiento, { short: true })}
                                                </td>
                                                <td className="py-3 text-right font-mono font-medium text-primary-600 dark:text-primary-400">
                                                    {formatCurrency(row.cuotaTotal)}
                                                </td>
                                                <td className="py-3 text-right font-mono text-gray-600 dark:text-gray-400">
                                                    {formatCurrency(row.abonoCapital)}
                                                </td>
                                                <td className="py-3 text-right font-mono text-gray-600 dark:text-gray-400">
                                                    {formatCurrency(row.intereses)}
                                                </td>
                                                <td className="py-3 text-right font-mono">
                                                    {formatCurrency(row.saldoFinal)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {result.cronograma.length > 5 && (
                                <button
                                    onClick={() => setShowFullSchedule(!showFullSchedule)}
                                    className="mt-4 flex w-full items-center justify-center gap-1 rounded-xl bg-gray-100 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
                                >
                                    {showFullSchedule ? (
                                        <>
                                            <ChevronUp className="h-4 w-4" />
                                            Mostrar menos
                                        </>
                                    ) : (
                                        <>
                                            <ChevronDown className="h-4 w-4" />
                                            Ver todas las {result.cronograma.length} cuotas
                                        </>
                                    )}
                                </button>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
