/**
 * Exportación de todos los tipos del sistema
 */

export * from './loan';
export * from './client';
export * from './payment';

// Tipos generales
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        total: number;
        pagina: number;
        limite: number;
        totalPaginas: number;
    };
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: Record<string, string[]>;
    };
}

export interface Usuario {
    id: string;
    email: string;
    nombre: string;
    rol: 'admin' | 'gerente' | 'cobrador' | 'cajero' | 'consulta';
    activo: boolean;
    permisos: string[];
    avatar?: string;
    sucursalId?: string;
    ultimoAcceso?: Date;
}

export interface ConfiguracionEmpresa {
    id: string;
    nombreEmpresa: string;
    rfc: string;
    direccion: string;
    telefono: string;
    email: string;
    logo?: string;
    moneda: string;
    zonaHoraria: string;
    esZonaFronteriza: boolean;

    // Configuración de préstamos
    tasaInteresDefault: number;
    plazoMaximo: number;
    montoMinimo: number;
    montoMaximo: number;
    diasGraciaDefault: number;
    tasaMoraDefault: number;

    // Notificaciones
    emailNotificaciones: boolean;
    smsNotificaciones: boolean;
    whatsappNotificaciones: boolean;

    // Pagos
    clabeEmpresa?: string;
    bancoEmpresa?: string;
    oxxoActivo: boolean;
    codiActivo: boolean;
}

export interface Notificacion {
    id: string;
    usuarioId: string;
    tipo: 'info' | 'warning' | 'error' | 'success';
    titulo: string;
    mensaje: string;
    link?: string;
    leida: boolean;
    createdAt: Date;
}

export interface EstadisticasDashboard {
    prestamos: {
        activos: number;
        vencidos: number;
        liquidados: number;
        montoPendiente: number;
    };
    pagos: {
        recibidosHoy: number;
        montoHoy: number;
        esperadosHoy: number;
    };
    clientes: {
        total: number;
        activos: number;
        nuevos: number;
        enMora: number;
    };
    cartera: {
        totalPrestado: number;
        totalRecuperado: number;
        tasaRecuperacion: number;
        morosidad: number;
    };
    graficos: {
        pagosUltimos7Dias: { fecha: string; monto: number }[];
        estadoCartera: { estado: string; cantidad: number; monto: number }[];
        clientesPorMes: { mes: string; nuevos: number }[];
    };
}
