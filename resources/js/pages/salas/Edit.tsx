import * as React from "react"
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import {  BreadcrumbItem, PageProps, Sala } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { CheckCircle2, Loader2, Pencil } from 'lucide-react';
import { useState } from "react";


interface EditProps extends PageProps {
    sala: Sala;
}
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Salas',
        href: '/salas',
    },
    {
        title: 'Editar Sala',
        href: '',
    },
];
export default function Edit() {
    const { salas } = usePage<EditProps>().props;
    const { data, setData, put, processing, errors } = useForm({
        nombre: salas.nombre,
        capacidad: salas.capacidad,
        ubicacion: salas.ubicacion,
    });
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('salas.update',salas.id));
    };
     
    const handleCancel = () => {
         if (data.nombre || data.capacidad || data.ubicacion) {
                    setShowCancelDialog(true);
                } else {
                    router.visit(route('salas.index'));
                }
    };
 const confirmCancel = () => {
            router.visit(route('salas.index'));
        };
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
    <Head title="Alta de Sala" />

    <div className="min-h-screen bg-gradient-to-br p-3">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header principal */}
        <div className="text-align-left">
          <h1 className="text-2xl font-bold bg-gradient-to-r bg-orange-400 bg-clip-text text-transparent flex items-center gap-2">
            <Pencil className="h-6 w-6 text-orange-400" />
            Editar la Sala
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Editar la información de las salas disponibles
          </p>
        </div>

        {/* Card principal */}
        <Card className="shadow-lg border-2 border-orange-100 dark:border-orange-900">
          <CardHeader className="bg-gradient-to-r">
            <CardTitle className="flex items-center gap-2 text-orange-400">
              <CheckCircle2 className="h-5 w-5 text-orange-400" />
              Información de la Sala
            </CardTitle>
            <CardDescription>
              Completa los campos para poder editar la sala.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6 pt-6">
              {/* Nombre */}
              <div className="space-y-2">
                <Label htmlFor="nombre" className="text-base font-semibold">
                  Nombre de la Sala
                </Label>
                <Input
                  id="nombre"
                  placeholder="Ej: Sala de Conferencias"
                  value={data.nombre}
                  onChange={(e) => setData('nombre', e.target.value)}
                  disabled={processing}
                  className="focus-visible:ring-orange-50"
                />
                {errors.nombre && (
                  <p className="text-sm text-red-500">{errors.nombre}</p>
                )}
              </div>

              {/* Capacidad */}
              <div className="space-y-2">
                <Label htmlFor="capacidad" className="text-base font-semibold">
                  Capacidad
                </Label>
                <Input
                  id="capacidad"
                  placeholder="Ej: 20"
                  value={data.capacidad}
                  onChange={(e) => setData('capacidad', e.target.value)}
                  disabled={processing}
                  className="focus-visible:ring-orange-50"
                />
                {errors.capacidad && (
                  <p className="text-sm text-red-500">{errors.capacidad}</p>
                )}
              </div>

              {/* Ubicación */}
              <div className="space-y-2">
                <Label htmlFor="ubicacion" className="text-base font-semibold">
                  Ubicación
                </Label>
                <Input
                  id="ubicacion"
                  placeholder="Ej: Piso 1, Edificio A"
                  value={data.ubicacion}
                  onChange={(e) => setData('ubicacion', e.target.value)}
                  disabled={processing}
                  className="focus-visible:ring-orange-50"
                />
                {errors.ubicacion && (
                  <p className="text-sm text-red-500">{errors.ubicacion}</p>
                )}
              </div>
            </CardContent>

            {/* Footer de acciones */}
            <CardFooter className="p-6 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="gap-2  bg-white"
              >
                Cancelar
              </Button>

              <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Descartar cambios?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tienes datos sin guardar. ¿Estás seguro de salir sin guardar los cambios?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Seguir editando</AlertDialogCancel>
                    <AlertDialogAction onClick={confirmCancel}>
                      Descartar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button
                type="submit"
                disabled={processing}
                className="gap-2 "
              >
                {processing ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Guardando...
                  </div>
                ) : (
                  'Guardar'
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  </AppLayout>
    );
}