import AppLayout from '@/layouts/app-layout';
import { Head, usePage, Link, router, useForm } from '@inertiajs/react';
import { Trash2, Plus,  Users, Edit, HelpCircle, User, FileDigit, PhoneOutgoing, MailCheck } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PageProps, type BreadcrumbItem, type Capacitador } from '@/types';
import { CapacitadoresDataTable } from '@/components/ui/capacitadores-data-table';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Gestión de Capacitadores', href: '/capacitadores' },
];

export default function Index() {
  const { capacitadores } = usePage<PageProps>().props;
  const { processing } = useForm();

  const handleDelete = (capacitador: Capacitador) => {
    router.delete(route('capacitadores.destroy', capacitador.id), {
      onError: (errors) => console.error('Error al eliminar:', errors),
    });
  };

  const handleEdit = (capacitador: Capacitador) => {
    router.visit(route('capacitadores.edit', capacitador.id));
  };

  const columns: ColumnDef<Capacitador>[] = [
    { accessorKey: 'nombre',
       header: 'Nombre',
                cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-orange-400" />
                    <div>
                        <p className="font-medium">
                            {row.original.nombre}
                        </p>
                    </div>
                </div>
            ),
    },
    { accessorKey: 'apellido',
       header: 'Apellido',
                cell: ({ row }) => (
                <div className="flex items-center gap-2">
                   
                    <div>
                        <p className="font-medium">
                            {row.original.apellido}
                        </p>
                    </div>
                </div>
            ),
     },
    { accessorKey: 'dni',
      header: 'D.N.I',
               cell: ({ row }) => (
                  <div className="max-w-xs">
                    {row.original.dni ? (
                        <div className="flex items-center gap-1">
                            <FileDigit className="h-4 w-4 text-orange-400" />
                            <p
                                className="font-medium text-black"
                                title={row.original.dni}
                            >
                                {row.original.dni}
                            </p>
                        </div>
                    ) : (
                        <span className="text-gray-400 dark:text-gray-500 text-sm">
                            Sin D.N.I.
                        </span>
                    )}
                  </div>
            ),
    },
    { accessorKey: 'telefono', 
      header: 'Teléfono',
              cell: ({ row }) => (
                <div className="max-w-xs">
                    {row.original.telefono ? (
                        <div className="flex items-center gap-1">
                            <PhoneOutgoing className="h-4 w-4 text-orange-400" />
                            <p
                                className="font-medium text-black"
                                title={row.original.telefono}
                            >
                                {row.original.telefono}
                            </p>
                        </div>
                    ) : (
                        <span className="text-gray-400 dark:text-gray-500 text-sm">
                            Sin telefono
                        </span>
                    )}
                </div>
            ),
    },
    { accessorKey: 'correo',
      header: 'Correo',
         cell: ({ row }) => (
                <div className="max-w-xs">
                    {row.original.correo ? (
                        <div className="flex items-center gap-1">
                            <MailCheck  className="h-4 w-4 text-orange-400" />
                            <p
                                className="font-medium text-black"
                                title={row.original.correo}
                            >
                                {row.original.correo}
                            </p>
                        </div>
                    ) : (
                        <span className="text-gray-400 dark:text-gray-500 text-sm">
                            Sin correo
                        </span>
                    )}
                  </div>
            ),
    },
    {
      id: 'actions',
      header: 'Acciones',
      cell: ({ row }) => {
        const capacitador = row.original;
        return (
          <div className="flex gap-2">
            <Button onClick={() => handleEdit(capacitador)} size="sm" variant="default" title="Editar capacitador">
              <Edit className="h-4 w-4" />
            </Button>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm" title="Eliminar capacitador">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogTitle>
                  ¿Desea eliminar al Capacitador "{capacitador.nombre} {capacitador.apellido}"?
                </DialogTitle>
                <DialogDescription>
                  Esta acción no se puede deshacer. El capacitador será eliminado permanentemente del sistema.
                </DialogDescription>
                <DialogFooter className="gap-2">
                  <DialogClose asChild>
                    <Button variant="secondary">Cancelar</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(capacitador)}
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
      <Head title="Gestión de Capacitadores" />

      <div className="min-h-screen bg-gradient-to-br p-3">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-align-left">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent flex items-center gap-2">
                  <Users className="h-5 w-5 text-orange-400" />
                  Gestión de Capacitadores
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Administra la lista de capacitadores del sistema.
                </p>
              </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <HelpCircle className="h-5 w-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>¿Qué es el módulo de Capacitadores?</DialogTitle>
                    <DialogDescription className="space-y-2">
                      <p>
                        Este módulo te permite gestionar los diferentes capacitadores del ministerio.
                      </p>
                      <p className="font-semibold">Funcionalidades:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Crear nuevos capacitadores</li>
                        <li>Editar información de los capacitadores existentes</li>
                        <li>Eliminar capacitadores que ya no son parte del ministerio</li>
                      </ul>
                    </DialogDescription>
                  </DialogContent>
                </Dialog>
            </div>
          </div>

          {/* Card principal */}
          <Card className="shadow-lg border-2 border-orange-100 dark:border-orange-900">
            <CardHeader className="bg-gradient-to-r">
              <CardTitle className="flex items-center gap-2 text-orange-400">
                <Users className="h-5 w-5 text-orange-400" />
                Lista de Capacitadores
              </CardTitle>
              <CardDescription>
                Aquí puedes visualizar, editar o eliminar los capacitadores registrados.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-6">
              {/* Botón Agregar */}
              <div className="flex justify-end mb-4">
                <Link href={route('capacitadores.create')}>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Agregar Capacitador
                  </Button>
                </Link>
              </div>

              {/* Tabla */}
              <CapacitadoresDataTable
                columns={columns}
                data={capacitadores.data}
                pagination={{
                  from: capacitadores.data.length > 0 ? ((capacitadores.current_page - 1) * capacitadores.per_page) + 1 : 0,
                  to: Math.min(capacitadores.current_page * capacitadores.per_page, capacitadores.total),
                  total: capacitadores.total,
                  links: capacitadores.links,
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
