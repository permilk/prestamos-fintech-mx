'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileBarChart, Download, Calendar, TrendingUp, DollarSign, Users, Wallet, Check, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Mock data for reports
const mockCarteraData = [
    { cliente: 'Juan Pérez García', prestamo: 'PRE-00001', monto: 15000, saldo: 12000, estado: 'Activo', cuotas: '3/12', tasa: '20%' },
    { cliente: 'María García López', prestamo: 'PRE-00002', monto: 25000, saldo: 20000, estado: 'Activo', cuotas: '2/12', tasa: '18%' },
    { cliente: 'Carlos López Martínez', prestamo: 'PRE-00003', monto: 30000, saldo: 28000, estado: 'Vencido', cuotas: '1/12', tasa: '22%' },
    { cliente: 'Ana Rodríguez', prestamo: 'PRE-00004', monto: 10000, saldo: 5000, estado: 'Activo', cuotas: '6/12', tasa: '20%' },
    { cliente: 'Roberto Hernández', prestamo: 'PRE-00005', monto: 18000, saldo: 0, estado: 'Liquidado', cuotas: '12/12', tasa: '18%' },
    { cliente: 'Patricia Sánchez', prestamo: 'PRE-00006', monto: 35000, saldo: 30000, estado: 'Activo', cuotas: '2/18', tasa: '15%' },
    { cliente: 'Fernando Ruiz', prestamo: 'PRE-00007', monto: 8000, saldo: 6000, estado: 'Activo', cuotas: '3/9', tasa: '24%' },
];

const mockCobranzaData = [
    { fecha: '2026-01-15', cliente: 'Juan Pérez', concepto: 'Cuota 3', monto: 1500, metodo: 'Efectivo', recibo: 'REC-001' },
    { fecha: '2026-01-15', cliente: 'Patricia Sánchez', concepto: 'Cuota 2', monto: 3200, metodo: 'SPEI', recibo: 'REC-002' },
    { fecha: '2026-01-16', cliente: 'María García', concepto: 'Cuota 2', monto: 2500, metodo: 'SPEI', recibo: 'REC-003' },
    { fecha: '2026-01-16', cliente: 'Ana Rodríguez', concepto: 'Cuota 6', monto: 1200, metodo: 'Efectivo', recibo: 'REC-004' },
    { fecha: '2026-01-16', cliente: 'Fernando Ruiz', concepto: 'Cuota 3', monto: 950, metodo: 'OXXO', recibo: 'REC-005' },
    { fecha: '2026-01-17', cliente: 'Roberto Hernández', concepto: 'Liquidación', monto: 5000, metodo: 'SPEI', recibo: 'REC-006' },
];

const mockVencidosData = [
    { cliente: 'Carlos López', prestamo: 'PRE-00003', diasMora: 7, cuotaVencida: 2500, saldoTotal: 28000, telefono: '5553456789' },
    { cliente: 'Pedro Sánchez', prestamo: 'PRE-00008', diasMora: 12, cuotaVencida: 1200, saldoTotal: 14400, telefono: '5551234567' },
    { cliente: 'Laura Martínez', prestamo: 'PRE-00009', diasMora: 5, cuotaVencida: 800, saldoTotal: 9600, telefono: '5559876543' },
];

const mockClientesData = [
    { nombre: 'Juan Pérez García', curp: 'PEGJ850101HDFRRL09', telefono: '5551234567', email: 'juan@email.com', prestamos: 1, saldo: 12000, estado: 'Activo' },
    { nombre: 'María García López', curp: 'GALM900215MDFRRC08', telefono: '5552345678', email: 'maria@email.com', prestamos: 1, saldo: 20000, estado: 'Activo' },
    { nombre: 'Carlos López Martínez', curp: 'LOMC780530HDFRRR07', telefono: '5553456789', email: 'carlos@email.com', prestamos: 1, saldo: 28000, estado: 'Moroso' },
    { nombre: 'Ana Rodríguez', curp: 'ROAA920410MDFDRN06', telefono: '5554567890', email: 'ana@email.com', prestamos: 2, saldo: 5000, estado: 'Activo' },
    { nombre: 'Roberto Hernández', curp: 'HERR880725HDFSRT05', telefono: '5555678901', email: 'roberto@email.com', prestamos: 1, saldo: 0, estado: 'Sin deuda' },
];

