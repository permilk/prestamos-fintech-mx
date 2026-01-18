/**
 * Tipos para el módulo de Pagos
 */

export type MetodoPago = 'efectivo' | 'spei' | 'oxxo' | 'codi' | 'tarjeta' | 'cheque' | 'otro';

export type EstadoPago = 'pendiente' | 'procesando' | 'completado' | 'fallido' | 'cancelado' | 'reembolsado';

export type ConceptoPago = 'cuota' | 'liquidacion' | 'abono_capital' | 'mora' | 'comision' | 'seguro';

export interface Pago {
    id: string;
    prestamoId: string;
    clienteId: string;

    // Montos
    montoTotal: number;
    abonoCapital: number;
    abonoIntereses: number;
    abonoMora: number;
    abonoIVA: number;
    abonoOtros: number;

    // Detalles
    concepto: ConceptoPago;
    metodoPago: MetodoPago;

    // Referencias de pago
    referencia?: string;
    clabe?: string;
    autorizacion?: string;
    folioOperacion?: string;

    // Fechas
    fechaPago: Date;
    fechaAplicacion: Date;
    fechaVencimientoCuota?: Date;

    // Estado
    estado: EstadoPago;
    numeroCuota?: number;

    // Saldos después del pago
    saldoAnterior: number;
    saldoPosterior: number;

    // Comprobante
    comprobanteUrl?: string;
    reciboGenerado: boolean;
    reciboEnviado: boolean;

    // Metadatos
    creadoPor: string;
    observaciones?: string;

    createdAt: Date;
    updatedAt: Date;
}

export interface PagoFormInput {
    prestamoId: string;
    monto: number;
    metodoPago: MetodoPago;
    concepto?: ConceptoPago;
    referencia?: string;
    observaciones?: string;
}

export interface ReferenciaPago {
    tipo: MetodoPago;
    referencia: string;
    clabe?: string;
    monto: number;
    vigencia: Date;
    instrucciones: string;
    codigoQR?: string;
    codigoBarras?: string;
}

// SPEI
export interface ReferenciaSPEI {
    clabe: string;
    banco: string;
    beneficiario: string;
    referencia: string;
    concepto: string;
    monto: number;
}

// OXXO Pay
export interface ReferenciaOXXO {
    referencia: string;
    codigoBarras: string;
    monto: number;
    montoCargo: number; // comisión OXXO
    vigencia: Date;
    instrucciones: string;
}

// CoDi
export interface ReferenciaCoDi {
    payload: string;
    codigoQR: string;
    monto: number;
    vigencia: Date;
    cuenta: string;
}

export interface FiltroPagos {
    prestamoId?: string;
    clienteId?: string;
    estado?: EstadoPago;
    metodoPago?: MetodoPago;
    fechaDesde?: Date;
    fechaHasta?: Date;
    montoMinimo?: number;
    montoMaximo?: number;
    pagina?: number;
    limite?: number;
}

export interface ResumenPagos {
    totalPagos: number;
    montoTotalRecibido: number;
    pagosPendientes: number;
    montoPendiente: number;
    pagosHoy: number;
    montoHoy: number;
    porMetodo: Record<MetodoPago, { cantidad: number; monto: number }>;
}
