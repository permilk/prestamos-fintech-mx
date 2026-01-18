/**
 * Generador de Tablas de Amortización
 * Soporta sistema francés (cuota fija) y sistema alemán (amortización constante)
 */

import { calcularCuotaFija } from './cat-calculator';

export type FrecuenciaPago = 'semanal' | 'quincenal' | 'mensual';
export type SistemaAmortizacion = 'frances' | 'aleman' | 'simple';

export interface AmortizationRow {
    numeroCuota: number;
    fechaVencimiento: Date;
    saldoInicial: number;
    cuotaTotal: number;
    abonoCapital: number;
    intereses: number;
    ivaIntereses: number;
    saldoFinal: number;
    estado: 'pendiente' | 'pagado' | 'vencido' | 'parcial';
}

export interface AmortizationTableResult {
    cronograma: AmortizationRow[];
    resumen: {
        totalCapital: number;
        totalIntereses: number;
        totalIVA: number;
        totalAPagar: number;
        cuotaPromedio: number;
    };
}

export interface AmortizationInput {
    capital: number;
    tasaAnual?: number;
    tasaMensual?: number;
    tasaPorPeriodo?: number; // Para interés simple "flat"
    plazo: number;
    frecuencia: FrecuenciaPago;
    fechaInicio: Date;
    sistema: SistemaAmortizacion;
    ivaRate?: number;
}

/**
 * Obtiene el número de días entre cuotas según la frecuencia
 */
function getDiasPorFrecuencia(frecuencia: FrecuenciaPago): number {
    switch (frecuencia) {
        case 'semanal':
            return 7;
        case 'quincenal':
            return 15;
        case 'mensual':
            return 30;
        default:
            return 30;
    }
}

/**
 * Suma días a una fecha considerando la frecuencia
 */
function sumarPeriodo(fecha: Date, frecuencia: FrecuenciaPago): Date {
    const nuevaFecha = new Date(fecha);

    switch (frecuencia) {
        case 'semanal':
            nuevaFecha.setDate(nuevaFecha.getDate() + 7);
            break;
        case 'quincenal':
            nuevaFecha.setDate(nuevaFecha.getDate() + 15);
            break;
        case 'mensual':
            nuevaFecha.setMonth(nuevaFecha.getMonth() + 1);
            break;
    }

    return nuevaFecha;
}

/**
 * Convierte tasa anual a tasa por periodo
 */
function tasaAnualAPeriodica(tasaAnual: number, frecuencia: FrecuenciaPago): number {
    const periodosPorAno = frecuencia === 'semanal' ? 52 : frecuencia === 'quincenal' ? 24 : 12;
    return tasaAnual / periodosPorAno;
}

/**
 * Genera tabla de amortización con sistema francés (cuota fija)
 * 
 * En este sistema:
 * - La cuota total es constante
 * - El componente de interés disminuye cada período
 * - El componente de capital aumenta cada período
 */
function generarTablaFrancesa(input: AmortizationInput): AmortizationTableResult {
    const {
        capital,
        tasaAnual = 0,
        tasaMensual,
        plazo,
        frecuencia,
        fechaInicio,
        ivaRate = 0.16,
    } = input;

    // Determinar tasa por período
    let tasaPorPeriodo: number;
    if (tasaMensual !== undefined) {
        tasaPorPeriodo = tasaMensual / 100;
        if (frecuencia === 'semanal') {
            tasaPorPeriodo = tasaPorPeriodo / 4.33;
        } else if (frecuencia === 'quincenal') {
            tasaPorPeriodo = tasaPorPeriodo / 2;
        }
    } else {
        tasaPorPeriodo = tasaAnualAPeriodica(tasaAnual / 100, frecuencia);
    }

    const cuotaFija = calcularCuotaFija(capital, tasaPorPeriodo, plazo);

    const cronograma: AmortizationRow[] = [];
    let saldoActual = capital;
    let fechaActual = new Date(fechaInicio);
    let totalIntereses = 0;
    let totalIVA = 0;

    for (let i = 1; i <= plazo; i++) {
        fechaActual = sumarPeriodo(fechaActual, frecuencia);

        const intereses = saldoActual * tasaPorPeriodo;
        const ivaIntereses = intereses * ivaRate;
        const abonoCapital = cuotaFija - intereses;
        const saldoFinal = Math.max(0, saldoActual - abonoCapital);

        // Ajustar última cuota para evitar residuos
        const cuotaAjustada = i === plazo ? saldoActual + intereses : cuotaFija;
        const abonoCapitalAjustado = i === plazo ? saldoActual : abonoCapital;

        cronograma.push({
            numeroCuota: i,
            fechaVencimiento: new Date(fechaActual),
            saldoInicial: Math.round(saldoActual * 100) / 100,
            cuotaTotal: Math.round((cuotaAjustada + ivaIntereses) * 100) / 100,
            abonoCapital: Math.round(abonoCapitalAjustado * 100) / 100,
            intereses: Math.round(intereses * 100) / 100,
            ivaIntereses: Math.round(ivaIntereses * 100) / 100,
            saldoFinal: Math.round(saldoFinal * 100) / 100,
            estado: 'pendiente',
        });

        totalIntereses += intereses;
        totalIVA += ivaIntereses;
        saldoActual = saldoFinal;
    }

    return {
        cronograma,
        resumen: {
            totalCapital: capital,
            totalIntereses: Math.round(totalIntereses * 100) / 100,
            totalIVA: Math.round(totalIVA * 100) / 100,
            totalAPagar: Math.round((capital + totalIntereses + totalIVA) * 100) / 100,
            cuotaPromedio: Math.round(cuotaFija * 100) / 100,
        },
    };
}

