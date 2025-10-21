import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage, Link, router } from '@inertiajs/react';
import { Edit, Trash2, Plus, HelpCircle,Grid2x2 } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PageProps, type BreadcrumbItem, Area_Responsable } from '@/types';
import { SimpleDataTable } from '@/components/ui/simple-data-table';


const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Gestión de Areá',
    href: '/areas',
  },
];

export default function Index() {
  const { areas } = usePage<PageProps>().props;
  const { delete: destroy, processing } = useForm();

  const handleDelete = (area: Area_Responsable) => {
    router.delete(route('areas.destroy', area.id), {
      preserveScroll: true,
      
    });
  };

  const handleEdit = (area: Area_Responsable) => {
    router.visit(route('areas.edit', area.id));
  };

  const columns: ColumnDef< Area_Responsable>[] = [
    { accessorKey: 'nombre',
       header: 'Nombre',
               cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Grid2x2 className="h-4 w-4 text-orange-400" />
                    <div>
                        <p className="font-medium">
                            {row.original.nombre}
                        </p>
                    </div>
                </div>
            ),
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const area = row.original;
        return (
          <div className="flex gap-2">
            <Button
              onClick={() => handleEdit(area)}
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
                <DialogTitle>
                  ¿Desea eliminar al Responsable "{area.nombre}"?
                </DialogTitle>
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
                      onClick={() => handleDelete(area)}
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
      <div className="min-h-screen bg-gradient-to-br p-3">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header principal */}
          <div className="text-align-left">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r bg-orange-400 bg-clip-text text-transparent flex items-center gap-2">
                    <Grid2x2 className="h-5 w-5 text-orange-400" />
                    Gestión de Área
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400">
                    Administra la lista de áreas del ministerio.
                  </p>
                </div>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <HelpCircle className="h-5 w-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>¿Qué es el módulo de Áreas?</DialogTitle>
                    <DialogDescription className="space-y-2">
                      <p>
                        Este módulo te permite gestionar las diferentes áreas o departamentos del ministerio.
                      </p>
                      <p className="font-semibold">Funcionalidades:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Crear nuevas áreas</li>
                        <li>Editar información de áreas existentes</li>
                        <li>Eliminar áreas que ya no se utilizan</li>
                      </ul>
                    </DialogDescription>
                  </DialogContent>
                </Dialog>
              </div>
          </div>
          {/* Card de tabla */}
          <Card className="shadow-lg border-2 border-orange-100 dark:border-orange-900">
            <CardHeader className="bg-gradient-to-r">
              <CardTitle className="flex items-center gap-2 text-orange-400">
                <Grid2x2 className="h-5 w-5 text-orange-400" />
                Lista de Áreas
              </CardTitle>
              <CardDescription>
                Aquí puedes visualizar, editar o eliminar las áreas registradas
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-6">
              {/* Botón Agregar */}
              <div className="flex justify-end mb-4">
                <Link href={route('areas.create')}>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Agregar Area
                  </Button>
                </Link>
              </div>

              {/* Tabla */}
              <SimpleDataTable columns={columns} data={areas.data} />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
