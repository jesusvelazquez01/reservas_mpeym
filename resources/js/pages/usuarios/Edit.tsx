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
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    Loader2,
    Pencil,
    HelpCircle,
    UserCog,
    Mail,
    Lock,
    Shield,
} from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { PageProps, Role, UserWithRoles } from '@/types';
import type { BreadcrumbItem } from '@/types';
import { useState } from 'react';
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
    { title: 'Editar', href: '' },
];

interface Props extends PageProps {
    user: UserWithRoles;
    roles: Role[];
}

export default function Edit() {
    const { user, roles } = usePage<Props>().props;
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        role: user.roles[0]?.name ?? '',
        password: '',
        password_confirmation: '',
    });

    const [showCancelDialog, setShowCancelDialog] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('users.update', user.id));
    };

    const handleCancel = () => {
        const hasChanges =
            data.name !== user.name ||
            data.email !== user.email ||
            data.role !== (user.roles[0]?.name ?? '') ||
            data.password !== '' ||
            data.password_confirmation !== '';

        if (hasChanges) {
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
            <Head title="Editar Usuario" />
            <div className="min-h-screen bg-gradient-to-br p-3">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="text-align-left">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent flex items-center gap-2">
                                    <Pencil className="h-5 w-5 text-orange-400" />
                                    Editar Usuario
                                </h1>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Modifica la información del usuario: {user.name}
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
                                    <DialogTitle>Editar Usuario</DialogTitle>
                                    <DialogDescription className="space-y-2">
                                        <p>
                                            Este formulario te permite actualizar la información
                                            de un usuario existente.
                                        </p>
                                        <p className="font-semibold">Puedes modificar:</p>
                                        <ul className="list-disc list-inside space-y-1">
                                            <li>Nombre completo del usuario</li>
                                            <li>Correo electrónico</li>
                                            <li>Rol asignado</li>
                                            <li>
                                                Contraseña (opcional - déjala vacía si no deseas
                                                cambiarla)
                                            </li>
                                        </ul>
                                    </DialogDescription>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    {/* Card principal */}
                    <Card className="shadow-lg border-2 border-orange-100 dark:border-orange-900">
                        <CardHeader className="bg-gradient-to-r">
                            <CardTitle className="flex items-center gap-2 text-orange-400">
                                <UserCog className="h-5 w-5 text-orange-400" />
                                Información del Usuario
                            </CardTitle>
                            <CardDescription>
                                Actualiza los campos que desees modificar
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6 pt-6">
                            {/* Nombre */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-base flex items-center gap-2">
                                    <UserCog className="h-4 w-4 text-orange-400" />
                                    Nombre Completo
                                </Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    disabled={processing}
                                    className="focus-visible:ring-orange-500"
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
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    disabled={processing}
                                    className="focus-visible:ring-orange-500"
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500">{errors.email}</p>
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
                                    <SelectTrigger className="focus:ring-orange-500">
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

                            {/* Separador */}
                            <div className="border-t pt-4">
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                    Cambio de contraseña (opcional)
                                </p>

                                {/* Nueva Contraseña */}
                                <div className="space-y-2 mb-4">
                                    <Label
                                        htmlFor="password"
                                        className="text-base flex items-center gap-2"
                                    >
                                        <Lock className="h-4 w-4 text-orange-400" />
                                        Nueva Contraseña
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        disabled={processing}
                                        placeholder="Dejar vacío para mantener la contraseña actual"
                                        className="focus-visible:ring-orange-500"
                                    />
                                    {errors.password && (
                                        <p className="text-sm text-red-500">{errors.password}</p>
                                    )}
                                </div>

                                {/* Confirmar Nueva Contraseña */}
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="password_confirmation"
                                        className="text-base flex items-center gap-2"
                                    >
                                        <Lock className="h-4 w-4 text-orange-400" />
                                        Confirmar Nueva Contraseña
                                    </Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData('password_confirmation', e.target.value)
                                        }
                                        disabled={processing}
                                        placeholder="Confirmar nueva contraseña"
                                        className="focus-visible:ring-orange-500"
                                    />
                                    {errors.password_confirmation && (
                                        <p className="text-sm text-red-500">
                                            {errors.password_confirmation}
                                        </p>
                                    )}
                                </div>
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
                                        'Guardar Cambios'
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
                                    Tienes modificaciones sin guardar. ¿Estás seguro de salir
                                    sin guardar los cambios?
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