import { StatsCard } from '@/components/dashboard/stats-card';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
    Users,
    Wallet,
    DollarSign,
    AlertTriangle,
    PiggyBank,
    TrendingUp,
    Plus,
    Package,
    UserPlus,
} from 'lucide-react';

// Mock data - will be replaced with actual API calls
const dashboardData = {
    totales: {
        clientes: 156,
        capitalPendiente: 485750.00,
        totalCobrado: 1250320.50,
        empenosActivos: 23,
        ahorros: 125000.00,
    },
    trends: {
        clientes: { value: 12, isPositive: true },
        capitalPendiente: { value: 8, isPositive: false },
        totalCobrado: { value: 15, isPositive: true },
    },
    prestamosRecientes: [
        { id: 1, cliente: 'Juan Pérez', monto: 15000, estado: 'activo', fecha: '2026-01-15' },
        { id: 2, cliente: 'María García', monto: 8000, estado: 'activo', fecha: '2026-01-14' },
        { id: 3, cliente: 'Carlos López', monto: 25000, estado: 'vencido', fecha: '2026-01-10' },
    ],
    vencidosHoy: 3,
};

export default function DashboardPage() {
    return (
        <div className="space-y-8 animate-fade-in">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
                        Panel de Control
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Bienvenido de vuelta. Aquí está el resumen de tu cartera.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Link href="/clientes/nuevo">
                        <Button variant="outline" size="sm">
                            <UserPlus className="h-4 w-4" />
                            Nuevo Cliente
                        </Button>
                    </Link>
                    <Link href="/prestamos/nuevo">
                        <Button size="sm">
                            <Plus className="h-4 w-4" />
                            Nuevo Préstamo
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                <StatsCard
                    title="Clientes"
                    value={dashboardData.totales.clientes}
                    subtitle="Clientes registrados"
                    icon={<Users className="h-6 w-6" />}
                    trend={dashboardData.trends.clientes}
                    variant="primary"
                />
                <StatsCard
                    title="Capital Pendiente"
                    value={dashboardData.totales.capitalPendiente}
                    subtitle="Dinero en calle"
                    icon={<Wallet className="h-6 w-6" />}
                    trend={dashboardData.trends.capitalPendiente}
                    variant="success"
                />
                <StatsCard
                    title="Total Cobrado"
                    value={dashboardData.totales.totalCobrado}
                    subtitle="Histórico de ingresos"
                    icon={<DollarSign className="h-6 w-6" />}
                    trend={dashboardData.trends.totalCobrado}
                    variant="info"
                />
                <StatsCard
                    title="Empeños Activos"
                    value={dashboardData.totales.empenosActivos}
                    subtitle="Artículos en custodia"
                    icon={<Package className="h-6 w-6" />}
                    variant="warning"
                />
                <StatsCard
                    title="Fondos / Ahorros"
                    value={dashboardData.totales.ahorros}
                    subtitle="Capital captado"
                    icon={<PiggyBank className="h-6 w-6" />}
                    variant="purple"
                />
            </div>

            {/* Alert for overdue loans */}
            {dashboardData.vencidosHoy > 0 && (
                <Card className="border-l-4 border-l-red-500 bg-red-50 dark:bg-red-900/20">
                    <CardContent className="flex items-center gap-4 py-4">
                        <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/50">
                            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-red-800 dark:text-red-200">
                                {dashboardData.vencidosHoy} préstamos vencidos requieren atención
                            </h3>
                            <p className="text-sm text-red-600 dark:text-red-300">
                                Revisa la sección de cobranza para gestionar estos casos.
                            </p>
                        </div>
                        <Link href="/cobranza">
                            <Button variant="danger" size="sm">Ver Cobranza</Button>
                        </Link>
                    </CardContent>
                </Card>
            )}

            {/* Two column layout */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Loans */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-base">Préstamos Recientes</CardTitle>
                        <Link href="/prestamos">
                            <Button variant="ghost" size="sm">Ver todos</Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {dashboardData.prestamosRecientes.map((prestamo) => (
                                <div
                                    key={prestamo.id}
                                    className="flex items-center justify-between rounded-xl bg-gray-50 p-4 dark:bg-gray-800"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-primary-600 font-semibold dark:bg-primary-900 dark:text-primary-300">
                                            {prestamo.cliente.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {prestamo.cliente}
                                            </p>
                                            <p className="text-sm text-gray-500">{prestamo.fecha}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-mono font-semibold text-gray-900 dark:text-white">
                                            ${prestamo.monto.toLocaleString('es-MX')}
                                        </p>
                                        <span
                                            className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${prestamo.estado === 'activo'
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                                : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                                                }`}
                                        >
                                            {prestamo.estado === 'activo' ? 'Activo' : 'Vencido'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Accesos Rápidos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <Link
                                href="/prestamos/nuevo"
                                className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-primary-500 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-primary-500"
                            >
                                <div className="rounded-xl bg-primary-100 p-3 dark:bg-primary-900">
                                    <Plus className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        Nuevo Préstamo
                                    </p>
                                    <p className="text-sm text-gray-500">Registrar salida</p>
                                </div>
                            </Link>

                            <Link
                                href="/empenos/nuevo"
                                className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-amber-500 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-amber-500"
                            >
                                <div className="rounded-xl bg-amber-100 p-3 dark:bg-amber-900">
                                    <Package className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        Nuevo Empeño
                                    </p>
                                    <p className="text-sm text-gray-500">Registrar garantía</p>
                                </div>
                            </Link>

                            <Link
                                href="/clientes/nuevo"
                                className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-emerald-500 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-emerald-500"
                            >
                                <div className="rounded-xl bg-emerald-100 p-3 dark:bg-emerald-900">
                                    <UserPlus className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        Nuevo Cliente
                                    </p>
                                    <p className="text-sm text-gray-500">Registrar persona</p>
                                </div>
                            </Link>

                            <Link
                                href="/simulador"
                                className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-violet-500 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-violet-500"
                            >
                                <div className="rounded-xl bg-violet-100 p-3 dark:bg-violet-900">
                                    <TrendingUp className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        Simulador
                                    </p>
                                    <p className="text-sm text-gray-500">Calcular préstamo</p>
                                </div>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
