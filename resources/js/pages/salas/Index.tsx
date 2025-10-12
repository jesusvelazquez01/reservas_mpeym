import AppLayout from '@/layouts/app-layout';
import { Head, usePage, router, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Pencil, Plus, Trash2, Building2, Edit } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { SimpleDataTable } from '@/components/ui/simple-data-table';
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
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BreadcrumbItem, Sala, PageProps } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Gestión de Salas', href: '/salas' },
];

export default function Index() {
  const { salas } = usePage<PageProps>().props;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [recordIdToDelete, setRecordIdToDelete] = useState<number | null>(null);
  const [selectedSala, setSelectedSala] = useState<Sala | null>(null);

  const columns: ColumnDef<Sala>[] = [
    { accessorKey: 'nombre', header: 'Nombre' },
    { accessorKey: 'capacidad', header: 'Capacidad' },
    { accessorKey: 'ubicacion', header: 'Ubicación' },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const sala = row.original;
        return (
          <div className="flex gap-2">
            <Link href={route('salas.edit', sala.id)}>
              <Button size="sm" variant="default">
                <Edit className="h-4 w-4" />
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
              <Trash2 className="h-4 w-4" />
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
        onError: () => console.error('Error al eliminar la Sala'),
      });
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Gestión de Salas" />

      <div className="min-h-screen bg-gradient-to-br p-3">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header principal */}
          <div className="text-align-left">
            <h1 className="text-2xl font-bold bg-gradient-to-r bg-orange-400 bg-clip-text text-transparent flex items-center gap-2">
              <Building2 className="h-6 w-6 text-orange-400" />
              Gestión de Salas
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Administra las salas registradas en el sistema
            </p>
          </div>

          {/* Card principal */}
          <Card className="shadow-lg border-2 border-orange-100 dark:border-orange-900">
            <CardHeader className="bg-gradient-to-r">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center gap-2 text-orange-400">
                    <Plus className="h-5 w-5 text-orange-400" />
                    Listado de Salas
                  </CardTitle>
                  <CardDescription>
                    Consulta, edita o elimina las salas disponibles.
                  </CardDescription>
                </div>
                <Link href={route('salas.create')}>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" /> Nueva Sala
                  </Button>
                </Link>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <SimpleDataTable columns={columns} data={salas} />
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
              Esta acción no se puede deshacer. La sala "{selectedSala?.nombre}" será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsDialogOpen(false);
                setRecordIdToDelete(null);
                setSelectedSala(null);
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
