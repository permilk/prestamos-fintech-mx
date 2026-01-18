'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Phone,
    Mail,
    MapPin,
    ChevronLeft,
    ChevronRight,
    X,
    Check,
} from 'lucide-react';
import { cn, formatCurrency, formatPhone } from '@/lib/utils';

// Mock data - will be replaced with API calls
const clientesData = [
    {
        id: '1',
        nombre: 'Juan Pérez García',
        curp: 'PEGJ850512HDFRRL09',
        telefono: '5551234567',
        email: 'juan.perez@email.com',
        direccion: 'Col. Centro, CDMX',
        prestamosActivos: 2,
        montoPendiente: 25000,
        estado: 'activo',
        nivelRiesgo: 'bajo',
    },
    {
        id: '2',
        nombre: 'María García López',
        curp: 'GALM900215MDFRPR01',
        telefono: '5559876543',
        email: 'maria.garcia@email.com',
        direccion: 'Col. Roma, CDMX',
        prestamosActivos: 1,
        montoPendiente: 8000,
        estado: 'activo',
        nivelRiesgo: 'bajo',
    },
    {
        id: '3',
        nombre: 'Carlos López Martínez',
        curp: 'LOMC880720HDFPRR05',
        telefono: '5552468135',
        email: 'carlos.lopez@email.com',
        direccion: 'Col. Condesa, CDMX',
        prestamosActivos: 1,
        montoPendiente: 45000,
        estado: 'activo',
        nivelRiesgo: 'medio',
    },
    {
        id: '4',
        nombre: 'Ana Rodríguez Sánchez',
        curp: 'ROSA920830MDFDNL08',
        telefono: '5553691472',
        email: 'ana.rodriguez@email.com',
        direccion: 'Col. Polanco, CDMX',
        prestamosActivos: 0,
        montoPendiente: 0,
        estado: 'inactivo',
        nivelRiesgo: 'sin_evaluar',
    },
    {
        id: '5',
        nombre: 'Roberto Hernández Díaz',
        curp: 'HEDR780415HDFRZB02',
        telefono: '5557894561',
        email: 'roberto.hernandez@email.com',
        direccion: 'Col. Del Valle, CDMX',
        prestamosActivos: 3,
        montoPendiente: 75000,
        estado: 'activo',
        nivelRiesgo: 'alto',
    },
    {
        id: '6',
        nombre: 'Patricia Sánchez Ruiz',
        curp: 'SARP880310MDFNZR04',
        telefono: '5558527413',
        email: 'patricia.sanchez@email.com',
        direccion: 'Col. Narvarte, CDMX',
        prestamosActivos: 1,
        montoPendiente: 15000,
        estado: 'moroso',
        nivelRiesgo: 'alto',
    },
    {
        id: '7',
        nombre: 'Fernando Ruiz Castro',
        curp: 'RUCF920625HDFZSR08',
        telefono: '5556349821',
        email: 'fernando.ruiz@email.com',
        direccion: 'Col. Coyoacán, CDMX',
        prestamosActivos: 2,
        montoPendiente: 32000,
        estado: 'activo',
        nivelRiesgo: 'medio',
    },
];

const riesgoColors = {
    bajo: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    medio: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    alto: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    sin_evaluar: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500',
};

const riesgoLabels = {
    bajo: 'Bajo',
    medio: 'Medio',
    alto: 'Alto',
    sin_evaluar: 'Sin evaluar',
};

const estadoColors = {
    activo: 'bg-green-100 text-green-700',
    inactivo: 'bg-gray-100 text-gray-500',
    moroso: 'bg-red-100 text-red-700',
};

