'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Plus, Search, Clock, Eye, HandCoins } from 'lucide-react';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

// Mock data with images
const empenosData = [
    {
        id: '1',
        cliente: 'Juan Pérez García',
        clienteId: '1',
        articulo: 'Anillo de oro 14k con diamante',
        categoria: 'Joyería',
        imagen: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=300&fit=crop',
        valorAvaluo: 15000,
        montoPrestado: 10000,
        fechaEmpeno: '2026-01-10',
        fechaVencimiento: '2026-04-10',
        estado: 'activo',
        diasRestantes: 83,
    },
    {
        id: '2',
        cliente: 'María García López',
        clienteId: '2',
        articulo: 'Laptop MacBook Pro 2024',
        categoria: 'Electrónica',
        imagen: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
        valorAvaluo: 25000,
        montoPrestado: 15000,
        fechaEmpeno: '2026-01-05',
        fechaVencimiento: '2026-04-05',
        estado: 'activo',
        diasRestantes: 78,
    },
    {
        id: '3',
        cliente: 'Carlos López Martínez',
        clienteId: '3',
        articulo: 'Reloj Rolex Submariner',
        categoria: 'Joyería',
        imagen: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
        valorAvaluo: 120000,
        montoPrestado: 80000,
        fechaEmpeno: '2025-12-01',
        fechaVencimiento: '2026-03-01',
        estado: 'proximo_vencer',
        diasRestantes: 43,
    },
    {
        id: '4',
        cliente: 'Ana Rodríguez Sánchez',
        clienteId: '4',
        articulo: 'Cadena de oro 18k',
        categoria: 'Joyería',
        imagen: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=300&fit=crop',
        valorAvaluo: 8500,
        montoPrestado: 5000,
        fechaEmpeno: '2026-01-12',
        fechaVencimiento: '2026-04-12',
        estado: 'activo',
        diasRestantes: 85,
    },
    {
        id: '5',
        cliente: 'Roberto Hernández',
        clienteId: '5',
        articulo: 'iPhone 15 Pro Max 256GB',
        categoria: 'Electrónica',
        imagen: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&h=300&fit=crop',
        valorAvaluo: 18000,
        montoPrestado: 12000,
        fechaEmpeno: '2026-01-08',
        fechaVencimiento: '2026-04-08',
        estado: 'activo',
        diasRestantes: 81,
    },
    {
        id: '6',
        cliente: 'Laura Martínez Ruiz',
        clienteId: '7',
        articulo: 'Consola PlayStation 5',
        categoria: 'Electrónica',
        imagen: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop',
        valorAvaluo: 9000,
        montoPrestado: 6000,
        fechaEmpeno: '2025-11-15',
        fechaVencimiento: '2026-02-15',
        estado: 'vencido',
        diasRestantes: 0,
        diasMora: 2,
    },
];

