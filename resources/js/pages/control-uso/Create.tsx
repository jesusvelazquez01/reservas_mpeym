import { useState } from 'react';
import { Save, CheckCircle2, AlertCircle, Monitor, Power, XCircle, Cable, Battery, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type Reserva, type Equipo } from '@/types';
import { Head, router } from '@inertiajs/react';

interface Props {
  reservas: Reserva[];
  equipos: Equipo[];
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Control de Uso', href: '/control-uso' },
  { title: 'Registrar', href: '/control-uso/create' },
];

type EquipoSeleccionado = {
  equipo_id: number;
  estado_pantalla: string;
  estado_final: string;
  se_encendio: boolean;
  se_apago: boolean;
  se_conecto_a_cargar: boolean;
  nivel_bateria: number;
  observaciones_equipo: string;
};

const estadoColors = {
  excelente: 'bg-green-500',
  bueno: 'bg-blue-500',
  regular: 'bg-yellow-500',
  malo: 'bg-red-500'
};

export default function Create({ reservas, equipos }: Props) {
  const [reservaId, setReservaId] = useState('');
  const [fueUtilizada, setFueUtilizada] = useState('Si');
  const [observaciones, setObservaciones] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [equiposSeleccionados, setEquiposSeleccionados] = useState<EquipoSeleccionado[]>([]);

  const reservaSeleccionada = reservas.find(r => r.id.toString() === reservaId);
  const equiposDisponibles = equipos.filter(e => e.sala_id === reservaSeleccionada?.sala?.id);

  const toggleEquipo = (equipo: Equipo) => {
    const existe = equiposSeleccionados.find(e => e.equipo_id === equipo.id);
    if (existe) {
      setEquiposSeleccionados(equiposSeleccionados.filter(e => e.equipo_id !== equipo.id));
    } else {
      setEquiposSeleccionados([...equiposSeleccionados, {
        equipo_id: equipo.id,
        estado_pantalla: '',
        estado_final: '',
        se_encendio: false,
        se_apago: false,
        se_conecto_a_cargar: false,
        nivel_bateria: 0,
        observaciones_equipo: ''
      }]);
    }
  };

  const updateEquipoData = (equipoId: number, field: keyof EquipoSeleccionado, value: any) => {
    setEquiposSeleccionados(equiposSeleccionados.map(e =>
      e.equipo_id === equipoId ? { ...e, [field]: value } : e
    ));
  };

  const getBatteryColor = (nivel: number) => {
    if (nivel >= 80) return 'text-green-500';
    if (nivel >= 50) return 'text-blue-500';
    if (nivel >= 20) return 'text-yellow-500';
    return 'text-red-500';
  };

  const handleSubmit = () => {
    if (!reservaId) return;
    setIsSubmitting(true);
    router.post(route('control-uso.store'), {
      reserva_id: parseInt(reservaId),
      fue_utilizada: fueUtilizada === 'Si',
      observaciones,
      equipos: equiposSeleccionados
    }, {
      onFinish: () => setIsSubmitting(false)
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Registrar Control de Uso" />

      <div className="min-h-screen bg-gradient-to-br p-3">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* HEADER */}
          <div className="text-align-left">
            <h1 className="text-2xl font-bold bg-gradient-to-r bg-orange-400 bg-clip-text text-transparent flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-orange-400" />
              Registrar Control de Uso
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Registra el estado y uso de los equipos asignados a una reserva.
            </p>
          </div>

          {/* CARD PRINCIPAL: Reserva */}
          <Card className="shadow-lg border-2 border-orange-100 dark:border-orange-900">
            <CardHeader className="bg-gradient-to-r">
              <CardTitle className="flex items-center gap-2 text-orange-400">
                <ClipboardList className="h-5 w-5 text-orange-400" />
                Información de la Reserva
              </CardTitle>
              <CardDescription>Selecciona la reserva que deseas controlar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label>Reserva</Label>
                <Select value={reservaId} onValueChange={setReservaId}>
                  <SelectTrigger className="w-full h-12 focus-visible:ring-orange-50">
                    <SelectValue placeholder="Selecciona una reserva..." />
                  </SelectTrigger>
                  <SelectContent>
                    {reservas.map(reserva => (
                      <SelectItem key={reserva.id} value={reserva.id.toString()}>
                        {reserva.sala?.nombre ?? 'Sin sala'} • {reserva.fecha} {reserva.hora_inicio}-{reserva.hora_fin}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Estado de utilización */}
              <div className="space-y-2">
                <Label>¿Fue utilizada?</Label>
                <Select value={fueUtilizada} onValueChange={setFueUtilizada}>
                  <SelectTrigger className="w-32 focus-visible:ring-orange-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Si">Sí</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>

                {fueUtilizada === 'No' && (
                  <Alert className="border-orange-400 bg-orange-50 dark:bg-orange-950">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    <AlertDescription className="text-orange-800 dark:text-orange-200">
                      Por favor, detalla en observaciones por qué no fue utilizada.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Observaciones Generales */}
              <div className="space-y-2">
                <Label>Observaciones Generales</Label>
                <Textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Observaciones sobre el uso de la sala..."
                  className="focus-visible:ring-orange-50 resize-none"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* CARD DE EQUIPOS */}
          {reservaId && equiposDisponibles.length > 0 && equiposDisponibles.map(equipo => {
            const isSelected = equiposSeleccionados.some(e => e.equipo_id === equipo.id);
            const equipoData = equiposSeleccionados.find(e => e.equipo_id === equipo.id);

            return (
              <Card key={equipo.id} className={`shadow-lg border-2 border-orange-100 dark:border-orange-900 transition-all ${isSelected ? 'border-orange-400 shadow-md' : ''}`}>
                <CardHeader className="bg-gradient-to-r">
                  <CardTitle className="flex items-center gap-2 text-orange-400">
                    <Monitor className="h-5 w-5 text-orange-400" />
                    {equipo.marca} {equipo.modelo}
                  </CardTitle>
                  <CardDescription>Selecciona y registra el estado de este equipo</CardDescription>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <Checkbox checked={isSelected} onCheckedChange={() => toggleEquipo(equipo)} />
                    <div className="flex-1">
                      <Label className="font-semibold flex items-center gap-2 text-orange-400">
                        <Monitor className="h-4 w-4 text-orange-400" />
                        {equipo.marca} {equipo.modelo}
                      </Label>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-sm text-slate-500">Estado inicial:</span>
                        <Badge className={`${estadoColors[equipo.estado_inicial?.toLowerCase() as keyof typeof estadoColors] || 'bg-gray-500'} text-white`}>
                          {equipo.estado_inicial}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {isSelected && equipoData && (
                    <div className="ml-7 pt-4 space-y-4">
                      {/* Estados y acciones */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Estado de Pantalla</Label>
                          <Select value={equipoData.estado_pantalla} onValueChange={(v) => updateEquipoData(equipo.id, 'estado_pantalla', v)}>
                            <SelectTrigger >
                              <SelectValue placeholder="Seleccionar..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="excelente">Excelente</SelectItem>
                              <SelectItem value="bueno">Bueno</SelectItem>
                              <SelectItem value="regular">Regular</SelectItem>
                              <SelectItem value="malo">Malo</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Estado Final</Label>
                          <Select value={equipoData.estado_final} onValueChange={(v) => updateEquipoData(equipo.id, 'estado_final', v)}>
                            <SelectTrigger >
                              <SelectValue placeholder="Seleccionar..." />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="excelente">Excelente</SelectItem>
                              <SelectItem value="bueno">Bueno</SelectItem>
                              <SelectItem value="regular">Regular</SelectItem>
                              <SelectItem value="malo">Malo</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Acciones y batería */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex items-center space-x-2 p-3 rounded-lg  dark:bg-slate-900">
                          <Checkbox checked={equipoData.se_encendio} onCheckedChange={(c) => updateEquipoData(equipo.id, 'se_encendio', c)} />
                          <Label className="text-sm flex items-center gap-2"><Power className="h-4 w-4 text-green-500" />Se encendió</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 rounded-lg  dark:bg-slate-900">
                          <Checkbox checked={equipoData.se_apago} onCheckedChange={(c) => updateEquipoData(equipo.id, 'se_apago', c)} />
                          <Label className="text-sm flex items-center gap-2"><XCircle className="h-4 w-4 text-red-500" />Se apagó</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 rounded-lg dark:bg-slate-900">
                          <Checkbox checked={equipoData.se_conecto_a_cargar} onCheckedChange={(c) => updateEquipoData(equipo.id, 'se_conecto_a_cargar', c)} />
                          <Label className="text-sm flex items-center gap-2"><Cable className="h-4 w-4 text-blue-500" />Conectado</Label>
                        </div>
                        <div className="space-y-2">
                          <Label className={`text-sm flex items-center gap-2 ${getBatteryColor(equipoData.nivel_bateria)}`}>
                            <Battery className="h-4 w-4" /> Batería: {equipoData.nivel_bateria}%
                          </Label>
                          <Input type="number" min={0} max={100} value={equipoData.nivel_bateria} onChange={(e) => updateEquipoData(equipo.id, 'nivel_bateria', parseInt(e.target.value) || 0)} className="h-9 border-orange-200" />
                        </div>
                      </div>

                      {/* Observaciones equipo */}
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold">Observaciones del Equipo</Label>
                        <Textarea
                          value={equipoData.observaciones_equipo}
                          onChange={(e) => updateEquipoData(equipo.id, 'observaciones_equipo', e.target.value)}
                          placeholder="Detalles específicos sobre este equipo..."
                          className="resize-none border-orange-200"
                          rows={2}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.visit('/control-uso')}
              className="border-orange-300 text-orange-600 hover:bg-orange-50"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              className="gap-2 bg-orange-500 hover:bg-orange-600 text-white shadow-md"
              disabled={!reservaId || isSubmitting}
            >
              <Save className="h-4 w-4" />
              {isSubmitting ? 'Guardando...' : 'Registrar Control'}
            </Button>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}
