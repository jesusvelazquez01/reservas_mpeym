import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage,Link } from '@inertiajs/react';

import {  Trash2, Plus, Pencil } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { CapacitadoresDataTable } from '@/components/ui/capacitadores-data-table';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PageProps, type BreadcrumbItem,  type Capacitador } from '@/types';

import { router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gestión de Responsables',
        href: '/responsables',
    },
];

export default function Index() {
    const { capacitadores } = usePage<PageProps>().props;

    const handleDelete = (capacitador: Capacitador) => {
        router.delete(route('capacitadores.destroy', capacitador.id), {
            onSuccess: () => {
                // La página se recargará automáticamente con los datos actualizados
            },
            onError: (errors) => {
                console.error('Error al eliminar:', errors);
            }
        });
    };


    const columns: ColumnDef<Capacitador>[] = [
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
            id: 'actions',
            header: 'Acciones',
            cell: ({ row }) => {
                const capacitador = row.original;
                return (
                    <div className="flex gap-2">
                        <Link href={route('capacitadores.edit', capacitador .id)}>
                            <Button size="sm" variant="default">
                                <Pencil className='h-4 w-4'/>
                            </Button>
                        </Link>
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
                                <DialogTitle>¿Desea eliminar al Responsable "{capacitador .nombre} {capacitador .apellido}"?</DialogTitle>
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
                                            onClick={() => handleDelete(capacitador )}
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
            <Head title="Gestión de Capacitadores" />
            <div className="p-3">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Capacitadores</h1>
                    <Link href={route('capacitadores.create')}>
                        <Button>
                            <Plus className='mr-2 h-4 w-4' /> Agregar Capacitador
                        </Button>
                    </Link>
                   
                </div>

                <CapacitadoresDataTable 
                    columns={columns} 
                    data={capacitadores.data}
                    pagination={{
                        from: capacitadores.data.length > 0 ? ((capacitadores.current_page - 1) * capacitadores.per_page) + 1 : 0,
                        to: Math.min(capacitadores.current_page * capacitadores.per_page, capacitadores.total),
                        total: capacitadores.total,
                        links: capacitadores.links,
                        OnPageChange: (url: string | null) => {
                            if (url) router.get(url);
                        },
                    }}
                />
            </div>

           
        </AppLayout>
    );
}