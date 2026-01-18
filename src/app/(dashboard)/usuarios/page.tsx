'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Plus, Search, Shield, Edit, Trash2, MoreHorizontal, X, Check, Power, Eye, Key } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock data
const initialUsuarios = [
    {
        id: '1',
        nombre: 'Administrador Sistema',
        email: 'admin@sistema.com',
        rol: 'admin',
        activo: true,
        ultimoAcceso: '2026-01-17T12:00:00',
    },
    {
        id: '2',
        nombre: 'Juan Gerente',
        email: 'gerente@sistema.com',
        rol: 'gerente',
        activo: true,
        ultimoAcceso: '2026-01-17T10:30:00',
    },
    {
        id: '3',
        nombre: 'María Cajera',
        email: 'cajero@sistema.com',
        rol: 'cajero',
        activo: true,
        ultimoAcceso: '2026-01-16T18:00:00',
    },
    {
        id: '4',
        nombre: 'Pedro Cobrador',
        email: 'cobrador@sistema.com',
        rol: 'cobrador',
        activo: false,
        ultimoAcceso: '2026-01-10T09:00:00',
    },
];

const rolColors = {
    admin: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    gerente: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    cajero: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    cobrador: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
    consulta: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

const rolLabels = {
    admin: 'Administrador',
    gerente: 'Gerente',
    cajero: 'Cajero',
    cobrador: 'Cobrador',
    consulta: 'Consulta',
};

// Modal Component
function Modal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />
            <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800 animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

// Dropdown Menu Component
function DropdownMenu({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) {
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                onClose();
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div ref={ref} className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800 z-10 animate-fade-in">
            {children}
        </div>
    );
}

type Usuario = typeof initialUsuarios[0];

export default function UsuariosPage() {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [usuarios, setUsuarios] = React.useState(initialUsuarios);
    const [showCreateModal, setShowCreateModal] = React.useState(false);
    const [editingUser, setEditingUser] = React.useState<Usuario | null>(null);
    const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);
    const [successMessage, setSuccessMessage] = React.useState('');

    // Form state
    const [formData, setFormData] = React.useState({
        nombre: '',
        email: '',
        rol: 'cajero',
        password: '',
    });

    const showSuccess = (msg: string) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const filteredUsuarios = usuarios.filter(u =>
        u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreateUser = () => {
        const newUser = {
            id: Date.now().toString(),
            nombre: formData.nombre,
            email: formData.email,
            rol: formData.rol,
            activo: true,
            ultimoAcceso: new Date().toISOString(),
        };
        setUsuarios([...usuarios, newUser]);
        setShowCreateModal(false);
        setFormData({ nombre: '', email: '', rol: 'cajero', password: '' });
        showSuccess('¡Usuario creado exitosamente!');
    };

    const handleUpdateUser = () => {
        if (!editingUser) return;
        setUsuarios(usuarios.map(u =>
            u.id === editingUser.id
                ? { ...u, nombre: formData.nombre, email: formData.email, rol: formData.rol }
                : u
        ));
        setEditingUser(null);
        setFormData({ nombre: '', email: '', rol: 'cajero', password: '' });
        showSuccess('¡Usuario actualizado exitosamente!');
    };

    const handleToggleActive = (userId: string) => {
        setUsuarios(usuarios.map(u =>
            u.id === userId ? { ...u, activo: !u.activo } : u
        ));
        setActiveDropdown(null);
        const usuario = usuarios.find(u => u.id === userId);
        showSuccess(usuario?.activo ? 'Usuario desactivado' : 'Usuario activado');
    };

    const handleDeleteUser = (userId: string) => {
        if (confirm('¿Estás seguro de eliminar este usuario?')) {
            setUsuarios(usuarios.filter(u => u.id !== userId));
            setActiveDropdown(null);
            showSuccess('Usuario eliminado');
        }
    };

    const openEditModal = (user: Usuario) => {
        setFormData({
            nombre: user.nombre,
            email: user.email,
            rol: user.rol,
            password: '',
        });
        setEditingUser(user);
    };

    const openCreateModal = () => {
        setFormData({ nombre: '', email: '', rol: 'cajero', password: '' });
        setShowCreateModal(true);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Success Toast */}
            {successMessage && (
                <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-xl bg-green-500 px-4 py-3 text-white shadow-lg animate-fade-in">
                    <Check className="h-5 w-5" />
                    {successMessage}
                </div>
            )}

            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white md:text-3xl">
                        🔐 Usuarios
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Administra usuarios y permisos del sistema
                    </p>
                </div>
                <Button onClick={openCreateModal}>
                    <Plus className="h-4 w-4" />
                    Nuevo Usuario
                </Button>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="py-4">
                    <Input
                        placeholder="Buscar por nombre o email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        leftIcon={<Search className="h-4 w-4" />}
                    />
                </CardContent>
            </Card>

            {/* Users Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredUsuarios.map((usuario) => (
                    <Card key={usuario.id}>
                        <CardContent className="py-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        'flex h-12 w-12 items-center justify-center rounded-full font-bold text-lg',
                                        usuario.activo
                                            ? 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300'
                                            : 'bg-gray-100 text-gray-400 dark:bg-gray-800'
                                    )}>
                                        {usuario.nombre.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                    </div>
                                    <div>
                                        <h3 className={cn(
                                            'font-semibold',
                                            usuario.activo ? 'text-gray-900 dark:text-white' : 'text-gray-400'
                                        )}>
                                            {usuario.nombre}
                                        </h3>
                                        <p className="text-sm text-gray-500">{usuario.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mb-4">
                                <span className={cn(
                                    'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                                    rolColors[usuario.rol as keyof typeof rolColors]
                                )}>
                                    <Shield className="h-3 w-3 mr-1" />
                                    {rolLabels[usuario.rol as keyof typeof rolLabels]}
                                </span>
                                <span className={cn(
                                    'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
                                    usuario.activo
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                        : 'bg-gray-100 text-gray-500 dark:bg-gray-800'
                                )}>
                                    {usuario.activo ? 'Activo' : 'Inactivo'}
                                </span>
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => openEditModal(usuario)}
                                >
                                    <Edit className="h-4 w-4" />
                                    Editar
                                </Button>
                                <div className="relative">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setActiveDropdown(activeDropdown === usuario.id ? null : usuario.id)}
                                    >
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                    <DropdownMenu
                                        isOpen={activeDropdown === usuario.id}
                                        onClose={() => setActiveDropdown(null)}
                                    >
                                        <button
                                            onClick={() => openEditModal(usuario)}
                                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                        >
                                            <Eye className="h-4 w-4" />
                                            Ver detalle
                                        </button>
                                        <button
                                            onClick={() => {
                                                setActiveDropdown(null);
                                                showSuccess('Contraseña temporal enviada al email');
                                            }}
                                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                        >
                                            <Key className="h-4 w-4" />
                                            Resetear contraseña
                                        </button>
                                        <button
                                            onClick={() => handleToggleActive(usuario.id)}
                                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                        >
                                            <Power className="h-4 w-4" />
                                            {usuario.activo ? 'Desactivar' : 'Activar'}
                                        </button>
                                        <hr className="my-1 border-gray-200 dark:border-gray-700" />
                                        <button
                                            onClick={() => handleDeleteUser(usuario.id)}
                                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            Eliminar usuario
                                        </button>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Roles Legend */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Permisos por Rol</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                            <h4 className="font-medium text-red-600 mb-2">Administrador</h4>
                            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                <li>• Acceso total al sistema</li>
                                <li>• Gestión de usuarios</li>
                                <li>• Configuración</li>
                            </ul>
                        </div>
                        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                            <h4 className="font-medium text-blue-600 mb-2">Gerente</h4>
                            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                <li>• Aprobación de préstamos</li>
                                <li>• Reportes completos</li>
                                <li>• Gestión de clientes</li>
                            </ul>
                        </div>
                        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                            <h4 className="font-medium text-green-600 mb-2">Cajero</h4>
                            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                <li>• Registro de pagos</li>
                                <li>• Consulta de saldos</li>
                                <li>• Corte de caja</li>
                            </ul>
                        </div>
                        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                            <h4 className="font-medium text-amber-600 mb-2">Cobrador</h4>
                            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                <li>• Vista de cobranza</li>
                                <li>• Registro de pagos</li>
                                <li>• Seguimiento clientes</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={showCreateModal || editingUser !== null}
                onClose={() => {
                    setShowCreateModal(false);
                    setEditingUser(null);
                }}
                title={editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Nombre Completo
                        </label>
                        <Input
                            placeholder="Ej: Juan Pérez"
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Correo Electrónico
                        </label>
                        <Input
                            type="email"
                            placeholder="usuario@empresa.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Rol
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {Object.entries(rolLabels).map(([value, label]) => (
                                <button
                                    key={value}
                                    onClick={() => setFormData({ ...formData, rol: value })}
                                    className={cn(
                                        'rounded-lg px-3 py-2 text-sm font-medium transition-all border-2',
                                        formData.rol === value
                                            ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                                            : 'border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-400'
                                    )}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                    {!editingUser && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Contraseña Temporal
                            </label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    )}
                    <div className="flex gap-3 pt-4">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => {
                                setShowCreateModal(false);
                                setEditingUser(null);
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            className="flex-1"
                            onClick={editingUser ? handleUpdateUser : handleCreateUser}
                            disabled={!formData.nombre || !formData.email}
                        >
                            {editingUser ? 'Guardar Cambios' : 'Crear Usuario'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