const mockMovimientosData = [
    { hora: '09:15', tipo: 'Entrada', concepto: 'Pago préstamo PRE-00001', referencia: 'PAG-001', monto: 1500 },
    { hora: '09:45', tipo: 'Entrada', concepto: 'Pago préstamo PRE-00006', referencia: 'PAG-002', monto: 3200 },
    { hora: '10:30', tipo: 'Salida', concepto: 'Desembolso PRE-00010', referencia: 'DES-001', monto: -10000 },
    { hora: '11:45', tipo: 'Entrada', concepto: 'Pago préstamo PRE-00002', referencia: 'PAG-003', monto: 2500 },
    { hora: '12:30', tipo: 'Entrada', concepto: 'Pago préstamo PRE-00004', referencia: 'PAG-004', monto: 1200 },
    { hora: '14:20', tipo: 'Entrada', concepto: 'Intereses mora PRE-00003', referencia: 'INT-001', monto: 350 },
    { hora: '15:00', tipo: 'Salida', concepto: 'Desembolso PRE-00011', referencia: 'DES-002', monto: -15000 },
    { hora: '16:00', tipo: 'Salida', concepto: 'Gastos operativos', referencia: 'GAS-001', monto: -500 },
    { hora: '17:30', tipo: 'Entrada', concepto: 'Liquidación PRE-00005', referencia: 'LIQ-001', monto: 5000 },
];

