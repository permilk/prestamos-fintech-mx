'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save, User, Phone, Mail, MapPin, Briefcase } from 'lucide-react';
import Link from 'next/link';

export default function NuevoClientePage() {
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Redirect to clients list
        router.push('/clientes');
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="flex items-center gap-4">
                <Link href="/clientes">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Nuevo Cliente
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Registra los datos del nuevo cliente
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Personal Info */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <User className="h-5 w-5 text-primary-500" />
                            Datos Personales
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6 sm:grid-cols-2">
                        <Input
                            label="CURP"
                            name="curp"
                            placeholder="XXXX000000XXXXXX00"
                            required
                            hint="18 caracteres alfanuméricos"
                        />
                        <Input
                            label="RFC (Opcional)"
                            name="rfc"
                            placeholder="XXXX000000XXX"
                        />
                        <Input
                            label="Nombre(s)"
                            name="nombre"
                            placeholder="Juan"
                            required
                        />
                        <Input
                            label="Apellido Paterno"
                            name="apellidoPaterno"
                            placeholder="Pérez"
                            required
                        />
                        <Input
                            label="Apellido Materno"
                            name="apellidoMaterno"
                            placeholder="García"
                        />
                        <Input
                            label="Fecha de Nacimiento"
                            name="fechaNacimiento"
                            type="date"
                            required
                        />
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Género <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="genero"
                                required
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-800"
                            >
                                <option value="">Seleccionar...</option>
                                <option value="M">Masculino</option>
                                <option value="F">Femenino</option>
                                <option value="O">Otro</option>
                            </select>
                        </div>
                    </CardContent>
                </Card>

                {/* Contact Info */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Phone className="h-5 w-5 text-primary-500" />
                            Información de Contacto
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6 sm:grid-cols-2">
                        <Input
                            label="Teléfono Principal"
                            name="telefono"
                            type="tel"
                            placeholder="55 1234 5678"
                            required
                        />
                        <Input
                            label="Teléfono Alterno"
                            name="telefonoAlterno"
                            type="tel"
                            placeholder="55 8765 4321"
                        />
                        <Input
                            label="Correo Electrónico"
                            name="email"
                            type="email"
                            placeholder="cliente@email.com"
                            required
                            className="sm:col-span-2"
                        />
                    </CardContent>
                </Card>

                {/* Address */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <MapPin className="h-5 w-5 text-primary-500" />
                            Domicilio
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <Input
                            label="Código Postal"
                            name="codigoPostal"
                            placeholder="01000"
                            required
                        />
                        <Input
                            label="Estado"
                            name="estado"
                            placeholder="Ciudad de México"
                            required
                        />
                        <Input
                            label="Municipio/Alcaldía"
                            name="municipio"
                            placeholder="Benito Juárez"
                            required
                        />
                        <Input
                            label="Colonia"
                            name="colonia"
                            placeholder="Del Valle"
                            required
                        />
                        <Input
                            label="Calle"
                            name="calle"
                            placeholder="Av. Insurgentes Sur"
                            required
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="No. Ext"
                                name="numeroExterior"
                                placeholder="123"
                                required
                            />
                            <Input
                                label="No. Int"
                                name="numeroInterior"
                                placeholder="4B"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Economic Info */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Briefcase className="h-5 w-5 text-primary-500" />
                            Información Económica
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6 sm:grid-cols-2">
                        <Input
                            label="Ocupación"
                            name="ocupacion"
                            placeholder="Empleado, Comerciante, etc."
                            required
                        />
                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Fuente de Ingresos <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="fuenteIngresos"
                                required
                                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-800"
                            >
                                <option value="">Seleccionar...</option>
                                <option value="empleo">Empleo formal</option>
                                <option value="negocio_propio">Negocio propio</option>
                                <option value="pensiones">Pensiones</option>
                                <option value="remesas">Remesas</option>
                                <option value="otro">Otro</option>
                            </select>
                        </div>
                        <Input
                            label="Ingreso Mensual Aproximado"
                            name="ingresoMensual"
                            type="number"
                            placeholder="15000"
                            required
                            leftIcon={<span className="text-gray-500">$</span>}
                        />
                        <Input
                            label="Lugar de Trabajo"
                            name="lugarTrabajo"
                            placeholder="Nombre de la empresa"
                        />
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <Link href="/clientes">
                        <Button variant="outline" type="button" className="w-full sm:w-auto">
                            Cancelar
                        </Button>
                    </Link>
                    <Button type="submit" loading={loading} className="w-full sm:w-auto">
                        <Save className="h-4 w-4" />
                        Guardar Cliente
                    </Button>
                </div>
            </form>
        </div>
    );
}
