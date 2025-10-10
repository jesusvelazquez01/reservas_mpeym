import { Button } from '@/components/ui/button';

import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Equipo, PageProps, type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import {  useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,

} from "@/components/ui/alert-dialog"
import { SimpleDataTable } from '@/components/ui/simple-data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Equipos',
        href: '/equipos',
    },
];

export default function Index() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [recordIdToDelete, setRecordIdToDelete] = useState<number | null>(null);
    const [selectedEquipo, setSelectedEquipo] = useState<Equipo | null>(null);

    const { equipos } = usePage<PageProps>().props;

    const getEstadoColor = (estado: string) => {
        switch (estado?.toLowerCase()) {
            case 'excelente': return 'bg-green-100 text-green-800';
            case 'bueno': return 'bg-blue-100 text-blue-800';
            case 'regular': return 'bg-yellow-100 text-yellow-800';
            case 'malo': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

   const columns: ColumnDef<Equipo>[] = [
        {
            accessorKey: 'marca',
            header: 'Marca',
        },
        {
            accessorKey: 'modelo',
            header: 'Modelo',
        },
        {
            accessorKey: 'estado_inicial',
            header: 'Estado',
            cell: ({ row }) => (
                <span className={`px-2 py-1 rounded text-xs font-medium ${getEstadoColor(row.original.estado_inicial)}`}>
                    {row.original.estado_inicial}
                </span>
            ),
        },
        {
            accessorKey: 'sistema_operativo',
            header: 'S.O.',
        },
        {
            accessorKey: 'fecha_adquisicion',
            header: 'F. Adquisición',
        },
        {
            accessorKey: 'fecha_baja',
            header: 'F. Baja',
            cell: ({ row }) => (
                <span className={row.original.fecha_baja ? 'text-red-600 font-medium' : ''}>
                    {row.original.fecha_baja || '-'}
                </span>
            ),
        },
        {
            accessorKey: 'sala.nombre',
            header: 'Sala',
        },
       {
            id: 'actions',
            header: 'Acciones',
            cell: ({ row }) => {
                const equipo = row.original;
                return (
                    <div className='flex gap-2'>
                        <Link href={route('equipos.edit', equipo.id)}>
                            <Button size="sm" variant="default">
                                <Pencil className='h-4 w-4'/>
                            </Button>
                        </Link>
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                                setRecordIdToDelete(equipo.id);
                                setSelectedEquipo(equipo);
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
            router.delete(route('equipos.destroy', recordIdToDelete), {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    setRecordIdToDelete(null);
                    setSelectedEquipo(null);
                },
                onError: () => {
                    console.error('Error al eliminar la Licencia del Docente');
                }
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Equipos" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Equipos</h1>
                    <Link href={route('equipos.create')}>
                        <Button>
                            <Plus className='mr-2 h-4 w-4' /> Agregar Equipo
                        </Button>
                    </Link>
                </div>

                {/* DataTable */}
                <SimpleDataTable columns={columns} data={equipos} />

                {/* AlertDialog fuera de la tabla */}
                <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta acción no se puede deshacer. La licencia de "{selectedEquipo?.equipo?.marca || 'Equipo'}" (Tipo: {selectedEquipo?.modelo}) será eliminada permanentemente de la base de datos.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => {
                                setIsDialogOpen(false);
                                setRecordIdToDelete(null);
                                setSelectedEquipo(null);
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
            </div>
        </AppLayout>
    );
}