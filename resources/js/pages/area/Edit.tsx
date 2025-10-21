import * as React from "react";
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {  type BreadcrumbItem,Area_Responsable } from '@/types';
import { Loader2, CheckCircle, Grid2x2 } from 'lucide-react';
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

interface EditProps{
    area:Area_Responsable;
}


const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Areas', href: '/areas' },
  { title: 'Editar Area', href: '' },
];

export default function Edit({area}:EditProps) {
    
  const { data, setData, put, processing, errors } = useForm({
    nombre: area.nombre
  });

  const [showCancelDialog, setShowCancelDialog] = React.useState(false);
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); put(route('areas.update',area.id)); };
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
            <h1 className="text-2xl font-bold bg-gradient-to-r bg-orange-400 bg-clip-text text-transparent flex items-center gap-2">
              <Grid2x2 className="h-6 w-6 text-orange-400" />
              Editar Aréa
            </h1>
            <p className="text-slate-600 dark:text-slate-400">Editar area del ministerio.</p>
          </div>

          <Card className="shadow-lg border-2 border-orange-100 dark:border-orange-900">
            
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-400">
                  <CheckCircle className="h-5 w-5 text-orange-400" />
                  Información del Area
                </CardTitle>
                <CardDescription>
                  Completa todos los campos obligatorios para editar una nueva area.
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