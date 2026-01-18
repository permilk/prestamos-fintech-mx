'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, Building, DollarSign, Bell, CreditCard, Shield } from 'lucide-react';

export default function ConfiguracionPage() {
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLoading(false);
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-4xl">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
                    ⚙️ Configuración
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Configura los parámetros del sistema
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Company Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Building className="h-5 w-5 text-primary-500" />
                            Información de la Empresa
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6 sm:grid-cols-2">
                        <Input
                            label="Nombre de la Empresa"
                            defaultValue="Préstamos Fintech MX"
                            required
                        />
                        <Input
                            label="RFC"
                            defaultValue="XYZ010101ABC"
                            required
                        />
                        <Input
                            label="Teléfono"
                            type="tel"
                            defaultValue="55 1234 5678"
                        />
                        <Input
                            label="Email"
                            type="email"
                            defaultValue="contacto@empresa.com"
                        />
                        <Input
                            label="Dirección"
                            defaultValue="Av. Reforma 123, CDMX"
                            className="sm:col-span-2"
                        />
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Zona Fiscal
                            </label>
                            <select
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-800"
                                defaultValue="general"
                            >
                                <option value="general">General (IVA 16%)</option>
                                <option value="frontera">Zona Fronteriza (IVA 8%)</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {/* Loan Defaults */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <DollarSign className="h-5 w-5 text-primary-500" />
                            Configuración de Préstamos
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <Input
                            label="Tasa de Interés por Defecto (%)"
                            type="number"
                            step="0.1"
                            defaultValue="20"
                        />
                        <Input
                            label="Plazo Máximo (meses)"
                            type="number"
                            defaultValue="24"
                        />
                        <Input
                            label="Monto Mínimo"
                            type="number"
                            defaultValue="1000"
                            leftIcon={<span className="text-gray-500">$</span>}
                        />
                        <Input
                            label="Monto Máximo"
                            type="number"
                            defaultValue="100000"
                            leftIcon={<span className="text-gray-500">$</span>}
                        />
                        <Input
                            label="Días de Gracia"
                            type="number"
                            defaultValue="3"
                        />
                        <Input
                            label="Tasa de Mora Diaria (%)"
                            type="number"
                            step="0.01"
                            defaultValue="0.1"
                        />
                    </CardContent>
                </Card>

                {/* Payment Methods */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <CreditCard className="h-5 w-5 text-primary-500" />
                            Métodos de Pago
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-6 sm:grid-cols-2">
                            <Input
                                label="CLABE para SPEI"
                                defaultValue="012180001234567890"
                                hint="18 dígitos"
                            />
                            <Input
                                label="Banco"
                                defaultValue="BBVA México"
                            />
                        </div>

                        <div className="space-y-3">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Métodos Habilitados
                            </p>
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                                {[
                                    { id: 'efectivo', label: 'Efectivo', enabled: true },
                                    { id: 'spei', label: 'SPEI', enabled: true },
                                    { id: 'oxxo', label: 'OXXO Pay', enabled: true },
                                    { id: 'codi', label: 'CoDi/DiMo', enabled: false },
                                ].map((metodo) => (
                                    <label key={metodo.id} className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 cursor-pointer hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                                        <input
                                            type="checkbox"
                                            defaultChecked={metodo.enabled}
                                            className="h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                                        />
                                        <span className="text-sm font-medium">{metodo.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Notifications */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Bell className="h-5 w-5 text-primary-500" />
                            Notificaciones
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {[
                                { id: 'email', label: 'Notificaciones por Email', enabled: true },
                                { id: 'sms', label: 'Notificaciones por SMS', enabled: false },
                                { id: 'whatsapp', label: 'Notificaciones por WhatsApp', enabled: true },
                                { id: 'recordatorio', label: 'Recordatorio de pago (3 días antes)', enabled: true },
                                { id: 'vencimiento', label: 'Alerta de vencimiento', enabled: true },
                            ].map((notif) => (
                                <label key={notif.id} className="flex items-center justify-between rounded-lg border border-gray-200 p-4 cursor-pointer hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                                    <span className="text-sm font-medium">{notif.label}</span>
                                    <input
                                        type="checkbox"
                                        defaultChecked={notif.enabled}
                                        className="h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                                    />
                                </label>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex justify-end">
                    <Button type="submit" loading={loading}>
                        <Save className="h-4 w-4" />
                        Guardar Configuración
                    </Button>
                </div>
            </form>
        </div>
    );
}
