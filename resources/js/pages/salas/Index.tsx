import AppLayout from '@/layouts/app-layout';
import { Head, usePage, router, Link } from '@inertiajs/react';

import { useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';

import { SimpleDataTable } from '@/components/ui/simple-data-table';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { type BreadcrumbItem, Sala,PageProps } from '@/types';



const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gestion de Salas',
        href: '/salas',
    },
];

export default function Index() {
    const { salas } = usePage<PageProps>().props;
     const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [recordIdToDelete, setRecordIdToDelete] = useState<number | null>(null);
    const [selectedSala, setSelectedSala] = useState<Sala | null>(null);
    const columns: ColumnDef<Sala>[] = [
        {
            accessorKey: 'nombre',
            header: 'Nombre',
        },
        {
            accessorKey: 'capacidad',
            header: 'Capacidad',
        },
        {
            accessorKey: 'ubicacion',
            header: 'Ubicación',
        },
         {
            id: 'actions',
            header: 'Acciones',
            cell: ({ row }) => {
                const sala = row.original;
                return (
                    <div className='flex gap-2'>
                        <Link href={route('salas.edit', sala.id)}>
                            <Button size="sm" variant="default">
                                <Pencil className='h-4 w-4'/>
                            </Button>
                        </Link>
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                                setRecordIdToDelete(sala.id);
                                setSelectedSala(sala);
                                setIsDialogOpen(true);
                            }}
                        >
                            <Trash2 className='h-4 w-4'/>
                        </Button>
                    </div>
                );
            },
        },
    ];


    const handleDelete = () => {
        if (recordIdToDelete) {
            router.delete(route('salas.destroy', recordIdToDelete), {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    setRecordIdToDelete(null);
                    setSelectedSala(null);
                },
                onError: () => {
                    console.error('Error al eliminar la Sala');
                }
            });
        }
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de Salas" />

            <div className="p-3">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Salas</h1>
                    <Link href={route('salas.create')}>
                        <Button>
                            <Plus className='mr-2 h-4 w-4' /> Agregar Sala
                        </Button>
                    </Link>
                 </div>
                {/*SimpleDataTable */}
                <SimpleDataTable columns={columns} data={salas} />
            </div>

           {/* AlertDialog fuera de la tabla */}
                <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta acción no se puede deshacer. El docente "{selectedSala?.nombre}" será eliminado permanentemente de la base de datos.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => {
                                setIsDialogOpen(false);
                                setRecordIdToDelete(null);
                                setSelectedSala(null);
                            }}>
                                Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDelete}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Eliminar
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
        </AppLayout>
    );
}