
import * as React from "react"
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import AppLayout from '@/layouts/app-layout';
import {  Sala, type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Calendar } from "@/components/ui/calendar"
//Popover, mostrar contenido en un tipo modal o algo asi
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

//Para el command de tipo select


import { ChevronDownIcon, Loader2 } from 'lucide-react';
import { es } from 'date-fns/locale';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Equipos',
        href: '/equipos',
    },
    {
        title: 'Dar de Alta',
        href: '',
    },
];
export default function Create() {
    const [openFin, setOpenFin] = useState(false);
    const [dateFin, setDateFin] = useState<Date | undefined>(undefined);
    const { salas } = usePage<{ salas: Sala[] }>().props;
   const [openBaja, setOpenBaja] = useState(false);
   const [dateBaja, setDateBaja] = useState<Date | undefined>(undefined);
    const { data, setData, post, processing, errors } = useForm({
        marca: '',
        modelo: '',
        estado_inicial: '',
        sistema_operativo: '',
        fecha_adquisicion: '',
        fecha_baja: '',
        sala_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('equipos.store'));
    };

    const [showCancelDialog, setShowCancelDialog] = useState(false);

    const handleCancel = () => {
        if (data.marca || data.modelo || data.estado_inicial || data.sistema_operativo || data.fecha_adquisicion || data.sala_id || data.fecha_baja) {
            setShowCancelDialog(true);
        } else {
            router.visit(route('equipos.index'));
        }
    };

    const confirmCancel = () => {
        router.visit(route('equipos.index'));
    };

     const formatDateForBackend = (date: Date): string => {
        return date.toISOString().split('T')[0];
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Alta de Equipo" />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">Alta Equipo</h1>
                <Card>
                    <form onSubmit={handleSubmit}>
                        <CardHeader>Información del Equipo</CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Marca */}
                                <div className="flex flex-col gap-1">
                                    <Label>Marca</Label>
                                    <Input
                                        value={data.marca}
                                        onChange={(e) => setData('marca', e.target.value)}
                                        placeholder="HP, Dell, Lenovo..."
                                        autoFocus
                                    />
                                    {errors.marca && <p className="text-sm text-red-500">{errors.marca}</p>}
                                </div>

                                {/* Modelo */}
                                <div className="flex flex-col gap-1">
                                    <Label>Modelo</Label>
                                    <Input
                                        value={data.modelo}
                                        onChange={(e) => setData('modelo', e.target.value)}
                                        placeholder="Pavilion 15, Inspiron..."
                                    />
                                    {errors.modelo && <p className="text-sm text-red-500">{errors.modelo}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Estado Inicial */}
                                <div className="flex flex-col gap-1">
                                    <Label>Estado Inicial</Label>
                                    <Select value={data.estado_inicial} onValueChange={(value) => setData('estado_inicial', value)}>
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

                                {/* Sistema Operativo */}
                                <div className="flex flex-col gap-1">
                                    <Label>Sistema Operativo</Label>
                                    <Input
                                        value={data.sistema_operativo}
                                        onChange={(e) => setData('sistema_operativo', e.target.value)}
                                        placeholder="Windows 11, Ubuntu..."
                                    />
                                    {errors.sistema_operativo && <p className="text-sm text-red-500">{errors.sistema_operativo}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Fecha Adquisición */}
                                <div className="flex flex-col gap-1">
                                    <Label>Fecha Adquisición</Label>
                                     <Popover open={openFin} onOpenChange={setOpenFin}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            id="fecha_adquisicion"
                                            className="w-48 justify-between font-normal"
                                            type="button"
                                        >
                                            {dateFin ? dateFin.toLocaleDateString() : "Selecciona una fecha"}
                                            <ChevronDownIcon />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            
                                            captionLayout="dropdown"
                                            selected={dateFin}
                                            onSelect={(date) => {
                                                setDateFin(date)
                                                if (date) {
                                                    setData('fecha_adquisicion', formatDateForBackend(date))
                                                }
                                                setOpenFin(false)
                                            }}
                                            initialFocus
                                            locale={es}
                                        />
                                    </PopoverContent>
                                 </Popover>
                                    {errors.fecha_adquisicion && <p className="text-sm text-red-500">{errors.fecha_adquisicion}</p>}
                                </div>

                                {/* Fecha Baja */}
                                {/* Fecha Baja */}
                            <div className="flex flex-col gap-1">
                                <Label>Fecha Baja (opcional)</Label>
                                <Popover open={openBaja} onOpenChange={setOpenBaja}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            id="fecha_baja"
                                            className="w-48 justify-between font-normal"
                                            type="button"
                                        >
                                            {dateBaja ? dateBaja.toLocaleDateString() : "Selecciona una fecha"}
                                            <ChevronDownIcon />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={dateBaja}
                                            captionLayout="dropdown"
                                            onSelect={(date) => {
                                                setDateBaja(date)
                                                if (date) {
                                                    setData('fecha_baja', formatDateForBackend(date))
                                                }
                                                setOpenBaja(false)
                                            }}
                                            initialFocus
                                            locale={es}
                                        />
                                    </PopoverContent>
                                </Popover>
                                {errors.fecha_baja && <p className="text-sm text-red-500">{errors.fecha_baja}</p>}
                            </div>
                            </div>

                            {/* Sala */}
                            <div className="flex flex-col gap-1">
                                <Label>Sala</Label>
                                <Select value={data.sala_id} onValueChange={(value) => setData('sala_id', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar sala..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {salas.map(sala => (
                                            <SelectItem key={sala.id} value={sala.id.toString()}>{sala.nombre}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.sala_id && <p className="text-sm text-red-500">{errors.sala_id}</p>}
                            </div>
                        </CardContent>

                        <CardFooter className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                            >
                                Cancelar
                            </Button>
                            
                            <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>¿Descartar cambios?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Tienes datos sin guardar. ¿Estás seguro que deseas salir sin guardar los cambios?
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Continuar cargando</AlertDialogCancel>
                                        <AlertDialogAction onClick={confirmCancel}>
                                            Descartar cambios
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            <Button
                                type="submit"
                                disabled={processing}
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
        </AppLayout>
    );
}