import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Equipo, PageProps, type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Calendar, DoorOpen, Edit, HelpCircle, Laptop, Laptop2,  MonitorCog,  Plus, Trash2 } from 'lucide-react';
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
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

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
    { accessorKey: 'marca',
       header: 'Marca',
         cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Laptop className="h-4 w-4 text-orange-400" />
                    <div>
                        <p className="font-medium">
                            {row.original.marca}
                        </p>
                    </div>
                </div>
            ),
      
    },
    { accessorKey: 'modelo',
      header: 'Modelo',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Laptop2 className="h-4 w-4 text-orange-400" />
          <div>
            <p className="font-medium">
              {row.original.modelo}
            </p>
          </div>
        </div>
      ),
    },
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
    { accessorKey: 'sistema_operativo',
       header: 'S.O.',
       cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <MonitorCog className="h-4 w-4 text-orange-400" />
          <div>
            <p className="font-medium">
              {row.original.sistema_operativo}
            </p>
          </div>
        </div>
      ),
   },
    { accessorKey: 'fecha_adquisicion',
       header: 'F. Adquisición',
                  cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-orange-400" />
                    <span className="text-sm">{row.original.fecha_adquisicion}</span>
                </div>
            ),
      },
    {
      accessorKey: 'fecha_baja',
      header: 'F. Baja',
      cell: ({ row }) => (
                        <div className="max-w-xs">
                    {row.original.fecha_baja ? (
                        <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-orange-400" />
                            <p
                                className="font-medium text-black"
                                title={row.original.fecha_baja}
                            >
                                {row.original.fecha_baja}
                            </p>
                        </div>
                    ) : (
                        <span className="text-gray-400 dark:text-gray-500 text-sm">
                            Sin fecha de baja
                        </span>
                    )}
                  </div>
      ),
    },
    { accessorKey: 'sala.nombre', 
      header: 'Sala',
                cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <DoorOpen className="h-4 w-4 text-orange-400" />
                    <div>
                        <p className="font-medium">
                            {row.original.sala?.nombre}
                        </p>
                    </div>
                </div>
            ),
    },
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
            <div className="flex items-center justify-between">
              <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r bg-orange-400 bg-clip-text text-transparent flex items-center gap-2">
                    <Laptop2 className="h-6 w-6 text-orange-400" />
                    Gestión de Equipos
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400">
                    Administra los equipos informáticos registrados en el sistema
                  </p>
              </div>
              <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <HelpCircle className="h-5 w-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>¿Qué es el módulo de Equipos?</DialogTitle>
                    <DialogDescription className="space-y-2">
                      <p>
                        Este módulo te permite gestionar los diferentes equipos  del ministerio.
                      </p>
                      <p className="font-semibold">Funcionalidades:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Crear nuevos equipos</li>
                        <li>Editar información de los equipos existentes</li>
                        <li>Eliminar equipos que ya no se utilizan o poner su fecha de baja</li>
                      </ul>
                    </DialogDescription>
                  </DialogContent>
                </Dialog>
            </div>
          </div>

          {/* Card principal */}
          <Card className="shadow-lg border-2 border-orange-100">
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
