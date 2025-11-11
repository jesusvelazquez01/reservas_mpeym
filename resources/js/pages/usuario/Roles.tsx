import { Head, useForm, router } from '@inertiajs/react';
import type { PageProps, Role, UserWithRoles } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { BreadcrumbItem } from '@/types';
import { SimpleDataTable } from '@/components/ui/simple-data-table';
import {
    Users,
    HelpCircle,
    Shield,
    Mail,
    UserCog,
    Loader2,
    Save,
} from 'lucide-react';
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
    {
        title: 'Roles de Usuario',
        href: '/users/roles',
    },
];

interface Props extends PageProps {
    usuarios: UserWithRoles[];
    roles: Role[];
}

export default function UserRolesPage({ usuarios, roles }: Props) {
    const initialRoles: Record<number, string> = {};
    usuarios.forEach((user) => {
        initialRoles[user.id] = user.roles?.[0]?.name || '';
    });

    const { data, setData, put, processing } = useForm<{
        roles: Record<number, string>;
    }>({
        roles: initialRoles,
    });

    const [showCancelDialog, setShowCancelDialog] = useState(false);

    const handleChange = (userId: number, role: string) => {
        setData('roles', {
            ...data.roles,
            [userId]: role,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Enviar actualizaciones para cada usuario que cambió
        Object.entries(data.roles).forEach(([userId, roleName]) => {
            const user = usuarios.find((u) => u.id === parseInt(userId));
            const currentRole = user?.roles?.[0]?.name || '';

            // Solo actualizar si el rol cambió
            if (currentRole !== roleName && roleName) {
                router.put(
                    `/users/${userId}/roles`,
                    {
                        roles: [roleName],
                    },
                    {
                        preserveScroll: true,
                        preserveState: true,
                        onSuccess: () => {
                            console.log(`Rol actualizado para usuario ${userId}`);
                        },
                        onError: (errors) => {
                            console.error('Error actualizando rol:', errors);
                        },
                    }
                );
            }
        });
    };

    const handleCancel = () => {
        // Verificar si hay cambios
        const hasChanges = Object.entries(data.roles).some(([userId, roleName]) => {
            const user = usuarios.find((u) => u.id === parseInt(userId));
            const currentRole = user?.roles?.[0]?.name || '';
            return currentRole !== roleName;
        });

        if (hasChanges) {
            setShowCancelDialog(true);
        } else {
            router.visit('/dashboard');
        }
    };

    const confirmCancel = () => {
        router.visit('/dashboard');
    };

    const columns = [
        {
            header: 'Nombre',
            accessorKey: 'name',
            cell: ({ row }: { row: { original: UserWithRoles } }) => (
                <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-orange-400" />
                    <span className="font-medium">{row.original.name}</span>
                </div>
            ),
        },
        {
            header: 'Email',
            accessorKey: 'email',
            cell: ({ row }: { row: { original: UserWithRoles } }) => (
                <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-orange-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        {row.original.email}
                    </span>
                </div>
            ),
        },
        {
            header: 'Rol',
            id: 'role',
            cell: ({ row }: { row: { original: UserWithRoles } }) => (
                <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-orange-400" />
                    <Select
                        value={data.roles[row.original.id]}
                        onValueChange={(value) => handleChange(row.original.id, value)}
                        disabled={processing}
                    >
                        <SelectTrigger className="w-[200px] focus:ring-orange-400">
                            <SelectValue placeholder="Seleccionar rol" />
                        </SelectTrigger>
                        <SelectContent>
                            {roles.map((role) => (
                                <SelectItem key={role.id} value={role.name}>
                                    <span className="capitalize">{role.name}</span>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Asignar Roles" />
            <div className="min-h-screen bg-gradient-to-br p-3">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="text-align-left">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold bg-orange-400 bg-clip-text text-transparent flex items-center gap-2">
                                    <UserCog className="h-6 w-6 text-orange-400" />
                                    Asignar Roles a Usuarios
                                </h1>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Administra los roles de cada usuario del sistema
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
                                    <DialogTitle>Asignación de Roles</DialogTitle>
                                    <DialogDescription className="space-y-2">
                                        <p>
                                            Este módulo permite asignar o cambiar el rol de cada
                                            usuario del sistema.
                                        </p>
                                        <p className="font-semibold">¿Cómo usarlo?</p>
                                        <ul className="list-disc list-inside space-y-1">
                                            <li>
                                                Selecciona el rol deseado para cada usuario desde
                                                el dropdown
                                            </li>
                                            <li>
                                                Puedes cambiar múltiples usuarios a la vez
                                            </li>
                                            <li>
                                                Haz clic en "Guardar Cambios" para aplicar las
                                                modificaciones
                                            </li>
                                            <li>
                                                Solo se actualizarán los usuarios con cambios
                                            </li>
                                        </ul>
                                    </DialogDescription>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    {/* Card principal */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Card className="shadow-lg border-2 border-orange-100 ">
                            <CardHeader className="bg-gradient-to-r">
                                <CardTitle className="flex items-center gap-2 text-orange-400">
                                    <Shield className="h-5 w-5 text-orange-400" />
                                    Usuarios y sus Roles
                                </CardTitle>
                                <CardDescription>
                                    Selecciona el rol apropiado para cada usuario. Los cambios
                                    se aplicarán al guardar.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="pt-6">
                                <SimpleDataTable columns={columns} data={usuarios} />
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
                                            <>
                                                <Save className="h-4 w-4" />
                                                Guardar Cambios
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </form>

                    {/* Alert Dialog */}
                    <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>¿Descartar cambios?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Has modificado roles de usuarios. ¿Estás seguro de salir
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