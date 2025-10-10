import * as React from "react"
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { type BreadcrumbItem, type Sala, type Equipo } from '@/types';
import { router } from '@inertiajs/react';
import { ChevronDownIcon, Loader2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useState } from "react";
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Equipos',
        href: '/equipos',
    },
    {
        title: 'Editar Equipo',
        href: '',
    },
];

interface EditProps {
    equipo: Equipo;
    salas: Sala[];
}

export default function Edit({ equipo, salas }: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        marca: equipo.marca || '',
        modelo: equipo.modelo || '',
        estado_inicial: equipo.estado_inicial || '',
        sistema_operativo: equipo.sistema_operativo || '',
        fecha_adquisicion: equipo.fecha_adquisicion || '',
        fecha_baja: equipo.fecha_baja || '',
        sala_id: equipo.sala_id?.toString() || '',
    });

    // POPOVER DEL CALENDARIO FECHA ADQUISICIÓN
    const [openAdquisicion, setOpenAdquisicion] = React.useState(false)
    const [dateAdquisicion, setDateAdquisicion] = React.useState<Date | undefined>(
        equipo.fecha_adquisicion ? new Date(equipo.fecha_adquisicion) : undefined
    )

    // POPOVER DEL CALENDARIO FECHA BAJA
    const [openBaja, setOpenBaja] = React.useState(false)
    const [dateBaja, setDateBaja] = React.useState<Date | undefined>(
        equipo.fecha_baja ? new Date(equipo.fecha_baja) : undefined
    )
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('equipos.update', equipo.id));
    };

    const handleCancel = () => {
        if (JSON.stringify(data) !== JSON.stringify({
            marca: equipo.marca,
            modelo: equipo.modelo,
            estado_inicial: equipo.estado_inicial,
            sistema_operativo: equipo.sistema_operativo,
            fecha_adquisicion: equipo.fecha_adquisicion,
            fecha_baja: equipo.fecha_baja,
            sala_id: equipo.sala_id?.toString()
        })) {
          setShowCancelDialog(true);
        }else{
            router.visit(route('equipos.index'));
        }
        
    };

    // Función para formatear fecha a string YYYY-MM-DD
    const formatDateForBackend = (date: Date): string => {
        return date.toISOString().split('T')[0];
    };
 const confirmCancel = () => {
            router.visit(route('equipos.index'));
        };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Editar Equipo" />
            <div className="flex flex-col gap-4 p-4">
                <h1 className="text-2xl font-bold">Editar Equipo</h1>
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
                                        disabled={processing}
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
                                        disabled={processing}
                                    />
                                    {errors.modelo && <p className="text-sm text-red-500">{errors.modelo}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Estado Inicial */}
                                <div className="flex flex-col gap-1">
                                    <Label>Estado Inicial</Label>
                                    <Select 
                                        value={data.estado_inicial} 
                                        onValueChange={(value) => setData('estado_inicial', value)}
                                        disabled={processing}
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

                                {/* Sistema Operativo */}
                                <div className="flex flex-col gap-1">
                                    <Label>Sistema Operativo</Label>
                                    <Input
                                        value={data.sistema_operativo}
                                        onChange={(e) => setData('sistema_operativo', e.target.value)}
                                        placeholder="Windows 11, Ubuntu..."
                                        disabled={processing}
                                    />
                                    {errors.sistema_operativo && <p className="text-sm text-red-500">{errors.sistema_operativo}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Fecha Adquisición */}
                                <div className="flex flex-col gap-1">
                                    <Label>Fecha Adquisición</Label>
                                    <Popover open={openAdquisicion} onOpenChange={setOpenAdquisicion}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-48 justify-between font-normal"
                                                type="button"
                                                disabled={processing}
                                            >
                                                {dateAdquisicion ? dateAdquisicion.toLocaleDateString() : "Selecciona una fecha"}
                                                <ChevronDownIcon />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={dateAdquisicion}
                                                onSelect={(date) => {
                                                    setDateAdquisicion(date)
                                                    if (date) {
                                                        setData('fecha_adquisicion', formatDateForBackend(date))
                                                    }
                                                    setOpenAdquisicion(false)
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {errors.fecha_adquisicion && <p className="text-sm text-red-500">{errors.fecha_adquisicion}</p>}
                                </div>

                                {/* Fecha Baja */}
                                <div className="flex flex-col gap-1">
                                    <Label>Fecha Baja (opcional)</Label>
                                    <Popover open={openBaja} onOpenChange={setOpenBaja}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-48 justify-between font-normal"
                                                type="button"
                                                disabled={processing}
                                            >
                                                {dateBaja ? dateBaja.toLocaleDateString() : "Selecciona una fecha"}
                                                <ChevronDownIcon />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={dateBaja}
                                                onSelect={(date) => {
                                                    setDateBaja(date)
                                                    if (date) {
                                                        setData('fecha_baja', formatDateForBackend(date))
                                                    } else {
                                                        setData('fecha_baja', '')
                                                    }
                                                    setOpenBaja(false)
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {errors.fecha_baja && <p className="text-sm text-red-500">{errors.fecha_baja}</p>}
                                </div>
                            </div>

                            {/* Sala */}
                            <div className="flex flex-col gap-1">
                                <Label>Sala</Label>
                                <Select 
                                    value={data.sala_id} 
                                    onValueChange={(value) => setData('sala_id', value)}
                                    disabled={processing}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar sala..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {salas.map(sala => (
                                            <SelectItem key={sala.id} value={sala.id.toString()}>
                                                {sala.nombre}
                                            </SelectItem>
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
                                        <AlertDialogCancel>Continuar editando</AlertDialogCancel>
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
                                        Actualizando...
                                    </div>
                                ) : (
                                    'Actualizar'
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </AppLayout>
    );
}