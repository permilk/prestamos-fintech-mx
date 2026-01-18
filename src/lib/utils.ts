import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combina clases de Tailwind de forma inteligente
 * Evita conflictos y duplicados
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Formatea un número como moneda MXN
 */
export function formatCurrency(
    amount: number,
    options?: {
        currency?: string;
        decimals?: number;
        showSymbol?: boolean;
    }
): string {
    const { currency = 'MXN', decimals = 2, showSymbol = true } = options ?? {};

    const formatter = new Intl.NumberFormat('es-MX', {
        style: showSymbol ? 'currency' : 'decimal',
        currency,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    });

    return formatter.format(amount);
}

/**
 * Formatea un porcentaje
 */
export function formatPercent(value: number, decimals: number = 1): string {
    return `${value.toFixed(decimals)}%`;
}

/**
 * Formatea una fecha en español
 */
export function formatDate(
    date: Date | string,
    options?: {
        includeTime?: boolean;
        short?: boolean;
    }
): string {
    const { includeTime = false, short = false } = options ?? {};
    const d = typeof date === 'string' ? new Date(date) : date;

    if (short) {
        return d.toLocaleDateString('es-MX', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
        });
    }

    const dateOptions: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    };

    if (includeTime) {
        dateOptions.hour = '2-digit';
        dateOptions.minute = '2-digit';
    }

    return d.toLocaleDateString('es-MX', dateOptions);
}

/**
 * Calcula días entre dos fechas
 */
export function daysBetween(date1: Date, date2: Date): number {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((date2.getTime() - date1.getTime()) / oneDay));
}

/**
 * Genera iniciales de un nombre
 */
export function getInitials(name: string): string {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

/**
 * Trunca texto con ellipsis
 */
export function truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + '...';
}

/**
 * Genera un ID único
 */
export function generateId(): string {
    return Math.random().toString(36).substring(2, 9);
}

/**
 * Debounce para funciones
 */
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;

    return (...args: Parameters<T>) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

/**
 * Deep clone de objetos
 */
export function deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Capitaliza la primera letra
 */
export function capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Formatea número de teléfono mexicano
 */
export function formatPhone(phone: string): string {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
        return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    return phone;
}

/**
 * Valida CURP mexicana
 */
export function validateCURP(curp: string): boolean {
    const regex = /^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9A-Z][0-9]$/;
    return regex.test(curp.toUpperCase());
}

/**
 * Colores para estados
 */
export const statusColors = {
    // Préstamos
    solicitud: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    aprobado: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    activo: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    vencido: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    liquidado: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300',
    cancelado: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500',

    // Pagos
    pendiente: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    procesando: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    completado: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    fallido: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',

    // Riesgo
    bajo: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    medio: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    alto: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    sin_evaluar: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500',
} as const;

/**
 * Etiquetas en español para estados
 */
export const statusLabels = {
    // Préstamos
    solicitud: 'Solicitud',
    aprobado: 'Aprobado',
    activo: 'Activo',
    vencido: 'Vencido',
    liquidado: 'Liquidado',
    cancelado: 'Cancelado',

    // Pagos
    pendiente: 'Pendiente',
    procesando: 'Procesando',
    completado: 'Completado',
    fallido: 'Fallido',
    reembolsado: 'Reembolsado',

    // Frecuencia
    semanal: 'Semanal',
    quincenal: 'Quincenal',
    mensual: 'Mensual',

    // Método pago
    efectivo: 'Efectivo',
    spei: 'SPEI',
    oxxo: 'OXXO',
    codi: 'CoDi',
    tarjeta: 'Tarjeta',
    cheque: 'Cheque',
    otro: 'Otro',

    // Riesgo
    bajo: 'Bajo',
    medio: 'Medio',
    alto: 'Alto',
    sin_evaluar: 'Sin evaluar',
} as const;
