import AppLayout from '@/layouts/app-layout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import {
  Plus,
  Trash2,
  ClipboardList,
  HelpCircle,
  DoorOpen,
  Building2,
  CalendarCheck,
  FileText,
  Edit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
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
import { PageProps, type BreadcrumbItem, ControlUso } from '@/types';
import { ResponsablesDataTable } from '@/components/ui/responsables-data-table';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Control de Uso', href: '/control-uso' },
];

export default function Index() {
  const { controles } = usePage<PageProps>().props;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [recordIdToDelete, setRecordIdToDelete] = useState<number | null>(null);
  const [selectedControl, setSelectedControl] = useState<ControlUso | null>(null);

  const columns: ColumnDef<ControlUso>[] = [
    {
      accessorKey: 'reserva.sala.nombre',
      header: 'Sala',
                  cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <DoorOpen className="h-4 w-4 text-orange-400" />
                    <span className="font-medium">{row.original.reserva?.sala?.nombre}</span>
                </div>
            ),
    },
    {
      accessorKey: 'reserva.entidad',
      header: 'Área',
                cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-orange-400" />
                    <span className="font-medium">{row.original.reserva?.entidad}</span>
                </div>
            ),
    },
    {
      accessorKey: 'reserva.fecha',
      header: 'Fecha',
                  cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <CalendarCheck className="h-4 w-4 text-orange-400" />
                    <span className="text-sm">{row.original.reserva?.fecha || 'Sin fecha'}</span>
                </div>
            ),
    },
    {
      accessorKey: 'fue_utilizada',
      header: 'Fue Utilizada',
      cell: ({ row }) => (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            row.original.fue_utilizada
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}
        >
          {row.original.fue_utilizada ? 'Sí' : 'No'}
        </span>
      ),
    },
    {
      accessorKey: 'observaciones',
      header: 'Observaciones',
      cell: ({ row }) => (
          <div className="max-w-xs">
                    {row.original.observaciones ? (
                        <div className="flex items-center gap-1">
                            <FileText className="h-3 w-3 text-gray-400" />
                            <p
                                className="text-sm text-gray-600 dark:text-gray-400 truncate"
                                title={row.original.observaciones}
                            >
                                {row.original.observaciones}
                            </p>
                        </div>
                    ) : (
                        <span className="text-gray-400 dark:text-gray-500 text-sm">
                            Sin motivo
                        </span>
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
          <div className="flex gap-2">
            <Link href={route('control-uso.edit', control.id)}>
              <Button size="sm" variant="default">
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
            <Button
              size="sm"
              variant="destructive"
              title="Eliminar control"
              onClick={() => {
                setRecordIdToDelete(control.id);
                setSelectedControl(control);
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
      router.delete(route('control-uso.destroy', recordIdToDelete), {
        preserveScroll: true,
        onSuccess: () => {
          setIsDialogOpen(false);
          setRecordIdToDelete(null);
          setSelectedControl(null);
        },
        onError: () => {
          console.error('Error al eliminar el control de uso');
        },
      });
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Control de Uso" />

      <div className="min-h-screen bg-gradient-to-br p-3">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header principal */}
          <div className="text-align-left">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-orange-400 bg-clip-text text-transparent flex items-center gap-2">
                  <ClipboardList className="h-6 w-6 text-orange-400" />
                  Control de Uso
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Gestiona los registros de uso de las salas y equipos.
                </p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <HelpCircle className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogTitle>¿Qué es el módulo de Control de Uso?</DialogTitle>
                  <DialogDescription className="space-y-2">
                    <p>
                      Este módulo te permite gestionar el uso real de las salas y equipos
                      reservados.
                    </p>
                    <p className="font-semibold">Funciones disponibles:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Registrar si una sala o equipo fue efectivamente utilizado</li>
                      <li>Editar observaciones sobre el uso</li>
                      <li>Eliminar registros antiguos o incorrectos</li>
                    </ul>
                  </DialogDescription>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Card principal */}
          <Card className="shadow-lg border-2 border-orange-100">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2 text-orange-400">
                    <ClipboardList className="h-5 w-5 text-orange-400" />
                    Listado de Controles
                  </CardTitle>
                  <CardDescription>
                    Consulta, edita o elimina los registros de control de uso.
                  </CardDescription>
                </div>
                <Link href={route('control-uso.create')}>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" /> Nuevo Registro
                  </Button>
                </Link>
              </div>
            </CardHeader>

            <CardContent className="pt-6">

           <ResponsablesDataTable
                columns={columns}
                data={controles.data || []}
                pagination={{
                  from: controles.from || 0,
                  to: controles.to || 0,
                  total: controles.total || 0,
                  links: controles.links || [],
                  OnPageChange: (url: string | null) => {
                    if (url) router.get(url, {}, { preserveScroll: true });
                  },
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AlertDialog */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar registro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El registro del control de uso{' '}
              {selectedControl?.reserva?.entidad && (
                <>
                  de la entidad <strong>{selectedControl.reserva.entidad}</strong>
                </>
              )}{' '}
              será eliminado permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsDialogOpen(false);
                setRecordIdToDelete(null);
                setSelectedControl(null);
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