import AppLayout from '@/layouts/app-layout';
import { Head, useForm, usePage, Link, router } from '@inertiajs/react';
import { Edit, Trash2, Plus, Users } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResponsablesDataTable } from '@/components/ui/responsables-data-table';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PageProps, type BreadcrumbItem, type Responsable } from '@/types';


const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Gestión de Responsables',
    href: '/responsables',
  },
];

export default function Index() {
  const { responsables } = usePage<PageProps>().props;
  const { delete: destroy, processing } = useForm();

  const handleDelete = (responsable: Responsable) => {
    router.delete(route('responsables.destroy', responsable.id), {
      preserveScroll: true,
      
    });
  };

  const handleEdit = (responsable: Responsable) => {
    router.visit(route('responsables.edit', responsable.id));
  };

  const columns: ColumnDef<Responsable>[] = [
    { accessorKey: 'nombre', header: 'Nombre' },
    { accessorKey: 'apellido', header: 'Apellido' },
    { accessorKey: 'dni', header: 'D.N.I' },
    { accessorKey: 'telefono', header: 'Teléfono' },
    { accessorKey: 'correo', header: 'Correo' },
    { accessorKey: 'area', header: 'Área' },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const responsable = row.original;
        return (
          <div className="flex gap-2">
            <Button
              onClick={() => handleEdit(responsable)}
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
                  ¿Desea eliminar al Responsable "{responsable.nombre} {responsable.apellido}"?
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
                      onClick={() => handleDelete(responsable)}
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
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent flex items-center gap-2">
              <Users className="h-5 w-5 text-orange-400" />
              Gestión de Responsables
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Administra la lista de responsables del sistema.
            </p>
          </div>

          {/* Card de tabla */}
          <Card className="shadow-lg border-2 border-orange-100 dark:border-orange-900">
            <CardHeader className="bg-gradient-to-r">
              <CardTitle className="flex items-center gap-2 text-orange-400">
                <Users className="h-5 w-5 text-orange-400" />
                Lista de Responsables
              </CardTitle>
              <CardDescription>
                Aquí puedes visualizar, editar o eliminar los responsables registrados.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-6">
              {/* Botón Agregar */}
              <div className="flex justify-end mb-4">
                <Link href={route('responsables.create')}>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Agregar Responsable
                  </Button>
                </Link>
              </div>

              {/* Tabla */}
              <ResponsablesDataTable
                columns={columns}
                data={responsables.data}
                pagination={{
                  from: responsables.data.length > 0 ? ((responsables.current_page - 1) * responsables.per_page) + 1 : 0,
                  to: Math.min(responsables.current_page * responsables.per_page, responsables.total),
                  total: responsables.total,
                  links: responsables.links,
                  OnPageChange: (url: string | null) => {
                    if (url) router.get(url);
                  },
                }}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
