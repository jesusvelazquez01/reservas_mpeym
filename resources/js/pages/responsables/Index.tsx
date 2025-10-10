import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage,Link } from '@inertiajs/react';

import { Edit, Trash2, Plus } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ResponsablesDataTable } from '@/components/ui/responsables-data-table';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PageProps, type BreadcrumbItem, type Responsable } from '@/types';
import { toast } from 'react-toastify';
import { router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gestión de Responsables',
        href: '/responsables',
    },
];

export default function Index() {
    const { responsables } = usePage<PageProps>().props;

    const { delete: destroy, processing } = useForm();

    const handleDelete = (responsable: Responsable) => {
        router.delete(route('responsables.destroy', responsable.id), {
            preserveScroll: true,
            onSuccess: () => toast.success('Responsable eliminado correctamente'),
            onError: () => toast.error('Error al eliminar el Responsable'),
        });
    };

    const handleEdit = (responsable: Responsable) => {
        router.visit(route('responsables.edit', responsable.id));
    };

    const columns: ColumnDef<Responsable>[] = [
        {
            accessorKey: 'nombre',
            header: 'Nombre',
        },
        {
            accessorKey: 'apellido',
            header: 'Apellido',
        },
        {
            accessorKey: 'dni',
            header: 'D.N.I',
        },
        {
            accessorKey: 'telefono',
            header: 'Teléfono',
        },
        {
            accessorKey: 'correo',
            header: 'Correo',
        },
        {
            accessorKey: 'area',
            header: 'Área',
        },
        {
            id: 'actions',
            header: 'Acciones',
            cell: ({ row }) => {
                const responsable = row.original;
                return (
                    <div className="flex gap-2">
                        <Button 
                            onClick={() => handleEdit(responsable)} 
                            size="sm" 
                            variant="default"
                            title="Editar responsable"
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button 
                                    variant="destructive" 
                                    size="sm"
                                    title="Eliminar responsable"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogTitle>¿Desea eliminar al Responsable "{responsable.nombre} {responsable.apellido}"?</DialogTitle>
                                <DialogDescription>
                                    Esta acción no se puede deshacer. El responsable será eliminado permanentemente del sistema.
                                </DialogDescription>
                                <DialogFooter className="gap-2">
                                    <DialogClose asChild>
                                        <Button variant="secondary">
                                            Cancelar
                                        </Button>
                                    </DialogClose>
                                    <DialogClose asChild>
                                        <Button 
                                            variant="destructive" 
                                            onClick={() => handleDelete(responsable)}
                                            disabled={processing}
                                        >
                                            {processing ? 'Eliminando...' : 'Eliminar'}
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
            <Head title="Gestión de Responsables" />
            <div className="p-3">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Responsables</h1>
                    <Link href={route('responsables.create')}>
                        <Button>
                            <Plus className='mr-2 h-4 w-4' /> Agregar Responsable
                        </Button>
                    </Link>
                   
                </div>

                <ResponsablesDataTable 
                    columns={columns} 
                    data={responsables.data}
                    pagination={{
                        from: responsables.data.length > 0 ? ((responsables.current_page - 1) * responsables.per_page) + 1 : 0,
                        to: Math.min(responsables.current_page * responsables.per_page, responsables.total),
                        total: responsables.total,
                        links: responsables.links,
                        OnPageChange: (url: string | null) => {
                            if (url) router.get(url);
                        },
                    }}
                />
            </div>

           
        </AppLayout>
    );
}