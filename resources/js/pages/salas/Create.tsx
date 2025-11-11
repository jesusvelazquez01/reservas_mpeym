import * as React from "react"
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import {  BreadcrumbItem,} from '@/types';
import { Head, router, useForm} from '@inertiajs/react';
import {  CheckCircle2, HelpCircle, Loader2, Plus } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Salas',
        href: '/salas',
    },
    {
        title: 'Alta de la Sala',
        href: '',
    },
];
export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        nombre: '',
        capacidad: '',
        ubicacion: '',
    });
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    //const [isSubmitting, setIsSubmitting] = useState(false);
    const handleSubmit = (e: React.FormEvent) => {

        e.preventDefault();
        post(route('salas.store'));
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
        <div className="text-align-left">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r bg-orange-400 bg-clip-text text-transparent flex items-center gap-2">
                <Plus className="h-5 w-5 text-orange-400" />
                Alta de Sala
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Registra la información de las salas disponibles
              </p>
            </div>
           <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <HelpCircle className="h-5 w-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>Módulo de Alta</DialogTitle>
                    <DialogDescription className="space-y-2">
                      <p>
                        Este módulo te permite dar de alta las diferentes salas del ministerio.
                      </p>
                      <p className="font-semibold">Carga Correcta de la Sala:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Nombre: Sala de Conferencias</li>
                        <li>Capacidad: 20</li>
                        <li>Ubicación: Piso 1, Edificio A</li>
                      </ul>
                      <p className="font-semibold">
                        No se permiten valores negativos
                      </p>
                    </DialogDescription>
                  </DialogContent>
                </Dialog>
          </div>
          
        </div>

        {/* Card principal */}
        <Card className="shadow-lg border-2 border-orange-100">
          <CardHeader className="bg-gradient-to-r">
            <CardTitle className="flex items-center gap-2 text-orange-400">
              <CheckCircle2 className="h-5 w-5 text-orange-400" />
              Información de la Sala
            </CardTitle>
            <CardDescription>
              Completa los campos para poder dar de alta una nueva sala.
            </CardDescription>
          </CardHeader>

          
            <CardContent className="space-y-6 pt-6">
              {/* Nombre */}
              <div className="space-y-2">
                <Label htmlFor="nombre" className="text-base">
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
                <Label htmlFor="capacidad" className="text-base ">
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
                <Label htmlFor="ubicacion" className="text-base">
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
        </Card>
           {/* Botones de Acción */}
            <Card className="shadow-lg border-2">
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-3 justify-end">
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
                  onClick={handleSubmit}
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
                </div>
              </CardContent>
            </Card>
      </div>
    </div>
  </AppLayout>
);

}