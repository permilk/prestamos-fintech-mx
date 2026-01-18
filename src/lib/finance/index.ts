/**
 * Módulo de Finanzas - Préstamos Fintech MX
 * 
 * Exporta todas las funciones de cálculo financiero
 * conforme a regulaciones mexicanas (Banxico, SAT, CONDUSEF)
 */

// Calculadora de CAT
export {
    calcularCAT,
    calcularCATSimple,
    calcularCuotaFija,
    validarCAT,
    type CATInput,
    type CATResult,
} from './cat-calculator';

// Tablas de Amortización
export {
    generarTablaAmortizacion,
    calcularSaldoPendiente,
    calcularMora,
    type AmortizationRow,
    type AmortizationTableResult,
    type AmortizationInput,
    type FrecuenciaPago,
    type SistemaAmortizacion,
} from './amortization';

// Cálculos de IVA
export {
    calcularIVAIntereses,
    calcularIVAComision,
    calcularIVAMoratorios,
    generarDesgloseIVA,
    registrarCapitalExento,
    formatearMXN,
    generarLeyendaFiscal,
    validarRFC,
    esMunicipioFronterizo,
    IVA_RATE,
    IVA_FRONTERA,
    MUNICIPIOS_FRONTERA,
    type IVABreakdown,
    type DesgloseIVACompleto,
} from './iva-calculator';
