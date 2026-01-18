'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
    ArrowLeft,
    Edit,
    Phone,
    Mail,
    MapPin,
    Briefcase,
    Plus,
    FileText,
    Clock,
} from 'lucide-react';
import { cn, formatCurrency, formatDate, formatPhone } from '@/lib/utils';

// Mock client data
const clienteData = {
    id: '1',
    nombre: 'Juan',
    apellidoPaterno: 'Pérez',
    apellidoMaterno: 'García',
    curp: 'PEGJ850512HDFRRL09',
    rfc: 'PEGJ850512AB1',
    fechaNacimiento: '1985-05-12',
    genero: 'M',
    telefono: '5551234567',
    telefonoAlterno: '5559876543',
    email: 'juan.perez@email.com',
    direccion: {
        calle: 'Av. Reforma',
        numeroExterior: '123',
        numeroInterior: '4B',
        colonia: 'Centro',
        municipio: 'Cuauhtémoc',
        estado: 'CDMX',
        codigoPostal: '06000',
    },
    ocupacion: 'Comerciante',
    lugarTrabajo: 'Negocio propio',
    ingresoMensual: 25000,
    fuenteIngresos: 'negocio_propio',
    nivelRiesgo: 'bajo',
    estado: 'activo',
    fechaRegistro: '2025-06-15',
};

const prestamosCliente = [
    { id: '1', monto: 15000, saldoPendiente: 18000, estado: 'activo', fechaCreacion: '2026-01-15' },
    { id: '7', monto: 10000, saldoPendiente: 0, estado: 'liquidado', fechaCreacion: '2025-08-01' },
];

export default function ClienteDetallePage() {
    const cliente = clienteData;
    const nombreCompleto = `${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`;

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/clientes">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-600 font-bold text-xl dark:bg-primary-900 dark:text-primary-300">
                            {cliente.nombre[0]}{cliente.apellidoPaterno[0]}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {nombreCompleto}
                            </h1>
                            <p className="text-sm text-gray-500 font-mono">{cliente.curp}</p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link href={`/prestamos/nuevo?cliente=${cliente.id}`}>
                        <Button>
                            <Plus className="h-4 w-4" />
                            Nuevo Préstamo
                        </Button>
                    </Link>
                    <Button variant="outline">
                        <Edit className="h-4 w-4" />
                        Editar
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Contact Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Información de Contacto</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                                <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Teléfono Principal</p>
                                <p className="font-medium">{formatPhone(cliente.telefono)}</p>
                            </div>
                        </div>
                        {cliente.telefonoAlterno && (
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                                    <Phone className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Teléfono Alterno</p>
                                    <p className="font-medium">{formatPhone(cliente.telefonoAlterno)}</p>
                                </div>
                            </div>
                        )}
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                                <Mail className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium">{cliente.email}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-900">
                                <MapPin className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Dirección</p>
                                <p className="font-medium">
                                    {cliente.direccion.calle} {cliente.direccion.numeroExterior}
                                    {cliente.direccion.numeroInterior && `, Int. ${cliente.direccion.numeroInterior}`}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {cliente.direccion.colonia}, {cliente.direccion.municipio}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {cliente.direccion.estado}, C.P. {cliente.direccion.codigoPostal}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Economic Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Información Económica</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-full bg-violet-100 p-2 dark:bg-violet-900">
                                <Briefcase className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Ocupación</p>
                                <p className="font-medium">{cliente.ocupacion}</p>
                            </div>
                        </div>
                        <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                            <p className="text-sm text-gray-500 mb-1">Ingreso Mensual</p>
                            <p className="text-2xl font-bold font-mono text-primary-600">
                                {formatCurrency(cliente.ingresoMensual)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-2">Nivel de Riesgo</p>
                            <span className={cn(
                                'inline-flex items-center rounded-full px-3 py-1 text-sm font-medium',
                                cliente.nivelRiesgo === 'bajo' && 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
                                cliente.nivelRiesgo === 'medio' && 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
                                cliente.nivelRiesgo === 'alto' && 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
                            )}>
                                Riesgo {cliente.nivelRiesgo.charAt(0).toUpperCase() + cliente.nivelRiesgo.slice(1)}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Status & Stats */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Resumen</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-900/20 text-center">
                                <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    {prestamosCliente.filter(p => p.estado === 'activo').length}
                                </p>
                                <p className="text-xs text-blue-600/70">Préstamos Activos</p>
                            </div>
                            <div className="rounded-xl bg-green-50 p-4 dark:bg-green-900/20 text-center">
                                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    {prestamosCliente.filter(p => p.estado === 'liquidado').length}
                                </p>
                                <p className="text-xs text-green-600/70">Liquidados</p>
                            </div>
                        </div>
                        <div className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                            <p className="text-sm text-gray-500 mb-1">Saldo Pendiente Total</p>
                            <p className="text-2xl font-bold font-mono">
                                {formatCurrency(prestamosCliente.reduce((sum, p) => sum + p.saldoPendiente, 0))}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Clock className="h-4 w-4" />
                            Cliente desde {formatDate(cliente.fechaRegistro, { short: true })}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Loans History */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary-500" />
                        Historial de Préstamos
                    </CardTitle>
                    <Link href={`/prestamos/nuevo?cliente=${cliente.id}`}>
                        <Button size="sm">
                            <Plus className="h-4 w-4" />
                            Nuevo
                        </Button>
                    </Link>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {prestamosCliente.map((prestamo) => (
                            <Link
                                key={prestamo.id}
                                href={`/prestamos/${prestamo.id}`}
                                className="flex items-center justify-between rounded-xl bg-gray-50 p-4 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        'flex h-10 w-10 items-center justify-center rounded-full font-mono text-sm font-bold',
                                        prestamo.estado === 'activo' && 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400',
                                        prestamo.estado === 'liquidado' && 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400',
                                    )}>
                                        #{prestamo.id}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {formatCurrency(prestamo.monto)}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {formatDate(prestamo.fechaCreacion, { short: true })}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={cn(
                                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                                        prestamo.estado === 'activo' && 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
                                        prestamo.estado === 'liquidado' && 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
                                    )}>
                                        {prestamo.estado === 'activo' ? 'Activo' : 'Liquidado'}
                                    </span>
                                    {prestamo.saldoPendiente > 0 && (
                                        <p className="text-sm font-mono text-gray-500 mt-1">
                                            Saldo: {formatCurrency(prestamo.saldoPendiente)}
                                        </p>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
