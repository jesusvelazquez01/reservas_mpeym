import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, Role } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    Loader2,
    Plus,
    HelpCircle,
    UserPlus,
    Mail,
    Lock,
    Shield,
} from 'lucide-react';
import { FormEvent, useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Usuarios', href: '/users' },
    { title: 'Crear Usuario', href: '' },
];

export default function Create() {
    const { roles } = usePage<{ roles: Role[] }>().props;
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: '',
    });

    const [showCancelDialog, setShowCancelDialog] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('users.store'));
    };

    const handleCancel = () => {
        if (
            data.name ||
            data.email ||
            data.password ||
            data.password_confirmation ||
            data.role
        ) {
            setShowCancelDialog(true);
        } else {
            router.visit(route('users.index'));
        }
    };

    const confirmCancel = () => {
        router.visit(route('users.index'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Usuario" />
            <div className="min-h-screen bg-gradient-to-br p-3">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="text-align-left">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent flex items-center gap-2">
                                    <Plus className="h-5 w-5 text-orange-400" />
                                    Crear Usuario
                                </h1>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Registra un nuevo usuario en el sistema
                                </p>
                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="rounded-full"
                                    >
                                        <HelpCircle className="h-5 w-5" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                                    <DialogDescription className="space-y-2">
                                        <p>
                                            Este formulario te permite registrar un nuevo usuario
                                            en el sistema.
                                        </p>
                                        <p className="font-semibold">Campos requeridos:</p>
                                        <ul className="list-disc list-inside space-y-1">
                                            <li>Nombre completo del usuario</li>
                                            <li>Correo electrónico válido</li>
                                            <li>Contraseña segura (mínimo 8 caracteres)</li>
                                            <li>Confirmación de contraseña</li>
                                            <li>Rol o permiso a asignar</li>
                                        </ul>
                                    </DialogDescription>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    {/* Card principal */}
                    <Card className="shadow-lg border-2 border-orange-100">
                        <CardHeader className="bg-gradient-to-r">
                            <CardTitle className="flex items-center gap-2 text-orange-400">
                                <UserPlus className="h-5 w-5 text-orange-400" />
                                Información del Usuario
                            </CardTitle>
                            <CardDescription>
                                Completa todos los campos para crear un nuevo usuario
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6 pt-6">
                            {/* Nombre */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-base flex items-center gap-2">
                                    <UserPlus className="h-4 w-4 text-orange-400" />
                                    Nombre Completo
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="Ej: Juan Pérez"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    disabled={processing}
                                    autoFocus
                                   
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500">{errors.name}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-base flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-orange-400" />
                                    Correo Electrónico
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Ej: usuario@ejemplo.com"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    disabled={processing}
                                   
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500">{errors.email}</p>
                                )}
                            </div>

                            {/* Contraseña */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-base flex items-center gap-2">
                                    <Lock className="h-4 w-4 text-orange-400" />
                                    Contraseña
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Mínimo 8 caracteres"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    disabled={processing}
                                    
                                />
                                {errors.password && (
                                    <p className="text-sm text-red-500">{errors.password}</p>
                                )}
                            </div>

                            {/* Confirmar Contraseña */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="password_confirmation"
                                    className="text-base flex items-center gap-2"
                                >
                                    <Lock className="h-4 w-4 text-orange-400" />
                                    Confirmar Contraseña
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    placeholder="Repite la contraseña"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData('password_confirmation', e.target.value)
                                    }
                                    disabled={processing}
                                   
                                />
                                {errors.password_confirmation && (
                                    <p className="text-sm text-red-500">
                                        {errors.password_confirmation}
                                    </p>
                                )}
                            </div>

                            {/* Rol */}
                            <div className="space-y-2">
                                <Label htmlFor="role" className="text-base flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-orange-400" />
                                    Rol
                                </Label>
                                <Select
                                    value={data.role}
                                    onValueChange={(value) => setData('role', value)}
                                    disabled={processing}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar un rol" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {roles.map((role) => (
                                            <SelectItem key={role.id} value={role.name}>
                                                {role.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.role && (
                                    <p className="text-sm text-red-500">{errors.role}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Botones de Acción */}
                    <Card className="shadow-lg border-2">
                        <CardContent className="p-6">
                            <div className="flex flex-wrap gap-3 justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancel}
                                    className="gap-2 bg-white"
                                    disabled={processing}
                                >
                                    Cancelar
                                </Button>

                                <Button
                                    onClick={handleSubmit}
                                    type="submit"
                                    disabled={processing}
                                    className="gap-2"
                                >
                                    {processing ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Guardando...
                                        </div>
                                    ) : (
                                        'Guardar'
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Alert Dialog */}
                    <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>¿Descartar cambios?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Tienes datos sin guardar. ¿Estás seguro de salir sin guardar
                                    los cambios?
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Seguir editando</AlertDialogCancel>
                                <AlertDialogAction onClick={confirmCancel}>
                                    Descartar
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
        </AppLayout>
    );
}