export default function ClientesPage() {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [showFilters, setShowFilters] = React.useState(false);
    const [filters, setFilters] = React.useState({
        estado: [] as string[],
        riesgo: [] as string[],
        conDeuda: 'todos' as 'todos' | 'con_deuda' | 'sin_deuda',
    });

    // Count active filters
    const activeFilterCount = filters.estado.length + filters.riesgo.length + (filters.conDeuda !== 'todos' ? 1 : 0);

    const toggleEstadoFilter = (estado: string) => {
        setFilters(prev => ({
            ...prev,
            estado: prev.estado.includes(estado)
                ? prev.estado.filter(e => e !== estado)
                : [...prev.estado, estado]
        }));
    };

    const toggleRiesgoFilter = (riesgo: string) => {
        setFilters(prev => ({
            ...prev,
            riesgo: prev.riesgo.includes(riesgo)
                ? prev.riesgo.filter(r => r !== riesgo)
                : [...prev.riesgo, riesgo]
        }));
    };

    const clearFilters = () => {
        setFilters({
            estado: [],
            riesgo: [],
            conDeuda: 'todos',
        });
    };

    const filteredClientes = clientesData.filter(c => {
        // Search filter
        const matchesSearch = c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.curp.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.telefono.includes(searchTerm);

        // Estado filter
        const matchesEstado = filters.estado.length === 0 || filters.estado.includes(c.estado);

        // Riesgo filter
        const matchesRiesgo = filters.riesgo.length === 0 || filters.riesgo.includes(c.nivelRiesgo);

        // Deuda filter
        const matchesDeuda = filters.conDeuda === 'todos' ||
            (filters.conDeuda === 'con_deuda' && c.montoPendiente > 0) ||
            (filters.conDeuda === 'sin_deuda' && c.montoPendiente === 0);

        return matchesSearch && matchesEstado && matchesRiesgo && matchesDeuda;
    });

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
                        👥 Clientes
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Gestiona tu cartera de clientes
                    </p>
                </div>
                <Link href="/clientes/nuevo">
                    <Button>
                        <Plus className="h-4 w-4" />
                        Nuevo Cliente
                    </Button>
                </Link>
            </div>

            {/* Search and Filters */}
            <Card>
                <CardContent className="py-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="flex-1">
                            <Input
                                placeholder="Buscar por nombre, CURP o teléfono..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                leftIcon={<Search className="h-4 w-4" />}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={showFilters ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <Filter className="h-4 w-4" />
                                Filtros
                                {activeFilterCount > 0 && (
                                    <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-primary-600 text-xs font-bold">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Filter Panel */}
                    {showFilters && (
                        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 animate-fade-in">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-medium text-gray-900 dark:text-white">Filtros Avanzados</h3>
                                {activeFilterCount > 0 && (
                                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                                        <X className="h-4 w-4" />
                                        Limpiar filtros
                                    </Button>
                                )}
                            </div>

                            <div className="grid gap-6 sm:grid-cols-3">
                                {/* Estado Filter */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                        Estado del Cliente
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            { value: 'activo', label: 'Activo', color: 'bg-green-500' },
                                            { value: 'inactivo', label: 'Inactivo', color: 'bg-gray-400' },
                                            { value: 'moroso', label: 'Moroso', color: 'bg-red-500' },
                                        ].map(estado => (
                                            <button
                                                key={estado.value}
                                                onClick={() => toggleEstadoFilter(estado.value)}
                                                className={cn(
                                                    'flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-all',
                                                    filters.estado.includes(estado.value)
                                                        ? 'bg-primary-100 text-primary-700 ring-2 ring-primary-500 dark:bg-primary-900 dark:text-primary-300'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
                                                )}
                                            >
                                                <span className={cn('h-2 w-2 rounded-full', estado.color)} />
                                                {estado.label}
                                                {filters.estado.includes(estado.value) && (
                                                    <Check className="h-3.5 w-3.5" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Riesgo Filter */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                        Nivel de Riesgo
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            { value: 'bajo', label: 'Bajo', color: 'bg-green-500' },
                                            { value: 'medio', label: 'Medio', color: 'bg-yellow-500' },
                                            { value: 'alto', label: 'Alto', color: 'bg-red-500' },
                                            { value: 'sin_evaluar', label: 'Sin evaluar', color: 'bg-gray-400' },
                                        ].map(riesgo => (
                                            <button
                                                key={riesgo.value}
                                                onClick={() => toggleRiesgoFilter(riesgo.value)}
                                                className={cn(
                                                    'flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-all',
                                                    filters.riesgo.includes(riesgo.value)
                                                        ? 'bg-primary-100 text-primary-700 ring-2 ring-primary-500 dark:bg-primary-900 dark:text-primary-300'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
                                                )}
                                            >
                                                <span className={cn('h-2 w-2 rounded-full', riesgo.color)} />
                                                {riesgo.label}
                                                {filters.riesgo.includes(riesgo.value) && (
                                                    <Check className="h-3.5 w-3.5" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Deuda Filter */}
                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                        Saldo Pendiente
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            { value: 'todos', label: 'Todos' },
                                            { value: 'con_deuda', label: 'Con deuda' },
                                            { value: 'sin_deuda', label: 'Sin deuda' },
                                        ].map(option => (
                                            <button
                                                key={option.value}
                                                onClick={() => setFilters(prev => ({ ...prev, conDeuda: option.value as any }))}
                                                className={cn(
                                                    'rounded-full px-3 py-1.5 text-sm font-medium transition-all',
                                                    filters.conDeuda === option.value
                                                        ? 'bg-primary-500 text-white'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
                                                )}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Results count */}
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-sm text-gray-500">
                                    <span className="font-semibold text-gray-900 dark:text-white">{filteredClientes.length}</span> clientes encontrados
                                    {activeFilterCount > 0 && (
                                        <span> con los filtros aplicados</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Clients Table */}
            <Card padding="none">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Cliente
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Contacto
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Préstamos
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Saldo Pendiente
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Riesgo
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {filteredClientes.map((cliente) => (
                                <tr
                                    key={cliente.id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600 font-semibold dark:bg-primary-900 dark:text-primary-300">
                                                {cliente.nombre.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                            </div>
                                            <div>
                                                <Link
                                                    href={`/clientes/${cliente.id}`}
                                                    className="font-medium text-gray-900 dark:text-white hover:text-primary-500"
                                                >
                                                    {cliente.nombre}
                                                </Link>
                                                <p className="text-xs text-gray-500 font-mono">{cliente.curp}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                                                <Phone className="h-3.5 w-3.5" />
                                                {formatPhone(cliente.telefono)}
                                            </div>
                                            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                                                <Mail className="h-3.5 w-3.5" />
                                                {cliente.email}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {cliente.prestamosActivos}
                                        </span>
                                        <span className="text-gray-500"> activos</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-mono font-semibold text-gray-900 dark:text-white">
                                            {formatCurrency(cliente.montoPendiente)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={cn(
                                            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                                            riesgoColors[cliente.nivelRiesgo as keyof typeof riesgoColors]
                                        )}>
                                            {riesgoLabels[cliente.nivelRiesgo as keyof typeof riesgoLabels]}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/clientes/${cliente.id}`}>
                                                <Button variant="ghost" size="sm">Ver</Button>
                                            </Link>
                                            <Link href={`/prestamos/nuevo?cliente=${cliente.id}`}>
                                                <Button variant="outline" size="sm">
                                                    <Plus className="h-3 w-3" />
                                                    Préstamo
                                                </Button>
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredClientes.length === 0 && (
                    <div className="py-12 text-center">
                        <div className="text-4xl mb-4">🔍</div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            No se encontraron clientes
                        </h3>
                        <p className="text-gray-500">
                            Intenta ajustar los filtros o el término de búsqueda
                        </p>
                        {activeFilterCount > 0 && (
                            <Button variant="outline" size="sm" className="mt-4" onClick={clearFilters}>
                                Limpiar filtros
                            </Button>
                        )}
                    </div>
                )}

                {/* Pagination */}
                {filteredClientes.length > 0 && (
                    <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4 dark:border-gray-700">
                        <p className="text-sm text-gray-500">
                            Mostrando <span className="font-medium">1-{filteredClientes.length}</span> de{' '}
                            <span className="font-medium">{filteredClientes.length}</span> clientes
                        </p>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" disabled>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" disabled>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}