/**
 * Genera tabla de amortización con sistema alemán (amortización constante)
 * 
 * En este sistema:
 * - El abono a capital es constante
 * - La cuota total disminuye cada período
 * - Los intereses disminuyen cada período
 */
function generarTablaAlemana(input: AmortizationInput): AmortizationTableResult {
    const {
        capital,
        tasaAnual = 0,
        tasaMensual,
        plazo,
        frecuencia,
        fechaInicio,
        ivaRate = 0.16,
    } = input;

    let tasaPorPeriodo: number;
    if (tasaMensual !== undefined) {
        tasaPorPeriodo = tasaMensual / 100;
        if (frecuencia === 'semanal') {
            tasaPorPeriodo = tasaPorPeriodo / 4.33;
        } else if (frecuencia === 'quincenal') {
            tasaPorPeriodo = tasaPorPeriodo / 2;
        }
    } else {
        tasaPorPeriodo = tasaAnualAPeriodica(tasaAnual / 100, frecuencia);
    }

    const abonoCapitalFijo = capital / plazo;

    const cronograma: AmortizationRow[] = [];
    let saldoActual = capital;
    let fechaActual = new Date(fechaInicio);
    let totalIntereses = 0;
    let totalIVA = 0;
    let totalCuotas = 0;

    for (let i = 1; i <= plazo; i++) {
        fechaActual = sumarPeriodo(fechaActual, frecuencia);

        const intereses = saldoActual * tasaPorPeriodo;
        const ivaIntereses = intereses * ivaRate;
        const cuotaTotal = abonoCapitalFijo + intereses + ivaIntereses;
        const saldoFinal = Math.max(0, saldoActual - abonoCapitalFijo);

        cronograma.push({
            numeroCuota: i,
            fechaVencimiento: new Date(fechaActual),
            saldoInicial: Math.round(saldoActual * 100) / 100,
            cuotaTotal: Math.round(cuotaTotal * 100) / 100,
            abonoCapital: Math.round(abonoCapitalFijo * 100) / 100,
            intereses: Math.round(intereses * 100) / 100,
            ivaIntereses: Math.round(ivaIntereses * 100) / 100,
            saldoFinal: Math.round(saldoFinal * 100) / 100,
            estado: 'pendiente',
        });

        totalIntereses += intereses;
        totalIVA += ivaIntereses;
        totalCuotas += cuotaTotal;
        saldoActual = saldoFinal;
    }

    return {
        cronograma,
        resumen: {
            totalCapital: capital,
            totalIntereses: Math.round(totalIntereses * 100) / 100,
            totalIVA: Math.round(totalIVA * 100) / 100,
            totalAPagar: Math.round(totalCuotas * 100) / 100,
            cuotaPromedio: Math.round((totalCuotas / plazo) * 100) / 100,
        },
    };
}

/**
 * Genera tabla con interés simple (flat)
 * 
 * En este sistema:
 * - El interés se calcula al inicio sobre el monto total
 * - La cuota es uniforme (capital + interés dividido entre cuotas)
 * - Es el método actual del sistema legacy
 */
