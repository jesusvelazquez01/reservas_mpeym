import AppLayout from '@/layouts/app-layout';
import { Head,usePage } from '@inertiajs/react';
import { useState } from 'react';
import { Pencil, Trash2, Link,Plus } from 'lucide-react';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';

import { type BreadcrumbItem, Sala,PageProps } from '@/types';
import { SimpleDataTable } from '@/components/ui/simple-data-table';



const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gestion de Salas',
        href: '/salas',
    },
];

export default function Salas() {

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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de Salas" />
            <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Salas</h1>
                    <Link href={route('salas.create')}>
                        <Button>
                            <Plus className='mr-2 h-4 w-4' /> Agregar Sala
                        </Button>
                    </Link>
                </div>
            <div className="p-3">
                <SimpleDataTable columns={columns} data={salas} />
            </div>
        </AppLayout>
    );
}