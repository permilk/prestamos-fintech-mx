/**
 * Calculadora de CAT (Costo Anual Total) según Banxico
 * Metodología: TIR anualizada de flujos de efectivo
 * Referencia: Circular 13/2021 de Banco de México
 */

export interface CATInput {
    montoPrestado: number;
    tasaInteresMensual: number;
    plazoMeses: number;
    comisionApertura?: number;
    seguroMensual?: number;
    otrosCargosMensuales?: number;
}

export interface CATResult {
    cat: number;                    // Porcentaje anualizado
    catFormateado: string;          // "45.6% Sin IVA"
    tasaEfectivaAnual: number;
    totalAPagar: number;
    totalIntereses: number;
    totalIVAIntereses: number;
    cuotaMensual: number;
    desglose: {
        capital: number;
        intereses: number;
        ivaIntereses: number;
        comisiones: number;
        seguros: number;
    };
}

/**
 * Calcula la TIR (Tasa Interna de Retorno) usando Newton-Raphson
 * 
 * La ecuación a resolver es:
 * Σ(Flujo_i / (1 + r)^i) = 0
 * donde r es la tasa mensual
 */
function calcularTIR(flujos: number[], tasaInicial: number = 0.1): number {
    const MAX_ITERACIONES = 100;
    const TOLERANCIA = 0.0000001;

    let tasa = tasaInicial;

    for (let i = 0; i < MAX_ITERACIONES; i++) {
        let vpn = 0;
        let derivada = 0;

        for (let t = 0; t < flujos.length; t++) {
            const factor = Math.pow(1 + tasa, t);
            vpn += flujos[t] / factor;
            derivada -= t * flujos[t] / Math.pow(1 + tasa, t + 1);
        }

        if (Math.abs(vpn) < TOLERANCIA) {
            return tasa;
        }

        if (derivada === 0) {
            break;
        }

        tasa = tasa - vpn / derivada;

        // Evitar tasas negativas o muy altas
        if (tasa < -0.99) tasa = -0.99;
        if (tasa > 10) tasa = 10;
    }

    return tasa;
}

/**
 * Calcula la cuota fija mensual (sistema francés)
 * Fórmula: C = P * [r(1+r)^n] / [(1+r)^n - 1]
 */
export function calcularCuotaFija(
    capital: number,
    tasaMensual: number,
    plazoMeses: number
): number {
    if (tasaMensual === 0) {
        return capital / plazoMeses;
    }

    const factor = Math.pow(1 + tasaMensual, plazoMeses);
    return capital * (tasaMensual * factor) / (factor - 1);
}

/**
 * Calcula el CAT conforme a la metodología de Banxico
 * 
 * El CAT es la TIR anualizada de todos los flujos de efectivo
 * desde la perspectiva del cliente.
 * 
 * @param input Datos del préstamo
 * @returns Resultado completo del cálculo de CAT
 */