const estadoColors = {
    activo: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    proximo_vencer: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
    vencido: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    rescatado: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    comercializado: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

const estadoLabels = {
    activo: 'Activo',
    proximo_vencer: 'Próximo a Vencer',
    vencido: 'Vencido',
    rescatado: 'Rescatado',
    comercializado: 'Comercializado',
};

export default function EmpenosPage() {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [filtro, setFiltro] = React.useState<string>('todos');

    const filteredEmpenos = empenosData.filter(e => {
        const matchesSearch = e.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.articulo.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFiltro = filtro === 'todos' || e.estado === filtro;
        return matchesSearch && matchesFiltro;
    });

    const totalPrestado = empenosData.reduce((sum, e) => e.estado !== 'rescatado' ? sum + e.montoPrestado : sum, 0);
    const totalAvaluo = empenosData.reduce((sum, e) => e.estado !== 'rescatado' ? sum + e.valorAvaluo : sum, 0);

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
                        📦 Empeños
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Gestiona artículos en garantía
                    </p>
                </div>
                <Link href="/empenos/nuevo">
                    <Button>
                        <Plus className="h-4 w-4" />
                        Nuevo Empeño
                    </Button>
                </Link>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-4">
                <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
                    <CardContent className="py-4">
                        <p className="text-sm text-white/80">En Custodia</p>
                        <p className="text-2xl font-bold">{empenosData.filter(e => e.estado === 'activo' || e.estado === 'proximo_vencer').length}</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <CardContent className="py-4">
                        <p className="text-sm text-white/80">Capital Prestado</p>
                        <p className="text-2xl font-bold font-mono">{formatCurrency(totalPrestado)}</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                    <CardContent className="py-4">
                        <p className="text-sm text-white/80">Valor Avalúos</p>
                        <p className="text-2xl font-bold font-mono">{formatCurrency(totalAvaluo)}</p>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
                    <CardContent className="py-4">
                        <p className="text-sm text-white/80">Vencidos</p>
                        <p className="text-2xl font-bold">{empenosData.filter(e => e.estado === 'vencido').length}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Search and Filters */}
            <Card>
                <CardContent className="py-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                        <div className="flex-1">
                            <Input
                                placeholder="Buscar por cliente o artículo..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                leftIcon={<Search className="h-4 w-4" />}
                            />
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {['todos', 'activo', 'proximo_vencer', 'vencido'].map((estado) => (
                                <button
                                    key={estado}
                                    onClick={() => setFiltro(estado)}
                                    className={cn(
                                        'rounded-full px-3 py-1.5 text-xs font-medium transition-all',
                                        filtro === estado
                                            ? 'bg-primary-500 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400'
                                    )}
                                >
                                    {estado === 'todos' ? 'Todos' :
                                        estado === 'proximo_vencer' ? 'Por Vencer' :
                                            estadoLabels[estado as keyof typeof estadoLabels]}
                                </button>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Grid of items */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredEmpenos.map((empeno) => (
                    <Card key={empeno.id} hover className="overflow-hidden">
                        {/* Image */}
                        <div className="aspect-video bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
                            <img
                                src={empeno.imagen}
                                alt={empeno.articulo}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-2 right-2">
                                <span className={cn(
                                    'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium shadow-lg',
                                    estadoColors[empeno.estado as keyof typeof estadoColors]
                                )}>
                                    {estadoLabels[empeno.estado as keyof typeof estadoLabels]}
                                </span>
                            </div>
                        </div>

                        <CardContent className="pt-4">
                            <div className="flex items-start justify-between mb-2">
                                <span className="text-xs text-gray-500 font-mono">#{empeno.id.padStart(4, '0')}</span>
                                <span className="text-xs text-gray-500">{empeno.categoria}</span>
                            </div>

                            <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                                {empeno.articulo}
                            </h3>

                            <Link
                                href={`/clientes/${empeno.clienteId}`}
                                className="text-sm text-primary-500 hover:underline"
                            >
                                {empeno.cliente}
                            </Link>

                            <div className="mt-4 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-gray-500">Avalúo</p>
                                    <p className="font-mono font-semibold text-gray-900 dark:text-white">
                                        {formatCurrency(empeno.valorAvaluo)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Prestado</p>
                                    <p className="font-mono font-semibold text-primary-600">
                                        {formatCurrency(empeno.montoPrestado)}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4 text-gray-400" />
                                {empeno.estado === 'vencido' ? (
                                    <span className="text-red-600 font-medium">
                                        {empeno.diasMora} días en mora
                                    </span>
                                ) : (
                                    <span className={cn(
                                        empeno.diasRestantes < 30 ? 'text-yellow-600 font-medium' : 'text-gray-600 dark:text-gray-400'
                                    )}>
                                        {empeno.diasRestantes} días restantes
                                    </span>
                                )}
                            </div>

                            <div className="mt-4 flex gap-2">
                                <Link href={`/empenos/${empeno.id}`} className="flex-1">
                                    <Button variant="outline" size="sm" className="w-full">
                                        <Eye className="h-4 w-4" />
                                        Ver Detalles
                                    </Button>
                                </Link>
                                <Link href={`/pagos/nuevo?empeno=${empeno.id}`} className="flex-1">
                                    <Button size="sm" variant={empeno.estado === 'vencido' ? 'danger' : 'default'} className="w-full">
                                        <HandCoins className="h-4 w-4" />
                                        Rescatar
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredEmpenos.length === 0 && (
                <Card className="py-12 text-center">
                    <CardContent>
                        <div className="text-6xl mb-4">📦</div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            No se encontraron empeños
                        </h3>
                        <p className="text-gray-500 mt-1">Intenta con otros criterios de búsqueda</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
