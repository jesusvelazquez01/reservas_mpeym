import * as React from "react";
import { useState } from "react";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { Sala, type BreadcrumbItem, type Equipo } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { es } from 'date-fns/locale';
import { ChevronDownIcon, Loader2, Monitor, CheckCircle2, HelpCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Equipos', href: '/equipos' },
  { title: 'Editar Equipo', href: '' },
];

interface EditProps {
  equipo: Equipo;
  salas: Sala[];
}

export default function Edit({ equipo, salas }: EditProps) {
  const [openAdq, setOpenAdq] = useState(false);
  const [openBaja, setOpenBaja] = useState(false);
  const [dateAdq, setDateAdq] = useState<Date | undefined>(
    equipo.fecha_adquisicion ? new Date(equipo.fecha_adquisicion) : undefined
  );
  const [dateBaja, setDateBaja] = useState<Date | undefined>(
    equipo.fecha_baja ? new Date(equipo.fecha_baja) : undefined
  );
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const { data, setData, put, processing, errors } = useForm({
    marca: equipo.marca || '',
    modelo: equipo.modelo || '',
    estado_inicial: equipo.estado_inicial || '',
    sistema_operativo: equipo.sistema_operativo || '',
    fecha_adquisicion: equipo.fecha_adquisicion || '',
    fecha_baja: equipo.fecha_baja || '',
    sala_id: equipo.sala_id?.toString() || '',
  });

  const formatDateForBackend = (date: Date): string =>
    date.toISOString().split('T')[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('equipos.update', equipo.id));
  };

  const handleCancel = () => {
    const original = {
      marca: equipo.marca,
      modelo: equipo.modelo,
      estado_inicial: equipo.estado_inicial,
      sistema_operativo: equipo.sistema_operativo,
      fecha_adquisicion: equipo.fecha_adquisicion,
      fecha_baja: equipo.fecha_baja,
      sala_id: equipo.sala_id?.toString(),
    };
    if (JSON.stringify(data) !== JSON.stringify(original)) {
      setShowCancelDialog(true);
    } else {
      router.visit(route('equipos.index'));
    }
  };

  const confirmCancel = () => router.visit(route('equipos.index'));

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Editar Equipo" />

      <div className="min-h-screen bg-gradient-to-br p-3">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Header */}
          <div className="text-align-left">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r bg-orange-400 bg-clip-text text-transparent flex items-center gap-2">
                  <Monitor className="h-5 w-5 text-orange-400" />
                  Editar Equipo
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  Modifica la información del equipo seleccionado
                </p>
              </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <HelpCircle className="h-5 w-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogTitle>Módulo de Edición</DialogTitle>
                    <DialogDescription className="space-y-2">
                      <p>
                        Este módulo te permite editar el equipo seleccionado del ministerio.
                      </p>
                      <p className="font-semibold">Edición correcta del equipo:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Marca:Asus</li>
                        <li>Modelo: Vivobook 15</li>
                        <li>Estado: Excelente</li>
                        <li>Sistema Operativo: Windows 11</li>
                        <li>Fecha de adquisición: 17/10/2025</li>
                        <li>Fecha de baja 'opcional': 17/10/2030</li>
                        <li>Sala: Sala de Capacitación</li>
                      </ul>
                      <p className="font-semibold">
                           Una vez completada la edición, presiona el botón "Actualizar" para registrar los nuevos datos en el sistema.
                      </p>
                      <p>
                        <span className="font-semibold">Nota:</span> Los campos marcados con <span className="text-red-500">*</span> son obligatorios.
                      </p>
                    </DialogDescription>
                  </DialogContent>
                </Dialog>
            </div>
            
            
          </div>

          {/* Card principal */}
          <Card className="shadow-lg border-2 border-orange-100 ">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-400">
                <CheckCircle2 className="h-5 w-5 text-orange-400" />
                Información del Equipo
              </CardTitle>
              <CardDescription>
                Modifica los campos que necesites actualizar
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              {/* Marca / Modelo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Marca <span className="text-red-500">*</span></Label>
                  <Input
                    placeholder="HP, Dell, Lenovo..."
                    value={data.marca}
                    onChange={(e) => setData('marca', e.target.value)}
                    disabled={processing}
                  />
                  {errors.marca && <p className="text-sm text-red-500">{errors.marca}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Modelo <span className="text-red-500">*</span></Label>
                  <Input
                    placeholder="Pavilion 15, Inspiron..."
                    value={data.modelo}
                    onChange={(e) => setData('modelo', e.target.value)}
                    disabled={processing}
                  />
                  {errors.modelo && <p className="text-sm text-red-500">{errors.modelo}</p>}
                </div>
              </div>

              {/* Estado / Sistema Operativo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Estado Inicial <span className="text-red-500">*</span></Label>
                  <Select
                    value={data.estado_inicial}
                    onValueChange={(value) => setData('estado_inicial', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excelente">Excelente</SelectItem>
                      <SelectItem value="bueno">Bueno</SelectItem>
                      <SelectItem value="regular">Regular</SelectItem>
                      <SelectItem value="malo">Malo</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.estado_inicial && <p className="text-sm text-red-500">{errors.estado_inicial}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Sistema Operativo <span className="text-red-500">*</span></Label>
                  <Input
                    placeholder="Windows 11, Ubuntu..."
                    value={data.sistema_operativo}
                    onChange={(e) => setData('sistema_operativo', e.target.value)}
                    disabled={processing}
                  />
                  {errors.sistema_operativo && <p className="text-sm text-red-500">{errors.sistema_operativo}</p>}
                </div>
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fecha de Adquisición <span className="text-red-500">*</span></Label>
                  <Popover open={openAdq} onOpenChange={setOpenAdq}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-48 justify-between font-normal" type="button">
                        {dateAdq ? dateAdq.toLocaleDateString() : "Seleccionar fecha"}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateAdq}
                        onSelect={(date) => {
                          setDateAdq(date);
                          if (date) setData('fecha_adquisicion', formatDateForBackend(date));
                          setOpenAdq(false);
                        }}
                        locale={es}
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.fecha_adquisicion && <p className="text-sm text-red-500">{errors.fecha_adquisicion}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Fecha de Baja (opcional)</Label>
                  <Popover open={openBaja} onOpenChange={setOpenBaja}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-48 justify-between font-normal" type="button">
                        {dateBaja ? dateBaja.toLocaleDateString() : "Seleccionar fecha"}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dateBaja}
                        onSelect={(date) => {
                          setDateBaja(date);
                          setData('fecha_baja', date ? formatDateForBackend(date) : '');
                          setOpenBaja(false);
                        }}
                        locale={es}
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.fecha_baja && <p className="text-sm text-red-500">{errors.fecha_baja}</p>}
                </div>
              </div>

              {/* Sala */}
              <div className="space-y-2">
                <Label>Sala <span className="text-red-500">*</span></Label>
                <Select value={data.sala_id} onValueChange={(value) => setData('sala_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar sala..." />
                  </SelectTrigger>
                  <SelectContent>
                    {salas.map((sala) => (
                      <SelectItem key={sala.id} value={sala.id.toString()}>{sala.nombre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.sala_id && <p className="text-sm text-red-500">{errors.sala_id}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Botones de acción */}
          <Card className="shadow-lg border-2 mt-4">
            <CardContent className="p-6 flex flex-wrap gap-3 justify-end">
              <Button type="button" variant="outline" onClick={handleCancel} className="gap-2 bg-white">
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

              <Button type="submit" disabled={processing} className="gap-2" onClick={handleSubmit}>
                {processing ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Guardando...
                  </div>
                ) : (
                  'Actualizar'
                )}
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </AppLayout>
  );
}