function generarTablaSimple(input: AmortizationInput): AmortizationTableResult {
    const {
        capital,
        tasaPorPeriodo = 0,
        plazo,
        frecuencia,
        fechaInicio,
        ivaRate = 0.16,
    } = input;

    const interesTotal = capital * (tasaPorPeriodo / 100);
    const ivaTotal = interesTotal * ivaRate;
    const montoTotal = capital + interesTotal + ivaTotal;
    const cuotaFija = montoTotal / plazo;
    const abonoCapitalPorCuota = capital / plazo;
    const interesPorCuota = interesTotal / plazo;
    const ivaPorCuota = ivaTotal / plazo;

    const cronograma: AmortizationRow[] = [];
    let saldoActual = capital;
    let fechaActual = new Date(fechaInicio);

    for (let i = 1; i <= plazo; i++) {
        fechaActual = sumarPeriodo(fechaActual, frecuencia);
        const saldoFinal = Math.max(0, saldoActual - abonoCapitalPorCuota);

        cronograma.push({
            numeroCuota: i,
            fechaVencimiento: new Date(fechaActual),
            saldoInicial: Math.round(saldoActual * 100) / 100,
            cuotaTotal: Math.round(cuotaFija * 100) / 100,
            abonoCapital: Math.round(abonoCapitalPorCuota * 100) / 100,
            intereses: Math.round(interesPorCuota * 100) / 100,
            ivaIntereses: Math.round(ivaPorCuota * 100) / 100,
            saldoFinal: Math.round(saldoFinal * 100) / 100,
            estado: 'pendiente',
        });

        saldoActual = saldoFinal;
    }

    return {
        cronograma,
        resumen: {
            totalCapital: capital,
            totalIntereses: Math.round(interesTotal * 100) / 100,
            totalIVA: Math.round(ivaTotal * 100) / 100,
            totalAPagar: Math.round(montoTotal * 100) / 100,
            cuotaPromedio: Math.round(cuotaFija * 100) / 100,
        },
    };
}

/**
 * Función principal para generar tabla de amortización
 * 
 * @param input Parámetros del préstamo
 * @returns Tabla de amortización completa con resumen
 */
export function generarTablaAmortizacion(input: AmortizationInput): AmortizationTableResult {
    switch (input.sistema) {
        case 'frances':
            return generarTablaFrancesa(input);
        case 'aleman':
            return generarTablaAlemana(input);
        case 'simple':
            return generarTablaSimple(input);
        default:
            return generarTablaFrancesa(input);
    }
}

/**
 * Calcula el saldo pendiente a una fecha específica
 */
export function calcularSaldoPendiente(
    cronograma: AmortizationRow[],
    fechaCorte: Date
): {
    saldoCapital: number;
    cuotasVencidas: number;
    montoCuotasVencidas: number;
    proximaCuota: AmortizationRow | null;
} {
    let saldoCapital = 0;
    let cuotasVencidas = 0;
    let montoCuotasVencidas = 0;
    let proximaCuota: AmortizationRow | null = null;

    for (const cuota of cronograma) {
        if (cuota.estado === 'pendiente' || cuota.estado === 'vencido') {
            if (cuota.fechaVencimiento <= fechaCorte) {
                cuotasVencidas++;
                montoCuotasVencidas += cuota.cuotaTotal;
            } else if (!proximaCuota) {
                proximaCuota = cuota;
            }
            saldoCapital = cuota.saldoInicial;
        }
    }

    return {
        saldoCapital,
        cuotasVencidas,
        montoCuotasVencidas: Math.round(montoCuotasVencidas * 100) / 100,
        proximaCuota,
    };
}

/**
 * Calcula la penalización por mora
 */
export function calcularMora(
    montoCuota: number,
    diasMora: number,
    tasaMoraDiaria: number = 0.1 // 0.1% diario por defecto
): {
    montoMora: number;
    ivaMora: number;
    totalConMora: number;
} {
    const montoMora = montoCuota * (tasaMoraDiaria / 100) * diasMora;
    const ivaMora = montoMora * 0.16;

    return {
        montoMora: Math.round(montoMora * 100) / 100,
        ivaMora: Math.round(ivaMora * 100) / 100,
        totalConMora: Math.round((montoCuota + montoMora + ivaMora) * 100) / 100,
    };
}
