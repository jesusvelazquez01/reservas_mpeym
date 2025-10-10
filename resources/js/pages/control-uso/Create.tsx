import { useState } from 'react';
import { Save, CheckCircle2, AlertCircle, Monitor, Power, XCircle, Cable, Battery } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
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
  { title: 'Crear', href: '/control-uso/create' },
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
      <Head title="Crear Control de Uso" />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-3">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-align-left ">
            <h1 className="text-2xl font-bold bg-gradient-to-r bg-black bg-clip-text text-transparent">
              Control de Uso
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Registra el estado y uso de equipos por reserva
            </p>
          </div>

          <div className="space-y-6">
            {/* Card Principal */}
            <Card className="shadow-lg border-2">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-orange-500" />
                  Información de la Reserva
                </CardTitle>
                <CardDescription>
                  Selecciona la reserva que deseas controlar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {/* Selector de Reserva */}
                <div className="space-y-2">
                  <Label htmlFor="reserva" className="text-base font-semibold">
                    Reserva *
                  </Label>
                  <Select value={reservaId} onValueChange={setReservaId}>
                    <SelectTrigger className="w-full h-12">
                      <SelectValue placeholder="Selecciona una reserva..." />
                    </SelectTrigger>
                    <SelectContent>
                      {reservas.map((reserva) => (
                        <SelectItem key={reserva.id} value={reserva.id.toString()}>
                          <div className="flex flex-col py-1">
                            <span className="font-medium">{reserva.sala?.nombre ?? 'Sin sala'}</span>
                            <span className="text-sm text-slate-500">
                              {reserva.fecha} • {reserva.hora_inicio} - {reserva.hora_fin}
                            </span>
                            <span className="text-xs text-slate-400">
                              {reserva.entidad}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Estado de Utilización */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fue-utilizada" className="text-base font-semibold">
                      ¿Fue utilizada?
                    </Label>
                    <Select value={fueUtilizada} onValueChange={setFueUtilizada}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Si">Sí</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {fueUtilizada === 'No' && (
                    <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                        Por favor, detalla en observaciones por qué no fue utilizada
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Observaciones Generales */}
                <div className="space-y-2">
                  <Label htmlFor="observaciones" className="text-base font-semibold">
                    Observaciones Generales
                  </Label>
                  <Textarea
                    id="observaciones"
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    placeholder="Observaciones sobre el uso de la sala..."
                    className="min-h-[100px] resize-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Card de Equipos */}
            {reservaId && equiposDisponibles.length > 0 && (
              <Card className="shadow-lg border-2">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-slate-900 dark:to-slate-800">
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="h-5 w-5 text-purple-600" />
                    Equipos Utilizados
                  </CardTitle>
                  <CardDescription>
                    Selecciona y registra el estado de cada equipo usado
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {equiposDisponibles.map((equipo) => {
                      const isSelected = equiposSeleccionados.some(e => e.equipo_id === equipo.id);
                      const equipoData = equiposSeleccionados.find(e => e.equipo_id === equipo.id);
                      
                      return (
                        <Card
                          key={equipo.id}
                          className={`transition-all duration-300 ${
                            isSelected 
                              ? 'border-2 border-blue-500 shadow-md' 
                              : 'border hover:border-slate-300 dark:hover:border-slate-600'
                          }`}
                        >
                          <CardContent className="p-4">
                            {/* Header del Equipo */}
                            <div className="flex items-start gap-3 mb-4">
                              <Checkbox
                                id={`equipo-${equipo.id}`}
                                checked={isSelected}
                                onCheckedChange={() => toggleEquipo(equipo)}
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <Label
                                  htmlFor={`equipo-${equipo.id}`}
                                  className="text-base font-semibold cursor-pointer flex items-center gap-2"
                                >
                                  <Monitor className="h-4 w-4" />
                                  {equipo.marca} {equipo.modelo}
                                </Label>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-sm text-slate-500">Estado inicial:</span>
                                  <Badge variant="outline" className={`${estadoColors[equipo.estado_inicial?.toLowerCase() as keyof typeof estadoColors] || 'bg-gray-500'} text-white`}>
                                    {equipo.estado_inicial}
                                  </Badge>
                                </div>
                              </div>
                            </div>

                            {/* Detalles del Equipo */}
                            {isSelected && equipoData && (
                              <div className="ml-7 space-y-6 pt-4 border-t animate-in fade-in-50 duration-300">
                                {/* Estados */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                      <Monitor className="h-4 w-4 text-blue-500" />
                                      Estado de Pantalla
                                    </Label>
                                    <Select
                                      value={equipoData.estado_pantalla}
                                      onValueChange={(value) => updateEquipoData(equipo.id, 'estado_pantalla', value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar..." />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="excelente">✨ Excelente</SelectItem>
                                        <SelectItem value="bueno">👍 Bueno</SelectItem>
                                        <SelectItem value="regular">⚠️ Regular</SelectItem>
                                        <SelectItem value="malo">❌ Malo</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                                      Estado Final
                                    </Label>
                                    <Select
                                      value={equipoData.estado_final}
                                      onValueChange={(value) => updateEquipoData(equipo.id, 'estado_final', value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar..." />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="excelente">✨ Excelente</SelectItem>
                                        <SelectItem value="bueno">👍 Bueno</SelectItem>
                                        <SelectItem value="regular">⚠️ Regular</SelectItem>
                                        <SelectItem value="malo">❌ Malo</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>

                                {/* Acciones y Batería */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                  <div className="flex items-center space-x-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
                                    <Checkbox
                                      id={`encendio-${equipo.id}`}
                                      checked={equipoData.se_encendio}
                                      onCheckedChange={(checked) => 
                                        updateEquipoData(equipo.id, 'se_encendio', checked)
                                      }
                                    />
                                    <Label htmlFor={`encendio-${equipo.id}`} className="text-sm cursor-pointer flex items-center gap-2">
                                      <Power className="h-4 w-4 text-green-500" />
                                      Se encendió
                                    </Label>
                                  </div>

                                  <div className="flex items-center space-x-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
                                    <Checkbox
                                      id={`apago-${equipo.id}`}
                                      checked={equipoData.se_apago}
                                      onCheckedChange={(checked) => 
                                        updateEquipoData(equipo.id, 'se_apago', checked)
                                      }
                                    />
                                    <Label htmlFor={`apago-${equipo.id}`} className="text-sm cursor-pointer flex items-center gap-2">
                                      <XCircle className="h-4 w-4 text-red-500" />
                                      Se apagó
                                    </Label>
                                  </div>

                                  <div className="flex items-center space-x-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-900">
                                    <Checkbox
                                      id={`cargar-${equipo.id}`}
                                      checked={equipoData.se_conecto_a_cargar}
                                      onCheckedChange={(checked) => 
                                        updateEquipoData(equipo.id, 'se_conecto_a_cargar', checked)
                                      }
                                    />
                                    <Label htmlFor={`cargar-${equipo.id}`} className="text-sm cursor-pointer flex items-center gap-2">
                                      <Cable className="h-4 w-4 text-blue-500" />
                                      Conectado
                                    </Label>
                                  </div>

                                  <div className="space-y-2">
                                    <Label className={`text-sm flex items-center gap-2 ${getBatteryColor(equipoData.nivel_bateria)}`}>
                                      <Battery className="h-4 w-4" />
                                      Batería: {equipoData.nivel_bateria}%
                                    </Label>
                                    <Input
                                      type="number"
                                      min="0"
                                      max="100"
                                      value={equipoData.nivel_bateria}
                                      onChange={(e) => 
                                        updateEquipoData(equipo.id, 'nivel_bateria', parseInt(e.target.value) || 0)
                                      }
                                      className="h-9"
                                    />
                                  </div>
                                </div>

                                {/* Observaciones del Equipo */}
                                <div className="space-y-2">
                                  <Label className="text-sm font-semibold">
                                    Observaciones del Equipo
                                  </Label>
                                  <Textarea
                                    value={equipoData.observaciones_equipo}
                                    onChange={(e) => 
                                      updateEquipoData(equipo.id, 'observaciones_equipo', e.target.value)
                                    }
                                    placeholder="Detalles específicos sobre este equipo..."
                                    className="resize-none"
                                    rows={2}
                                  />
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Botones de Acción */}
            <Card className="shadow-lg border-2">
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-3 justify-end">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="lg" 
                    onClick={() => router.visit('/control-uso')}
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    size="lg" 
                    className="gap-2 bg-gradient-to-r bg-orange-400"
                    disabled={!reservaId || isSubmitting}
                  >
                    <Save className="h-4 w-4" />
                    {isSubmitting ? 'Guardando...' : 'Registrar Control'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}