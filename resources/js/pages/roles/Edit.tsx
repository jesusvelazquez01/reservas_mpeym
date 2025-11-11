import { Head, router, useForm, usePage } from '@inertiajs/react';
import type { PageProps, Role, BreadcrumbItem, Permission } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Loader2,
    HelpCircle,
    Shield,
    ShieldCheck,
    CheckSquare,
    Pencil,
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
        title: 'Roles',
        href: '/roles',
    },
    {
        title: 'Editar',
        href: '#',
    },
];

export default function Edit() {
    const { role, permissions, rolePermissions } = usePage<
        PageProps & {
            role: Role;
            permissions: Record<string, Permission[]>;
            rolePermissions: string[];
        }
    >().props;

    const { data, setData, put, processing } = useForm({
        permissions: rolePermissions,
    });

    const [showCancelDialog, setShowCancelDialog] = useState(false);

    const handleCheckboxChange = (permissionName: string, checked: boolean) => {
        if (checked) {
            setData('permissions', [...data.permissions, permissionName]);
        } else {
            setData(
                'permissions',
                data.permissions.filter((p) => p !== permissionName)
            );
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('roles.update', { role: role.id }));
    };

    const handleCancel = () => {
        // Verificar si hay cambios
        const hasChanges =
            JSON.stringify([...data.permissions].sort()) !==
            JSON.stringify([...rolePermissions].sort());

        if (hasChanges) {
            setShowCancelDialog(true);
        } else {
            router.visit(route('roles.index'));
        }
    };

    const confirmCancel = () => {
        router.visit(route('roles.index'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar Rol - ${role.name}`} />
            <div className="min-h-screen bg-gradient-to-br p-3">
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="text-align-left">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold bg-orange-400 bg-clip-text text-transparent flex items-center gap-2">
                                    <Pencil className="h-5 w-5 text-orange-400" />
                                    Editar Rol: {role.name}
                                </h1>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Administra los permisos asignados a este rol
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
                                    <DialogTitle>Editar Permisos del Rol</DialogTitle>
                                    <DialogDescription className="space-y-2">
                                        <p>
                                            Selecciona los permisos que deseas asignar al rol{' '}
                                            <strong>{role.name}</strong>.
                                        </p>
                                        <p className="font-semibold">Tipos de permisos:</p>
                                        <ul className="list-disc list-inside space-y-1">
                                            <li>
                                                <strong>Ver:</strong> Permite visualizar la
                                                información
                                            </li>
                                            <li>
                                                <strong>Crear:</strong> Permite crear nuevos
                                                registros
                                            </li>
                                            <li>
                                                <strong>Editar:</strong> Permite modificar
                                                registros existentes
                                            </li>
                                            <li>
                                                <strong>Eliminar:</strong> Permite borrar
                                                registros
                                            </li>
                                        </ul>
                                    </DialogDescription>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>

                    {/* Card de permisos */}
                    <Card className="shadow-lg border-2 border-orange-100 ">
                        <CardHeader className="bg-gradient-to-r">
                            <CardTitle className="flex items-center gap-2 text-orange-400">
                                <ShieldCheck className="h-5 w-5 text-orange-400" />
                                Permisos del Rol
                            </CardTitle>
                            <CardDescription>
                                Selecciona los permisos que tendrá este rol. Los usuarios
                                con este rol podrán realizar las acciones marcadas.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="pt-6 space-y-6">
                            {Object.entries(permissions).map(([entity, perms]) => (
                                <div
                                    key={entity}
                                    className="border rounded-lg p-4 space-y-3 bg-gray-50 dark:bg-gray-800/50"
                                >
                                    <div className="flex items-center gap-2 mb-3">
                                        <Shield className="h-5 w-5 text-orange-400" />
                                        <h2 className="text-lg font-semibold capitalize text-orange-400 dark:text-orange-400">
                                            {entity}
                                        </h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                        {perms.map((permission) => (
                                            <div
                                                key={permission.id}
                                                className="flex items-center gap-2 p-2 rounded hover:bg-white dark:hover:bg-gray-700 transition-colors"
                                            >
                                                <Checkbox
                                                    id={`perm-${permission.id}`}
                                                    checked={data.permissions.includes(
                                                        permission.name
                                                    )}
                                                    onCheckedChange={(checked) =>
                                                        handleCheckboxChange(
                                                            permission.name,
                                                            !!checked
                                                        )
                                                    }
                                                    className="border-orange-400"
                                                />
                                                <label
                                                    htmlFor={`perm-${permission.id}`}
                                                    className="text-sm cursor-pointer flex-1"
                                                >
                                                    {permission.name}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
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
                                        <>
                                            <CheckSquare className="h-4 w-4" />
                                            Guardar Permisos
                                        </>
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
                                    Has modificado los permisos del rol. ¿Estás seguro de
                                    salir sin guardar los cambios?
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