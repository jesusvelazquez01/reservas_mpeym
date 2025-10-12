import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Equipo, PageProps, type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Edit, Laptop2, Pencil, Plus, Trash2 } from 'lucide-react';
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
} from "@/components/ui/alert-dialog"
import { SimpleDataTable } from '@/components/ui/simple-data-table';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

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
    { accessorKey: 'marca', header: 'Marca' },
    { accessorKey: 'modelo', header: 'Modelo' },
    {
      accessorKey: 'estado_inicial',
      header: 'Estado',
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${getEstadoColor(row.original.estado_inicial)}`}
        >
          {row.original.estado_inicial}
        </span>
      ),
    },
    { accessorKey: 'sistema_operativo', header: 'S.O.' },
    { accessorKey: 'fecha_adquisicion', header: 'F. Adquisición' },
    {
      accessorKey: 'fecha_baja',
      header: 'F. Baja',
      cell: ({ row }) => (
        <span className={row.original.fecha_baja ? 'text-red-600 font-medium' : ''}>
          {row.original.fecha_baja || '-'}
        </span>
      ),
    },
    { accessorKey: 'sala.nombre', header: 'Sala' },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const equipo = row.original;
        return (
          <div className="flex gap-2">
            <Link href={route('equipos.edit', equipo.id)}>
              <Button size="sm" variant="default">
                <Edit className="h-4 w-4" />
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
              <Trash2 className="h-4 w-4" />
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
          console.error('Error al eliminar el equipo');
        },
      });
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Equipos" />

      <div className="min-h-screen bg-gradient-to-br p-3">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header principal */}
          <div className="text-align-left">
            <h1 className="text-2xl font-bold bg-gradient-to-r bg-orange-400 bg-clip-text text-transparent flex items-center gap-2">
              <Laptop2 className="h-6 w-6 text-orange-400" />
              Gestión de Equipos
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Administra los equipos informáticos registrados en el sistema
            </p>
          </div>

          {/* Card principal */}
          <Card className="shadow-lg border-2 border-orange-100 dark:border-orange-900">
            <CardHeader className="bg-gradient-to-r">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2 text-orange-400">
                    <Laptop2 className="h-5 w-5 text-orange-400" />
                    Listado de Equipos
                  </CardTitle>
                  <CardDescription>
                    Consulta, edita o elimina los equipos disponibles.
                  </CardDescription>
                </div>
                <Link href={route('equipos.create')}>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" /> Nuevo Equipo
                  </Button>
                </Link>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <SimpleDataTable columns={columns} data={equipos} />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AlertDialog fuera de la tabla */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El equipo "{selectedEquipo?.marca}" modelo "{selectedEquipo?.modelo}" será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsDialogOpen(false);
                setRecordIdToDelete(null);
                setSelectedEquipo(null);
              }}
            >
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