export function calcularCAT(input: CATInput): CATResult {
    const {
        montoPrestado,
        tasaInteresMensual,
        plazoMeses,
        comisionApertura = 0,
        seguroMensual = 0,
        otrosCargosMensuales = 0,
    } = input;

    const IVA_RATE = 0.16;
    const tasaMensualDecimal = tasaInteresMensual / 100;

    // Calcular cuota base (capital + interés)
    const cuotaBase = calcularCuotaFija(montoPrestado, tasaMensualDecimal, plazoMeses);

    // Cuota total incluyendo cargos adicionales
    const cuotaTotal = cuotaBase + seguroMensual + otrosCargosMensuales;

    // Monto neto recibido por el cliente (después de comisión)
    const montoNetoRecibido = montoPrestado - comisionApertura;

    // Construir flujos de efectivo
    // Flujo 0: Dinero recibido (positivo desde perspectiva del cliente)
    // Flujos 1-n: Pagos realizados (negativos)
    const flujos: number[] = [montoNetoRecibido];

    for (let i = 0; i < plazoMeses; i++) {
        flujos.push(-cuotaTotal);
    }

    // Calcular TIR mensual
    const tirMensual = calcularTIR(flujos, tasaMensualDecimal);

    // Anualizar la TIR para obtener el CAT
    // CAT = (1 + TIR_mensual)^12 - 1
    const cat = (Math.pow(1 + tirMensual, 12) - 1) * 100;

    // Calcular desglose de totales
    const totalAPagar = cuotaTotal * plazoMeses + comisionApertura;
    const totalIntereses = (cuotaBase * plazoMeses) - montoPrestado;
    const totalIVAIntereses = totalIntereses * IVA_RATE;

    // Tasa efectiva anual (sin cargos adicionales)
    const tasaEfectivaAnual = (Math.pow(1 + tasaMensualDecimal, 12) - 1) * 100;

    return {
        cat: Math.round(cat * 10) / 10,
        catFormateado: `${(Math.round(cat * 10) / 10).toFixed(1)}% Sin IVA`,
        tasaEfectivaAnual: Math.round(tasaEfectivaAnual * 100) / 100,
        totalAPagar: Math.round(totalAPagar * 100) / 100,
        totalIntereses: Math.round(totalIntereses * 100) / 100,
        totalIVAIntereses: Math.round(totalIVAIntereses * 100) / 100,
        cuotaMensual: Math.round(cuotaTotal * 100) / 100,
        desglose: {
            capital: montoPrestado,
            intereses: Math.round(totalIntereses * 100) / 100,
            ivaIntereses: Math.round(totalIVAIntereses * 100) / 100,
            comisiones: comisionApertura,
            seguros: seguroMensual * plazoMeses,
        },
    };
}

/**
 * Calcula el CAT simplificado para interés simple (flat)
 * Usado para préstamos tradicionales donde el interés se calcula al inicio
 */
export function calcularCATSimple(
    montoPrestado: number,
    tasaInteresTotal: number,
    plazoMeses: number
): CATResult {
    const IVA_RATE = 0.16;
    const montoInteres = montoPrestado * (tasaInteresTotal / 100);
    const montoTotal = montoPrestado + montoInteres;
    const cuotaMensual = montoTotal / plazoMeses;

    // Para interés simple, la TIR es diferente
    const flujos: number[] = [montoPrestado];
    for (let i = 0; i < plazoMeses; i++) {
        flujos.push(-cuotaMensual);
    }

    const tirMensual = calcularTIR(flujos, 0.05);
    const cat = (Math.pow(1 + tirMensual, 12) - 1) * 100;

    return {
        cat: Math.round(cat * 10) / 10,
        catFormateado: `${(Math.round(cat * 10) / 10).toFixed(1)}% Sin IVA`,
        tasaEfectivaAnual: cat,
        totalAPagar: Math.round(montoTotal * 100) / 100,
        totalIntereses: Math.round(montoInteres * 100) / 100,
        totalIVAIntereses: Math.round(montoInteres * IVA_RATE * 100) / 100,
        cuotaMensual: Math.round(cuotaMensual * 100) / 100,
        desglose: {
            capital: montoPrestado,
            intereses: Math.round(montoInteres * 100) / 100,
            ivaIntereses: Math.round(montoInteres * IVA_RATE * 100) / 100,
            comisiones: 0,
            seguros: 0,
        },
    };
}

/**
 * Valida si el CAT está dentro de rangos aceptables
 * Los rangos varían según el tipo de crédito
 */
export function validarCAT(cat: number, tipoCredito: 'personal' | 'nomina' | 'pyme' | 'hipotecario'): {
    esValido: boolean;
    advertencia?: string;
    rangoEsperado: { min: number; max: number };
} {
    const rangos = {
        personal: { min: 20, max: 150 },
        nomina: { min: 15, max: 80 },
        pyme: { min: 18, max: 100 },
        hipotecario: { min: 8, max: 25 },
    };

    const rango = rangos[tipoCredito];
    const esValido = cat >= rango.min && cat <= rango.max;

    let advertencia: string | undefined;
    if (cat < rango.min) {
        advertencia = `El CAT parece muy bajo para un crédito ${tipoCredito}. Verifica los datos.`;
    } else if (cat > rango.max) {
        advertencia = `El CAT excede el rango típico para créditos ${tipoCredito}. Considera revisar las condiciones.`;
    }

    return {
        esValido,
        advertencia,
        rangoEsperado: rango,
    };
}
