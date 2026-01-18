/**
 * Tipos para el módulo de Clientes
 */

export type EstadoCliente = 'activo' | 'inactivo' | 'bloqueado' | 'prospecto';

export type NivelRiesgo = 'bajo' | 'medio' | 'alto' | 'sin_evaluar';

export type FuenteIngresos = 'empleo' | 'negocio_propio' | 'pensiones' | 'remesas' | 'otro';

export interface Cliente {
    id: string;

    // Identificación
    curp: string;
    rfc?: string;
    ine?: string;

    // Datos personales
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno?: string;
    nombreCompleto: string;
    fechaNacimiento: Date;
    genero: 'M' | 'F' | 'O';
    nacionalidad: string;

    // Contacto
    telefono: string;
    telefonoAlterno?: string;
    email: string;

    // Domicilio
    codigoPostal: string;
    estado: string;
    municipio: string;
    colonia: string;
    calle: string;
    numeroExterior: string;
    numeroInterior?: string;
    referenciaDomicilio?: string;

    // Información económica (KYC)
    ocupacion: string;
    lugarTrabajo?: string;
    antiguedadLaboral?: number; // en meses
    fuenteIngresos: FuenteIngresos;
    ingresoMensual: number;
    gastosMensuales?: number;

    // Evaluación crediticia
    nivelRiesgo: NivelRiesgo;
    scoreInterno?: number;
    limiteCredito: number;
    creditoDisponible: number;

    // Documentos
    fotoCliente?: string;
    ineFrente?: string;
    ineReverso?: string;
    comprobanteDomicilio?: string;
    comprobanteIngresos?: string;

    // Estado
    estado_cuenta: EstadoCliente;
    fechaRegistro: Date;
    fechaUltimaActividad: Date;

    // Historial
    totalPrestamos: number;
    prestamosActivos: number;
    montoTotalPrestado: number;
    montoPendiente: number;
    diasMaxMora: number;

    // Referencias
    referencias: ReferenciaPersonal[];

    // Metadatos
    creadoPor: string;
    notas?: string;
    etiquetas?: string[];

    createdAt: Date;
    updatedAt: Date;
}

export interface ReferenciaPersonal {
    id: string;
    nombre: string;
    telefono: string;
    relacion: 'familiar' | 'amigo' | 'laboral' | 'otro';
    notas?: string;
}

export interface ClienteFormInput {
    // Datos básicos
    curp: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno?: string;
    fechaNacimiento: Date;
    genero: 'M' | 'F' | 'O';

    // Contacto
    telefono: string;
    telefonoAlterno?: string;
    email: string;

    // Domicilio
    codigoPostal: string;
    estado: string;
    municipio: string;
    colonia: string;
    calle: string;
    numeroExterior: string;
    numeroInterior?: string;

    // Económico
    ocupacion: string;
    fuenteIngresos: FuenteIngresos;
    ingresoMensual: number;

    // Referencias
    referencias?: ReferenciaPersonal[];
}

export interface FiltroClientes {
    estado?: EstadoCliente;
    nivelRiesgo?: NivelRiesgo;
    busqueda?: string;
    conPrestamosActivos?: boolean;
    enMora?: boolean;
    pagina?: number;
    limite?: number;
    ordenarPor?: 'nombre' | 'fecha' | 'montoPendiente';
    ordenDireccion?: 'asc' | 'desc';
}

export interface ResumenCliente {
    totalClientes: number;
    clientesActivos: number;
    clientesEnMora: number;
    clientesNuevosMes: number;
    promedioSaldoPendiente: number;
}