export default function ReportesPage() {
    const [loading, setLoading] = React.useState<string | null>(null);
    const [success, setSuccess] = React.useState<string | null>(null);

    const showSuccess = (type: string) => {
        setSuccess(type);
        setTimeout(() => setSuccess(null), 3000);
    };

    // Professional PDF header with branding
    const addProfessionalHeader = (doc: jsPDF, title: string, subtitle?: string) => {
        const pageWidth = doc.internal.pageSize.getWidth();

        // Blue header bar
        doc.setFillColor(30, 64, 175);
        doc.rect(0, 0, pageWidth, 40, 'F');

        // Company name
        doc.setFontSize(22);
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text('Préstamos Fintech MX', 14, 18);

        // Company tagline
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('Sistema de Gestión de Préstamos', 14, 26);

        // Report date on the right
        doc.setFontSize(10);
        doc.text(`Generado: ${new Date().toLocaleDateString('es-MX', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })}`, pageWidth - 14, 18, { align: 'right' });
        doc.text(`Hora: ${new Date().toLocaleTimeString('es-MX')}`, pageWidth - 14, 26, { align: 'right' });

        // Report title
        doc.setFontSize(16);
        doc.setTextColor(30, 64, 175);
        doc.setFont('helvetica', 'bold');
        doc.text(title, 14, 52);

        // Subtitle if provided
        if (subtitle) {
            doc.setFontSize(11);
            doc.setTextColor(100, 100, 100);
            doc.setFont('helvetica', 'normal');
            doc.text(subtitle, 14, 60);
            return 70;
        }

        return 62;
    };

    // Add summary box
    const addSummaryBox = (doc: jsPDF, startY: number, items: { label: string; value: string; color?: number[] }[]) => {
        const pageWidth = doc.internal.pageSize.getWidth();
        const boxWidth = (pageWidth - 28) / items.length;

        items.forEach((item, index) => {
            const x = 14 + (boxWidth * index);

            // Box background
            doc.setFillColor(248, 250, 252);
            doc.roundedRect(x, startY, boxWidth - 4, 28, 3, 3, 'F');

            // Border
            doc.setDrawColor(226, 232, 240);
            doc.roundedRect(x, startY, boxWidth - 4, 28, 3, 3, 'S');

            // Label
            doc.setFontSize(9);
            doc.setTextColor(100, 116, 139);
            doc.setFont('helvetica', 'normal');
            doc.text(item.label, x + 6, startY + 10);

            // Value
            doc.setFontSize(14);
            if (item.color) {
                doc.setTextColor(...(item.color as [number, number, number]));
            } else {
                doc.setTextColor(15, 23, 42);
            }
            doc.setFont('helvetica', 'bold');
            doc.text(item.value, x + 6, startY + 22);
        });

        return startY + 36;
    };

    // Add footer to all pages
    const addFooter = (doc: jsPDF) => {
        const pageCount = doc.getNumberOfPages();
        const pageHeight = doc.internal.pageSize.getHeight();
        const pageWidth = doc.internal.pageSize.getWidth();

        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);

            // Footer line
            doc.setDrawColor(226, 232, 240);
            doc.line(14, pageHeight - 20, pageWidth - 14, pageHeight - 20);

            // Footer text
            doc.setFontSize(8);
            doc.setTextColor(148, 163, 184);
            doc.setFont('helvetica', 'normal');
            doc.text('Préstamos Fintech MX © 2026 - Documento confidencial', 14, pageHeight - 12);
            doc.text(`Página ${i} de ${pageCount}`, pageWidth - 14, pageHeight - 12, { align: 'right' });
        }
    };

    // Generate Estado de Cartera PDF
    const generateCarteraPDF = () => {
        setLoading('cartera');

        setTimeout(() => {
            const doc = new jsPDF();
            let startY = addProfessionalHeader(doc, 'Estado de Cartera', 'Resumen completo de la cartera de préstamos');

            // Summary boxes
            const totalMonto = mockCarteraData.reduce((sum, r) => sum + r.monto, 0);
            const totalSaldo = mockCarteraData.reduce((sum, r) => sum + r.saldo, 0);
            const activos = mockCarteraData.filter(r => r.estado === 'Activo').length;
            const vencidos = mockCarteraData.filter(r => r.estado === 'Vencido').length;

            startY = addSummaryBox(doc, startY, [
                { label: 'Total Cartera', value: `$${totalMonto.toLocaleString()}` },
                { label: 'Saldo Pendiente', value: `$${totalSaldo.toLocaleString()}`, color: [30, 64, 175] },
                { label: 'Préstamos Activos', value: activos.toString(), color: [16, 185, 129] },
                { label: 'Préstamos Vencidos', value: vencidos.toString(), color: [239, 68, 68] },
            ]);

            // Table
            autoTable(doc, {
                startY: startY + 5,
                head: [['#', 'Cliente', 'Préstamo', 'Monto Original', 'Saldo Actual', 'Cuotas', 'Tasa', 'Estado']],
                body: mockCarteraData.map((row, i) => [
                    (i + 1).toString(),
                    row.cliente,
                    row.prestamo,
                    `$${row.monto.toLocaleString()}`,
                    `$${row.saldo.toLocaleString()}`,
                    row.cuotas,
                    row.tasa,
                    row.estado,
                ]),
                theme: 'grid',
                headStyles: {
                    fillColor: [30, 64, 175],
                    fontSize: 9,
                    fontStyle: 'bold',
                    halign: 'center'
                },
                bodyStyles: { fontSize: 9 },
                columnStyles: {
                    0: { halign: 'center', cellWidth: 10 },
                    3: { halign: 'right' },
                    4: { halign: 'right' },
                    5: { halign: 'center' },
                    6: { halign: 'center' },
                    7: { halign: 'center' },
                },
                didParseCell: (data) => {
                    if (data.column.index === 7 && data.section === 'body') {
                        const value = data.cell.raw as string;
                        if (value === 'Activo') data.cell.styles.textColor = [16, 185, 129];
                        else if (value === 'Vencido') data.cell.styles.textColor = [239, 68, 68];
                        else if (value === 'Liquidado') data.cell.styles.textColor = [148, 163, 184];
                    }
                },
                alternateRowStyles: { fillColor: [248, 250, 252] },
                margin: { left: 14, right: 14 },
            });

            addFooter(doc);
            doc.save('estado_cartera.pdf');
            setLoading(null);
            showSuccess('cartera');
        }, 500);
    };

    // Generate Cobranza PDF
    const generateCobranzaPDF = () => {
        setLoading('cobranza');

        setTimeout(() => {
            const doc = new jsPDF();
            let startY = addProfessionalHeader(doc, 'Reporte de Cobranza', 'Periodo: Enero 2026');

            // Summary
            const total = mockCobranzaData.reduce((sum, r) => sum + r.monto, 0);
            const efectivo = mockCobranzaData.filter(r => r.metodo === 'Efectivo').reduce((sum, r) => sum + r.monto, 0);
            const spei = mockCobranzaData.filter(r => r.metodo === 'SPEI').reduce((sum, r) => sum + r.monto, 0);
            const otros = total - efectivo - spei;

            startY = addSummaryBox(doc, startY, [
                { label: 'Total Cobrado', value: `$${total.toLocaleString()}`, color: [16, 185, 129] },
                { label: 'Efectivo', value: `$${efectivo.toLocaleString()}` },
                { label: 'SPEI', value: `$${spei.toLocaleString()}` },
                { label: 'Otros Medios', value: `$${otros.toLocaleString()}` },
            ]);

            autoTable(doc, {
                startY: startY + 5,
                head: [['#', 'Fecha', 'Cliente', 'Concepto', 'Recibo', 'Método', 'Monto']],
                body: mockCobranzaData.map((row, i) => [
                    (i + 1).toString(),
                    row.fecha,
                    row.cliente,
                    row.concepto,
                    row.recibo,
                    row.metodo,
                    `$${row.monto.toLocaleString()}`,
                ]),
                theme: 'grid',
                headStyles: { fillColor: [16, 185, 129], fontSize: 9, fontStyle: 'bold', halign: 'center' },
                bodyStyles: { fontSize: 9 },
                columnStyles: {
                    0: { halign: 'center', cellWidth: 10 },
                    6: { halign: 'right', fontStyle: 'bold' },
                },
                alternateRowStyles: { fillColor: [240, 253, 244] },
                margin: { left: 14, right: 14 },
                foot: [[
                    '', '', '', '', '', 'TOTAL:',
                    `$${total.toLocaleString()}`
                ]],
                footStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255], fontStyle: 'bold' },
            });

            addFooter(doc);
            doc.save('reporte_cobranza.pdf');
            setLoading(null);
            showSuccess('cobranza');
        }, 500);
    };

    // Generate Cartera Vencida PDF
    const generateVencidosPDF = () => {
        setLoading('vencidos');

        setTimeout(() => {
            const doc = new jsPDF();
            let startY = addProfessionalHeader(doc, 'Cartera Vencida', 'Análisis de préstamos en mora');

            const totalVencido = mockVencidosData.reduce((sum, r) => sum + r.cuotaVencida, 0);
            const totalSaldo = mockVencidosData.reduce((sum, r) => sum + r.saldoTotal, 0);
            const promedioDias = Math.round(mockVencidosData.reduce((sum, r) => sum + r.diasMora, 0) / mockVencidosData.length);

            startY = addSummaryBox(doc, startY, [
                { label: 'Préstamos Vencidos', value: mockVencidosData.length.toString(), color: [239, 68, 68] },
                { label: 'Cuotas Vencidas', value: `$${totalVencido.toLocaleString()}`, color: [239, 68, 68] },
                { label: 'Capital en Riesgo', value: `$${totalSaldo.toLocaleString()}` },
                { label: 'Promedio Días Mora', value: `${promedioDias} días` },
            ]);

            // Priority indicator
            doc.setFillColor(254, 242, 242);
            doc.roundedRect(14, startY + 2, doc.internal.pageSize.getWidth() - 28, 18, 3, 3, 'F');
            doc.setFontSize(10);
            doc.setTextColor(185, 28, 28);
            doc.setFont('helvetica', 'bold');
            doc.text('⚠️ ATENCIÓN: Los siguientes clientes requieren seguimiento inmediato de cobranza', 20, startY + 13);

            startY += 25;

            autoTable(doc, {
                startY,
                head: [['#', 'Cliente', 'Préstamo', 'Días Mora', 'Cuota Vencida', 'Saldo Total', 'Teléfono', 'Prioridad']],
                body: mockVencidosData.map((row, i) => [
                    (i + 1).toString(),
                    row.cliente,
                    row.prestamo,
                    row.diasMora.toString(),
                    `$${row.cuotaVencida.toLocaleString()}`,
                    `$${row.saldoTotal.toLocaleString()}`,
                    row.telefono,
                    row.diasMora > 10 ? 'ALTA' : row.diasMora > 5 ? 'MEDIA' : 'BAJA',
                ]),
                theme: 'grid',
                headStyles: { fillColor: [239, 68, 68], fontSize: 9, fontStyle: 'bold', halign: 'center' },
                bodyStyles: { fontSize: 9 },
                columnStyles: {
                    0: { halign: 'center', cellWidth: 10 },
                    3: { halign: 'center' },
                    4: { halign: 'right' },
                    5: { halign: 'right' },
                    7: { halign: 'center', fontStyle: 'bold' },
                },
                didParseCell: (data) => {
                    if (data.column.index === 7 && data.section === 'body') {
                        const value = data.cell.raw as string;
                        if (value === 'ALTA') {
                            data.cell.styles.textColor = [255, 255, 255];
                            data.cell.styles.fillColor = [239, 68, 68];
                        } else if (value === 'MEDIA') {
                            data.cell.styles.textColor = [255, 255, 255];
                            data.cell.styles.fillColor = [245, 158, 11];
                        } else {
                            data.cell.styles.textColor = [255, 255, 255];
                            data.cell.styles.fillColor = [34, 197, 94];
                        }
                    }
                },
                alternateRowStyles: { fillColor: [254, 242, 242] },
                margin: { left: 14, right: 14 },
            });

            addFooter(doc);
            doc.save('cartera_vencida.pdf');
            setLoading(null);
            showSuccess('vencidos');
        }, 500);
    };

    // Generate Clientes Excel (CSV)
    const generateClientesExcel = () => {
        setLoading('clientes');

        setTimeout(() => {
            const headers = ['Nombre', 'CURP', 'Teléfono', 'Email', 'Préstamos Activos', 'Saldo Pendiente', 'Estado'];
            const rows = mockClientesData.map(c => [c.nombre, c.curp, c.telefono, c.email, c.prestamos, c.saldo, c.estado]);

            const csvContent = '\uFEFF' + [ // BOM for Excel UTF-8
                headers.join(','),
                ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'directorio_clientes.csv';
            a.click();

            setLoading(null);
            showSuccess('clientes');
        }, 500);
    };

    // Generate Movimientos PDF
    const generateMovimientosPDF = () => {
        setLoading('movimientos');

        setTimeout(() => {
            const doc = new jsPDF();
            let startY = addProfessionalHeader(doc, 'Corte de Caja', `Movimientos del día: ${new Date().toLocaleDateString('es-MX')}`);

            const entradas = mockMovimientosData.filter(m => m.monto > 0).reduce((sum, m) => sum + m.monto, 0);
            const salidas = Math.abs(mockMovimientosData.filter(m => m.monto < 0).reduce((sum, m) => sum + m.monto, 0));
            const neto = entradas - salidas;

            startY = addSummaryBox(doc, startY, [
                { label: 'Total Entradas', value: `$${entradas.toLocaleString()}`, color: [16, 185, 129] },
                { label: 'Total Salidas', value: `$${salidas.toLocaleString()}`, color: [239, 68, 68] },
                { label: 'Saldo Neto', value: `$${neto.toLocaleString()}`, color: neto >= 0 ? [16, 185, 129] : [239, 68, 68] },
                { label: 'Operaciones', value: mockMovimientosData.length.toString() },
            ]);

            autoTable(doc, {
                startY: startY + 5,
                head: [['#', 'Hora', 'Tipo', 'Concepto', 'Referencia', 'Monto']],
                body: mockMovimientosData.map((row, i) => [
                    (i + 1).toString(),
                    row.hora,
                    row.tipo,
                    row.concepto,
                    row.referencia,
                    row.monto > 0 ? `+$${row.monto.toLocaleString()}` : `-$${Math.abs(row.monto).toLocaleString()}`,
                ]),
                theme: 'grid',
                headStyles: { fillColor: [139, 92, 246], fontSize: 9, fontStyle: 'bold', halign: 'center' },
                bodyStyles: { fontSize: 9 },
                columnStyles: {
                    0: { halign: 'center', cellWidth: 10 },
                    1: { halign: 'center' },
                    2: { halign: 'center' },
                    5: { halign: 'right', fontStyle: 'bold' },
                },
                didParseCell: (data) => {
                    if (data.column.index === 2 && data.section === 'body') {
                        const value = data.cell.raw as string;
                        data.cell.styles.textColor = value === 'Entrada' ? [16, 185, 129] : [239, 68, 68];
                    }
                    if (data.column.index === 5 && data.section === 'body') {
                        const value = data.cell.raw as string;
                        data.cell.styles.textColor = value.startsWith('+') ? [16, 185, 129] : [239, 68, 68];
                    }
                },
                alternateRowStyles: { fillColor: [245, 243, 255] },
                margin: { left: 14, right: 14 },
            });

            // Signature area
            const finalY = (doc as any).lastAutoTable.finalY + 20;
            doc.setDrawColor(200, 200, 200);
            doc.line(14, finalY + 20, 80, finalY + 20);
            doc.line(doc.internal.pageSize.getWidth() - 80, finalY + 20, doc.internal.pageSize.getWidth() - 14, finalY + 20);

            doc.setFontSize(9);
            doc.setTextColor(100, 100, 100);
            doc.text('Elaboró', 47, finalY + 28, { align: 'center' });
            doc.text('Autorizó', doc.internal.pageSize.getWidth() - 47, finalY + 28, { align: 'center' });

            addFooter(doc);
            doc.save('corte_caja.pdf');
            setLoading(null);
            showSuccess('movimientos');
        }, 500);
    };

    // Generate Rentabilidad PDF
    const generateRentabilidadPDF = () => {
        setLoading('rentabilidad');

        setTimeout(() => {
            const doc = new jsPDF();
            let startY = addProfessionalHeader(doc, 'Análisis de Rentabilidad', 'Periodo: Enero 2026');

            startY = addSummaryBox(doc, startY, [
                { label: 'Ingresos Totales', value: '$56,500.00', color: [16, 185, 129] },
                { label: 'Gastos Totales', value: '$17,000.00', color: [239, 68, 68] },
                { label: 'Utilidad Neta', value: '$39,500.00', color: [16, 185, 129] },
                { label: 'Margen', value: '69.9%', color: [30, 64, 175] },
            ]);

            // Income section
            doc.setFontSize(12);
            doc.setTextColor(16, 185, 129);
            doc.setFont('helvetica', 'bold');
            doc.text('INGRESOS', 14, startY + 10);

            autoTable(doc, {
                startY: startY + 15,
                head: [['Concepto', 'Monto', '% del Total']],
                body: [
                    ['Ingresos por Intereses Ordinarios', '$45,000.00', '79.6%'],
                    ['Intereses por Mora', '$3,500.00', '6.2%'],
                    ['Comisiones por Apertura', '$8,000.00', '14.2%'],
                ],
                theme: 'plain',
                headStyles: { fillColor: [240, 253, 244], textColor: [16, 185, 129], fontSize: 10 },
                bodyStyles: { fontSize: 10 },
                columnStyles: { 1: { halign: 'right' }, 2: { halign: 'right' } },
                foot: [['TOTAL INGRESOS', '$56,500.00', '100%']],
                footStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255], fontStyle: 'bold' },
                margin: { left: 14, right: 14 },
            });

            const afterIncome = (doc as any).lastAutoTable.finalY + 15;

            // Expenses section
            doc.setFontSize(12);
            doc.setTextColor(239, 68, 68);
            doc.setFont('helvetica', 'bold');
            doc.text('GASTOS', 14, afterIncome);

            autoTable(doc, {
                startY: afterIncome + 5,
                head: [['Concepto', 'Monto', '% del Total']],
                body: [
                    ['Gastos Operativos', '$12,000.00', '70.6%'],
                    ['Provisión Cartera Vencida', '$5,000.00', '29.4%'],
                ],
                theme: 'plain',
                headStyles: { fillColor: [254, 242, 242], textColor: [239, 68, 68], fontSize: 10 },
                bodyStyles: { fontSize: 10 },
                columnStyles: { 1: { halign: 'right' }, 2: { halign: 'right' } },
                foot: [['TOTAL GASTOS', '$17,000.00', '100%']],
                footStyles: { fillColor: [239, 68, 68], textColor: [255, 255, 255], fontStyle: 'bold' },
                margin: { left: 14, right: 14 },
            });

            // Final summary
            const finalY = (doc as any).lastAutoTable.finalY + 15;

            doc.setFillColor(30, 64, 175);
            doc.roundedRect(14, finalY, doc.internal.pageSize.getWidth() - 28, 30, 3, 3, 'F');

            doc.setFontSize(14);
            doc.setTextColor(255, 255, 255);
            doc.setFont('helvetica', 'bold');
            doc.text('UTILIDAD NETA DEL PERIODO', 20, finalY + 13);
            doc.setFontSize(18);
            doc.text('$39,500.00', doc.internal.pageSize.getWidth() - 20, finalY + 20, { align: 'right' });

            addFooter(doc);
            doc.save('analisis_rentabilidad.pdf');
            setLoading(null);
            showSuccess('rentabilidad');
        }, 500);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Success Toast */}
            {success && (
                <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-xl bg-green-500 px-4 py-3 text-white shadow-lg animate-fade-in">
                    <Check className="h-5 w-5" />
                    ¡Reporte generado exitosamente!
                </div>
            )}

            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
                        📊 Reportes
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Genera y descarga reportes del sistema
                    </p>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="py-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900">
                                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Clientes Totales</p>
                                <p className="text-2xl font-bold">156</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="py-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-green-100 p-3 dark:bg-green-900">
                                <Wallet className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Préstamos Activos</p>
                                <p className="text-2xl font-bold">42</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="py-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-emerald-100 p-3 dark:bg-emerald-900">
                                <DollarSign className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Cobrado Este Mes</p>
                                <p className="text-2xl font-bold font-mono">{formatCurrency(125000)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="py-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-violet-100 p-3 dark:bg-violet-900">
                                <TrendingUp className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Tasa Recuperación</p>
                                <p className="text-2xl font-bold">94.5%</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Report Types */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card hover>
                    <CardContent className="py-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="rounded-full bg-blue-100 p-4 dark:bg-blue-900 mb-4">
                                <FileBarChart className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">Estado de Cartera</h3>
                            <p className="text-sm text-gray-500 mt-1 mb-4">
                                Resumen completo de préstamos activos, vencidos y liquidados
                            </p>
                            <Button size="sm" onClick={generateCarteraPDF} disabled={loading === 'cartera'}>
                                {loading === 'cartera' ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Download className="h-4 w-4" />
                                )}
                                {loading === 'cartera' ? 'Generando...' : 'Generar PDF'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card hover>
                    <CardContent className="py-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="rounded-full bg-green-100 p-4 dark:bg-green-900 mb-4">
                                <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">Reporte de Cobranza</h3>
                            <p className="text-sm text-gray-500 mt-1 mb-4">
                                Pagos recibidos, pendientes y proyección de ingresos
                            </p>
                            <Button size="sm" onClick={generateCobranzaPDF} disabled={loading === 'cobranza'}>
                                {loading === 'cobranza' ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Download className="h-4 w-4" />
                                )}
                                {loading === 'cobranza' ? 'Generando...' : 'Generar PDF'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card hover>
                    <CardContent className="py-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="rounded-full bg-red-100 p-4 dark:bg-red-900 mb-4">
                                <Calendar className="h-8 w-8 text-red-600 dark:text-red-400" />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">Cartera Vencida</h3>
                            <p className="text-sm text-gray-500 mt-1 mb-4">
                                Detalle de préstamos en mora con análisis de antigüedad
                            </p>
                            <Button size="sm" onClick={generateVencidosPDF} disabled={loading === 'vencidos'}>
                                {loading === 'vencidos' ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Download className="h-4 w-4" />
                                )}
                                {loading === 'vencidos' ? 'Generando...' : 'Generar PDF'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card hover>
                    <CardContent className="py-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="rounded-full bg-amber-100 p-4 dark:bg-amber-900 mb-4">
                                <Users className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">Directorio de Clientes</h3>
                            <p className="text-sm text-gray-500 mt-1 mb-4">
                                Lista completa de clientes con datos de contacto
                            </p>
                            <Button size="sm" onClick={generateClientesExcel} disabled={loading === 'clientes'}>
                                {loading === 'clientes' ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Download className="h-4 w-4" />
                                )}
                                {loading === 'clientes' ? 'Generando...' : 'Generar Excel'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card hover>
                    <CardContent className="py-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="rounded-full bg-violet-100 p-4 dark:bg-violet-900 mb-4">
                                <Wallet className="h-8 w-8 text-violet-600 dark:text-violet-400" />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">Movimientos del Día</h3>
                            <p className="text-sm text-gray-500 mt-1 mb-4">
                                Corte de caja con entradas, salidas y arqueo
                            </p>
                            <Button size="sm" onClick={generateMovimientosPDF} disabled={loading === 'movimientos'}>
                                {loading === 'movimientos' ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Download className="h-4 w-4" />
                                )}
                                {loading === 'movimientos' ? 'Generando...' : 'Generar PDF'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card hover>
                    <CardContent className="py-6">
                        <div className="flex flex-col items-center text-center">
                            <div className="rounded-full bg-indigo-100 p-4 dark:bg-indigo-900 mb-4">
                                <TrendingUp className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">Análisis de Rentabilidad</h3>
                            <p className="text-sm text-gray-500 mt-1 mb-4">
                                Ingresos por intereses, comisiones y utilidad neta
                            </p>
                            <Button size="sm" onClick={generateRentabilidadPDF} disabled={loading === 'rentabilidad'}>
                                {loading === 'rentabilidad' ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Download className="h-4 w-4" />
                                )}
                                {loading === 'rentabilidad' ? 'Generando...' : 'Generar PDF'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
