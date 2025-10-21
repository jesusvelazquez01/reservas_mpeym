import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { DateSelectArg, EventClickArg } from '@fullcalendar/core';
import esLocale from '@fullcalendar/core/locales/es';
import { Undo2 } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Toaster } from 'sonner';
import { entidad } from '@/constants/estados';
import { cn } from '@/lib/utils';
import { ResponsableAutocomplete } from '@/components/ui/responsable-autocomplete';
import { type Sala, type Responsable, type Reserva, type PageProps, type Capacitador } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


type ReservaCalendario = Reserva & {
  title: string;
  start: string;
  end: string;
  controlUso?: unknown;
  esPasada?: boolean;
  tieneControl?: boolean;
  estado?: 'futura' | 'pasada_sin_control' | 'pasada_con_control' | 'muy_antigua';
  puedeEditar?: boolean;
};

interface Props extends PageProps {
  sala: Sala;
  reservas: ReservaCalendario[];
  todasLasSalas: Sala[];
  responsables: Responsable[];
  capacitadores: Capacitador[];
  errors?: Record<string, string>;
  flash?: {
    success?: string;
  };
}

function esReservaPasada(fecha: string) {
  return new Date(fecha) < new Date(new Date().toISOString().split('T')[0]);
}

export default function CalendarioSala({ 
  sala, 
  reservas, 
  todasLasSalas, 
  responsables, 
  capacitadores,
  flash, 
  errors 
}: Props) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [alertDialogAbierto, setAlertDialogAbierto] = useState(false);

  
  const { data, setData, post, put, processing, errors: formErrors } = useForm({
    id: null as number | null,
    fecha: '',
    hora_inicio: '',
    hora_fin: '',
    responsable: '',
    entidad: '',
    motivo: '',
    cantidad_equipos: 0,
    sala_id: sala.id,
    capacitadores_ids: [] as number[],
    tieneControl: false,
    puedeEditar: true,
  });
  const getEventColor = (reserva: ReservaCalendario) => {
    switch(reserva.estado) {
      case 'futura': return '#eb7f34';
      case 'pasada_sin_control': return 'rgba(239, 68, 68, 0.6)';
      case 'pasada_con_control': return '#10b981';
      case 'muy_antigua': return 'rgba(156, 163, 175, 0.4)';
      default: return '#eb7f34';
    }
  };

  const getTextColor = (reserva: ReservaCalendario) => {
    return reserva.esPasada ? '#666666' : '#ffffff';
  };

  const handleSelect = (info: DateSelectArg) => {
    const fechaSeleccionada = new Date(info.start);
    const ahora = new Date();

    if (fechaSeleccionada < ahora) {
      toast.warning("No puedes reservar en horarios pasados");
      return;
    }

    const fecha = info.startStr.split('T')[0];
    const hora_inicio = info.startStr.split('T')[1].substring(0, 5);
    const hora_fin = info.endStr.split('T')[1].substring(0, 5);

    setData({
      id: null,
      fecha,
      hora_inicio,
      hora_fin,
      responsable: '',
      entidad: '',
      motivo: '',
      cantidad_equipos: 0,
      sala_id: sala.id,
      capacitadores_ids: [],
      tieneControl: false,
      puedeEditar: true
    });

    setModoEdicion(false);
    setModalAbierto(true);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const evento = clickInfo.event;
    const fecha = evento.startStr.split('T')[0];
    const hora_inicio = evento.startStr.split('T')[1].substring(0, 5);
    const hora_fin = evento.endStr.split('T')[1].substring(0, 5);
    const reserva = reservas.find(r => r.id.toString() === evento.id);

    if (!reserva) {
      toast.error("No se pudo encontrar la información de la reserva");
      return;
    }

    setData({
      id: reserva.id,
      fecha,
      hora_inicio,
      hora_fin,
      responsable: reserva.responsable || '',
      entidad: reserva.entidad || '',
      motivo: reserva.motivo || '',
      cantidad_equipos: reserva.cantidad_equipos || 0,
      sala_id: sala.id,
      capacitadores_ids: reserva.capacitadores?.map(c => c.id) || [],
      tieneControl: !!reserva.controlUso,
      puedeEditar: reserva.puedeEditar ?? true,
    });

    setModoEdicion(true);
    setModalAbierto(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const loadingToast = toast.loading("Procesando reserva...");

    if (modoEdicion && data.id) {
      put(`/reservas/${data.id}`, {
        onSuccess: () => {
          toast.dismiss(loadingToast);
          setTimeout(() => {
            router.reload({ only: ['reservas'] });
          }, 1500);
          setModalAbierto(false);
        },
        onError: () => {
          toast.dismiss(loadingToast);
          
          
        },
        preserveScroll: true
      });
    } else {
      post('/reservas', {
        onSuccess: () => {
          toast.dismiss(loadingToast);
          setTimeout(() => {
            router.visit(`/salas/${sala.id}/reservas`, {
              preserveScroll: true,
              preserveState: false
              
            });
          }, 1500);
          setModalAbierto(false);
        },
        onError: () => {
          toast.dismiss(loadingToast);
          toast.error("Ya existe una reserva en ese horario");
        },
        preserveScroll: true
      });
    }
  };

  const handleCancelarReserva = () => {
    if (data.id) {
      router.delete(`/reservas/${data.id}`, {
        preserveScroll: true,
        onSuccess: () => {

        }
      });
      setModalAbierto(false);
      setAlertDialogAbierto(false);
    }
  };

  return (
    <AppLayout>
      <Head title={`Reservas - ${sala.nombre}`} />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-2">Calendario de {sala.nombre}</h1>

        <div className="mb-4 flex items-center gap-3">
          <Label htmlFor="select-sala" className="font-semibold text-gray-700">
            Cambiar sala:
          </Label>
          <Select
            value={sala.id.toString()}
            onValueChange={(value) => {
              router.visit(`/salas/${value}/reservas`);
            }}
          >
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Selecciona una sala" />
            </SelectTrigger>
            <SelectContent>
              {todasLasSalas.map((s) => (
                <SelectItem key={s.id} value={s.id.toString()}>
                  {s.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4">
          <Button variant="ghost" asChild>
            <a href="/dashboard" className="inline-flex items-center">
              <Undo2 className="mr-2 h-4 w-4" />
              Ir al dashboard
            </a>
          </Button>
        </div>

        {/* Leyenda de colores */}
        <div className="mb-4 bg-gray-50 rounded-lg p-4 border">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Validaciones:</h3>
          <div className="flex flex-wrap gap-4">
            <Badge variant="outline" className="gap-2">
              <div className="w-3 h-3 rounded" style={{backgroundColor: '#eb7f34'}}></div>
              <span>Futuras</span>
            </Badge>
            <Badge variant="outline" className="gap-2">
              <div className="w-3 h-3 rounded" style={{backgroundColor: 'rgba(239, 68, 68, 0.6)'}}></div>
              <span>Pasadas sin control</span>
            </Badge>
            <Badge variant="outline" className="gap-2">
              <div className="w-3 h-3 rounded" style={{backgroundColor: '#10b981'}}></div>
              <span>Pasadas con control</span>
            </Badge>
            <Badge variant="outline" className="gap-2">
              <div className="w-3 h-3 rounded" style={{backgroundColor: 'rgba(156, 163, 175, 0.4)'}}></div>
              <span>Muy antiguas</span>
            </Badge>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 border">


          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            selectable={true}
            selectMirror={true}
            unselectAuto={true}
            unselectCancel="[role='dialog'], [data-radix-dialog-content], [data-radix-popover-content], [data-radix-popover-trigger], .select-trigger, .command-input, .command-item, .command-list, .command-group, button, input, textarea, select"
            select={handleSelect}
            eventClick={handleEventClick}
            initialView="timeGridWeek"
            locale={esLocale}
            slotMinTime="08:00:00"
            slotMaxTime="22:00:00"
            slotDuration="00:30:00"
            nowIndicator={true}
            allDaySlot={false}
            height="auto"
            events={reservas.map((reserva) => ({
              ...reserva,
              id: reserva.id.toString(),
              backgroundColor: getEventColor(reserva),
              borderColor: getEventColor(reserva),
              textColor: getTextColor(reserva)
            }))}
            eventColor="#eb7f34"
            eventTextColor="#ffffff"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            titleFormat={{
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            }}
            slotLabelFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            }}
          />
        </div>
      </div>

      {/* Dialog Modal */}
      <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {modoEdicion ? 'Editar reserva' : 'Nueva reserva'}
            </DialogTitle>
            <DialogDescription>
              {modoEdicion 
                ? 'Modifica los datos de tu reserva' 
                : 'Completa los datos para crear una nueva reserva'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="entidad">Área</Label>
              <Select
                value={data.entidad}
                onValueChange={(value) => setData('entidad', value)}
                disabled={processing}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un área..." />
                </SelectTrigger>
                <SelectContent>
                  {entidad.map((area) => (
                    <SelectItem key={area.value} value={area.value}>
                      {area.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="responsable">Jefe de Área *</Label>
              {modoEdicion && !data.puedeEditar ? (
                <Input
                  type="text"
                  value={data.responsable}
                  disabled
                />
              ) : (
                <ResponsableAutocomplete
                  value={data.responsable}
                  onChange={(value) => setData('responsable', value)}
                  responsables={responsables}
                  placeholder="Buscar jefe por nombre o DNI..."
                />
              )}
              {formErrors?.responsable && (
                <p className="text-sm text-destructive">{formErrors.responsable}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="motivo">Motivo (opcional)</Label>
              <Textarea
                id="motivo"
                rows={3}
                value={data.motivo}
                disabled={modoEdicion && !data.puedeEditar}
                onChange={(e) => setData('motivo', e.target.value)}
                placeholder="Describe el motivo de la reserva..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cantidad_equipos">Cantidad de Equipos</Label>
              <Input
                id="cantidad_equipos"
                type="number"
                min="0"
                value={data.cantidad_equipos}
                disabled={modoEdicion && !data.puedeEditar}
                onChange={(e) => setData('cantidad_equipos', parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>

            {/* Sección de Capacitadores */}
            <div className="space-y-2">
              <Label>Capacitadores</Label>
              <div className="max-h-40 overflow-y-auto border rounded-md p-3 bg-gray-50 space-y-2">
                {capacitadores.map((capacitador) => (
                  <div key={capacitador.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`capacitador-${capacitador.id}`}
                      checked={data.capacitadores_ids.includes(capacitador.id)}
                      disabled={modoEdicion && !data.puedeEditar}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setData('capacitadores_ids', [...data.capacitadores_ids, capacitador.id]);
                        } else {
                          setData('capacitadores_ids',
                            data.capacitadores_ids.filter(id => id !== capacitador.id)
                          );
                        }
                      }}
                    />
                    <label
                      htmlFor={`capacitador-${capacitador.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {capacitador.nombre} {capacitador.apellido} - DNI: {capacitador.dni}
                    </label>
                  </div>
                ))}
                {capacitadores.length === 0 && (
                  <p className="text-sm text-muted-foreground">No hay capacitadores registrados</p>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Seleccionados: {data.capacitadores_ids.length}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Fecha</Label>
                <Input type="text" value={data.fecha} disabled />
              </div>
              <div className="space-y-2">
                <Label>Hora Inicio</Label>
                <Input type="text" value={data.hora_inicio} disabled />
              </div>
              <div className="space-y-2">
                <Label>Hora Fin</Label>
                <Input type="text" value={data.hora_fin} disabled />
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-2 pt-4">
              {modoEdicion && data.id && data.puedeEditar && 
               esReservaPasada(data.fecha) && !data.tieneControl && (
                <Button
                  type="button"
                  onClick={() => router.visit('/control-uso')}
                  variant="default"
                >
                  Registrar uso
                </Button>
              )}

              {modoEdicion && data.id && data.puedeEditar && 
               !esReservaPasada(data.fecha) && (
                <Button
                  type="button"
                  onClick={() => setAlertDialogAbierto(true)}
                  variant="destructive"
                >
                  Cancelar reserva
                </Button>
              )}

              <Button
                type="button"
                onClick={() => setModalAbierto(false)}
                variant="outline"
              >
                Cerrar
              </Button>

              {(!modoEdicion || (data.puedeEditar && !esReservaPasada(data.fecha))) && (
                <Button type="submit" disabled={processing}>
                  {processing ? 'Guardando...' : 'Guardar'}
                </Button>
              )}
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Alert Dialog para confirmación de cancelación */}
      <AlertDialog open={alertDialogAbierto} onOpenChange={setAlertDialogAbierto}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se cancelará permanentemente la reserva.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, mantener reserva</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelarReserva}>
              Sí, cancelar reserva
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster 
        position="top-right"
        expand={true}
        richColors
      />
    </AppLayout>
  );
}