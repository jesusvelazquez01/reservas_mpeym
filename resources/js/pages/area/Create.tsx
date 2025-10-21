import * as React from "react";
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem } from '@/types';
import { Loader2, CheckCircle, Plus, HelpCircle } from 'lucide-react';
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
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";




const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Areas', href: '/areas' },
  { title: 'Dar de Alta', href: '' },
];

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    nombre: '',
  });

  const [showCancelDialog, setShowCancelDialog] = React.useState(false);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); post(route('areas.store')); };
  const handleCancel = () => {
    if(Object.values(data).some(v => v)) setShowCancelDialog(true);
    else router.visit(route('areas.index'));
  };
  const confirmCancel = () => router.visit(route('areas.index'));

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Alta de Capacitador" />
      <div className="min-h-screen bg-gradient-to-br p-3">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-align-left">
            <div className="flex items-center justify-between">
              <div>
                      <h1 className="text-2xl font-bold bg-gradient-to-r bg-orange-400 bg-clip-text text-transparent flex items-center gap-2">
                    <Plus className="h-6 w-6 text-orange-400" />
                    Alta de Aréa
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400">Registra las areas del ministerio.</p>
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
                        Este módulo te permite dar de alta áreas o departamentos del ministerio.
                      </p>
                      <p className="font-semibold">Carga correcta del area:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Nombre: Dirección de Infraestructura</li>
                      </ul>
                      <p className="font-semibold">
                        Una vez completada la carga, presiona el botón "Guardar" para registrar el area en el sistema.
                      </p>
                        <p>
                        <span className="font-semibold">Nota:</span> Los campos marcados con <span className="text-red-500">*</span> son obligatorios.
                      </p>
                    </DialogDescription>
                  </DialogContent>
                </Dialog>
            </div>
           
            </div>
          

          <Card className="shadow-lg border-2 border-orange-100 dark:border-orange-900">
            
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-400">
                  <CheckCircle className="h-5 w-5 text-orange-400" />
                  Información del Area
                </CardTitle>
                <CardDescription>
                  Completa todos los campos obligatorios para registrar una nueva area.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6 pt-6">
                {/* Nombre / Apellido */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nombre <span className="text-red-500">*</span></Label>
                    <Input
                      value={data.nombre}
                      onChange={e => setData('nombre', e.target.value)}
                      placeholder="Nombre del Area"
                      disabled={processing}
                    />
                    {errors.nombre && <p className="text-sm text-red-500">{errors.nombre}</p>}
                  </div>
                </div>
              </CardContent>
            
          </Card>
          {/* Botones */}
                    <Card className="shadow-lg border-2 mt-4">
                      <CardContent className="p-6 flex flex-wrap gap-3 justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCancel}
                          className="gap-2 bg-white"
                        >
                          Cancelar
                        </Button>
          
                        <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Descartar cambios?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tienes datos sin guardar. ¿Deseas salir sin guardar los cambios?
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
                          className="gap-2"
                          onClick={handleSubmit}
                        >
                          {processing ? (
                            <div className="flex items-center gap-2">
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Guardando...
                            </div>
                          ) : (
                            "Guardar"
                          )}
                        </Button>
                      </CardContent>
                    </Card>
        </div>
      </div>
    </AppLayout>
  );
}