/**
 * Calculadora de IVA para servicios financieros en México
 * 
 * Conforme al Artículo 1 de la Ley del IVA:
 * - Los intereses cobrados por créditos CAUSAN IVA al 16%
 * - El capital prestado está EXENTO de IVA
 * - Las comisiones por servicios financieros CAUSAN IVA
 * 
 * Excepciones (Art. 15 Fracc. X):
 * - Intereses de créditos hipotecarios para casa habitación
 * - Intereses de tarjetas de crédito (ya están incluidos en la tasa)
 */

export interface IVABreakdown {
    concepto: string;
    subtotal: number;
    tasaIVA: number;
    montoIVA: number;
    total: number;
    exento: boolean;
}

export interface DesgloseIVACompleto {
    conceptos: IVABreakdown[];
    totales: {
        subtotalGravado: number;
        subtotalExento: number;
        ivaTotal: number;
        total: number;
    };
    leyenda: string;
}

// Tasa de IVA vigente en México
export const IVA_RATE = 0.16;
export const IVA_FRONTERA = 0.08; // Zona fronteriza norte

/**
 * Calcula el IVA sobre intereses
 */
export function calcularIVAIntereses(
    intereses: number,
    esZonaFronteriza: boolean = false
): IVABreakdown {
    const tasa = esZonaFronteriza ? IVA_FRONTERA : IVA_RATE;
    const montoIVA = intereses * tasa;

    return {
        concepto: 'Intereses',
        subtotal: Math.round(intereses * 100) / 100,
        tasaIVA: tasa * 100,
        montoIVA: Math.round(montoIVA * 100) / 100,
        total: Math.round((intereses + montoIVA) * 100) / 100,
        exento: false,
    };
}

/**
 * Calcula el IVA sobre comisiones
 */
export function calcularIVAComision(
    comision: number,
    esZonaFronteriza: boolean = false
): IVABreakdown {
    const tasa = esZonaFronteriza ? IVA_FRONTERA : IVA_RATE;
    const montoIVA = comision * tasa;

    return {
        concepto: 'Comisión por apertura',
        subtotal: Math.round(comision * 100) / 100,
        tasaIVA: tasa * 100,
        montoIVA: Math.round(montoIVA * 100) / 100,
        total: Math.round((comision + montoIVA) * 100) / 100,
        exento: false,
    };
}

/**
 * Registra el capital como concepto exento
 */
export function registrarCapitalExento(capital: number): IVABreakdown {
    return {
        concepto: 'Capital prestado',
        subtotal: capital,
        tasaIVA: 0,
        montoIVA: 0,
        total: capital,
        exento: true,
    };
}

/**
 * Genera el desglose completo de IVA para un préstamo
 * 
 * @param capital Monto del capital prestado
 * @param intereses Total de intereses del préstamo
 * @param comisionApertura Comisión por apertura (opcional)
 * @param seguroTotal Total de seguros (opcional)
 * @param esZonaFronteriza Si aplica tasa fronteriza (8%)
 * @returns Desglose completo con totales
 */
export function generarDesgloseIVA(
    capital: number,
    intereses: number,
    comisionApertura: number = 0,
    seguroTotal: number = 0,
    esZonaFronteriza: boolean = false
): DesgloseIVACompleto {
    const conceptos: IVABreakdown[] = [];

    // 1. Capital (exento)
    conceptos.push(registrarCapitalExento(capital));

    // 2. Intereses (gravados)
    if (intereses > 0) {
        conceptos.push(calcularIVAIntereses(intereses, esZonaFronteriza));
    }

    // 3. Comisión de apertura (gravada)
    if (comisionApertura > 0) {
        conceptos.push(calcularIVAComision(comisionApertura, esZonaFronteriza));
    }

    // 4. Seguros (exentos según Art. 15 Fracc. IX)
    if (seguroTotal > 0) {
        conceptos.push({
            concepto: 'Seguro de vida/deudor',
            subtotal: seguroTotal,
            tasaIVA: 0,
            montoIVA: 0,
            total: seguroTotal,
            exento: true,
        });
    }

    // Calcular totales
    const subtotalGravado = conceptos
        .filter(c => !c.exento)
        .reduce((sum, c) => sum + c.subtotal, 0);

    const subtotalExento = conceptos
        .filter(c => c.exento)
        .reduce((sum, c) => sum + c.subtotal, 0);

    const ivaTotal = conceptos.reduce((sum, c) => sum + c.montoIVA, 0);

    const total = conceptos.reduce((sum, c) => sum + c.total, 0);

    const tasa = esZonaFronteriza ? '8%' : '16%';

    return {
        conceptos,
        totales: {
            subtotalGravado: Math.round(subtotalGravado * 100) / 100,
            subtotalExento: Math.round(subtotalExento * 100) / 100,
            ivaTotal: Math.round(ivaTotal * 100) / 100,
            total: Math.round(total * 100) / 100,
        },
        leyenda: `IVA calculado a la tasa del ${tasa} conforme a la Ley del IVA vigente.`,
    };
}

