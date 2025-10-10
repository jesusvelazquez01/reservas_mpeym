import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Reserva, type Equipo, type ControlUso } from '@/types';
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





interface Props {
  reservas: Reserva[];
  equipos: Equipo[];
  controles: ControlUso[];
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Control de Uso',
     href: '/control-uso' },
];

type EquipoSeleccionado = {
  equipo_id: number;
  estado_pantalla: string;
  estado_final: string;
  se_encendio: boolean;
  se_apago: boolean;
  se_conecto_a_cargar: boolean;
  nivel_bateria: number;
  observaciones_equipo: string;
};

export default function Index({ reservas, equipos, controles }: Props) {

     const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [recordIdToDelete, setRecordIdToDelete] = useState<number | null>(null);
    const [selectedControl, setSelectedControl] = useState<ControlUso | null>(null);
const columns: ColumnDef<ControlUso>[] = [
        {
            accessorKey: 'reserva.sala.nombre',
            header: 'Sala',
            cell: ({ row }) => row.original.reserva?.sala?.nombre || 'Sin sala'
        },
        {
            accessorKey: 'reserva.entidad',
            header: 'Entidad',
            cell: ({ row }) => row.original.reserva?.entidad || 'Sin entidad'
        },
        {
            accessorKey: 'reserva.fecha',
            header: 'Fecha',
            cell: ({ row }) => row.original.reserva?.fecha || 'Sin fecha'
        },
        {
            accessorKey: 'fue_utilizada',
            header: 'Fue Utilizada',
            cell: ({ row }) => (
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                    row.original.fue_utilizada === 'Si' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                }`}>
                    {row.original.fue_utilizada}
                </span>
            ),
        },
        {
            accessorKey: 'observaciones',
            header: 'Observaciones',
            cell: ({ row }) => (
                <div className="max-w-xs">
                    {row.original.observaciones ? (
                        <p className="text-sm text-gray-600 truncate" title={row.original.observaciones}>
                            {row.original.observaciones}
                        </p>
                    ) : (
                        <span className="text-gray-400 text-sm">Sin observaciones</span>
                    )}
                </div>
            ),
        },
        {
            id: 'actions',
            header: 'Acciones',
            cell: ({ row }) => {
                const control = row.original;
                return (
                    <div className='flex gap-2'>
                        <Link href={route('control-uso.edit', control.id)}>
                            <Button size="sm" variant="default">
                                <Pencil className='h-4 w-4'/>
                            </Button>
                        </Link>
                        <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                                setRecordIdToDelete(control.id);
                                setSelectedControl(control);
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
            router.delete(route('control-uso.destroy', recordIdToDelete), {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    setRecordIdToDelete(null);
                    setSelectedControl(null);
                },
                onError: () => {
                    console.error('Error al eliminar la Licencia del Docente');
                }
            });
        }
    };
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Control de Uso" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Controles de Uso</h1>
                    <Link href={route('control-uso.create')}>
                        <Button>
                            <Plus className='mr-2 h-4 w-4' /> Agregar Registros
                        </Button>
                    </Link>
                </div>

                {/* DataTable */}
                <SimpleDataTable columns={columns} data={controles} />

                {/* AlertDialog fuera de la tabla */}
                <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Esta acción no se puede deshacer. El control de uso será eliminado permanentemente de la base de datos.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => {
                                setIsDialogOpen(false);
                                setRecordIdToDelete(null);
                                setSelectedControl(null);
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