import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Plus, Edit, Trash2, Users, HelpCircle, Mail, Shield } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { SimpleDataTable } from '@/components/ui/simple-data-table';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card';
import { type BreadcrumbItem, type PageProps, type UserWithRoles } from '@/types';
import { normalizePaginatedData } from '@/lib/utils';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Usuarios',
        href: '/users',
    },
];

export default function Index() {
    const { users } = usePage<PageProps>().props;
    const normalizedUsers = normalizePaginatedData<UserWithRoles>(users);

    const handleDelete = (user: UserWithRoles) => {
        router.delete(route('users.destroy', user.id), {
            preserveScroll: true,
        });
    };

    const columns: ColumnDef<UserWithRoles>[] = [
        {
            accessorKey: 'name',
            header: 'Nombre',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-orange-400" />
                    <span className="font-medium">{row.original.name}</span>
                </div>
            ),
        },
        {
            accessorKey: 'email',
            header: 'Correo',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-orange-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                        {row.original.email}
                    </span>
                </div>
            ),
        },
        {
            id: 'roles',
            header: 'Roles',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-orange-400" />
                    <div className="flex flex-wrap gap-1">
                        {row.original.roles && row.original.roles.length > 0 ? (
                            row.original.roles.map((role) => (
                                <span
                                    key={role.id}
                                    className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-md px-2 py-1 text-xs font-medium"
                                >
                                    {role.name}
                                </span>
                            ))
                        ) : (
                            <span className="text-gray-400 dark:text-gray-500 text-xs">
                                Sin roles asignados
                            </span>
                        )}
                    </div>
                </div>
            ),
        },
        {
            id: 'actions',
            header: 'Acciones',
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <div className="flex gap-2">
                        <Link href={route('users.edit', user.id)}>
                            <Button size="sm" variant="default" title="Editar usuario">
                                <Edit className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    title="Eliminar usuario"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogTitle>
                                    ¿Desea eliminar el usuario "{user.name}"?
                                </DialogTitle>
                                <DialogDescription>
                                    Esta acción no se puede deshacer. El usuario será
                                    eliminado permanentemente del sistema y perderá acceso a
                                    todas sus funcionalidades.
                                </DialogDescription>
                                <DialogFooter className="gap-2">
                                    <DialogClose asChild>
                                        <Button variant="secondary">Cancelar</Button>
                                    </DialogClose>
                                    <DialogClose asChild>
                                        <Button
                                            variant="destructive"
                                            onClick={() => handleDelete(user)}
                                        >
                                            Eliminar
                                        </Button>
                                    </DialogClose>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                );
            },
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Usuarios" />

            <div className="min-h-screen bg-gradient-to-br p-3">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header principal */}
                    <div className="text-align-left">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent flex items-center gap-2">
                                    <Users className="h-6 w-6 text-orange-400" />
                                    Gestión de Usuarios
                                </h1>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Administra los usuarios del sistema y sus permisos.
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
                                    <DialogTitle>
                                        ¿Qué es la Gestión de Usuarios?
                                    </DialogTitle>
                                    <DialogDescription className="space-y-2">
                                        <p>
                                            Este módulo permite administrar los usuarios que
                                            tienen acceso al sistema y controlar sus permisos.
                                        </p>
                                        <p className="font-semibold">Funcionalidades:</p>
                                        <ul className="list-disc list-inside space-y-1">
                                            <li>Crear nuevos usuarios del sistema</li>
                                            <li>Editar información y permisos de usuarios</li>
                                            <li>Asignar roles y permisos específicos</li>
                                            <li>Eliminar usuarios que ya no requieren acceso</li>
                                            <li>Consultar roles asignados a cada usuario</li>
                                        </ul>
                                    </DialogDescription>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    {/* Card principal */}
                    <Card className="shadow-lg border-2 border-orange-100 dark:border-orange-900">
                        <CardHeader className="bg-gradient-to-r">
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="flex items-center gap-2 text-orange-400">
                                        <Users className="h-5 w-5 text-orange-400" />
                                        Lista de Usuarios
                                    </CardTitle>
                                    <CardDescription>
                                        Aquí puedes visualizar, editar o eliminar los usuarios
                                        registrados en el sistema
                                    </CardDescription>
                                </div>
                                <Link href={route('users.create')}>
                                    <Button className="gap-2">
                                        <Plus className="h-4 w-4" />
                                        Agregar Usuario
                                    </Button>
                                </Link>
                            </div>
                        </CardHeader>

                        <CardContent className="pt-6">
                            {/* Tabla */}
                            <SimpleDataTable
                                columns={columns}
                                data={normalizedUsers.data}
                            />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}