/**
 * Calcula el IVA de intereses moratorios
 */
export function calcularIVAMoratorios(
    interesMoratorio: number,
    esZonaFronteriza: boolean = false
): IVABreakdown {
    const tasa = esZonaFronteriza ? IVA_FRONTERA : IVA_RATE;
    const montoIVA = interesMoratorio * tasa;

    return {
        concepto: 'Intereses moratorios',
        subtotal: Math.round(interesMoratorio * 100) / 100,
        tasaIVA: tasa * 100,
        montoIVA: Math.round(montoIVA * 100) / 100,
        total: Math.round((interesMoratorio + montoIVA) * 100) / 100,
        exento: false,
    };
}

/**
 * Formatea un monto en pesos mexicanos
 */
export function formatearMXN(monto: number): string {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(monto);
}

/**
 * Genera texto legal para comprobantes fiscales
 */
export function generarLeyendaFiscal(
    rfcEmisor: string,
    nombreEmisor: string
): string {
    return `Este documento es un comprobante de operación generado por ${nombreEmisor} (RFC: ${rfcEmisor}). ` +
        `Los intereses y comisiones causan IVA conforme a los artículos 1 y 14 de la Ley del IVA. ` +
        `Consulte con su asesor fiscal para efectos de deducibilidad.`;
}

/**
 * Valida si un RFC tiene formato correcto
 */
export function validarRFC(rfc: string): {
    valido: boolean;
    tipo: 'moral' | 'fisica' | null;
    mensaje?: string;
} {
    // RFC persona moral: 3 letras + 6 dígitos + 3 caracteres
    const regexMoral = /^[A-ZÑ&]{3}[0-9]{6}[A-Z0-9]{3}$/;

    // RFC persona física: 4 letras + 6 dígitos + 3 caracteres
    const regexFisica = /^[A-ZÑ&]{4}[0-9]{6}[A-Z0-9]{3}$/;

    const rfcLimpio = rfc.toUpperCase().trim();

    if (regexMoral.test(rfcLimpio)) {
        return { valido: true, tipo: 'moral' };
    }

    if (regexFisica.test(rfcLimpio)) {
        return { valido: true, tipo: 'fisica' };
    }

    return {
        valido: false,
        tipo: null,
        mensaje: 'El RFC no tiene un formato válido. Persona física: 13 caracteres. Persona moral: 12 caracteres.',
    };
}

/**
 * Municipios de zona fronteriza con IVA reducido (8%)
 * Lista parcial - en producción debe ser una base de datos completa
 */
export const MUNICIPIOS_FRONTERA = [
    // Baja California
    'TIJUANA',
    'MEXICALI',
    'TECATE',
    'ENSENADA',
    'PLAYAS DE ROSARITO',
    // Sonora
    'NOGALES',
    'AGUA PRIETA',
    'SAN LUIS RIO COLORADO',
    // Chihuahua
    'JUAREZ',
    'OJINAGA',
    'ASCENSION',
    // Coahuila
    'PIEDRAS NEGRAS',
    'ACUÑA',
    // Nuevo León
    'ANAHUAC',
    // Tamaulipas
    'NUEVO LAREDO',
    'REYNOSA',
    'MATAMOROS',
    'RIO BRAVO',
    'VALLE HERMOSO',
];

/**
 * Verifica si un municipio está en zona fronteriza
 */
export function esMunicipioFronterizo(municipio: string): boolean {
    return MUNICIPIOS_FRONTERA.includes(municipio.toUpperCase().trim());
}
