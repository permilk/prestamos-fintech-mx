/**
 * Tipos para el módulo de Préstamos
 */

import { FrecuenciaPago, SistemaAmortizacion, AmortizationRow } from '../lib/finance';

export type EstadoPrestamo = 'solicitud' | 'aprobado' | 'activo' | 'vencido' | 'liquidado' | 'cancelado';

export type TipoPrestamo = 'personal' | 'nomina' | 'pyme' | 'grupal' | 'empeno';

export interface Prestamo {
    id: string;
    clienteId: string;

    // Montos
    montoSolicitado: number;
    montoAprobado: number;
    montoPrestado: number;

    // Tasas
    tasaInteresMensual: number;
    tasaInteresAnual: number;
    tasaMoraDiaria: number;
    cat: number;

    // Términos
    plazo: number;
    frecuencia: FrecuenciaPago;
    sistemaAmortizacion: SistemaAmortizacion;
    diaCorte: number;
    diasGracia: number;

    // Costos adicionales
    comisionApertura: number;
    seguroMensual: number;
    otrosCargos: number;

    // Totales calculados
    totalIntereses: number;
    totalIVA: number;
    totalAPagar: number;
    cuotaMensual: number;

    // Fechas
    fechaSolicitud: Date;
    fechaAprobacion: Date | null;
    fechaDesembolso: Date | null;
    fechaPrimerPago: Date;
    fechaUltimoPago: Date;
    fechaLiquidacion: Date | null;

    // Estado
    estado: EstadoPrestamo;
    tipo: TipoPrestamo;

    // Saldos actuales
    saldoCapital: number;
    saldoIntereses: number;
    saldoMora: number;
    cuotasVencidas: number;
    diasMora: number;

    // Cronograma
    cronograma: AmortizationRow[];

    // Metadatos
    creadoPor: string;
    aprobadoPor: string | null;
    notas: string;
    documentos: string[];

    createdAt: Date;
    updatedAt: Date;
}

export interface PrestamoFormInput {
    clienteId: string;
    monto: number;
    plazo: number;
    frecuencia: FrecuenciaPago;
    tasaInteres: number;
    sistemaAmortizacion?: SistemaAmortizacion;
    comisionApertura?: number;
    seguroMensual?: number;
    fechaInicio?: Date;
    notas?: string;
}

export interface SimulacionPrestamo {
    monto: number;
    plazo: number;
    frecuencia: FrecuenciaPago;
    tasaInteres: number;
    sistemaAmortizacion: SistemaAmortizacion;
    comisionApertura?: number;
}

export interface ResultadoSimulacion {
    cuotaMensual: number;
    totalAPagar: number;
    totalIntereses: number;
    totalIVA: number;
    cat: string;
    cronogramaPreview: AmortizationRow[];
}

export interface FiltroPrestamos {
    estado?: EstadoPrestamo | EstadoPrestamo[];
    tipo?: TipoPrestamo;
    clienteId?: string;
    fechaDesde?: Date;
    fechaHasta?: Date;
    montoMinimo?: number;
    montoMaximo?: number;
    busqueda?: string;
    pagina?: number;
    limite?: number;
    ordenarPor?: 'fecha' | 'monto' | 'cliente' | 'estado';
    ordenDireccion?: 'asc' | 'desc';
}

export interface ResumenCartera {
    totalPrestamos: number;
    montoTotalPrestado: number;
    montoTotalRecuperado: number;
    montoEnMora: number;
    tasaRecuperacion: number;
    prestamosActivos: number;
    prestamosVencidos: number;
    prestamosLiquidados: number;
}
