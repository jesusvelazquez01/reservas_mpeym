import { Button } from '@/components/ui/button';
import { SimpleDataTable } from '@/components/ui/simple-data-table';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, PageProps, Role, PaginatedData } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Pencil, Shield, HelpCircle, ShieldCheck, Edit } from 'lucide-react';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from '@/components/ui/card';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gestión de Roles',
        href: '/roles',
    },
];

interface Props extends PageProps {
    roles: PaginatedData<Role>;
}

export default function Index({ roles }: Props) {
    const columns: ColumnDef<Role>[] = [
        {
            header: 'Rol',
            accessorKey: 'name',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-orange-400" />
                    <span className="font-medium capitalize">{row.getValue('name')}</span>
                </div>
            ),
        },
        {
            header: 'Permisos',
            accessorKey: 'permissions_count',
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-blue-400" />
                    <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                    >
                        {row.getValue('permissions_count')} permisos
                    </Badge>
                </div>
            ),
        },
        {
            header: 'Acciones',
            id: 'actions',
            cell: ({ row }) => (
                <Link href={`/roles/${row.original.id}/edit`}>
                    <Button size="sm" variant="default" title="Editar permisos">
                        <Edit className="h-4 w-4" />
                    </Button>
                </Link>
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de Roles" />
            <div className="min-h-screen bg-gradient-to-br p-3">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header principal */}
                    <div className="text-align-left">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold bg-orange-400 bg-clip-text text-transparent flex items-center gap-2">
                                    <Shield className="h-6 w-6 text-orange-400" />
                                    Gestión de Roles
                                </h1>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Administra los roles y permisos del sistema
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
                                    <DialogTitle>¿Qué es la Gestión de Roles?</DialogTitle>
                                    <DialogDescription className="space-y-2">
                                        <p>
                                            Este módulo permite administrar los roles del sistema
                                            y los permisos asociados a cada uno.
                                        </p>
                                        <p className="font-semibold">Funcionalidades:</p>
                                        <ul className="list-disc list-inside space-y-1">
                                            <li>
                                                Visualizar todos los roles disponibles en el
                                                sistema
                                            </li>
                                            <li>
                                                Ver la cantidad de permisos asignados a cada rol
                                            </li>
                                            <li>
                                                Editar permisos de cada rol según las necesidades
                                            </li>
                                            <li>
                                                Controlar el acceso de usuarios a diferentes
                                                módulos
                                            </li>
                                        </ul>
                                    </DialogDescription>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    {/* Card principal */}
                    <Card className="shadow-lg border-2 border-orange-100 ">
                        <CardHeader className="bg-gradient-to-r">
                            <CardTitle className="flex items-center gap-2 text-orange-400">
                                <Shield className="h-5 w-5 text-orange-400" />
                                Lista de Roles
                            </CardTitle>
                            <CardDescription>
                                Consulta y edita los permisos asignados a cada rol del
                                sistema
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="pt-6">
                            {/* Tabla */}
                            <SimpleDataTable columns={columns} data={roles.data} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}